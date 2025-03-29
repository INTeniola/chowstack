
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Initialize Supabase Admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const body = await req.json();
    const { record, type } = body;
    
    // Only process new user creations
    if (type !== "INSERT" || !record) {
      return new Response(
        JSON.stringify({ message: "Not a user creation event" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
    
    // Get user details
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(record.id);
    
    if (userError || !userData.user) {
      throw new Error(`Error fetching user: ${userError?.message}`);
    }
    
    // Prepare email content
    const user = userData.user;
    const isVendor = user.app_metadata?.is_vendor || user.user_metadata?.is_vendor || false;
    const welcomeEmail = {
      to: user.email,
      subject: `Welcome to MealStock${isVendor ? " Vendor Portal" : ""}!`,
      html: getWelcomeEmailTemplate(user.user_metadata?.full_name || "there", isVendor),
    };
    
    // Send email using your preferred email service
    // This is a placeholder - replace with your actual email sending logic
    console.log("Would send welcome email:", welcomeEmail);
    
    // For now, just log the email details
    return new Response(
      JSON.stringify({ 
        message: "Welcome email logged",
        email: welcomeEmail,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Email template function
function getWelcomeEmailTemplate(name: string, isVendor: boolean): string {
  if (isVendor) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2B543F;">Welcome to MealStock Vendor Portal, ${name}!</h1>
        <p>Thank you for joining our community of food vendors and chefs. We're excited to have you on board!</p>
        <p>As a MealStock vendor, you'll be able to:</p>
        <ul>
          <li>List your delicious meals and food packages</li>
          <li>Manage your orders and inventory</li>
          <li>Connect with customers who love your food</li>
          <li>Track your sales and performance</li>
        </ul>
        <p>To get started, please complete your vendor profile by adding your business details, uploading photos, and creating your first meal listings.</p>
        <p>If you need any assistance, our vendor support team is here to help you succeed.</p>
        <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
          <p style="margin: 0;"><strong>Next Steps:</strong></p>
          <ol style="margin-top: 10px;">
            <li>Complete your vendor profile</li>
            <li>Add your business hours and location</li>
            <li>Create your first meal listings</li>
            <li>Set up your payment details</li>
          </ol>
        </div>
        <p style="margin-top: 30px;">Happy cooking!</p>
        <p>The MealStock Team</p>
      </div>
    `;
  } else {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2B543F;">Welcome to MealStock, ${name}!</h1>
        <p>Thank you for creating an account with MealStock. We're thrilled to have you join our community of food lovers!</p>
        <p>With your MealStock account, you can:</p>
        <ul>
          <li>Discover delicious meal packages from local vendors</li>
          <li>Create personalized meal plans</li>
          <li>Join community group orders for better deals</li>
          <li>Track your orders and preferences</li>
        </ul>
        <p>We recommend starting by exploring our available meal options and setting up your dietary preferences for a personalized experience.</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://mealstock.app/discovery" style="background-color: #2B543F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Explore Meals</a>
        </div>
        <p style="margin-top: 30px;">Enjoy your MealStock experience!</p>
        <p>The MealStock Team</p>
      </div>
    `;
  }
}
