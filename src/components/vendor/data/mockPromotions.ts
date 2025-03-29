
import { Promotion } from '../types/promotionTypes';

// Mock promotions data
export const mockPromotions: Promotion[] = [
  {
    id: 'promo1',
    title: 'Summer Family Pack Special',
    description: 'Get 15% off when ordering 3+ Family Meal Bundles',
    type: 'discount',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 0,
    minOrderQuantity: 3,
    applicableProducts: ['Family Meal Bundle'],
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-08-31'),
    usageLimit: 0,
    usageCount: 45,
    isActive: true,
    createdAt: '2023-05-15T10:30:00Z',
  },
  {
    id: 'promo2',
    title: 'Vegetarian Bundle Deal',
    description: 'Purchase 2 Vegetarian Weekly Packs and get $20 off',
    type: 'discount',
    discountType: 'fixed',
    discountValue: 20,
    minOrderValue: 0,
    minOrderQuantity: 2,
    applicableProducts: ['Vegetarian Weekly Pack'],
    startDate: new Date('2023-07-01'),
    endDate: new Date('2023-10-31'),
    usageLimit: 100,
    usageCount: 37,
    isActive: true,
    createdAt: '2023-06-20T14:15:00Z',
  },
  {
    id: 'promo3',
    title: 'Fall Seasonal Special',
    description: 'Limited time fall-themed meal bundles with seasonal ingredients',
    type: 'special',
    startDate: new Date('2023-09-15'),
    endDate: new Date('2023-11-30'),
    usageLimit: 0,
    usageCount: 12,
    isActive: true,
    createdAt: '2023-08-30T09:45:00Z',
  },
  {
    id: 'promo4',
    title: 'Protein Power Pack Bundle',
    description: 'Buy 2 Protein Power Packs, get 1 Breakfast Essentials free',
    type: 'bundle',
    minOrderQuantity: 2,
    applicableProducts: ['Protein Power Pack', 'Breakfast Essentials'],
    startDate: new Date('2023-08-01'),
    endDate: new Date('2023-10-15'),
    usageLimit: 50,
    usageCount: 28,
    isActive: true,
    createdAt: '2023-07-25T11:20:00Z',
  },
  {
    id: 'promo5',
    title: 'Summer Flash Sale',
    description: '20% off all meal packages for 48 hours only',
    type: 'discount',
    discountType: 'percentage',
    discountValue: 20,
    startDate: new Date('2023-07-15'),
    endDate: new Date('2023-07-17'),
    usageLimit: 0,
    usageCount: 76,
    isActive: false,
    createdAt: '2023-07-10T08:30:00Z',
  },
];
