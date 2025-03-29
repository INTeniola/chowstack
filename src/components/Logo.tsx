
import React from 'react';
import { UtensilsCrossed, ShoppingBag } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true }) => {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${dimensions[size]} flex items-center justify-center rounded-full bg-mealstock-cream`}>
        {/* Logo base */}
        <div className="absolute inset-0 bg-mealstock-green rounded-full opacity-20"></div>
        
        {/* Food container icon */}
        <div className="absolute bottom-0 left-0 transform translate-x-1 translate-y-1">
          <ShoppingBag 
            size={iconSize[size]} 
            className="text-mealstock-green"
          />
        </div>
        
        {/* Utensils icon */}
        <div className="absolute top-0 right-0 transform -translate-x-1 -translate-y-1">
          <UtensilsCrossed 
            size={iconSize[size]} 
            className="text-mealstock-orange"
          />
        </div>
      </div>
      
      {withText && (
        <div className="text-xl md:text-2xl font-bold text-mealstock-green">
          MealStock
        </div>
      )}
    </div>
  );
};

export default Logo;
