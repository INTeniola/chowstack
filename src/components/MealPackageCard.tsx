
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Star, ShoppingCart, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface MealPackage {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  singleMealPrice: number;
  rating: number;
  reviewCount: number;
  deliveryTime: number;
  mealCount: number;
  featured?: boolean;
  cuisineType: string[];
  vendorName: string;
  vendorId: string;
  dietaryTags?: string[];
}

interface MealPackageCardProps {
  mealPackage: MealPackage;
  featured?: boolean;
}

const MealPackageCard: React.FC<MealPackageCardProps> = ({ mealPackage, featured = false }) => {
  const { 
    name, 
    description, 
    imageUrl, 
    price, 
    singleMealPrice, 
    rating, 
    reviewCount, 
    deliveryTime, 
    mealCount, 
    cuisineType, 
    vendorName,
    dietaryTags = []
  } = mealPackage;
  
  // Calculate savings
  const regularPrice = singleMealPrice * mealCount;
  const savings = regularPrice - price;
  const savingsPercentage = Math.round((savings / regularPrice) * 100);
  
  return (
    <Card className={`overflow-hidden flex flex-col h-full transition-all hover:shadow-md ${
      featured ? 'border-mealstock-orange' : ''
    }`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {featured && (
          <Badge className="absolute top-2 right-2 bg-mealstock-orange text-white border-none">
            Featured
          </Badge>
        )}
        
        {savingsPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-mealstock-green text-white border-none">
            Save {savingsPercentage}%
          </Badge>
        )}
        
        {dietaryTags.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {dietaryTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/80 text-mealstock-brown text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-mealstock-brown text-lg line-clamp-1">{name}</h3>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span className="text-sm font-medium text-mealstock-brown">{rating.toFixed(1)}</span>
            <span className="text-xs text-mealstock-brown/60 ml-1">({reviewCount})</span>
          </div>
        </div>
        
        <p className="text-mealstock-brown/70 text-sm line-clamp-2 mb-2">
          {description}
        </p>
        
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-mealstock-brown/70">
            <span className="font-medium text-mealstock-brown">{vendorName}</span>
          </div>
          <div className="flex items-center text-sm text-mealstock-brown/70">
            <Clock className="w-3 h-3 mr-1" />
            <span>{deliveryTime} mins</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {cuisineType.map((type, index) => (
            <Badge key={index} variant="outline" className="bg-mealstock-cream/50 text-xs">
              {type}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4 text-mealstock-green" />
              <span className="text-sm font-medium">{mealCount} meals</span>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <span className="text-sm line-through text-mealstock-brown/50">
                    ₦{regularPrice.toLocaleString()}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Individual meal price: ₦{singleMealPrice.toLocaleString()} × {mealCount}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-xl text-mealstock-brown">
                ₦{price.toLocaleString()}
              </span>
              <span className="text-xs text-mealstock-green ml-1">
                Save ₦{savings.toLocaleString()}
              </span>
            </div>
            
            <Button size="sm" className="bg-mealstock-orange hover:bg-mealstock-orange/90">
              <ShoppingCart className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MealPackageCard;
