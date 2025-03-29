
import { v4 as uuidv4 } from 'uuid';
import { MealPackage } from '@/components/MealPackageCard';
import { MealPreservationGuide } from '@/types/preservationTypes';
import { generatePreservationInstructions } from './claudeService';
import { generateAudioInstructions, generateQRCodeForAudio } from './elevenLabsService';
import { saveMealPreservationGuide, getMealPreservationGuide } from './preservationDbService';

export const generateMealPreservationGuide = async (meal: MealPackage): Promise<MealPreservationGuide> => {
  // First check if we already have a guide for this meal
  const existingGuide = await getMealPreservationGuide(meal.id);
  if (existingGuide) {
    return existingGuide;
  }
  
  // Generate instructions using Claude API service
  const { preservationInstructions, reheatingInstructions, freshnessDuration } = 
    await generatePreservationInstructions(meal);
  
  // Generate audio instructions using ElevenLabs service
  const audioInstructionUrl = await generateAudioInstructions(
    meal.name,
    preservationInstructions,
    reheatingInstructions
  );
  
  // Generate QR code for audio instructions
  const qrCodeUrl = await generateQRCodeForAudio(audioInstructionUrl);
  
  // Create the guide
  const guide: MealPreservationGuide = {
    id: uuidv4(),
    mealId: meal.id,
    mealName: meal.name,
    imageUrl: meal.imageUrl,
    preservationInstructions,
    reheatingInstructions,
    freshnessDuration,
    audioInstructionUrl,
    qrCodeUrl,
    customNotes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Save to database
  await saveMealPreservationGuide(guide);
  
  return guide;
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
