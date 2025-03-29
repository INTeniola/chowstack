
import React from 'react';
import { MealPackage } from '@/components/MealPackageCard';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, ShoppingCart } from 'lucide-react';
import { OptimizedImage } from '@/hooks/use-image-optimization';
import { useConnectivity } from '@/contexts/ConnectivityContext';

interface OptimizedMealPackageCardProps {
  mealPackage: MealPackage;
  onAddToCart?: (mealPackage: MealPackage) => void;
  onViewDetails?: (mealPackage: MealPackage) => void;
}

const OptimizedMealPackageCard: React.FC<OptimizedMealPackageCardProps> = ({
  mealPackage,
  onAddToCart,
  onViewDetails,
}) => {
  const {
    name,
    price,
    rating,
    mealCount,
    deliveryTime,
    cuisineType,
    dietaryTags,
    imageUrl,
    vendorName,
  } = mealPackage;

  const { lowBandwidthMode } = useConnectivity();
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(mealPackage);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(mealPackage);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all h-full flex flex-col">
      <div className="relative h-40 w-full">
        <OptimizedImage
          src={imageUrl}
          alt={name}
          size="medium"
          lowBandwidth={lowBandwidthMode}
          className="w-full h-full object-cover"
          fallbackSrc="/placeholder.svg"
        />
        
        <div className="absolute top-2 right-2 flex space-x-1">
          <Badge className="bg-mealstock-green text-white border-none">
            <Star className="h-3 w-3 mr-1 fill-current" />
            {rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-3 flex-1">
        <div className="space-y-1.5">
          <h3 className="font-bold text-mealstock-brown line-clamp-2">{name}</h3>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-mealstock-green font-bold">₦{(price / 100).toLocaleString()}</span>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" /> {deliveryTime} mins
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {vendorName} • {mealCount} meals
          </div>
          
          <div className="flex flex-wrap gap-1 pt-1">
            <Badge variant="outline" className="text-xs bg-mealstock-cream/50">
              {cuisineType[0]}
            </Badge>
            {dietaryTags && dietaryTags.length > 0 && (
              <Badge variant="outline" className="text-xs bg-mealstock-cream/50">
                {dietaryTags[0]}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 grid grid-cols-2 gap-2 mt-auto">
        <Button 
          variant="outline" 
          className="w-full text-mealstock-brown border-mealstock-brown hover:bg-mealstock-brown hover:text-white"
          onClick={handleViewDetails}
        >
          Details
        </Button>
        <Button 
          className="w-full bg-mealstock-green hover:bg-mealstock-green/90 text-white"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" /> Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OptimizedMealPackageCard;
