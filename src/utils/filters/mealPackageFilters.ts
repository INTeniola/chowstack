
import { MealPackage } from '@/components/MealPackageCard';

// Filter function for meal packages
export const filterMealPackages = (packages: MealPackage[], filters: any): MealPackage[] => {
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
export const sortMealPackages = (packages: MealPackage[], sortBy: string): MealPackage[] => {
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
