
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import MealPackageCard from '@/components/MealPackageCard';
import VendorCard from '@/components/VendorCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { fetchMealPackages, fetchVendors, fetchWeeklySpecials } from '@/utils/apiUtils';

const Discovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dietary: [],
    priceRange: { min: 0, max: 100000 },
    cuisineType: [],
    sortBy: 'recommended'
  });
  
  // Fetch meal packages data
  const { 
    data: mealPackages = [], 
    isLoading: loadingMeals 
  } = useQuery({
    queryKey: ['mealPackages', filters],
    queryFn: () => fetchMealPackages(filters),
  });
  
  // Fetch vendors data
  const { 
    data: vendors = [], 
    isLoading: loadingVendors 
  } = useQuery({
    queryKey: ['vendors', filters],
    queryFn: () => fetchVendors(filters),
  });
  
  // Fetch weekly specials
  const { 
    data: weeklySpecials = [], 
    isLoading: loadingSpecials 
  } = useQuery({
    queryKey: ['weeklySpecials'],
    queryFn: fetchWeeklySpecials,
  });
  
  // Filter for recommended packages (in a real app, this would be based on user preferences)
  const recommendedPackages = mealPackages.filter(pkg => pkg.rating >= 4.5).slice(0, 4);
  
  const handleFilterChange = (newFilters) => {
    setFilters({...filters, ...newFilters});
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-mealstock-cream">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero section with search */}
        <section className="bg-gradient-to-b from-mealstock-lightGreen/20 to-mealstock-cream py-8">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-bold text-mealstock-brown mb-4">
              Discover Fresh Meal Packages
            </h1>
            <p className="text-mealstock-brown/80 mb-6 max-w-2xl">
              Stock up your freezer with delicious, ready-to-heat Nigerian and international cuisine.
            </p>
            
            {/* Search and filters */}
            <SearchFilters 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>
        </section>
        
        {/* Weekly Specials */}
        <section className="py-8">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-mealstock-brown mb-6">
              Weekly Specials
            </h2>
            
            {loadingSpecials ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex space-x-4">
                  {weeklySpecials.map((special) => (
                    <div key={special.id} className="w-80 flex-shrink-0">
                      <MealPackageCard mealPackage={special} featured />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </section>
        
        {/* Recommended for You */}
        <section className="py-8 bg-white">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-mealstock-brown mb-6">
              Recommended for You
            </h2>
            
            {loadingMeals ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedPackages.map((pkg) => (
                  <MealPackageCard key={pkg.id} mealPackage={pkg} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Main Discovery Tabs */}
        <section className="py-8">
          <div className="container-custom">
            <Tabs defaultValue="packages" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="packages">Meal Packages</TabsTrigger>
                <TabsTrigger value="vendors">Featured Vendors</TabsTrigger>
              </TabsList>
              
              {/* Meal Packages Tab */}
              <TabsContent value="packages">
                {loadingMeals ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mealPackages.map((pkg) => (
                      <MealPackageCard key={pkg.id} mealPackage={pkg} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Vendors Tab */}
              <TabsContent value="vendors">
                {loadingVendors ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors.map((vendor) => (
                      <VendorCard key={vendor.id} vendor={vendor} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Discovery;
