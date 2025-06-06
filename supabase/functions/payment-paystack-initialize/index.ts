
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
const PAYSTACK_API_URL = "https://api.paystack.co";

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
    const {
      amount,
      email,
      reference,
      callback_url,
      metadata,
      currency = "NGN"
    } = await req.json();
    
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error("PAYSTACK_SECRET_KEY is not set");
    }

    console.log("Initializing Paystack payment for:", email);

    // Convert amount to kobo (Paystack accepts amount in the smallest currency unit)
    const amountInKobo = Math.round(amount * 100);

    // Call Paystack API to initialize transaction
    const paystackResponse = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`
      },
      body: JSON.stringify({
        amount: amountInKobo,
        email,
        currency,
        reference,
        callback_url,
        metadata
      })
    });

    if (!paystackResponse.ok) {
      const errorText = await paystackResponse.text();
      console.error("Paystack API error:", errorText);
      throw new Error(`Paystack API error: ${paystackResponse.status} ${errorText}`);
    }

    const paystackData = await paystackResponse.json();
    
    if (!paystackData.status) {
      throw new Error(paystackData.message || "Paystack transaction initialization failed");
    }
    
    // Log the payment attempt to the payment_logs table
    try {
      // Create a Supabase client with the service key
      const supabaseAdmin = await createAdminClient();
      
      await supabaseAdmin.from('payment_logs').insert({
        payment_reference: paystackData.data.reference,
        event_type: 'initialize',
        status: 'pending',
        amount: amount,
        provider: 'paystack',
        details: {
          request: {
            email,
            amount,
            currency,
            callback_url
          },
          response: paystackData
        }
      });
    } catch (logError) {
      // Just log the error but don't interrupt the payment flow
      console.error("Error logging payment attempt:", logError);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        reference: paystackData.data.reference,
        message: "Payment initialized successfully",
        redirectUrl: paystackData.data.authorization_url,
        status: "pending",
        gatewayResponse: paystackData.data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error initializing Paystack payment:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        reference: "",
        message: error.message || "Failed to initialize payment",
        status: "failed"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

// Helper function to create a Supabase admin client
async function createAdminClient() {
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.23.0");
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}
