
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MealPackage } from '@/components/MealPackageCard';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, ShoppingCart, InfoIcon } from 'lucide-react';
import { OptimizedImage } from '@/hooks/use-image-optimization';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { useToast } from '@/hooks/use-toast';

interface MealPackageCardOptimizedProps {
  mealPackage: MealPackage;
  onAddToCart?: (mealPackage: MealPackage) => void;
  onViewDetails?: (mealPackage: MealPackage) => void;
  featured?: boolean;
}

const MealPackageCardOptimized: React.FC<MealPackageCardOptimizedProps> = ({
  mealPackage,
  onAddToCart,
  onViewDetails,
  featured = false,
}) => {
  const {
    id,
    name,
    price,
    rating,
    mealCount,
    deliveryTime,
    cuisineType = [],
    dietaryTags = [],
    imageUrl,
    vendorName,
  } = mealPackage;

  const { lowBandwidthMode, connectionQuality } = useConnectivity();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(mealPackage);
      
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart`,
      });
    } else {
      // Default behavior if no handler is provided
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart`,
      });
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(mealPackage);
    } else {
      // Default behavior if no handler is provided
      navigate(`/meal/${id}`);
    }
  };

  // Determine which details to show based on connectivity
  const showFullDetails = !lowBandwidthMode && connectionQuality !== 'slow' && connectionQuality !== 'poor';

  return (
    <Card className={`overflow-hidden transition-all h-full flex flex-col ${featured ? 'border-mealstock-orange/50 bg-amber-50/50' : ''}`}>
      <div className="relative h-40 w-full">
        <OptimizedImage
          src={imageUrl}
          alt={name}
          size={lowBandwidthMode ? "small" : "medium"}
          className="w-full h-full object-cover"
          fallbackSrc="/placeholder.svg"
        />
        
        {featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-mealstock-orange text-white border-none">
              Featured
            </Badge>
          </div>
        )}
        
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
            {showFullDetails && (
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" /> {deliveryTime} mins
              </div>
            )}
          </div>
          
          {showFullDetails && (
            <div className="text-xs text-muted-foreground">
              {vendorName} • {mealCount} meals
            </div>
          )}
          
          {showFullDetails && cuisineType && cuisineType.length > 0 && (
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
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 grid grid-cols-2 gap-2 mt-auto">
        <Button 
          variant="outline" 
          className="w-full text-mealstock-brown border-mealstock-brown hover:bg-mealstock-brown hover:text-white"
          onClick={handleViewDetails}
        >
          <InfoIcon className="h-4 w-4 mr-2" />
          Details
        </Button>
        <Button 
          className="w-full bg-mealstock-green hover:bg-mealstock-green/90 text-white"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MealPackageCardOptimized;
