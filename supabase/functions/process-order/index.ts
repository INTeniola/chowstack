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

    // 3. Check payment status or initiate payment
    let paymentStatus = 'pending';
    let paymentReference = '';
    
    if (paymentDetails) {
      // For prepaid methods (Paystack, Flutterwave, Mobile Money)
      if (['paystack', 'flutterwave', 'mobile_money'].includes(order.payment_method)) {
        // Record pending payment in database
        const { data: paymentData, error: paymentError } = await supabase
          .from('pending_payments')
          .insert({
            reference: paymentDetails.reference || `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            amount: order.total_amount,
            currency: paymentDetails.currency || 'NGN',
            customer_email: paymentDetails.email,
            payment_method: order.payment_method,
            status: 'pending',
            metadata: {
              orderId: order.id,
              userId: order.user_id,
              items: order.items.map(item => ({ id: item.meal_id, quantity: item.quantity }))
            }
          })
          .select()
          .single();
        
        if (paymentError) throw paymentError;
        
        paymentReference = paymentData.reference;
      } 
      // For bank transfers, create payment record but keep pending
      else if (order.payment_method === 'bank_transfer') {
        const { data: paymentData, error: paymentError } = await supabase
          .from('pending_payments')
          .insert({
            reference: `BT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            amount: order.total_amount,
            currency: 'NGN',
            customer_email: paymentDetails.email,
            payment_method: 'bank_transfer',
            status: 'pending',
            metadata: {
              orderId: order.id,
              userId: order.user_id,
              items: order.items.map(item => ({ id: item.meal_id, quantity: item.quantity }))
            }
          })
          .select()
          .single();
        
        if (paymentError) throw paymentError;
        
        paymentReference = paymentData.reference;
      }
      // For cash on delivery, mark as pending but approve order
      else if (order.payment_method === 'cash_on_delivery') {
        paymentStatus = 'cod_pending';
        paymentReference = `COD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
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
        payment_status: paymentStatus,
        status: paymentStatus === 'cod_pending' ? 'processing' : 'pending'
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
        content: `Your order #${createdOrder.id} has been confirmed. ${paymentStatus === 'pending' ? 'Please complete payment to proceed.' : 'It is being prepared.'}`,
        related_id: createdOrder.id
      });

    // 7. Log the transaction
    await supabase
      .from('payment_logs')
      .insert({
        payment_reference: paymentReference,
        event_type: 'order_created',
        status: paymentStatus,
        amount: order.total_amount,
        provider: order.payment_method,
        details: {
          order_id: createdOrder.id,
          items: orderItems.length,
          payment_method: order.payment_method
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        order: createdOrder,
        payment: {
          status: paymentStatus,
          reference: paymentReference
        },
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
