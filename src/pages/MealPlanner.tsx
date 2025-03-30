import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Printer, Save, Info, DollarSign, Utensils } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PlannerCalendar from '@/components/planner/PlannerCalendar';
import MealList from '@/components/planner/MealList';
import NutritionSummary from '@/components/planner/NutritionSummary';
import BudgetSummary from '@/components/planner/BudgetSummary';
import DeliverySchedule from '@/components/planner/DeliverySchedule';
import SavePlanModal from '@/components/planner/SavePlanModal';
import ClaudeRecommendations from '@/components/planner/ClaudeRecommendations';
import { fetchMealPackages } from '@/utils/apiUtils';
import { MealPackage } from '@/components/MealPackageCard';
import localStorageUtils from '@/utils/localStorageUtils';

const DEFAULT_FILTERS = {
  dietary: [],
  priceRange: { min: 0, max: 50000 },
  cuisineType: [],
  sortBy: 'recommended'
};

const MealPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 0 }));
  const [mealPlan, setMealPlan] = useState<Record<string, MealPackage[]>>({});
  const [mealPackages, setMealPackages] = useState<MealPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedPlans, setSavedPlans] = useState<{ name: string; plan: Record<string, MealPackage[]>; date?: string }[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    budget: 150000, // ₦150,000 default budget
    dietaryPreferences: ['Nigerian', 'West African'],
    mealServings: 4, // Default people to serve
  });

  useEffect(() => {
    const loadMealPackages = async () => {
      try {
        const packages = await fetchMealPackages(DEFAULT_FILTERS);
        setMealPackages(packages);
      } catch (error) {
        console.error('Error loading meal packages:', error);
        toast({
          title: "Error loading meal packages",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadMealPackages();
  }, []);

  useEffect(() => {
    const loadSavedPlans = () => {
      const storedPlans = localStorageUtils.getMealPlans();
      if (storedPlans && Array.isArray(storedPlans) && storedPlans.length > 0) {
        console.log('Loaded saved plans:', storedPlans);
        setSavedPlans(storedPlans);
      }
    };
    
    loadSavedPlans();
  }, []);

  const goToPreviousWeek = () => {
    const newWeekStart = subWeeks(weekStart, 1);
    setWeekStart(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = addWeeks(weekStart, 1);
    setWeekStart(newWeekStart);
  };

  const handleMealDrop = (dayKey: string, meal: MealPackage) => {
    setMealPlan(prev => {
      const dayMeals = [...(prev[dayKey] || [])];
      
      const existingIndex = dayMeals.findIndex(m => m.id === meal.id);
      if (existingIndex >= 0) {
        dayMeals[existingIndex] = meal;
      } else {
        dayMeals.push(meal);
      }
      
      return {
        ...prev,
        [dayKey]: dayMeals
      };
    });
  };

  const removeMealFromDay = (dayKey: string, mealId: string) => {
    setMealPlan(prev => {
      const dayMeals = prev[dayKey] ? prev[dayKey].filter(m => m.id !== mealId) : [];
      
      const newPlan = {
        ...prev,
        [dayKey]: dayMeals
      };
      
      if (newPlan[dayKey].length === 0) {
        delete newPlan[dayKey];
      }
      
      return newPlan;
    });
    
    toast({
      title: "Meal removed",
      description: "Meal has been removed from your plan",
    });
  };

  const savePlan = (planName: string) => {
    if (!planName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a plan name",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const newPlan = {
        name: planName,
        plan: {...mealPlan},
        date: new Date().toISOString()
      };
      
      const updatedPlans = [...savedPlans, newPlan];
      setSavedPlans(updatedPlans);
      
      localStorageUtils.saveMealPlans(updatedPlans);
      
      toast({
        title: "Plan saved",
        description: `Your meal plan "${planName}" has been saved`,
      });
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error",
        description: "Failed to save your meal plan",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
      setShowSaveModal(false);
    }
  };

  const loadPlan = (planIndex: number) => {
    if (savedPlans[planIndex]) {
      setMealPlan(savedPlans[planIndex].plan);
      
      toast({
        title: "Plan loaded",
        description: `Your meal plan "${savedPlans[planIndex].name}" has been loaded`,
      });
    }
  };

  const printPlan = () => {
    window.print();
  };

  const calculateTotals = () => {
    let totalCost = 0;
    let totalMeals = 0;
    
    Object.values(mealPlan).forEach(dayMeals => {
      dayMeals.forEach(meal => {
        totalCost += meal.price;
        totalMeals += meal.mealCount || 0;
      });
    });
    
    return { totalCost, totalMeals };
  };

  const { totalCost, totalMeals } = calculateTotals();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">Meal Planner</h1>
            
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="px-2 font-medium">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </div>
              
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <DndProvider backend={HTML5Backend}>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Weekly Calendar</CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowSaveModal(true)}
                          disabled={isSaving || Object.keys(mealPlan).length === 0}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save Plan
                        </Button>
                        <Button variant="outline" size="sm" onClick={printPlan}>
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PlannerCalendar 
                      weekStart={weekStart} 
                      mealPlan={mealPlan}
                      onMealDrop={handleMealDrop}
                      onRemoveMeal={removeMealFromDay}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Available Meal Packages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MealList 
                      mealPackages={mealPackages} 
                      loading={loading} 
                    />
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ClaudeRecommendations 
                      currentPlan={mealPlan}
                      userPreferences={userPreferences}
                      onAddToPlan={(day, meal) => handleMealDrop(day, meal)}
                    />
                  </CardContent>
                </Card>
              </DndProvider>
            </div>
            
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-1" />
                      Budget Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BudgetSummary 
                      totalCost={totalCost} 
                      budget={userPreferences.budget}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Utensils className="h-5 w-5 mr-1" />
                      Nutrition Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NutritionSummary mealPlan={mealPlan} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-1" />
                      Delivery Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeliverySchedule mealPlan={mealPlan} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {savedPlans.length > 0 ? (
                      <ul className="space-y-2">
                        {savedPlans.map((plan, index) => (
                          <li key={index} className="flex justify-between items-center">
                            <span className="font-medium">{plan.name}</span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => loadPlan(index)}
                            >
                              Load
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No saved plans yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {showSaveModal && (
          <SavePlanModal 
            onSave={savePlan}
            onCancel={() => setShowSaveModal(false)}
            open={showSaveModal}
            isSaving={isSaving}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MealPlanner;
