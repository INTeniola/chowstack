
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onOpenAuth: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAuth }) => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-mealstock-cream to-white overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-mealstock-brown">
              Bulk Meal Delivery for Busy Nigerians
            </h1>
            <p className="text-lg md:text-xl text-mealstock-brown/80">
              Stock up on delicious, ready-to-heat meals delivered in bulk. Save time, money, and enjoy home-style cooking without the hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onOpenAuth}
                className="btn-primary"
                size="lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-mealstock-green text-mealstock-green hover:bg-mealstock-green hover:text-white"
                size="lg"
              >
                View Menu
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
          
          <div className="relative">
            <div className="aspect-square rounded-full bg-mealstock-lightGreen absolute -right-10 -top-10 w-48 h-48 blur-3xl opacity-50"></div>
            <div className="aspect-square rounded-full bg-mealstock-lightOrange absolute -left-10 -bottom-10 w-48 h-48 blur-3xl opacity-50"></div>
            
            {/* Placeholder for hero image - replace with actual image when available */}
            <div className="bg-mealstock-orange/10 rounded-2xl p-2 border border-mealstock-orange/20 relative z-10">
              <div className="bg-gradient-to-br from-mealstock-orange/20 to-mealstock-green/20 aspect-video rounded-xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="inline-block p-4 bg-white rounded-full mb-4">
                    <div className="w-16 h-16 rounded-full bg-mealstock-orange flex items-center justify-center">
                      <span className="text-white text-3xl">🍲</span>
                    </div>
                  </div>
                  <p className="text-mealstock-brown font-medium">
                    Hero image placeholder - delicious food containers stacked and ready to go
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
