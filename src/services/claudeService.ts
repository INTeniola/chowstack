
// This is a mock service for Claude API integration
// In a real application, this would call a backend service that interacts with Claude API

import { MealPackage } from '@/components/MealPackageCard';
import { PreservationInstruction, ReheatingInstruction } from '@/types/preservationTypes';

export const generatePreservationInstructions = async (
  meal: MealPackage
): Promise<{
  preservationInstructions: PreservationInstruction[];
  reheatingInstructions: ReheatingInstruction[];
  freshnessDuration: number;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real implementation, this would call the Claude API through a backend service
  // For now, we'll return mock data based on meal type

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
};
