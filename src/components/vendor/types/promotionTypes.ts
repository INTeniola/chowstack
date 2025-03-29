
export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'bogo' | 'bundle' | 'special';
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  minOrderValue?: number;
  minOrderQuantity?: number;
  applicableProducts?: string[];
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface PromotionFormValues {
  title: string;
  description: string;
  type: 'discount' | 'bogo' | 'bundle' | 'special';
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  minOrderValue?: number;
  minOrderQuantity?: number;
  applicableProducts?: string;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  isActive: boolean;
}
