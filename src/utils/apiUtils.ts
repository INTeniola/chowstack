
import { MealPackage } from '@/components/MealPackageCard';
import { Vendor } from '@/components/VendorCard';
import { mockMealPackages, mockWeeklySpecials } from './mockData/mealPackages';
import { mockVendors } from './mockData/vendors';
import { filterMealPackages, sortMealPackages } from './filters/mealPackageFilters';
import { filterVendors, sortVendors } from './filters/vendorFilters';

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
