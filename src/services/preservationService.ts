
import { v4 as uuidv4 } from 'uuid';
import { MealPackage } from '@/components/MealPackageCard';
import { MealPreservationGuide } from '@/types/preservationTypes';
import { generatePreservationGuide as fetchPreservationGuide } from './edgeFunctions';
import { saveMealPreservationGuide, getMealPreservationGuide } from './preservationDbService';

export const generateMealPreservationGuide = async (meal: MealPackage): Promise<MealPreservationGuide> => {
  // First check if we already have a guide for this meal
  const existingGuide = await getMealPreservationGuide(meal.id);
  if (existingGuide) {
    return existingGuide;
  }
  
  // Use the edge function to generate preservation guide
  try {
    const response = await fetchPreservationGuide(meal.id);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate preservation guide');
    }
    
    const guide = response.guide;
    
    // Convert the guide to our application format
    const mealGuide: MealPreservationGuide = {
      id: guide.id,
      mealId: guide.meal_id,
      mealName: meal.name,
      imageUrl: meal.imageUrl,
      preservationInstructions: guide.preservation_instructions,
      reheatingInstructions: guide.reheating_instructions,
      freshnessDuration: guide.freshness_duration,
      audioInstructionUrl: guide.audio_url,
      qrCodeUrl: guide.qr_code_url,
      customNotes: '',
      createdAt: new Date(guide.created_at),
      updatedAt: new Date(guide.updated_at)
    };
    
    // Also save to our local cache
    await saveMealPreservationGuide(mealGuide);
    
    return mealGuide;
  } catch (error) {
    console.error('Error generating preservation guide:', error);
    
    // Fallback to mock data in case of error
    const mockGuide: MealPreservationGuide = {
      id: uuidv4(),
      mealId: meal.id,
      mealName: meal.name,
      imageUrl: meal.imageUrl,
      preservationInstructions: [
        {
          method: 'refrigerate',
          duration: { value: 3, unit: 'days' },
          tips: [
            'Store in an airtight container',
            'Keep on the middle shelf of your refrigerator',
            'Consume within 3 days for best quality'
          ]
        }
      ],
      reheatingInstructions: [
        {
          method: 'microwave',
          duration: { value: 2, unit: 'minutes' },
          steps: [
            'Place in a microwave-safe container',
            'Cover with a microwave-safe lid',
            'Heat on high for 2 minutes or until hot throughout'
          ]
        }
      ],
      freshnessDuration: 3,
      customNotes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await saveMealPreservationGuide(mockGuide);
    
    return mockGuide;
  }
};

// Add a function to calculate expiration date
export const calculateExpirationDate = (guide: MealPreservationGuide, preservationMethod: string): Date => {
  const today = new Date();
  
  // Find the matching preservation method
  const instruction = guide.preservationInstructions.find(
    instr => instr.method === preservationMethod
  );
  
  if (!instruction) {
    // If no matching method, use the freshness duration
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + guide.freshnessDuration);
    return expirationDate;
  }
  
  // Calculate expiration based on the preservation method
  const expirationDate = new Date(today);
  
  switch (instruction.duration.unit) {
    case 'minutes':
      expirationDate.setMinutes(today.getMinutes() + instruction.duration.value);
      break;
    case 'hours':
      expirationDate.setHours(today.getHours() + instruction.duration.value);
      break;
    case 'days':
      expirationDate.setDate(today.getDate() + instruction.duration.value);
      break;
    default:
      expirationDate.setDate(today.getDate() + guide.freshnessDuration);
  }
  
  return expirationDate;
};
