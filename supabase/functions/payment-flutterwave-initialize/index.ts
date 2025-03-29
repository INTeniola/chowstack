
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const FLUTTERWAVE_SECRET_KEY = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
const FLUTTERWAVE_API_URL = "https://api.flutterwave.com/v3";

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
      currency = "NGN",
      customer
    } = await req.json();
    
    if (!FLUTTERWAVE_SECRET_KEY) {
      throw new Error("FLUTTERWAVE_SECRET_KEY is not set");
    }

    console.log("Initializing Flutterwave payment for:", email);

    // Prepare the payment payload
    const paymentPayload = {
      tx_ref: reference || `FLW-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount,
      currency,
      redirect_url: callback_url,
      customer: {
        email,
        name: customer?.name || 'Customer',
        phonenumber: customer?.phone || ''
      },
      meta: metadata || {}
    };

    // Call Flutterwave API to initialize transaction
    const flutterwaveResponse = await fetch(`${FLUTTERWAVE_API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FLUTTERWAVE_SECRET_KEY}`
      },
      body: JSON.stringify(paymentPayload)
    });

    if (!flutterwaveResponse.ok) {
      const errorText = await flutterwaveResponse.text();
      console.error("Flutterwave API error:", errorText);
      throw new Error(`Flutterwave API error: ${flutterwaveResponse.status} ${errorText}`);
    }

    const flutterwaveData = await flutterwaveResponse.json();
    
    if (flutterwaveData.status !== "success") {
      throw new Error(flutterwaveData.message || "Flutterwave transaction initialization failed");
    }
    
    // Log the payment attempt
    try {
      const supabaseAdmin = await createAdminClient();
      
      await supabaseAdmin.from('payment_logs').insert({
        payment_reference: paymentPayload.tx_ref,
        event_type: 'initialize',
        status: 'pending',
        amount: amount,
        provider: 'flutterwave',
        details: {
          request: {
            email,
            amount,
            currency,
            callback_url
          },
          response: flutterwaveData
        }
      });
    } catch (logError) {
      console.error("Error logging payment attempt:", logError);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        reference: paymentPayload.tx_ref,
        message: "Payment initialized successfully",
        redirectUrl: flutterwaveData.data.link,
        status: "pending",
        gatewayResponse: flutterwaveData.data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error initializing Flutterwave payment:", error);
    
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
