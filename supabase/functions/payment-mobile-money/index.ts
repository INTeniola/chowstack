
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// We'll support multiple mobile money providers
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
      mobile
    } = await req.json();
    
    if (!FLUTTERWAVE_SECRET_KEY) {
      throw new Error("FLUTTERWAVE_SECRET_KEY is not set");
    }
    
    if (!mobile || !mobile.number || !mobile.provider) {
      throw new Error("Mobile money details are required");
    }

    console.log("Initializing Mobile Money payment for:", email);

    // Map the provider to Flutterwave's payment type
    const providerMapping = {
      "mtn": "MoMo",
      "airtel": "MoMo",
      "glo": "MoMo",
      "9mobile": "MoMo",
      "paga": "Paga"
    };
    
    const paymentType = providerMapping[mobile.provider.toLowerCase()] || "MoMo";

    // Prepare the payment payload
    const paymentPayload = {
      tx_ref: reference || `MM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount,
      currency,
      redirect_url: callback_url,
      payment_type: paymentType,
      customer: {
        email,
        phone_number: mobile.number,
        name: metadata?.customerName || 'Customer'
      },
      meta: metadata || {},
      mobile_money: {
        phone: mobile.number,
        network: mobile.provider.toLowerCase()
      }
    };

    // Call Flutterwave API to initialize mobile money transaction
    const flutterwaveResponse = await fetch(`${FLUTTERWAVE_API_URL}/charges?type=mobile_money`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FLUTTERWAVE_SECRET_KEY}`
      },
      body: JSON.stringify(paymentPayload)
    });

    if (!flutterwaveResponse.ok) {
      const errorText = await flutterwaveResponse.text();
      console.error("Flutterwave Mobile Money API error:", errorText);
      throw new Error(`Flutterwave Mobile Money API error: ${flutterwaveResponse.status} ${errorText}`);
    }

    const flutterwaveData = await flutterwaveResponse.json();
    
    if (flutterwaveData.status !== "success") {
      throw new Error(flutterwaveData.message || "Mobile Money transaction initialization failed");
    }
    
    // Log the payment attempt
    try {
      const supabaseAdmin = await createAdminClient();
      
      await supabaseAdmin.from('payment_logs').insert({
        payment_reference: paymentPayload.tx_ref,
        event_type: 'initialize',
        status: 'pending',
        amount: amount,
        provider: 'mobile_money',
        details: {
          request: {
            email,
            amount,
            currency,
            mobile: {
              number: mobile.number,
              provider: mobile.provider
            }
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
        message: "Mobile Money payment initialized successfully",
        redirectUrl: flutterwaveData.data.link || null,
        status: "pending",
        gatewayResponse: flutterwaveData.data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error initializing Mobile Money payment:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        reference: "",
        message: error.message || "Failed to initialize Mobile Money payment",
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
