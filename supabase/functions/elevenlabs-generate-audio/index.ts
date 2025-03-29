
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AudioGenerationRequest {
  mealName: string;
  preservationInstructions: any[];
  reheatingInstructions: any[];
  voiceId: string;
  model: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mealName, preservationInstructions, reheatingInstructions, voiceId, model } = 
      await req.json() as AudioGenerationRequest;
    
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not set");
    }

    // Generate the script for the audio instructions
    const script = generatePreservationScript(mealName, preservationInstructions, reheatingInstructions);
    
    console.log("Generating audio with script:", script);

    // Call ElevenLabs API to convert text to speech
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: script,
        model_id: model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", errorText);
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }

    // Get audio content as ArrayBuffer
    const audioArrayBuffer = await response.arrayBuffer();
    
    // Upload to Supabase Storage
    const filename = `audio-guides/${mealName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.mp3`;
    
    // Create a supabase client using the environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials are not set");
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Ensure the bucket exists
    const { data: bucketData, error: bucketError } = await supabaseAdmin
      .storage
      .getBucket('audio-guides');
    
    if (bucketError) {
      // Bucket doesn't exist, create it
      const { error: createBucketError } = await supabaseAdmin.storage.createBucket('audio-guides', {
        public: true
      });
      
      if (createBucketError) {
        throw createBucketError;
      }
    }
    
    // Upload the file
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('audio-guides')
      .upload(filename, audioArrayBuffer, {
        contentType: 'audio/mpeg',
        cacheControl: '3600'
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('audio-guides')
      .getPublicUrl(filename);
    
    const audioUrl = publicUrlData.publicUrl;
    
    return new Response(
      JSON.stringify({
        success: true,
        audioUrl
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error generating audio:", error);
    
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

// Helper function to generate the script from preservation instructions
function generatePreservationScript(
  mealName: string,
  preservationInstructions: any[],
  reheatingInstructions: any[]
): string {
  let script = `Hello! Here are the preservation and reheating instructions for your ${mealName}.\n\n`;
  
  // Add preservation instructions
  if (preservationInstructions.length > 0) {
    script += "For preservation:\n";
    
    preservationInstructions.forEach((instruction, index) => {
      script += `Option ${index + 1}: ${instruction.method}.\n`;
      script += `This will keep your meal fresh for ${instruction.duration.value} ${instruction.duration.unit}.\n`;
      
      if (instruction.tips && instruction.tips.length > 0) {
        script += "Tips:\n";
        instruction.tips.forEach((tip: string) => {
          script += `- ${tip}\n`;
        });
      }
      
      script += "\n";
    });
  }
  
  // Add reheating instructions
  if (reheatingInstructions.length > 0) {
    script += "For reheating:\n";
    
    reheatingInstructions.forEach((instruction, index) => {
      script += `Option ${index + 1}: ${instruction.method}.\n`;
      script += `This will take about ${instruction.duration.value} ${instruction.duration.unit}.\n`;
      
      if (instruction.steps && instruction.steps.length > 0) {
        script += "Steps:\n";
        instruction.steps.forEach((step: string, stepIndex: number) => {
          script += `Step ${stepIndex + 1}: ${step}\n`;
        });
      }
      
      script += "\n";
    });
  }
  
  script += "Enjoy your meal!";
  
  return script;
}

// Helper function to create Supabase client with customized fetch
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.2";
