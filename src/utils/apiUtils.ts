import { MealPackage } from '@/components/MealPackageCard';
import { Vendor } from '@/components/VendorCard';

// Mock data for the meal packages
const mockMealPackages: MealPackage[] = [
  {
    id: '1',
    name: 'Nigerian Classics Bundle',
    description: 'A collection of classic Nigerian dishes including Jollof Rice, Egusi Soup, and Pounded Yam.',
    imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=2940&auto=format&fit=crop',
    price: 24999,
    singleMealPrice: 3500,
    rating: 4.8,
    reviewCount: 256,
    deliveryTime: 45,
    mealCount: 8,
    cuisineType: ['Nigerian', 'West African'],
    vendorName: "Mama's Kitchen",
    vendorId: 'v1',
    dietaryTags: ['Halal']
  },
  {
    id: '2',
    name: 'West African Variety Pack',
    description: 'Explore the best of West African cuisine with this variety pack featuring dishes from Nigeria, Ghana, and Senegal.',
    imageUrl: 'https://images.unsplash.com/photo-1619057883177-e3bea8196f25?q=80&w=2787&auto=format&fit=crop',
    price: 28999,
    singleMealPrice: 4000,
    rating: 4.6,
    reviewCount: 189,
    deliveryTime: 50,
    mealCount: 8,
    cuisineType: ['West African', 'Nigerian', 'Ghanaian'],
    vendorName: 'AfroEats',
    vendorId: 'v2',
    dietaryTags: []
  },
  {
    id: '3',
    name: 'Healthy Nigerian Meals',
    description: 'Nutritious and healthy Nigerian meals with reduced oil and carefully balanced macros.',
    imageUrl: 'https://images.unsplash.com/photo-1590167379920-a54c77dc4c9e?q=80&w=2940&auto=format&fit=crop',
    price: 26999,
    singleMealPrice: 3800,
    rating: 4.5,
    reviewCount: 142,
    deliveryTime: 40,
    mealCount: 8,
    cuisineType: ['Nigerian', 'Healthy'],
    vendorName: 'FitNaija',
    vendorId: 'v3',
    dietaryTags: ['Gluten Free', 'Low Carb']
  },
  {
    id: '4',
    name: 'Premium Seafood Package',
    description: 'Fresh seafood dishes featuring prawns, fish, and shellfish prepared in traditional Nigerian style.',
    imageUrl: 'https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?q=80&w=2940&auto=format&fit=crop',
    price: 34999,
    singleMealPrice: 4500,
    rating: 4.9,
    reviewCount: 112,
    deliveryTime: 60,
    mealCount: 8,
    cuisineType: ['Nigerian', 'Seafood'],
    vendorName: 'Ocean Basket Nigeria',
    vendorId: 'v4',
    dietaryTags: []
  },
  {
    id: '5',
    name: 'International Fusion',
    description: 'A blend of international cuisine with Nigerian twists, featuring Chinese, Italian, and Indian inspired dishes.',
    imageUrl: 'https://images.unsplash.com/photo-1547496502-affa22d38842?q=80&w=2677&auto=format&fit=crop',
    price: 29999,
    singleMealPrice: 4200,
    rating: 4.4,
    reviewCount: 98,
    deliveryTime: 55,
    mealCount: 8,
    cuisineType: ['International', 'Fusion', 'Nigerian'],
    vendorName: 'Global Flavors',
    vendorId: 'v5',
    dietaryTags: []
  },
  {
    id: '6',
    name: 'Vegetarian Nigerian Bundle',
    description: 'Delicious vegetarian versions of popular Nigerian dishes, full of flavor and nutrition.',
    imageUrl: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?q=80&w=2787&auto=format&fit=crop',
    price: 22999,
    singleMealPrice: 3200,
    rating: 4.7,
    reviewCount: 76,
    deliveryTime: 40,
    mealCount: 8,
    cuisineType: ['Nigerian', 'Vegetarian'],
    vendorName: 'Green Plate',
    vendorId: 'v6',
    dietaryTags: ['Vegetarian', 'Vegan Options']
  }
];

// Mock data for weekly specials
const mockWeeklySpecials: MealPackage[] = [
  {
    id: 's1',
    name: 'Weekend Family Feast',
    description: 'Perfect for weekend family gatherings, this package includes Jollof Rice, Pounded Yam, Egusi, and Peppered Fish.',
    imageUrl: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?q=80&w=2940&auto=format&fit=crop',
    price: 39999,
    singleMealPrice: 6000,
    rating: 4.9,
    reviewCount: 124,
    deliveryTime: 60,
    mealCount: 10,
    featured: true,
    cuisineType: ['Nigerian', 'Family Size'],
    vendorName: 'Family Delight',
    vendorId: 'v1',
    dietaryTags: []
  },
  {
    id: 's2',
    name: 'Office Lunch Bundle',
    description: 'Convenient meals for busy professionals. Includes a variety of Nigerian and Continental options.',
    imageUrl: 'https://images.unsplash.com/photo-1580554530778-5f0f827d36d8?q=80&w=2830&auto=format&fit=crop',
    price: 32999,
    singleMealPrice: 4500,
    rating: 4.7,
    reviewCount: 89,
    deliveryTime: 45,
    mealCount: 10,
    featured: true,
    cuisineType: ['Nigerian', 'Continental'],
    vendorName: 'WorkDay Eats',
    vendorId: 'v3',
    dietaryTags: []
  },
  {
    id: 's3',
    name: 'Student Saver Pack',
    description: 'Affordable and filling meals designed for students on a budget. Great variety and value.',
    imageUrl: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?q=80&w=2940&auto=format&fit=crop',
    price: 18999,
    singleMealPrice: 2800,
    rating: 4.5,
    reviewCount: 215,
    deliveryTime: 40,
    mealCount: 8,
    featured: true,
    cuisineType: ['Nigerian', 'Budget Friendly'],
    vendorName: 'Campus Meals',
    vendorId: 'v5',
    dietaryTags: []
  }
];

// Mock data for vendors
const mockVendors: Vendor[] = [
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

// Filter function for meal packages
const filterMealPackages = (packages: MealPackage[], filters: any): MealPackage[] => {
  return packages.filter(pkg => {
    // Filter by dietary requirements
    if (filters.dietary.length > 0) {
      const pkgDietary = pkg.dietaryTags || [];
      if (!filters.dietary.some((diet: string) => pkgDietary.includes(diet))) {
        return false;
      }
    }
    
    // Filter by price range
    if (pkg.price < filters.priceRange.min || pkg.price > filters.priceRange.max) {
      return false;
    }
    
    // Filter by cuisine type
    if (filters.cuisineType.length > 0) {
      if (!filters.cuisineType.some((cuisine: string) => pkg.cuisineType.includes(cuisine))) {
        return false;
      }
    }
    
    return true;
  });
};

// Sort function for meal packages
const sortMealPackages = (packages: MealPackage[], sortBy: string): MealPackage[] => {
  const sortedPackages = [...packages];
  
  switch (sortBy) {
    case 'price-low':
      return sortedPackages.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sortedPackages.sort((a, b) => b.price - a.price);
    case 'rating':
      return sortedPackages.sort((a, b) => b.rating - a.rating);
    case 'nearest':
      // In a real app, this would use geolocation data
      return sortedPackages.sort((a, b) => a.deliveryTime - b.deliveryTime);
    case 'recommended':
    default:
      // In a real app, this would incorporate user preferences, ratings, etc.
      return sortedPackages.sort((a, b) => b.rating - a.rating);
  }
};

// Filter function for vendors
const filterVendors = (vendors: Vendor[], filters: any): Vendor[] => {
  return vendors.filter(vendor => {
    // Filter by cuisine type
    if (filters.cuisineType.length > 0) {
      if (!filters.cuisineType.some((cuisine: string) => vendor.cuisineTypes.includes(cuisine))) {
        return false;
      }
    }
    
    return true;
  });
};

// Sort function for vendors
const sortVendors = (vendors: Vendor[], sortBy: string): Vendor[] => {
  const sortedVendors = [...vendors];
  
  switch (sortBy) {
    case 'rating':
      return sortedVendors.sort((a, b) => b.rating - a.rating);
    case 'nearest':
      return sortedVendors.sort((a, b) => a.distance - b.distance);
    case 'recommended':
    default:
      // In a real app, this would incorporate user preferences, ratings, etc.
      return sortedVendors.sort((a, b) => b.rating - a.rating);
  }
};

// Mock API functions
export const fetchMealPackages = async (filters: any): Promise<MealPackage[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const filteredPackages = filterMealPackages(mockMealPackages, filters);
  return sortMealPackages(filteredPackages, filters.sortBy);
};

export const fetchWeeklySpecials = async (): Promise<MealPackage[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return mockWeeklySpecials;
};

export const fetchVendors = async (filters: any): Promise<Vendor[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const filteredVendors = filterVendors(mockVendors, filters);
  return sortVendors(filteredVendors, filters.sortBy);
};

// In a real application, these functions would make actual API calls to a backend
