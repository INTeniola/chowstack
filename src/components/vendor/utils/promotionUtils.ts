
import { format } from 'date-fns';
import { Percent, Tag, Package, Calendar } from 'lucide-react';
import { Promotion } from '../types/promotionTypes';

// Get the promo type icon
export const getPromoTypeIcon = (type: Promotion['type']) => {
  switch (type) {
    case 'discount':
      return <Percent className="h-5 w-5 text-green-500" />;
    case 'bogo':
      return <Tag className="h-5 w-5 text-blue-500" />;
    case 'bundle':
      return <Package className="h-5 w-5 text-amber-500" />;
    case 'special':
      return <Calendar className="h-5 w-5 text-purple-500" />;
    default:
      return null;
  }
};

// Format promotion date range for display
export const formatDateRange = (startDate: Date, endDate: Date) => {
  return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
};

// Check if a promotion is active and current (between start and end dates)
export const isPromotionCurrent = (promo: Promotion) => {
  const now = new Date();
  return promo.isActive && promo.startDate <= now && promo.endDate >= now;
};

// Calculate remaining days for a promotion
export const getRemainingDays = (endDate: Date) => {
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Get a description of the promotion for display
export const getPromotionDescription = (promo: Promotion) => {
  switch (promo.type) {
    case 'discount':
      if (promo.discountType === 'percentage') {
        return `${promo.discountValue}% off`;
      } else {
        return `$${promo.discountValue} off`;
      }
    case 'bogo':
      return 'Buy One Get One';
    case 'bundle':
      return 'Bundle Deal';
    case 'special':
      return 'Special Offer';
    default:
      return '';
  }
};
