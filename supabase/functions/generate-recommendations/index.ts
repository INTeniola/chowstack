
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { user_id, location } = await req.json();

    if (!user_id) {
      throw new Error('User ID is required');
    }

    console.log('Generating recommendations for user:', user_id);

    // 1. Get user preferences
    const { data: userPreferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (preferencesError && preferencesError.code !== 'PGRST116') {
      throw preferencesError;
    }

    // 2. Get user's past orders
    const { data: pastOrders, error: ordersError } = await supabase
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

    // Extract meal IDs from past orders
    const pastOrderedMealIds = pastOrders
      ? pastOrders.flatMap(order => order.order_items.map(item => item.meal_id))
      : [];

    // 3. Generate personalized meal suggestions
    let query = supabase
      .from('meals')
      .select('*, vendors(id, business_name)')
      .eq('is_available', true)
      .limit(10);

    // Apply cuisine preferences if available
    if (userPreferences?.cuisine_preferences && userPreferences.cuisine_preferences.length > 0) {
      query = query.in('cuisine_type', userPreferences.cuisine_preferences);
    }

    const { data: recommendedMeals, error: mealsError } = await query;
    if (mealsError) throw mealsError;

    // 4. Find potential group order matches if location is provided
    let communityRecommendations = [];
    if (location) {
      // In a real application, would use location to find nearby users
      // For demo, we'll just find users with similar preferences
      if (userPreferences) {
        const { data: potentialMatches, error: matchError } = await supabase
          .from('user_preferences')
          .select('user_id')
          .neq('user_id', user_id)
          .limit(5);

        if (matchError) throw matchError;

        if (potentialMatches && potentialMatches.length > 0) {
          // Calculate potential savings (10-20% discount for group orders)
          const potentialSavings = recommendedMeals.length > 0 
            ? (recommendedMeals[0].price_single * 0.15).toFixed(2) 
            : 0;

          communityRecommendations = potentialMatches.map(match => ({
            user_id: match.user_id,
            similarity_score: 0.75, // Mock score
            potential_savings: potentialSavings
          }));

          // Store suggestions in database
          for (const match of communityRecommendations) {
            await supabase
              .from('community_suggestions')
              .upsert({
                user_id: user_id,
                suggested_user_id: match.user_id,
                similarity_score: match.similarity_score,
                potential_savings: match.potential_savings
              });
          }
        }
      }
    }

    // 5. Calculate optimal bulk ordering combinations
    const bulkOrderSuggestions = recommendedMeals
      .filter(meal => meal.price_bulk && meal.bulk_quantity)
      .map(meal => {
        const singlePrice = meal.price_single;
        const bulkPrice = meal.price_bulk;
        const bulkQuantity = meal.bulk_quantity;
        const savingsPerItem = singlePrice - (bulkPrice / bulkQuantity);
        const totalSavings = savingsPerItem * bulkQuantity;
        
        return {
          meal_id: meal.id,
          meal_name: meal.name,
          vendor_name: meal.vendors.business_name,
          bulk_quantity: bulkQuantity,
          price_single: singlePrice,
          price_bulk: bulkPrice,
          savings_per_item: savingsPerItem,
          total_savings: totalSavings
        };
      })
      .sort((a, b) => b.total_savings - a.total_savings)
      .slice(0, 3);

    return new Response(
      JSON.stringify({
        personal_recommendations: recommendedMeals.map(meal => ({
          id: meal.id,
          name: meal.name,
          price: meal.price_single,
          vendor_name: meal.vendors.business_name,
          image_url: meal.image_url,
          previously_ordered: pastOrderedMealIds.includes(meal.id)
        })),
        community_recommendations: communityRecommendations,
        bulk_order_suggestions: bulkOrderSuggestions
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error generating recommendations:', error);
    
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
