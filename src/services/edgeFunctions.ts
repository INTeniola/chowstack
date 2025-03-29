
import { supabase } from '@/integrations/supabase/client';
import { trackEdgeFunctionPerformance, captureEdgeFunctionError } from '@/lib/sentry';

// Process a new order
export const processOrder = async (orderData: any) => {
  const startTime = performance.now();
  try {
    const { data, error } = await supabase.functions.invoke('process-order', {
      body: orderData,
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance('process-order', duration, !error);
    
    if (error) throw error;
    return data;
  } catch (error) {
    captureEdgeFunctionError('process-order', error);
    console.error('Error processing order:', error);
    throw error;
  }
};

// Get personalized recommendations for a user
export const getRecommendations = async (userId: string, location?: { lat: number; lng: number }) => {
  const startTime = performance.now();
  try {
    const { data, error } = await supabase.functions.invoke('generate-recommendations', {
      body: {
        user_id: userId,
        location
      },
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance('generate-recommendations', duration, !error);
    
    if (error) throw error;
    return data;
  } catch (error) {
    captureEdgeFunctionError('generate-recommendations', error);
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

// Generate preservation guide for a meal
export const generatePreservationGuide = async (mealId: string) => {
  const startTime = performance.now();
  try {
    const { data, error } = await supabase.functions.invoke('generate-preservation-guide', {
      body: {
        meal_id: mealId
      },
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance('generate-preservation-guide', duration, !error);
    
    if (error) throw error;
    return data;
  } catch (error) {
    captureEdgeFunctionError('generate-preservation-guide', error);
    console.error('Error generating preservation guide:', error);
    throw error;
  }
};

// Run inventory management check
export const checkInventory = async () => {
  const startTime = performance.now();
  try {
    const { data, error } = await supabase.functions.invoke('manage-inventory', {
      body: {},
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance('manage-inventory', duration, !error);
    
    if (error) throw error;
    return data;
  } catch (error) {
    captureEdgeFunctionError('manage-inventory', error);
    console.error('Error checking inventory:', error);
    throw error;
  }
};

// Find community matches for a user
export const findCommunityMatches = async (
  userId: string, 
  location?: { lat: number; lng: number; radius?: number }
) => {
  const startTime = performance.now();
  try {
    const { data, error } = await supabase.functions.invoke('community-matching', {
      body: {
        user_id: userId,
        location_lat: location?.lat,
        location_lng: location?.lng,
        radius: location?.radius || 10 // Default 10km radius
      },
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance('community-matching', duration, !error);
    
    if (error) throw error;
    return data;
  } catch (error) {
    captureEdgeFunctionError('community-matching', error);
    console.error('Error finding community matches:', error);
    throw error;
  }
};
