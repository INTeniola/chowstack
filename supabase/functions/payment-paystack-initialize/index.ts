
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
