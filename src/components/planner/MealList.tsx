
import React from 'react';
import { useDrag } from 'react-dnd';
import { MealPackage } from '@/components/MealPackageCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface MealListProps {
  mealPackages: MealPackage[];
  loading: boolean;
}

const MealList: React.FC<MealListProps> = ({ mealPackages, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-3">
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 mt-2" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mealPackages.map((meal) => (
        <DraggableMeal key={meal.id} meal={meal} />
      ))}
    </div>
  );
};

interface DraggableMealProps {
  meal: MealPackage;
}

const DraggableMeal: React.FC<DraggableMealProps> = ({ meal }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'meal-package',
    item: { meal },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`cursor-grab ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3">
          <div className="flex gap-3">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <img 
                src={meal.imageUrl} 
                alt={meal.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm line-clamp-2">{meal.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <Badge variant="outline" className="text-xs">
                  {meal.cuisineType[0]}
                </Badge>
                <span className="text-sm font-medium">₦{(meal.price / 100).toLocaleString()}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {meal.mealCount} meals • {meal.dietaryTags?.join(', ') || 'No dietary tags'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealList;
