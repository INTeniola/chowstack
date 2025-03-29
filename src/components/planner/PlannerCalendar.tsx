
import React from 'react';
import { format, addDays } from 'date-fns';
import { useDrop } from 'react-dnd';
import { MealPackage } from '@/components/MealPackageCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PlannerCalendarProps {
  weekStart: Date;
  mealPlan: Record<string, MealPackage[]>;
  onMealDrop: (dayKey: string, meal: MealPackage) => void;
  onRemoveMeal: (dayKey: string, mealId: string) => void;
}

const PlannerCalendar: React.FC<PlannerCalendarProps> = ({ 
  weekStart, 
  mealPlan, 
  onMealDrop,
  onRemoveMeal
}) => {
  // Create an array of 7 days starting from weekStart
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      dayOfWeek: format(date, 'EEE'),
      dayOfMonth: format(date, 'd'),
      key: format(date, 'yyyy-MM-dd')
    };
  });

  return (
    <div className="grid grid-cols-7 gap-2 print:gap-0">
      {/* Calendar header - days of the week */}
      {days.map((day) => (
        <div key={`header-${day.key}`} className="text-center font-semibold p-2">
          <div className="text-sm">{day.dayOfWeek}</div>
          <div className="text-lg">{day.dayOfMonth}</div>
        </div>
      ))}
      
      {/* Calendar body - meal cells */}
      {days.map((day) => (
        <CalendarDay
          key={`day-${day.key}`}
          day={day}
          meals={mealPlan[day.key] || []}
          onMealDrop={(meal) => onMealDrop(day.key, meal)}
          onRemoveMeal={(mealId) => onRemoveMeal(day.key, mealId)}
        />
      ))}
    </div>
  );
};

interface CalendarDayProps {
  day: {
    key: string;
    date: Date;
    dayOfWeek: string;
    dayOfMonth: string;
  };
  meals: MealPackage[];
  onMealDrop: (meal: MealPackage) => void;
  onRemoveMeal: (mealId: string) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, meals, onMealDrop, onRemoveMeal }) => {
  // Set up drop target
  const [{ isOver }, drop] = useDrop({
    accept: 'meal-package',
    drop: (item: { meal: MealPackage }) => {
      onMealDrop(item.meal);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-[180px] border rounded-md p-2 overflow-y-auto ${
        isOver ? 'bg-primary/10 border-primary' : 'bg-card'
      }`}
    >
      {meals.length > 0 ? (
        <div className="space-y-2">
          {meals.map((meal) => (
            <div 
              key={meal.id} 
              className="relative bg-accent/30 rounded-md p-2 text-sm"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1 right-1 h-5 w-5 opacity-70 hover:opacity-100" 
                onClick={() => onRemoveMeal(meal.id)}
              >
                <X className="h-3 w-3" />
              </Button>
              
              <div className="font-medium line-clamp-2 pr-6">{meal.name}</div>
              <div className="mt-1 flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {meal.cuisineType[0]}
                </Badge>
                <span className="text-xs font-medium">₦{(meal.price / 100).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Drop meals here</p>
        </div>
      )}
    </div>
  );
};

export default PlannerCalendar;
