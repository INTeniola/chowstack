
import { Vendor } from '@/components/VendorCard';

// Mock data for vendors
export const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: "Mama's Kitchen",
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2940&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 546,
    cuisineTypes: ['Nigerian', 'West African', 'Traditional'],
    location: 'Ikeja, Lagos',
    distance: 3.2,
    deliveryTime: 45,
    isVerified: true,
    mealPackagesCount: 12
  },
  {
    id: 'v2',
    name: 'AfroEats',
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2940&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2830&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 312,
    cuisineTypes: ['West African', 'Nigerian', 'Ghanaian'],
    location: 'Victoria Island, Lagos',
    distance: 5.7,
    deliveryTime: 60,
    isVerified: true,
    mealPackagesCount: 16
  },
  {
    id: 'v3',
    name: 'FitNaija',
    imageUrl: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=80&w=2960&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=2878&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 289,
    cuisineTypes: ['Nigerian', 'Healthy', 'Fitness'],
    location: 'Lekki, Lagos',
    distance: 4.9,
    deliveryTime: 50,
    isVerified: true,
    mealPackagesCount: 8
  },
  {
    id: 'v4',
    name: 'Ocean Basket Nigeria',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2874&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2870&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 178,
    cuisineTypes: ['Seafood', 'Nigerian', 'Fusion'],
    location: 'Ikoyi, Lagos',
    distance: 6.3,
    deliveryTime: 65,
    isVerified: false,
    mealPackagesCount: 10
  },
  {
    id: 'v5',
    name: 'Global Flavors',
    imageUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=2785&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=2785&auto=format&fit=crop',
    rating: 4.4,
    reviewCount: 203,
    cuisineTypes: ['International', 'Nigerian', 'Fusion'],
    location: 'Ajah, Lagos',
    distance: 12.1,
    deliveryTime: 75,
    isVerified: false,
    mealPackagesCount: 14
  },
  {
    id: 'v6',
    name: 'Green Plate',
    imageUrl: 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?q=80&w=2874&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=2880&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 155,
    cuisineTypes: ['Vegetarian', 'Vegan', 'Nigerian'],
    location: 'Surulere, Lagos',
    distance: 8.5,
    deliveryTime: 55,
    isVerified: true,
    mealPackagesCount: 9
  }
];
