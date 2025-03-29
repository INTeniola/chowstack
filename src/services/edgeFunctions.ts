
import { supabase } from '@/integrations/supabase/client';

// Process a new order
export const processOrder = async (orderData: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('process-order', {
      body: orderData,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
};

// Get personalized recommendations for a user
export const getRecommendations = async (userId: string, location?: { lat: number; lng: number }) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-recommendations', {
      body: {
        user_id: userId,
        location
      },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

// Generate preservation guide for a meal
export const generatePreservationGuide = async (mealId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-preservation-guide', {
      body: {
        meal_id: mealId
      },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating preservation guide:', error);
    throw error;
  }
};

// Run inventory management check
export const checkInventory = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('manage-inventory', {
      body: {},
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking inventory:', error);
    throw error;
  }
};

// Find community matches for a user
export const findCommunityMatches = async (
  userId: string, 
  location?: { lat: number; lng: number; radius?: number }
) => {
  try {
    const { data, error } = await supabase.functions.invoke('community-matching', {
      body: {
        user_id: userId,
        location_lat: location?.lat,
        location_lng: location?.lng,
        radius: location?.radius || 10 // Default 10km radius
      },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error finding community matches:', error);
    throw error;
  }
};
