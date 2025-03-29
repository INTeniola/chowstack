
// Integration with ElevenLabs API for voice and audio generation

import { supabase } from '@/integrations/supabase/client';
import { PreservationInstruction, ReheatingInstruction } from '@/types/preservationTypes';
import { trackApiFailure } from '@/lib/sentry';

// Voice profile IDs for different types of content
export enum VoiceProfile {
  CULINARY_EXPERT = "XB0fDUnXU5powFXDhCwa", // Charlotte - culinary expert voice
  DELIVERY_AGENT = "TX3LPaxmHKxFdv7VOQHJ",  // Liam - delivery agent voice
  CUSTOMER_SERVICE = "EXAVITQu4vr4xnSDxMaL", // Sarah - customer service voice
  GUIDE_NARRATOR = "JBFqnCBsd6RMkjVDRZzb"   // George - guide narrator voice
}

// Voice models
export enum VoiceModel {
  MULTILINGUAL = "eleven_multilingual_v2",
  TURBO = "eleven_turbo_v2"
}

// Generate audio instructions for meal preservation and reheating
export const generateAudioInstructions = async (
  mealName: string,
  preservationInstructions: PreservationInstruction[],
  reheatingInstructions: ReheatingInstruction[],
  voiceId: string = VoiceProfile.CULINARY_EXPERT,
  model: string = VoiceModel.MULTILINGUAL
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('elevenlabs-generate-audio', {
      body: {
        mealName,
        preservationInstructions,
        reheatingInstructions,
        voiceId,
        model
      }
    });
    
    if (error) throw error;
    return data.audioUrl;
  } catch (error) {
    trackApiFailure('elevenlabs', 'generate-audio', error, { 
      mealName, 
      preservationInstructions, 
      reheatingInstructions 
    });
    console.error('Error generating audio instructions:', error);
    
    // Return a mock audio URL for fallback
    return `https://example.com/audio/${mealName.replace(/\s+/g, '-').toLowerCase()}.mp3`;
  }
};

// Generate QR code for audio instructions
export const generateQRCodeForAudio = async (audioUrl: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-qrcode', {
      body: { url: audioUrl }
    });
    
    if (error) throw error;
    return data.qrCodeUrl;
  } catch (error) {
    trackApiFailure('qrcode', 'generate', error, { audioUrl });
    console.error('Error generating QR code:', error);
    
    // Return a mock QR code URL for fallback
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(audioUrl)}`;
  }
};

// Generate delivery notifications in local dialect
export const generateDeliveryNotification = async (
  recipientName: string,
  estimatedTime: string,
  deliveryLocation: string,
  isDelayed: boolean = false,
  dialect: 'english' | 'pidgin' | 'yoruba' | 'hausa' | 'igbo' = 'english',
  voiceId: string = VoiceProfile.DELIVERY_AGENT
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('elevenlabs-delivery-notification', {
      body: {
        recipientName,
        estimatedTime,
        deliveryLocation,
        isDelayed,
        dialect,
        voiceId
      }
    });
    
    if (error) throw error;
    return data.audioUrl;
  } catch (error) {
    trackApiFailure('elevenlabs', 'delivery-notification', error, { 
      recipientName, 
      estimatedTime, 
      deliveryLocation, 
      dialect 
    });
    console.error('Error generating delivery notification:', error);
    
    // Return a mock audio URL for fallback
    return `https://example.com/notifications/delivery-${isDelayed ? 'delayed' : 'ontime'}.mp3`;
  }
};

// Generate voice responses for common customer questions
export const generateCustomerSupportResponse = async (
  question: string,
  voiceId: string = VoiceProfile.CUSTOMER_SERVICE
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('elevenlabs-customer-support', {
      body: {
        question,
        voiceId
      }
    });
    
    if (error) throw error;
    return data.audioUrl;
  } catch (error) {
    trackApiFailure('elevenlabs', 'customer-support', error, { question });
    console.error('Error generating customer support response:', error);
    
    // Return a mock audio URL for fallback
    const questionType = 
      question.toLowerCase().includes('delivery') ? 'delivery' :
      question.toLowerCase().includes('payment') ? 'payment' :
      question.toLowerCase().includes('refund') ? 'refund' : 'general';
    
    return `https://example.com/support/${questionType}-response.mp3`;
  }
};

// Convert text to speech for any content
export const textToSpeech = async (
  text: string,
  voiceId: string = VoiceProfile.GUIDE_NARRATOR,
  model: string = VoiceModel.MULTILINGUAL
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
      body: {
        text,
        voiceId,
        model
      }
    });
    
    if (error) throw error;
    return data.audioUrl;
  } catch (error) {
    trackApiFailure('elevenlabs', 'text-to-speech', error, { text });
    console.error('Error converting text to speech:', error);
    
    // Return a mock audio URL for fallback
    return `https://example.com/tts/fallback-audio.mp3`;
  }
};
