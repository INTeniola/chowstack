
// This service integrates with Claude API for AI-powered features

import { supabase } from '@/integrations/supabase/client';
import { MealPackage } from '@/components/MealPackageCard';
import { PreservationInstruction, ReheatingInstruction } from '@/types/preservationTypes';
import { trackApiFailure } from '@/lib/sentry';

// Generate meal descriptions with Claude
export const generateMealDescription = async (
  mealData: {
    name: string;
    ingredients: string[];
    cuisineType: string[];
    dietaryTags?: string[];
  }
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('claude-generate-description', {
      body: { mealData }
    });
    
    if (error) throw error;
    return data.description;
  } catch (error) {
    trackApiFailure('claude', 'generate-description', error, { mealData });
    console.error('Error generating meal description:', error);
    
    // Fallback: Generate a simple description without AI
    const { name, ingredients, cuisineType, dietaryTags } = mealData;
    return `${name} is a delicious ${cuisineType.join(', ')} dish made with ${ingredients.slice(0, 3).join(', ')}${ingredients.length > 3 ? ' and other ingredients' : ''}. ${dietaryTags ? `Suitable for ${dietaryTags.join(', ')} diets.` : ''}`;
  }
};

// Analyze user feedback to extract sentiment and actionable insights
export const analyzeFeedback = async (
  feedback: {
    type: string;
    rating: number;
    comment: string;
    mealId?: string;
    orderId?: string;
  }
): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  actionableInsights: string[];
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('claude-analyze-feedback', {
      body: { feedback }
    });
    
    if (error) throw error;
    return data.analysis;
  } catch (error) {
    trackApiFailure('claude', 'analyze-feedback', error, { feedback });
    console.error('Error analyzing feedback:', error);
    
    // Fallback: Simple analysis based on rating
    return {
      sentiment: feedback.rating >= 4 ? 'positive' : feedback.rating >= 2 ? 'neutral' : 'negative',
      topics: ['general'],
      actionableInsights: feedback.rating < 4 ? ['Consider addressing customer concerns'] : ['Continue providing good service']
    };
  }
};

// Generate personalized meal recommendations
export const generatePersonalizedRecommendations = async (
  userId: string,
  preferences: {
    dietaryRestrictions: string[];
    likedCuisines: string[];
    dislikedIngredients: string[];
    previousOrders?: string[];
  }
): Promise<{
  recommendedMeals: string[];
  reasons: Record<string, string>;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('claude-recommend-meals', {
      body: { userId, preferences }
    });
    
    if (error) throw error;
    return data.recommendations;
  } catch (error) {
    trackApiFailure('claude', 'recommend-meals', error, { userId, preferences });
    console.error('Error generating meal recommendations:', error);
    
    // Fallback: Return empty recommendations
    return {
      recommendedMeals: [],
      reasons: {}
    };
  }
};

// Process natural language search queries
export const processNaturalLanguageSearch = async (
  query: string
): Promise<{
  structuredQuery: {
    keywords: string[];
    cuisineTypes: string[];
    dietaryRestrictions: string[];
    priceRange?: { min: number; max: number };
    mealTypes?: string[];
  };
  enhancedQuery: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('claude-process-search', {
      body: { query }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    trackApiFailure('claude', 'process-search', error, { query });
    console.error('Error processing search query:', error);
    
    // Fallback: Basic keyword extraction
    const keywords = query.toLowerCase()
      .split(' ')
      .filter(word => word.length > 3);
    
    return {
      structuredQuery: {
        keywords,
        cuisineTypes: [],
        dietaryRestrictions: [],
      },
      enhancedQuery: query
    };
  }
};

// Generate preservation instructions using Claude
export const generatePreservationInstructions = async (
  meal: MealPackage
): Promise<{
  preservationInstructions: PreservationInstruction[];
  reheatingInstructions: ReheatingInstruction[];
  freshnessDuration: number;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('claude-preservation-guide', {
      body: { meal }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    trackApiFailure('claude', 'preservation-guide', error, { mealId: meal.id });
    console.error('Error generating preservation instructions:', error);
    
    // Fallback to mock data in case of error (from the original implementation)
    // Simulate different instructions based on cuisine type
    const cuisineType = meal.cuisineType[0].toLowerCase();
    
    if (cuisineType.includes('soup') || cuisineType.includes('stew')) {
      return {
        preservationInstructions: [
          {
            method: 'refrigerate',
            duration: { value: 3, unit: 'days' },
            tips: [
              'Allow to cool before refrigerating',
              'Store in an airtight container',
              'Keep away from raw foods'
            ]
          },
          {
            method: 'freeze',
            duration: { value: 60, unit: 'days' },
            tips: [
              'Divide into portion-sized containers',
              'Leave some space at the top for expansion',
              'Label with date frozen'
            ]
          }
        ],
        reheatingInstructions: [
          {
            method: 'microwave',
            duration: { value: 5, unit: 'minutes' },
            steps: [
              'Transfer to microwave-safe container',
              'Cover with microwave-safe lid or paper towel',
              'Heat on high for 2-3 minutes, stir, then heat for another 2-3 minutes',
              'Ensure it reaches at least 75°C before serving'
            ]
          },
          {
            method: 'stovetop',
            duration: { value: 10, unit: 'minutes' },
            temperature: 100,
            steps: [
              'Transfer to pot',
              'Heat on medium, stirring occasionally',
              'Add a splash of water if needed',
              'Heat until bubbling and at least 75°C'
            ]
          }
        ],
        freshnessDuration: 3
      };
    } else if (cuisineType.includes('rice')) {
      return {
        preservationInstructions: [
          {
            method: 'refrigerate',
            duration: { value: 2, unit: 'days' },
            tips: [
              'Allow to cool within 1 hour of cooking',
              'Store in an airtight container',
              'Refrigerate promptly'
            ]
          },
          {
            method: 'freeze',
            duration: { value: 30, unit: 'days' },
            tips: [
              'Spread on a tray to cool quickly',
              'Portion into meal-sized servings',
              'Label with date and contents'
            ]
          }
        ],
        reheatingInstructions: [
          {
            method: 'microwave',
            duration: { value: 3, unit: 'minutes' },
            steps: [
              'Sprinkle with a tablespoon of water',
              'Cover loosely with a microwave-safe lid',
              'Heat for 1-2 minutes, stir, then heat for another 1-2 minutes',
              'Let stand for 1 minute before serving'
            ]
          },
          {
            method: 'stovetop',
            duration: { value: 5, unit: 'minutes' },
            steps: [
              'Add a tablespoon of oil to a pan',
              'Add rice and break up any clumps',
              'Stir-fry until hot throughout',
              'Add a few drops of water and cover for 1 minute to steam'
            ]
          }
        ],
        freshnessDuration: 2
      };
    } else {
      // Default instructions for other cuisine types
      return {
        preservationInstructions: [
          {
            method: 'refrigerate',
            duration: { value: 4, unit: 'days' },
            tips: [
              'Cool within 2 hours of cooking',
              'Store in airtight containers',
              'Keep on upper shelves of refrigerator'
            ]
          }
        ],
        reheatingInstructions: [
          {
            method: 'microwave',
            duration: { value: 4, unit: 'minutes' },
            steps: [
              'Place food in a microwave-safe dish',
              'Cover with a microwave-safe lid or damp paper towel',
              'Heat on high for 2 minutes, stir, then heat for another 2 minutes',
              'Let stand for 1 minute before serving'
            ]
          }
        ],
        freshnessDuration: 4
      };
    }
  }
};
