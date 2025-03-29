
import { supabase } from '@/integrations/supabase/client';
import { trackEdgeFunctionPerformance, captureEdgeFunctionError, trackApiFailure } from '@/lib/sentry';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Helper function for retrying failed requests
const retryOperation = async <T>(
  operation: () => Promise<T>, 
  functionName: string,
  maxRetries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1}/${maxRetries + 1} failed for ${functionName}:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
      }
    }
  }
  
  captureEdgeFunctionError(functionName, lastError);
  throw lastError;
};

// Process a new order
export const processOrder = async (orderData: any) => {
  const functionName = 'process-order';
  const startTime = performance.now();
  
  try {
    const operation = async () => {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: orderData,
      });
      
      if (error) throw error;
      return data;
    };
    
    const result = await retryOperation(operation, functionName);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance(functionName, duration, true);
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance(functionName, duration, false);
    captureEdgeFunctionError(functionName, error);
    trackApiFailure('supabase', `functions/${functionName}`, error, { orderData });
    
    console.error(`Error processing order:`, error);
    throw error;
  }
};

// Get personalized recommendations for a user
export const getRecommendations = async (userId: string, location?: { lat: number; lng: number }) => {
  const functionName = 'generate-recommendations';
  const startTime = performance.now();
  
  try {
    const operation = async () => {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          user_id: userId,
          location
        },
      });
      
      if (error) throw error;
      return data;
    };
    
    const result = await retryOperation(operation, functionName);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance(functionName, duration, true);
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance(functionName, duration, false);
    captureEdgeFunctionError(functionName, error);
    trackApiFailure('supabase', `functions/${functionName}`, error, { userId, location });
    
    console.error(`Error getting recommendations:`, error);
    throw error;
  }
};

// Generate preservation guide for a meal
export const generatePreservationGuide = async (mealId: string) => {
  const functionName = 'generate-preservation-guide';
  const startTime = performance.now();
  
  try {
    const operation = async () => {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          meal_id: mealId
        },
      });
      
      if (error) throw error;
      return data;
    };
    
    const result = await retryOperation(operation, functionName);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance(functionName, duration, true);
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance(functionName, duration, false);
    captureEdgeFunctionError(functionName, error);
    trackApiFailure('supabase', `functions/${functionName}`, error, { mealId });
    
    console.error(`Error generating preservation guide:`, error);
    throw error;
  }
};

// Run inventory management check
export const checkInventory = async () => {
  const functionName = 'manage-inventory';
  const startTime = performance.now();
  
  try {
    const operation = async () => {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {},
      });
      
      if (error) throw error;
      return data;
    };
    
    const result = await retryOperation(operation, functionName);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance(functionName, duration, true);
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance(functionName, duration, false);
    captureEdgeFunctionError(functionName, error);
    trackApiFailure('supabase', `functions/${functionName}`, error);
    
    console.error(`Error checking inventory:`, error);
    throw error;
  }
};

// Find community matches for a user
export const findCommunityMatches = async (
  userId: string, 
  location?: { lat: number; lng: number; radius?: number }
) => {
  const functionName = 'community-matching';
  const startTime = performance.now();
  
  try {
    const operation = async () => {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          user_id: userId,
          location_lat: location?.lat,
          location_lng: location?.lng,
          radius: location?.radius || 10 // Default 10km radius
        },
      });
      
      if (error) throw error;
      return data;
    };
    
    const result = await retryOperation(operation, functionName);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance(functionName, duration, true);
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackEdgeFunctionPerformance(functionName, duration, false);
    captureEdgeFunctionError(functionName, error);
    trackApiFailure('supabase', `functions/${functionName}`, error, { userId, location });
    
    console.error(`Error finding community matches:`, error);
    throw error;
  }
};
