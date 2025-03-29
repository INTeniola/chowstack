
// This is a mock database service for preservation instructions
// In a real application, this would interact with a real database

import { MealPreservationGuide } from '@/types/preservationTypes';

// Mock in-memory database
const mealPreservationGuides: MealPreservationGuide[] = [];

export const saveMealPreservationGuide = async (guide: MealPreservationGuide): Promise<MealPreservationGuide> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Check if guide already exists
  const existingIndex = mealPreservationGuides.findIndex(g => g.id === guide.id);
  
  if (existingIndex >= 0) {
    // Update existing guide
    mealPreservationGuides[existingIndex] = {
      ...guide,
      updatedAt: new Date()
    };
    return mealPreservationGuides[existingIndex];
  } else {
    // Add new guide
    const newGuide = {
      ...guide,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mealPreservationGuides.push(newGuide);
    return newGuide;
  }
};

export const getMealPreservationGuide = async (mealId: string): Promise<MealPreservationGuide | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const guide = mealPreservationGuides.find(g => g.mealId === mealId);
  return guide || null;
};

export const saveCustomNote = async (guideId: string, note: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const existingIndex = mealPreservationGuides.findIndex(g => g.id === guideId);
  
  if (existingIndex >= 0) {
    mealPreservationGuides[existingIndex] = {
      ...mealPreservationGuides[existingIndex],
      customNotes: note,
      updatedAt: new Date()
    };
  }
};
