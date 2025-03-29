
import { Vendor } from '@/components/VendorCard';

// Filter function for vendors
export const filterVendors = (vendors: Vendor[], filters: any): Vendor[] => {
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
export const sortVendors = (vendors: Vendor[], sortBy: string): Vendor[] => {
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
