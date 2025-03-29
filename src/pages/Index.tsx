
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero onOpenAuth={handleOpenAuthModal} />
        <Features />
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-mealstock-cream/30">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-mealstock-brown mb-4">
                How MealStock Works
              </h2>
              <p className="text-lg text-mealstock-brown/80 max-w-2xl mx-auto">
                Get delicious meals delivered in bulk in just a few simple steps.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Browse & Select",
                  description: "Choose from our diverse menu of Nigerian and international dishes."
                },
                {
                  step: "02",
                  title: "Schedule Delivery",
                  description: "Pick your preferred delivery day and time slot."
                },
                {
                  step: "03",
                  title: "Store & Reheat",
                  description: "Store your meals and enjoy them whenever you want throughout the week."
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-xl border border-mealstock-green/10 relative"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-mealstock-orange flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-mealstock-brown mb-2 mt-4 text-center">
                    {item.title}
                  </h3>
                  <p className="text-mealstock-brown/80 text-center">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-mealstock-brown mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-mealstock-brown/80 max-w-2xl mx-auto">
                Choose the plan that best fits your needs and lifestyle.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter Plan",
                  price: "₦14,999",
                  description: "Perfect for individuals",
                  features: [
                    "5 meals per week",
                    "Free delivery",
                    "Basic meal selection",
                    "24/7 customer support"
                  ]
                },
                {
                  name: "Family Plan",
                  price: "₦29,999",
                  description: "Ideal for families",
                  features: [
                    "12 meals per week",
                    "Free priority delivery",
                    "Full menu access",
                    "Customizable portions",
                    "24/7 customer support"
                  ],
                  featured: true
                },
                {
                  name: "Office Plan",
                  price: "₦89,999",
                  description: "Great for small offices",
                  features: [
                    "30 meals per week",
                    "Free priority delivery",
                    "Full menu access",
                    "Dedicated account manager",
                    "Custom meal options",
                    "Corporate billing"
                  ]
                }
              ].map((plan, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl overflow-hidden ${
                    plan.featured 
                    ? 'border-2 border-mealstock-orange shadow-lg transform md:-translate-y-4' 
                    : 'border border-mealstock-green/10'
                  }`}
                >
                  {plan.featured && (
                    <div className="bg-mealstock-orange text-white text-center py-2 font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="p-8 bg-white">
                    <h3 className="text-xl font-semibold text-mealstock-brown mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-mealstock-brown/80 mb-4">
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-mealstock-brown">{plan.price}</span>
                      <span className="text-mealstock-brown/80">/month</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-mealstock-brown">
                          <svg className="w-5 h-5 text-mealstock-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button 
                      className={`w-full py-3 rounded-md font-medium ${
                        plan.featured 
                        ? 'bg-mealstock-orange hover:bg-mealstock-orange/90 text-white' 
                        : 'bg-mealstock-green hover:bg-mealstock-green/90 text-white'
                      }`}
                      onClick={handleOpenAuthModal}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
    </div>
  );
};

export default Index;
