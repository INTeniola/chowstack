
import React from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { MealPreservationGuide, PreservationMethod } from '@/types/preservationTypes';
import { calculateExpirationDate } from '@/services/preservationService';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FreshnessTimelineProps {
  guide: MealPreservationGuide;
  selectedMethod: PreservationMethod;
}

const FreshnessTimeline: React.FC<FreshnessTimelineProps> = ({ guide, selectedMethod }) => {
  const now = new Date();
  const expirationDate = calculateExpirationDate(guide, selectedMethod);
  
  // Calculate how many days until expiration
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate percentage of time remaining
  const totalDays = guide.freshnessDuration;
  const daysElapsed = totalDays - daysUntilExpiration;
  const percentageElapsed = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
  
  // Determine status based on days remaining
  let status = 'fresh';
  if (daysUntilExpiration <= 0) {
    status = 'expired';
  } else if (daysUntilExpiration <= 1) {
    status = 'warning';
  }
  
  return (
    <div className="space-y-2 my-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Freshness Timeline</h4>
        <span className="text-xs text-muted-foreground">
          {status === 'expired' ? (
            'Expired'
          ) : (
            `Expires ${expirationDate.toLocaleDateString()}`
          )}
        </span>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="space-y-1">
              <Progress 
                value={percentageElapsed} 
                className={`h-2 ${
                  status === 'expired' ? 'bg-destructive/20' : 
                  status === 'warning' ? 'bg-amber-200' : 
                  'bg-green-100'
                }`}
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {status === 'expired' ? (
                    <AlertTriangle className="h-3 w-3 text-destructive mr-1" />
                  ) : status === 'warning' ? (
                    <Clock className="h-3 w-3 text-amber-500 mr-1" />
                  ) : (
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  )}
                  
                  <span className={`text-xs ${
                    status === 'expired' ? 'text-destructive' : 
                    status === 'warning' ? 'text-amber-500' : 
                    'text-green-600'
                  }`}>
                    {status === 'expired' ? 
                      'Past recommended freshness date' : 
                      status === 'warning' ? 
                      'Consume soon' : 
                      'Fresh'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {daysUntilExpiration <= 0 ? 
                    'Expired' : 
                    daysUntilExpiration === 1 ? 
                    '1 day left' : 
                    `${daysUntilExpiration} days left`}
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">Based on {selectedMethod} storage method</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FreshnessTimeline;
