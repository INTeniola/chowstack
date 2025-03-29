
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
    console.log('Running inventory management check');

    // 1. Get all inventory items that are below threshold
    const { data: lowInventory, error: inventoryError } = await supabase
      .from('inventory')
      .select(`
        id,
        vendor_id,
        meal_id,
        quantity,
        low_threshold,
        meals(name),
        vendors(business_name, user_id)
      `)
      .lt('quantity', supabase.raw('low_threshold'));

    if (inventoryError) throw inventoryError;

    console.log(`Found ${lowInventory ? lowInventory.length : 0} items with low inventory`);

    // Group notifications by vendor to avoid sending multiple alerts
    const vendorAlerts = {};
    const mealsToUpdate = [];

    if (lowInventory && lowInventory.length > 0) {
      for (const item of lowInventory) {
        // Group alerts by vendor
        if (!vendorAlerts[item.vendor_id]) {
          vendorAlerts[item.vendor_id] = {
            vendor_id: item.vendor_id,
            user_id: item.vendors.user_id,
            business_name: item.vendors.business_name,
            low_items: []
          };
        }
        
        vendorAlerts[item.vendor_id].low_items.push({
          meal_id: item.meal_id,
          meal_name: item.meals.name,
          current_quantity: item.quantity,
          recommended_quantity: item.low_threshold * 3 // Recommend restocking to 3x threshold
        });

        // If inventory is zero, mark meal as unavailable
        if (item.quantity <= 0) {
          mealsToUpdate.push({
            id: item.meal_id,
            is_available: false
          });
        }
      }

      // Send notifications to vendors
      for (const vendorId in vendorAlerts) {
        const alert = vendorAlerts[vendorId];
        const itemsList = alert.low_items.map(item => `${item.meal_name} (${item.current_quantity} left)`).join(', ');
        
        await supabase
          .from('notifications')
          .insert({
            user_id: alert.user_id,
            type: 'inventory',
            title: 'Inventory Alert',
            content: `Low inventory for: ${itemsList}`,
            related_id: null
          });
      }

      // Update meal availability status
      if (mealsToUpdate.length > 0) {
        await supabase
          .from('meals')
          .upsert(mealsToUpdate);
      }
    }

    // 2. Analyze order patterns for popular items (simplified for demo)
    const { data: popularItems, error: orderError } = await supabase
      .from('order_items')
      .select(`
        meal_id,
        meals(name, vendor_id),
        count
      `)
      .limit(10)
      .group('meal_id', 'meals.name', 'meals.vendor_id')
      .order('count', { ascending: false });

    if (orderError) throw orderError;

    const stockRecommendations = {};
    
    // Generate stock recommendations based on popularity
    if (popularItems && popularItems.length > 0) {
      for (const item of popularItems) {
        const vendorId = item.meals.vendor_id;
        
        if (!stockRecommendations[vendorId]) {
          stockRecommendations[vendorId] = [];
        }
        
        stockRecommendations[vendorId].push({
          meal_id: item.meal_id,
          meal_name: item.meals.name,
          popularity_count: item.count,
          recommended_stock: Math.ceil(item.count / 5) * 10 // Simple formula for demo
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        inventory_alerts: Object.values(vendorAlerts),
        stock_recommendations: stockRecommendations,
        meals_updated: mealsToUpdate.length
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error managing inventory:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
