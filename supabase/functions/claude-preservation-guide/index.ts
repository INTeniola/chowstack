
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

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
    const { meal } = await req.json();
    
    if (!CLAUDE_API_KEY) {
      throw new Error("CLAUDE_API_KEY is not set");
    }

    console.log("Generating preservation guide for meal:", meal.name);

    // Construct the prompt for Claude
    const prompt = `
    You are a culinary preservation expert helping generate detailed storage and reheating instructions for meals.
    
    Please provide detailed preservation and reheating instructions for the following meal:
    
    Meal Name: ${meal.name}
    Ingredients: ${meal.ingredients ? meal.ingredients.join(', ') : 'Not specified'}
    Cuisine Type: ${meal.cuisineType ? meal.cuisineType.join(', ') : 'Not specified'}
    Dietary Tags: ${meal.dietaryTags ? meal.dietaryTags.join(', ') : 'None'}
    
    Your response should be formatted as a JSON object with the following structure:
    
    {
      "preservationInstructions": [
        {
          "method": "refrigerate|freeze|room_temperature",
          "duration": {
            "value": number,
            "unit": "minutes|hours|days"
          },
          "tips": ["tip1", "tip2", ...]
        }
      ],
      "reheatingInstructions": [
        {
          "method": "microwave|oven|stovetop|air_fryer|none",
          "duration": {
            "value": number,
            "unit": "minutes|hours|days"
          },
          "temperature": number (optional),
          "steps": ["step1", "step2", ...]
        }
      ],
      "freshnessDuration": number (in days)
    }
    
    Include multiple preservation methods where applicable. Ensure that the instructions are specific to the cuisine type and ingredients. For Nigerian dishes, please adjust instructions as appropriate for the local climate and kitchen infrastructure.
    `;

    // Call Claude API
    const claudeResponse = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2
      })
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Claude API error: ${claudeResponse.status} ${errorText}`);
    }

    const claudeData = await claudeResponse.json();
    
    // Extract the generated JSON from Claude's response text
    const responseText = claudeData.content[0].text;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/{[\s\S]*?}/);
                      
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Claude's response");
    }
    
    // Parse the extracted JSON
    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const guideData = JSON.parse(jsonStr);
    
    // Create a complete guide object
    const guide = {
      id: crypto.randomUUID(),
      meal_id: meal.id,
      preservation_instructions: guideData.preservationInstructions,
      reheating_instructions: guideData.reheatingInstructions,
      freshness_duration: guideData.freshnessDuration,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify({
        success: true,
        guide
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error generating preservation guide:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
