
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
    const { meal_id } = await req.json();

    if (!meal_id) {
      throw new Error('Meal ID is required');
    }

    console.log('Generating preservation guide for meal:', meal_id);

    // Check if we already have a guide for this meal
    const { data: existingGuide, error: guideError } = await supabase
      .from('meal_preservation_guides')
      .select('*')
      .eq('meal_id', meal_id)
      .single();

    if (!guideError && existingGuide) {
      return new Response(
        JSON.stringify({
          success: true,
          guide: existingGuide,
          message: 'Existing preservation guide retrieved'
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Get meal details
    const { data: meal, error: mealError } = await supabase
      .from('meals')
      .select('*, vendors(business_name)')
      .eq('id', meal_id)
      .single();

    if (mealError) throw mealError;

    // Call Claude API to generate custom storage instructions
    // For demo purposes, we'll create mock instructions
    const preservationInstructions = [
      {
        method: 'refrigerate',
        duration: { value: 4, unit: 'days' },
        tips: [
          'Store in an airtight container',
          'Keep on the middle shelf of your refrigerator',
          'Make sure to cool within 2 hours of receiving'
        ]
      },
      {
        method: 'freeze',
        duration: { value: 30, unit: 'days' },
        tips: [
          'Divide into portion-sized containers before freezing',
          'Label with the date of freezing',
          'Allow to thaw in refrigerator for 24 hours before reheating'
        ]
      }
    ];

    // Generate reheating guidelines
    const reheatingInstructions = [
      {
        method: 'microwave',
        duration: { value: 3, unit: 'minutes' },
        steps: [
          'Place in a microwave-safe container',
          'Cover with a microwave-safe lid or paper towel',
          'Heat on high for 2-3 minutes, stirring halfway through',
          'Let stand for 1 minute before serving'
        ]
      },
      {
        method: 'oven',
        duration: { value: 15, unit: 'minutes' },
        temperature: 180, // Celsius
        steps: [
          'Preheat oven to 180°C (350°F)',
          'Transfer to an oven-safe dish',
          'Cover with foil',
          'Bake for 15 minutes, then remove foil and bake for 5 more minutes',
          'Ensure internal temperature reaches 75°C (165°F)'
        ]
      }
    ];

    // Calculate freshness duration
    const freshnessDuration = 4; // days

    // Generate audio instructions URL (mock for demo)
    const audio_url = `https://example.com/audio/${meal_id}.mp3`;

    // Store the guide in the database
    const { data: savedGuide, error: saveError } = await supabase
      .from('meal_preservation_guides')
      .insert({
        meal_id,
        preservation_instructions: preservationInstructions,
        reheating_instructions: reheatingInstructions,
        freshness_duration: freshnessDuration,
        audio_url
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return new Response(
      JSON.stringify({
        success: true,
        guide: savedGuide,
        message: 'Preservation guide generated and saved'
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error generating preservation guide:', error);
    
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
