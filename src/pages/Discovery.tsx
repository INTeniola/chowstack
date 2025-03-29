import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import MealPackageCard from '@/components/MealPackageCard';
import MealPackageCardOptimized from '@/components/MealPackageCardOptimized';
import VendorCard from '@/components/VendorCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useQuery } from '@tanstack/react-query';
import { fetchMealPackages, fetchVendors, fetchWeeklySpecials } from '@/utils/apiUtils';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WifiOff, AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { useImageOptimization } from '@/hooks/use-image-optimization';
import { useIsMobile } from '@/hooks/use-mobile';

const Discovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dietary: [],
    priceRange: { min: 0, max: 100000 },
    cuisineType: [],
    sortBy: 'recommended'
  });
  
  const { isOnline, connectionQuality, lowBandwidthMode } = useConnectivity();
  const { shouldOptimizeImages } = useImageOptimization();
  const isMobile = useIsMobile();
  
  const staleTime = connectionQuality === 'slow' || connectionQuality === 'poor' 
    ? 1000 * 60 * 30 // 30 minutes 
    : 1000 * 60 * 5; // 5 minutes
  
  const networkTimeout = connectionQuality === 'slow' || connectionQuality === 'poor'
    ? 60000 // 60 seconds for slow connections
    : 30000; // 30 seconds for normal connections
  
  const { 
    data: mealPackages = [], 
    isLoading: loadingMeals,
    isError: mealError,
    refetch: refetchMeals
  } = useQuery({
    queryKey: ['mealPackages', filters],
    queryFn: () => fetchMealPackages(filters),
    staleTime,
    retry: isOnline ? 2 : 0,
    networkMode: isOnline ? 'online' : 'always',
    refetchOnWindowFocus: connectionQuality !== 'slow' && connectionQuality !== 'poor',
  });
  
  const { 
    data: vendors = [], 
    isLoading: loadingVendors,
    isError: vendorError,
    refetch: refetchVendors
  } = useQuery({
    queryKey: ['vendors', filters],
    queryFn: () => fetchVendors(filters),
    staleTime,
    retry: isOnline ? 2 : 0,
    networkMode: isOnline ? 'online' : 'always',
    refetchOnWindowFocus: connectionQuality !== 'slow' && connectionQuality !== 'poor',
  });
  
  const { 
    data: weeklySpecials = [], 
    isLoading: loadingSpecials,
    isError: specialsError,
    refetch: refetchSpecials
  } = useQuery({
    queryKey: ['weeklySpecials'],
    queryFn: fetchWeeklySpecials,
    staleTime,
    enabled: isOnline && !lowBandwidthMode,
    retry: isOnline ? 2 : 0,
    networkMode: isOnline ? 'online' : 'always',
    refetchOnWindowFocus: connectionQuality !== 'slow' && connectionQuality !== 'poor',
  });
  
  const recommendedPackages = mealPackages.filter(pkg => pkg.rating >= 4.5).slice(0, 4);
  
  const handleFilterChange = (newFilters) => {
    setFilters({...filters, ...newFilters});
  };

  const handleRefreshAll = () => {
    refetchMeals();
    refetchVendors();
    if (isOnline && !lowBandwidthMode) {
      refetchSpecials();
    }
  };
  
  const useOptimizedComponents = shouldOptimizeImages || lowBandwidthMode;
  
  const MealComponent = useOptimizedComponents ? MealPackageCardOptimized : MealPackageCard;
  
  return (
    <div className="min-h-screen flex flex-col bg-mealstock-cream">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-mealstock-lightGreen/20 to-mealstock-cream py-8">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-bold text-mealstock-brown mb-4">
              Discover Fresh Meal Packages
            </h1>
            <p className="text-mealstock-brown/80 mb-6 max-w-2xl">
              Stock up your freezer with delicious, ready-to-heat Nigerian and international cuisine.
            </p>
            
            {!isOnline && (
              <Alert variant="destructive" className="mb-6">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>You're currently offline</AlertTitle>
                <AlertDescription>
                  You're viewing cached content. Some features may be limited until your connection is restored.
                </AlertDescription>
              </Alert>
            )}
            
            {isOnline && (connectionQuality === 'slow' || connectionQuality === 'poor') && !lowBandwidthMode && (
              <Alert variant="warning" className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertTitle className="text-yellow-700 dark:text-yellow-300">Slow connection detected</AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                  Consider enabling Data Saver mode in the navbar for a faster browsing experience.
                </AlertDescription>
              </Alert>
            )}
            
            <SearchFilters 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
            
            {((!isOnline || connectionQuality === 'slow' || connectionQuality === 'poor') && 
              (mealError || vendorError || specialsError)) && (
              <div className="flex justify-center mt-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleRefreshAll}
                >
                  <RotateCw className="h-4 w-4" />
                  Refresh Content
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {(!lowBandwidthMode) && (
          <section className="py-8">
            <div className="container-custom">
              <h2 className="text-2xl font-bold text-mealstock-brown mb-6 flex justify-between items-center">
                <span>Weekly Specials</span>
              </h2>
              
              {loadingSpecials ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {weeklySpecials.map((special) => (
                        <CarouselItem key={special.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                          <div className="h-full">
                            <MealComponent mealPackage={special} featured />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {!isMobile && (
                      <>
                        <CarouselPrevious className="left-0" />
                        <CarouselNext className="right-0" />
                      </>
                    )}
                  </Carousel>
                </div>
              )}
            </div>
          </section>
        )}
        
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
                  <MealComponent key={pkg.id} mealPackage={pkg} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        <section className="py-8">
          <div className="container-custom">
            <Tabs defaultValue="packages" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="packages">Meal Packages</TabsTrigger>
                <TabsTrigger value="vendors">Featured Vendors</TabsTrigger>
              </TabsList>
              
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
                      <MealComponent key={pkg.id} mealPackage={pkg} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
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
      
      <OfflineIndicator />
      <Footer />
    </div>
  );
};

export default Discovery;
