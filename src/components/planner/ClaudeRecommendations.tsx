
import React, { useState, useEffect } from 'react';
import { MealPackage } from '@/components/MealPackageCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Plus, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { fetchMealPackages } from '@/utils/apiUtils';

interface ClaudeRecommendationsProps {
  currentPlan: Record<string, MealPackage[]>;
  userPreferences: {
    budget: number;
    dietaryPreferences: string[];
    mealServings: number;
  };
  onAddToPlan: (dayKey: string, meal: MealPackage) => void;
}

interface RecommendationType {
  title: string;
  description: string;
  meals: MealPackage[];
}

const ClaudeRecommendations: React.FC<ClaudeRecommendationsProps> = ({
  currentPlan,
  userPreferences,
  onAddToPlan
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([]);
  const [activeTab, setActiveTab] = useState("balanced");
  
  // Generate recommendations based on the current plan and user preferences
  const generateRecommendations = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would call the Claude API
      // For now, we'll simulate the recommendations using our existing data
      
      const allMeals = await fetchMealPackages({
        dietary: [],
        priceRange: { min: 0, max: 50000 },
        cuisineType: [],
        sortBy: 'recommended'
      });
      
      // Get meals that aren't already in the plan
      const plannedMealIds = new Set<string>();
      Object.values(currentPlan).forEach(dayMeals => {
        dayMeals.forEach(meal => plannedMealIds.add(meal.id));
      });
      
      const availableMeals = allMeals.filter(meal => !plannedMealIds.has(meal.id));
      
      // Create recommendation categories
      const balancedMeals = shuffleArray([...availableMeals]).slice(0, 3);
      const budgetFriendly = [...availableMeals]
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);
      const highlyRated = [...availableMeals]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      
      // In a real app, we would use Claude to generate more personalized recommendations
      setRecommendations([
        {
          title: "Balanced Meal Plan",
          description: "A nutritionally balanced selection with variety and flavor",
          meals: balancedMeals
        },
        {
          title: "Budget-Friendly Options",
          description: "Maximize your budget without compromising on quality",
          meals: budgetFriendly
        },
        {
          title: "Top-Rated Selections",
          description: "Highly-rated meals loved by other customers",
          meals: highlyRated
        }
      ]);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Failed to generate recommendations",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    generateRecommendations();
  }, []);
  
  const handleRefreshRecommendations = () => {
    generateRecommendations();
    toast({
      title: "Refreshing recommendations",
      description: "Finding the best meals for your plan"
    });
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60 mt-1" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 mt-3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
                <div className="flex justify-between mt-3">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  // Find the active recommendation set
  const activeRecommendation = recommendations.find(r => 
    r.title.toLowerCase().includes(activeTab.toLowerCase())
  ) || recommendations[0];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
            AI-Powered Recommendations
          </h3>
          <p className="text-sm text-muted-foreground">
            Personalized suggestions based on your preferences and current plan
          </p>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleRefreshRecommendations}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="balanced">Balanced</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="rated">Top Rated</TabsTrigger>
        </TabsList>
        
        {recommendations.map((recommendation) => (
          <TabsContent 
            key={recommendation.title} 
            value={recommendation.title.toLowerCase().includes("balanced") ? "balanced" : 
                  recommendation.title.toLowerCase().includes("budget") ? "budget" : "rated"}
            className="pt-4"
          >
            <div className="mb-4">
              <h4 className="font-medium">{recommendation.title}</h4>
              <p className="text-sm text-muted-foreground">{recommendation.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendation.meals.map((meal) => (
                <MealRecommendationCard 
                  key={meal.id} 
                  meal={meal} 
                  onAddToPlan={onAddToPlan}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface MealRecommendationCardProps {
  meal: MealPackage;
  onAddToPlan: (dayKey: string, meal: MealPackage) => void;
}

const MealRecommendationCard: React.FC<MealRecommendationCardProps> = ({ meal, onAddToPlan }) => {
  const { toast } = useToast();
  const [showDaySelector, setShowDaySelector] = useState(false);
  
  // Generate next 7 days for selection
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      value: date.toISOString().split('T')[0]
    };
  });
  
  const handleAddToDay = (dayKey: string) => {
    onAddToPlan(dayKey, meal);
    setShowDaySelector(false);
    toast({
      title: "Meal added to plan",
      description: `Added ${meal.name} to ${dayKey}`,
    });
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="h-36 w-full overflow-hidden">
        <img 
          src={meal.imageUrl} 
          alt={meal.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h4 className="font-medium line-clamp-1">{meal.name}</h4>
        <div className="flex justify-between items-center mt-1 mb-2">
          <Badge variant="outline" className="text-xs">
            {meal.cuisineType[0]}
          </Badge>
          <span className="text-sm font-medium">₦{(meal.price / 100).toLocaleString()}</span>
        </div>
        
        {!showDaySelector ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => setShowDaySelector(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to Plan
          </Button>
        ) : (
          <div className="space-y-2 mt-2">
            <p className="text-xs text-muted-foreground">Select day:</p>
            <div className="grid grid-cols-2 gap-1">
              {nextDays.slice(0, 4).map((day) => (
                <Button 
                  key={day.value}
                  variant="ghost" 
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleAddToDay(day.value)}
                >
                  {day.label.split(',')[0]}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default ClaudeRecommendations;
