
import React from 'react';
import { Package, Users, Calendar as CalendarIcon, Edit, Trash2, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Promotion } from './types/promotionTypes';
import { 
  getPromoTypeIcon, 
  formatDateRange, 
  isPromotionCurrent, 
  getRemainingDays,
  getPromotionDescription 
} from './utils/promotionUtils';

interface PromotionCardProps {
  promotion: Promotion;
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ 
  promotion, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) => {
  return (
    <Card key={promotion.id} className={`overflow-hidden ${!promotion.isActive && 'opacity-70'}`}>
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          {isPromotionCurrent(promotion) ? (
            <Badge className="bg-green-500">Active</Badge>
          ) : !promotion.isActive ? (
            <Badge variant="outline" className="border-muted-foreground text-muted-foreground">Inactive</Badge>
          ) : new Date() < promotion.startDate ? (
            <Badge variant="outline" className="border-blue-500 text-blue-500">Upcoming</Badge>
          ) : (
            <Badge variant="outline" className="border-red-500 text-red-500">Expired</Badge>
          )}
        </div>
        
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            {getPromoTypeIcon(promotion.type)}
            <div className="text-sm font-medium">
              {promotion.type.charAt(0).toUpperCase() + promotion.type.slice(1)}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">{promotion.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 h-10">{promotion.description}</p>
        </div>
      </div>
      
      <CardContent className="p-6 pt-2 space-y-4">
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDateRange(promotion.startDate, promotion.endDate)}</span>
          </div>
          
          {isPromotionCurrent(promotion) && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">
                {getRemainingDays(promotion.endDate)} days remaining
              </span>
            </div>
          )}
          
          {(promotion.minOrderQuantity || 0) > 0 && (
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Min. quantity: {promotion.minOrderQuantity}</span>
            </div>
          )}
          
          {(promotion.minOrderValue || 0) > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Min. order: ${promotion.minOrderValue}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Used {promotion.usageCount} times</span>
          </div>
          
          <div className="pt-2">
            <Badge variant="secondary" className="rounded-md font-normal">
              {getPromotionDescription(promotion)}
            </Badge>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(promotion.id)}
          >
            {promotion.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(promotion)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => onDelete(promotion.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionCard;
