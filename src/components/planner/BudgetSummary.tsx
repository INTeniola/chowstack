
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface BudgetSummaryProps {
  totalCost: number;
  budget: number;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ totalCost, budget }) => {
  // Calculate percentage of budget used
  const budgetPercentage = Math.min(100, (totalCost / budget) * 100);
  
  // Determine status color based on percentage
  let statusColor = 'bg-green-500';
  if (budgetPercentage > 90) {
    statusColor = 'bg-red-500';
  } else if (budgetPercentage > 75) {
    statusColor = 'bg-yellow-500';
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-md p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
          <p className="text-lg font-bold">₦{(totalCost / 100).toLocaleString()}</p>
        </div>
        
        <div className="bg-muted/50 rounded-md p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Budget</p>
          <p className="text-lg font-bold">₦{(budget / 100).toLocaleString()}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Budget Used</span>
          <span className="text-sm font-medium">{budgetPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={budgetPercentage} className={`h-2.5 ${statusColor}`} />
      </div>
      
      <div className="text-sm">
        <p className="font-medium">Remaining: ₦{((budget - totalCost) / 100).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default BudgetSummary;
