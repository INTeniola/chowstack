
import React from 'react';
import { Calendar } from 'lucide-react';

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
      <div className={`relative ${dimensions[size]} flex items-center justify-center`}>
        {/* Stacked food containers */}
        <div className="absolute bottom-0 w-full h-2/3 bg-mealstock-orange rounded-md"></div>
        <div className="absolute bottom-1 w-4/5 h-2/3 bg-mealstock-lightOrange rounded-md"></div>
        <div className="absolute bottom-2 w-3/5 h-2/3 bg-mealstock-lightGreen rounded-md"></div>
        
        {/* Calendar icon */}
        <div className="absolute top-0 right-0">
          <Calendar 
            size={iconSize[size]} 
            className="text-mealstock-green"
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
