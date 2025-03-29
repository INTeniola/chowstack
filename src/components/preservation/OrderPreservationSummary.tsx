
import React, { useState } from 'react';
import { CartItem } from '@/types/checkoutTypes';
import { useQueries } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateMealPreservationGuide } from '@/services/preservationService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import PreservationGuide from './PreservationGuide';
import { Package, Info } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

interface OrderPreservationSummaryProps {
  items: CartItem[];
}

const OrderPreservationSummary: React.FC<OrderPreservationSummaryProps> = ({ items }) => {
  const isMobile = useMobile();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Convert cart items to meal packages for the preservation guide
  const mealPackages = items.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price * 100, // Convert to base currency
    rating: 4.5, // Default rating
    mealCount: 1, // Default meal count
    deliveryTime: 30, // Default delivery time
    cuisineType: ['Nigerian'], // Default cuisine type
    dietaryTags: [],
    vendorId: item.vendorId,
    vendorName: item.vendorName,
    imageUrl: item.image
  }));
  
  // Query preservation guides for all meals
  const guidesQueries = useQueries({
    queries: mealPackages.map(meal => ({
      queryKey: ['preservationGuide', meal.id],
      queryFn: () => generateMealPreservationGuide(meal),
      staleTime: Infinity,
    })),
  });
  
  // Check if guides are loading
  const isLoading = guidesQueries.some(query => query.isLoading);
  
  // Find the selected meal package
  const selectedMeal = selectedItemId 
    ? mealPackages.find(meal => meal.id === selectedItemId)
    : null;
  
  // Content for the dialog/drawer
  const guideContent = selectedMeal ? (
    <PreservationGuide meal={selectedMeal} />
  ) : null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Package className="h-5 w-5 mr-2 text-muted-foreground" />
          Meal Preservation Instructions
        </CardTitle>
        <CardDescription>
          Get detailed instructions on how to store and reheat your meals for optimal freshness
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="visual">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="visual">Visual Guide</TabsTrigger>
            <TabsTrigger value="list">Items List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mealPackages.map((meal) => (
                <div 
                  key={meal.id} 
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedItemId(meal.id)}
                >
                  <div className="h-32 rounded-md overflow-hidden">
                    <img 
                      src={meal.imageUrl} 
                      alt={meal.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-xs font-medium mt-1 truncate">{meal.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {mealPackages.map((meal) => (
                  <div 
                    key={meal.id}
                    className="flex items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                    onClick={() => setSelectedItemId(meal.id)}
                  >
                    <div className="h-12 w-12 rounded overflow-hidden mr-3 flex-shrink-0">
                      <img 
                        src={meal.imageUrl} 
                        alt={meal.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{meal.name}</p>
                      <p className="text-xs text-muted-foreground">Vendor: {meal.vendorName}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <p className="text-xs text-muted-foreground mt-4">
          Click on a meal to view detailed preservation and reheating instructions.
        </p>
      </CardContent>
      
      {/* Preservation guide dialog/drawer */}
      {isMobile ? (
        <Drawer open={!!selectedItemId} onOpenChange={(open) => !open && setSelectedItemId(null)}>
          <DrawerContent className="max-h-[90vh] overflow-auto">
            {guideContent}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!selectedItemId} onOpenChange={(open) => !open && setSelectedItemId(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            {guideContent}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default OrderPreservationSummary;
