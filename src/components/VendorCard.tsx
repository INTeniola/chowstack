
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MapPin, Clock, Star, Award, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface Vendor {
  id: string;
  name: string;
  imageUrl: string;
  coverImageUrl: string;
  rating: number;
  reviewCount: number;
  cuisineTypes: string[];
  location: string;
  distance: number;
  deliveryTime: number;
  isVerified: boolean;
  mealPackagesCount: number;
  featuredMeals?: string[];
}

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const { 
    name, 
    imageUrl, 
    coverImageUrl, 
    rating, 
    reviewCount, 
    cuisineTypes, 
    location, 
    distance, 
    deliveryTime, 
    isVerified, 
    mealPackagesCount 
  } = vendor;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <div className="relative h-40">
        <img 
          src={coverImageUrl} 
          alt={`${name} cover`} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute -bottom-6 left-4 w-16 h-16 rounded-lg overflow-hidden border-4 border-white">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        {isVerified && (
          <Badge className="absolute top-2 right-2 bg-mealstock-green text-white border-none gap-1">
            <Award className="h-3 w-3" /> Verified
          </Badge>
        )}
      </div>
      
      <CardContent className="pt-8 pb-2">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-mealstock-brown text-lg">{name}</h3>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span className="text-sm font-medium text-mealstock-brown">{rating.toFixed(1)}</span>
            <span className="text-xs text-mealstock-brown/60 ml-1">({reviewCount})</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {cuisineTypes.map((type, index) => (
            <Badge key={index} variant="outline" className="bg-mealstock-cream/50 text-xs">
              {type}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs text-mealstock-brown/70 mt-3">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{distance} km</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
            <span>{deliveryTime} mins</span>
          </div>
          <div className="flex items-center">
            <Package className="w-3 h-3 mr-1 flex-shrink-0" />
            <span>{mealPackagesCount} packages</span>
          </div>
        </div>
        
        <div className="flex items-center mt-2 text-xs text-mealstock-brown/70">
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full text-mealstock-green border-mealstock-green hover:bg-mealstock-green hover:text-white">
          View Vendor
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VendorCard;
