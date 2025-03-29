
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// SMS provider API keys from environment variables
const TERMII_API_KEY = Deno.env.get('TERMII_API_KEY');
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const AFRICASTALKING_API_KEY = Deno.env.get('AFRICASTALKING_API_KEY');
const INFOBIP_API_KEY = Deno.env.get('INFOBIP_API_KEY');

// API URLs
const TERMII_API_URL = "https://api.ng.termii.com/api";
const TWILIO_API_URL = "https://api.twilio.com/2010-04-01";
const AFRICASTALKING_API_URL = "https://api.africastalking.com/version1/messaging";
const INFOBIP_API_URL = "https://xyl3g0.api.infobip.com/sms/2/text/advanced";

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
      to,
      message,
      type,
      provider = 'termii',
      senderId = 'MealStock',
      reference,
      metadata
    } = await req.json();
    
    // Validate phone number format (basic validation)
    if (!to || !to.match(/^\+?[0-9]{10,15}$/)) {
      throw new Error("Invalid phone number format");
    }
    
    // Normalize Nigerian phone numbers if needed
    const normalizedPhone = normalizeNigerianPhoneNumber(to);
    
    // Validate message
    if (!message || message.length < 1) {
      throw new Error("Message is required");
    }
    
    console.log(`Sending SMS via ${provider} to ${normalizedPhone}`);
    
    let result;
    
    // Send SMS based on selected provider
    switch (provider.toLowerCase()) {
      case 'termii':
        result = await sendSmsViaTermii(normalizedPhone, message, senderId);
        break;
      case 'twilio':
        result = await sendSmsViaTwilio(normalizedPhone, message, senderId);
        break;
      case 'africastalking':
        result = await sendSmsViaAfricastalking(normalizedPhone, message, senderId);
        break;
      case 'infobip':
        result = await sendSmsViaInfobip(normalizedPhone, message, senderId);
        break;
      default:
        throw new Error(`Unsupported SMS provider: ${provider}`);
    }
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error sending SMS:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to send SMS"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

// Function to normalize Nigerian phone numbers
function normalizeNigerianPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If it starts with '0', replace with Nigerian country code
  if (cleaned.startsWith('0')) {
    cleaned = '234' + cleaned.substring(1);
  }
  
  // If it doesn't have country code yet, add it
  if (!cleaned.startsWith('234')) {
    cleaned = '234' + cleaned;
  }
  
  // Ensure the number has the correct format
  if (cleaned.length < 10 || cleaned.length > 14) {
    throw new Error("Invalid Nigerian phone number length");
  }
  
  return cleaned;
}

// Send SMS via Termii
async function sendSmsViaTermii(to: string, message: string, senderId: string): Promise<any> {
  if (!TERMII_API_KEY) {
    throw new Error("TERMII_API_KEY is not set");
  }
  
  const response = await fetch(`${TERMII_API_URL}/sms/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      api_key: TERMII_API_KEY,
      to,
      from: senderId,
      sms: message,
      type: "plain",
      channel: "generic"
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Termii API error: ${response.status} ${errorText}`);
  }
  
  const data = await response.json();
  
  return {
    success: data.message === "Successfully Sent",
    messageId: data.message_id || null,
    reference: data.message_id || null,
    message: data.message || "Message sent"
  };
}

// Send SMS via Twilio
async function sendSmsViaTwilio(to: string, message: string, senderId: string): Promise<any> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error("Twilio credentials are not set");
  }
  
  // Twilio requires + before phone numbers with country code
  const formattedTo = to.startsWith('+') ? to : `+${to}`;
  
  // Encode the credentials for Basic Auth
  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  
  // Prepare the form data
  const formData = new URLSearchParams();
  formData.append('To', formattedTo);
  formData.append('From', senderId);
  formData.append('Body', message);
  
  const response = await fetch(`${TWILIO_API_URL}/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData.toString()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Twilio API error: ${data.code} - ${data.message}`);
  }
  
  return {
    success: data.status !== "failed",
    messageId: data.sid || null,
    reference: data.sid || null,
    message: data.status || "Message sent"
  };
}

// Send SMS via Africa's Talking
async function sendSmsViaAfricastalking(to: string, message: string, senderId: string): Promise<any> {
  if (!AFRICASTALKING_API_KEY) {
    throw new Error("AFRICASTALKING_API_KEY is not set");
  }
  
  // Africa's Talking expects a comma-separated list of recipients
  const response = await fetch(AFRICASTALKING_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      "apiKey": AFRICASTALKING_API_KEY,
      "username": "mealstock" // Your AT username should be set here
    },
    body: new URLSearchParams({
      to,
      message,
      from: senderId
    }).toString()
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Africa's Talking API error: ${response.status} ${errorText}`);
  }
  
  const data = await response.json();
  
  if (data.SMSMessageData.Recipients[0].status !== "Success") {
    throw new Error(data.SMSMessageData.Recipients[0].statusCode);
  }
  
  return {
    success: data.SMSMessageData.Recipients[0].status === "Success",
    messageId: data.SMSMessageData.Recipients[0].messageId || null,
    reference: data.SMSMessageData.Recipients[0].messageId || null,
    message: "Message sent successfully"
  };
}

// Send SMS via Infobip
async function sendSmsViaInfobip(to: string, message: string, senderId: string): Promise<any> {
  if (!INFOBIP_API_KEY) {
    throw new Error("INFOBIP_API_KEY is not set");
  }
  
  const response = await fetch(INFOBIP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `App ${INFOBIP_API_KEY}`
    },
    body: JSON.stringify({
      messages: [
        {
          from: senderId,
          destinations: [
            { to }
          ],
          text: message
        }
      ]
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Infobip API error: ${response.status} ${errorText}`);
  }
  
  const data = await response.json();
  
  if (data.messages[0].status.groupName !== "PENDING") {
    throw new Error(data.messages[0].status.description);
  }
  
  return {
    success: data.messages[0].status.groupName === "PENDING",
    messageId: data.messages[0].messageId || null,
    reference: data.messages[0].messageId || null,
    message: data.messages[0].status.description || "Message sent"
  };
}
