
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
const FLUTTERWAVE_SECRET_KEY = Deno.env.get('FLUTTERWAVE_SECRET_KEY');

const PAYSTACK_API_URL = "https://api.paystack.co";
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
    const { reference, gateway } = await req.json();
    
    if (!reference) {
      throw new Error("Payment reference is required");
    }

    if (!gateway) {
      throw new Error("Payment gateway is required");
    }

    console.log(`Verifying payment status for reference: ${reference} using ${gateway}`);

    let verificationResult;
    
    // Verify based on the specified gateway
    switch(gateway) {
      case 'paystack':
        verificationResult = await verifyPaystackPayment(reference);
        break;
      case 'flutterwave':
        verificationResult = await verifyFlutterwavePayment(reference);
        break;
      default:
        throw new Error(`Unsupported payment gateway: ${gateway}`);
    }
    
    // Log the verification attempt
    try {
      const supabaseAdmin = await createAdminClient();
      
      await supabaseAdmin.from('payment_logs').insert({
        payment_reference: reference,
        event_type: 'verify',
        status: verificationResult.success ? 'success' : 'failed',
        amount: verificationResult.amount,
        provider: gateway,
        details: verificationResult.gatewayResponse
      });
      
      // If payment is successful, update the pending_payments table
      if (verificationResult.success && verificationResult.status === 'successful') {
        await supabaseAdmin.from('pending_payments')
          .update({ 
            status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('reference', reference);
      }
    } catch (logError) {
      console.error("Error logging payment verification:", logError);
    }
    
    return new Response(
      JSON.stringify(verificationResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        reference: "",
        message: error.message || "Failed to verify payment",
        status: "failed"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function verifyPaystackPayment(reference: string) {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not set");
  }

  const response = await fetch(`${PAYSTACK_API_URL}/transaction/verify/${reference}`, {
    headers: {
      "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paystack verification error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.status) {
    throw new Error(data.message || "Paystack verification failed");
  }
  
  // Map Paystack status to our system status
  const paymentStatus = data.data.status === 'success' ? 'successful' : 
                         data.data.status === 'failed' ? 'failed' : 'pending';
  
  // Amount from Paystack is in kobo, convert to naira
  const amountInNaira = data.data.amount / 100;
  
  return {
    success: true,
    reference: data.data.reference,
    message: `Payment verification ${paymentStatus}`,
    redirectUrl: null,
    status: paymentStatus,
    amount: amountInNaira,
    gatewayResponse: data.data
  };
}

async function verifyFlutterwavePayment(reference: string) {
  if (!FLUTTERWAVE_SECRET_KEY) {
    throw new Error("FLUTTERWAVE_SECRET_KEY is not set");
  }

  const response = await fetch(`${FLUTTERWAVE_API_URL}/transactions/verify_by_reference?tx_ref=${reference}`, {
    headers: {
      "Authorization": `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flutterwave verification error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  
  if (data.status !== "success") {
    throw new Error(data.message || "Flutterwave verification failed");
  }
  
  // Map Flutterwave status to our system status
  const paymentStatus = data.data.status === 'successful' ? 'successful' : 
                         data.data.status === 'failed' ? 'failed' : 'pending';
  
  return {
    success: true,
    reference: data.data.tx_ref,
    message: `Payment verification ${paymentStatus}`,
    redirectUrl: null,
    status: paymentStatus,
    amount: data.data.amount,
    gatewayResponse: data.data
  };
}

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
