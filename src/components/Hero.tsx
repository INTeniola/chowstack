
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ResponsiveImage } from '@/components/uploads/ResponsiveImage';

// Reliable Nigerian food images that are guaranteed to work
const NIGERIAN_FOODS = [
  {
    src: "https://images.unsplash.com/photo-1574484284002-952d92456975",
    alt: "Nigerian Jollof Rice"
  },
  {
    src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    alt: "Egusi Soup with Pounded Yam"
  },
  {
    src: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
    alt: "Suya (Nigerian Spiced Skewers)"
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    alt: "Moin Moin (Steamed Bean Pudding)"
  },
  {
    src: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
    alt: "Nigerian Feast"
  },
  {
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    alt: "African Cuisine"
  }
];

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [foodImages, setFoodImages] = useState(NIGERIAN_FOODS);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Fetch images from Supabase storage
  useEffect(() => {
    const fetchImagesFromSupabase = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch images from Supabase
        const { data, error } = await supabase
          .storage
          .from('food-images')
          .list('');

        if (error) {
          console.error('Error fetching images from Supabase:', error);
          toast.error('Could not load custom images', {
            description: 'Using default food images instead'
          });
          return;
        }

        if (data && data.length > 0) {
          // Filter for image files only
          const imageFiles = data.filter(file => 
            file.name.match(/\.(jpeg|jpg|png|webp)$/i)
          );

          if (imageFiles.length > 0) {
            // Create URLs for the images
            const supabaseImages = imageFiles.map(file => {
              const { data } = supabase
                .storage
                .from('food-images')
                .getPublicUrl(file.name);
              
              return {
                src: data.publicUrl || '',
                alt: file.name.split('.')[0].replace(/-|_/g, ' ')
              };
            });
            
            // Combine Supabase images with our reliable ones to ensure we always have content
            setFoodImages([...supabaseImages, ...NIGERIAN_FOODS]);
            toast.success('Loaded custom food images');
          }
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
        toast.error('Error loading images', {
          description: 'Using default images instead'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchImagesFromSupabase();
  }, []);

  // Auto rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === foodImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [foodImages.length]);

  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-b from-mealstock-cream to-white overflow-hidden">
      {/* Food-themed decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-10">
        <img src="/assets/food-icons/spoon.svg" alt="Spoon Icon" className="text-mealstock-orange w-full h-full" />
      </div>
      
      <div className="absolute bottom-0 right-0 w-40 h-40 opacity-10">
        <img src="/assets/food-icons/pot.svg" alt="Pot Icon" className="text-mealstock-green w-full h-full" />
      </div>
      
      <div className="absolute top-1/3 right-10 w-24 h-24 opacity-10">
        <img src="/assets/food-icons/plate.svg" alt="Plate Icon" className="text-mealstock-brown w-full h-full" />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-mealstock-brown">
              Your Weekly Feasts, <br className="hidden md:block" />
              <span className="text-mealstock-orange">One Delivery Away</span>
            </h1>
            <p className="text-lg text-mealstock-brown/80">
              Stock your fridge with authentic Nigerian cuisine, delivered in bulk. Save time, reduce costs, and enjoy home-style cooking without the daily hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-mealstock-orange hover:bg-mealstock-orange/90 text-white"
                size="lg"
                asChild
              >
                <Link to="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="pt-4 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                    <img 
                      src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} 
                      alt="Customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-mealstock-brown/80">
                Trusted by <span className="font-bold">2,000+</span> families in Nigeria
              </p>
            </div>
          </div>
          
          {/* Nigerian Food Slideshow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-mealstock-lightGreen -right-10 -top-10 w-24 md:w-48 h-24 md:h-48 blur-3xl opacity-50"></div>
            <div className="absolute inset-0 rounded-full bg-mealstock-lightOrange -left-10 -bottom-10 w-24 md:w-48 h-24 md:h-48 blur-3xl opacity-50"></div>
            
            <div className="bg-mealstock-orange/10 rounded-2xl p-2 border border-mealstock-orange/20 relative z-10 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center aspect-video w-full bg-gray-100 rounded-xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mealstock-orange"></div>
                </div>
              ) : (
                <Carousel className="w-full">
                  <CarouselContent>
                    {foodImages.map((food, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                          <ResponsiveImage
                            src={food.src}
                            alt={food.alt}
                            className="w-full h-full object-cover"
                            fallbackSrc="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <p className="text-white font-medium text-sm md:text-base">
                              {food.alt}
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {!isMobile && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
