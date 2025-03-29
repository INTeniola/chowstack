
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to calculate similarity between two users
function calculateSimilarity(user1Prefs, user2Prefs) {
  let score = 0;
  
  // Compare cuisine preferences
  if (user1Prefs.cuisine_preferences && user2Prefs.cuisine_preferences) {
    const commonCuisines = user1Prefs.cuisine_preferences.filter(cuisine => 
      user2Prefs.cuisine_preferences.includes(cuisine)
    );
    score += commonCuisines.length * 0.2;
  }
  
  // Compare dietary restrictions (more important if they match)
  if (user1Prefs.dietary_restrictions && user2Prefs.dietary_restrictions) {
    const commonRestrictions = user1Prefs.dietary_restrictions.filter(diet => 
      user2Prefs.dietary_restrictions.includes(diet)
    );
    score += commonRestrictions.length * 0.3;
  }
  
  // Compare price sensitivity (closer values are better)
  if (user1Prefs.price_sensitivity && user2Prefs.price_sensitivity) {
    const priceDiff = Math.abs(user1Prefs.price_sensitivity - user2Prefs.price_sensitivity);
    score += (5 - priceDiff) * 0.1; // Max 0.5 points for identical price sensitivity
  }
  
  return Math.min(score, 1.0); // Cap at 1.0
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { user_id, location_lat, location_lng, radius } = await req.json();

    if (!user_id) {
      throw new Error('User ID is required');
    }

    console.log('Finding community matches for user:', user_id);

    // 1. Get target user's preferences
    const { data: userPreferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (preferencesError && preferencesError.code !== 'PGRST116') {
      throw preferencesError;
    }

    if (!userPreferences) {
      throw new Error('User preferences not found');
    }

    // 2. Get target user's order history
    const { data: userOrders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_items (
          meal_id,
          quantity
        )
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (ordersError) throw ordersError;

    // Extract meal IDs from the user's past orders
    const userOrderedMealIds = userOrders
      ? userOrders.flatMap(order => order.order_items.map(item => item.meal_id))
      : [];

    // 3. Find other users in proximity (simplified for demo)
    // In a real app, would use PostGIS for location-based queries
    let query = supabase.from('user_preferences').select('*');
    
    // Exclude the current user
    query = query.neq('user_id', user_id);

    const { data: potentialMatches, error: matchError } = await query;
    if (matchError) throw matchError;

    // 4. Calculate similarity scores with each potential match
    const matchResults = [];
    
    if (potentialMatches && potentialMatches.length > 0) {
      for (const match of potentialMatches) {
        // Calculate similarity score
        const similarityScore = calculateSimilarity(userPreferences, match);
        
        if (similarityScore > 0.5) { // Only consider good matches
          // Calculate potential savings (mock calculations for demo)
          // In a real app, would analyze common meal purchases
          const potentialSavingsPerOrder = 15.0; // Average savings in dollars
          
          matchResults.push({
            user_id: match.user_id,
            similarity_score: similarityScore,
            potential_savings: potentialSavingsPerOrder
          });
        }
      }
    }

    // 5. Sort by similarity score and get the top matches
    const topMatches = matchResults
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, 5);

    // 6. Store matches in database for future reference
    for (const match of topMatches) {
      await supabase
        .from('community_suggestions')
        .upsert({
          user_id: user_id,
          suggested_user_id: match.user_id,
          similarity_score: match.similarity_score,
          potential_savings: match.potential_savings,
          is_matched: false
        });
    }

    // 7. Get basic profiles for the matched users
    let matchedProfiles = [];
    if (topMatches.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', topMatches.map(match => match.user_id));
        
      if (!profilesError && profiles) {
        // Combine profile info with match details
        matchedProfiles = topMatches.map(match => {
          const profile = profiles.find(p => p.id === match.user_id);
          return {
            ...match,
            name: profile ? profile.name : 'Anonymous User'
          };
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        matches: matchedProfiles,
        total_potential_savings: matchedProfiles.reduce((sum, match) => sum + match.potential_savings, 0).toFixed(2)
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error in community matching:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 400, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
