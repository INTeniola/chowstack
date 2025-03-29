
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
    const { order, paymentDetails } = await req.json();

    // Validate input
    if (!order || !order.user_id || !order.items || order.items.length === 0) {
      throw new Error('Invalid order details. Please provide user_id and items.');
    }

    console.log('Processing order:', order.id);

    // 1. Validate order details and check meal availability
    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select('id, is_available, vendor_id')
      .in('id', order.items.map(item => item.meal_id));

    if (mealsError) throw mealsError;

    // Check if all meals are available
    const unavailableMeals = meals.filter(meal => !meal.is_available);
    if (unavailableMeals.length > 0) {
      throw new Error(`Some meals are no longer available: ${unavailableMeals.map(meal => meal.id).join(', ')}`);
    }

    // 2. Calculate accurate delivery times (simplified for demo)
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 1); // Next day delivery

    // 3. Process payment (mock implementation)
    // In a real system, this would connect to a payment gateway like Stripe
    const paymentResult = {
      success: true,
      transaction_id: `txn_${crypto.randomUUID().substring(0, 8)}`,
      amount: order.total_amount
    };

    if (!paymentResult.success) {
      throw new Error('Payment processing failed');
    }

    // 4. Create the order in the database
    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: order.id || undefined, // Use provided ID or let Supabase generate one
        user_id: order.user_id,
        total_amount: order.total_amount,
        delivery_date: estimatedDeliveryDate.toISOString(),
        delivery_address: order.delivery_address,
        payment_method: order.payment_method,
        payment_status: 'paid',
        status: 'preparing'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 5. Add order items
    const orderItems = order.items.map(item => ({
      order_id: createdOrder.id,
      meal_id: item.meal_id,
      quantity: item.quantity,
      price_per_item: item.price,
      total_price: item.price * item.quantity,
      special_instructions: item.specialInstructions || null
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 6. Send confirmation notification
    await supabase
      .from('notifications')
      .insert({
        user_id: order.user_id,
        type: 'orderStatus',
        title: 'Order Confirmed',
        content: `Your order #${createdOrder.id} has been confirmed and is being prepared.`,
        related_id: createdOrder.id
      });

    return new Response(
      JSON.stringify({
        success: true,
        order: createdOrder,
        payment: paymentResult,
        message: 'Order processed successfully'
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error processing order:', error);
    
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
