
import React from 'react';
import { Utensils, UtensilsCrossed } from 'lucide-react';

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
    <div className="flex items-center gap-3">
      <div className={`relative ${dimensions[size]} flex items-center justify-center rounded-full bg-mealstock-cream`}>
        {/* Logo base */}
        <div className="absolute inset-0 bg-mealstock-green rounded-full opacity-20"></div>
        
        {/* "C" shape - curved like pasta */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-3/4 border-4 border-mealstock-orange rounded-full border-r-0"></div>
        </div>
        
        {/* "S" shape - curved like pasta */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-1/2 border-4 border-mealstock-green rounded-full border-l-transparent border-b-transparent rotate-45"></div>
        </div>
        
        {/* Utensils icon for pasta feel */}
        <div className="absolute -bottom-1 -right-1 transform rotate-45">
          <Utensils 
            size={iconSize[size]} 
            className="text-mealstock-green"
          />
        </div>
      </div>
      
      {withText && (
        <span className="text-xl md:text-2xl font-bold text-mealstock-green">
          ChowStack
        </span>
      )}
    </div>
  );
};

export default Logo;
