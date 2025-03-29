
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import { ResponsiveImage } from '@/components/uploads/ResponsiveImage';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

// Nigerian food images for the slideshow
const NIGERIAN_FOODS = [
  {
    src: "https://images.unsplash.com/photo-1647102398925-e30527aee930",
    alt: "Nigerian Jollof Rice"
  },
  {
    src: "https://images.unsplash.com/photo-1640527051371-1f7b5c32a062",
    alt: "Egusi Soup with Pounded Yam"
  },
  {
    src: "https://images.unsplash.com/photo-1643553210055-8416a305c7e9",
    alt: "Suya (Nigerian Spiced Skewers)"
  },
  {
    src: "https://images.unsplash.com/photo-1667489021871-7d8923f1033e",
    alt: "Moin Moin (Steamed Bean Pudding)"
  }
];

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useIsMobile();

  // Auto rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === NIGERIAN_FOODS.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-b from-mealstock-cream to-white overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-mealstock-brown">
              Your Weekly Feasts, <br className="hidden md:block" />
              One Delivery Away
            </h1>
            <p className="text-lg text-mealstock-brown/80">
              Stock your fridge with authentic Nigerian cuisine, delivered in bulk. Save time, reduce costs, and enjoy home-style cooking without the daily hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="btn-primary"
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
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                ))}
              </div>
              <p className="text-sm text-mealstock-brown/80">
                Trusted by <span className="font-bold">2,000+</span> families in Nigeria
              </p>
            </div>
          </div>
          
          {/* Nigerian Food Slideshow */}
          <div className="relative">
            <div className="aspect-square rounded-full bg-mealstock-lightGreen absolute -right-10 -top-10 w-24 md:w-48 h-24 md:h-48 blur-3xl opacity-50"></div>
            <div className="aspect-square rounded-full bg-mealstock-lightOrange absolute -left-10 -bottom-10 w-24 md:w-48 h-24 md:h-48 blur-3xl opacity-50"></div>
            
            <div className="bg-mealstock-orange/10 rounded-2xl p-2 border border-mealstock-orange/20 relative z-10 overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {NIGERIAN_FOODS.map((food, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                        <ResponsiveImage
                          src={food.src}
                          alt={food.alt}
                          className="w-full h-full object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
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
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
