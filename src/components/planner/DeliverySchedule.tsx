
import React from 'react';
import { format, addDays } from 'date-fns';
import { Clock, AlertTriangle } from 'lucide-react';
import { MealPackage } from '@/components/MealPackageCard';
import { Badge } from '@/components/ui/badge';

interface DeliveryScheduleProps {
  mealPlan: Record<string, MealPackage[]>;
}

// Calculate optimal delivery schedule based on the meal plan
const calculateDeliverySchedule = (mealPlan: Record<string, MealPackage[]>) => {
  // Get all dates that have meals planned
  const planDates = Object.keys(mealPlan).sort();
  
  if (planDates.length === 0) {
    return [];
  }
  
  // Group deliveries by vendor to minimize delivery trips
  const vendorDeliveries = new Map<string, { vendorName: string; dates: string[]; meals: MealPackage[] }>();
  
  planDates.forEach(date => {
    mealPlan[date].forEach(meal => {
      if (!vendorDeliveries.has(meal.vendorId)) {
        vendorDeliveries.set(meal.vendorId, {
          vendorName: meal.vendorName,
          dates: [date],
          meals: [meal]
        });
      } else {
        const delivery = vendorDeliveries.get(meal.vendorId)!;
        if (!delivery.dates.includes(date)) {
          delivery.dates.push(date);
        }
        delivery.meals.push(meal);
      }
    });
  });
  
  // Convert to array and calculate delivery dates (just before first meal from vendor)
  return Array.from(vendorDeliveries.values()).map(delivery => {
    // Sort dates chronologically
    const sortedDates = delivery.dates.sort();
    const firstMealDate = new Date(sortedDates[0]);
    
    // Deliveries happen a day before the meal is needed
    const deliveryDate = new Date(firstMealDate);
    
    // Calculate total items and average delivery time
    const totalItems = delivery.meals.length;
    const avgDeliveryTime = Math.round(
      delivery.meals.reduce((sum, meal) => sum + meal.deliveryTime, 0) / delivery.meals.length
    );
    
    return {
      vendorId: delivery.meals[0].vendorId,
      vendorName: delivery.vendorName,
      deliveryDate,
      totalItems,
      avgDeliveryTime,
      firstMealDate
    };
  });
};

const DeliverySchedule: React.FC<DeliveryScheduleProps> = ({ mealPlan }) => {
  const deliveries = calculateDeliverySchedule(mealPlan);
  
  if (deliveries.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-muted-foreground">
          Add meals to your plan to see delivery information
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {deliveries.map((delivery, index) => (
        <div 
          key={`${delivery.vendorId}-${index}`} 
          className="bg-muted/30 rounded-md p-3"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-sm">{delivery.vendorName}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Delivery date: {format(delivery.deliveryDate, 'EEE, MMM d')}
              </p>
            </div>
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {delivery.avgDeliveryTime}min
            </Badge>
          </div>
          
          <div className="mt-2 text-xs flex items-center">
            <span className="mr-1">Items: {delivery.totalItems}</span> •
            <span className="ml-1">For: {format(delivery.firstMealDate, 'EEE, MMM d')}</span>
          </div>
          
          {index === 0 && (
            <div className="mt-2 flex items-center text-xs text-amber-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>Coming up soon!</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeliverySchedule;
