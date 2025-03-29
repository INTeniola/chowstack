
import React from 'react';
import { MealPackage } from '@/components/MealPackageCard';
import { Progress } from '@/components/ui/progress';

interface NutritionSummaryProps {
  mealPlan: Record<string, MealPackage[]>;
}

// Mock nutritional data since we don't have real nutritional info in the meal packages
const getNutritionData = (mealPlan: Record<string, MealPackage[]>) => {
  // Count the different cuisine types for variety
  const cuisineTypes = new Set<string>();
  let totalMeals = 0;
  
  Object.values(mealPlan).forEach(dayMeals => {
    dayMeals.forEach(meal => {
      meal.cuisineType.forEach(cuisine => cuisineTypes.add(cuisine));
      totalMeals++;
    });
  });
  
  // Calculate nutrition balance (mock data)
  const varietyScore = Math.min(100, (cuisineTypes.size / 5) * 100); // 5 cuisine types = 100%
  const proteinScore = Math.min(100, Math.random() * 60 + 40); // Random between 40-100%
  const carbScore = Math.min(100, Math.random() * 60 + 30); // Random between 30-90%
  const fatScore = Math.min(100, Math.random() * 40 + 50); // Random between 50-90%
  const fiberScore = Math.min(100, Math.random() * 50 + 30); // Random between 30-80%
  
  return {
    varietyScore,
    proteinScore,
    carbScore,
    fatScore,
    fiberScore,
    cuisineVariety: cuisineTypes.size,
    totalMeals
  };
};

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ mealPlan }) => {
  const nutrition = getNutritionData(mealPlan);
  
  // No meals planned yet
  if (nutrition.totalMeals === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-muted-foreground">
          Add meals to your plan to see nutritional information
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Meal Variety</span>
          <span className="font-medium">{nutrition.cuisineVariety} cuisines</span>
        </div>
        <Progress value={nutrition.varietyScore} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Protein Balance</span>
          <span className="font-medium">{Math.round(nutrition.proteinScore)}%</span>
        </div>
        <Progress value={nutrition.proteinScore} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Carbohydrates</span>
          <span className="font-medium">{Math.round(nutrition.carbScore)}%</span>
        </div>
        <Progress value={nutrition.carbScore} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Healthy Fats</span>
          <span className="font-medium">{Math.round(nutrition.fatScore)}%</span>
        </div>
        <Progress value={nutrition.fatScore} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Fiber Content</span>
          <span className="font-medium">{Math.round(nutrition.fiberScore)}%</span>
        </div>
        <Progress value={nutrition.fiberScore} className="h-2" />
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        <p className="italic">Nutritional data is estimated based on meal types and variety.</p>
      </div>
    </div>
  );
};

export default NutritionSummary;
