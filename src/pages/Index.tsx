
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-mealstock-cream/30 py-16 md:py-24">
          <div className="container-custom relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-mealstock-orange/10 to-mealstock-green/10 rounded-full blur-3xl"></div>
                <img 
                  src="/assets/hero-food.png" 
                  alt="Delicious meals" 
                  className="relative z-10 w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1617524455170-0e150ed7b4e6";
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-mealstock-brown mb-6 leading-tight">
                  Bulk Meals,
                  <span className="text-mealstock-orange block">Fresh Every Time</span>
                </h2>
                <p className="text-lg md:text-xl text-mealstock-brown/80 mb-8 max-w-lg mx-auto md:mx-0">
                  All our meals are prepared fresh, properly packaged, and delivered with instructions on how to store and reheat.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button size="lg" className="bg-mealstock-orange hover:bg-mealstock-orange/90 text-white" asChild>
                    <Link to="/discovery">
                      Explore Our Menu
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-mealstock-orange/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-mealstock-green/5 rounded-full blur-3xl"></div>
        </section>
        
        <Features />
        
        {/* How it works section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-mealstock-cream/30">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-mealstock-brown mb-4">
                How ChowStack Works
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
                  description: "Choose from our diverse menu of Nigerian and international dishes.",
                  icon: "🍲"
                },
                {
                  step: "02",
                  title: "Schedule Delivery",
                  description: "Pick your preferred delivery day and time slot.",
                  icon: "🚚"
                },
                {
                  step: "03",
                  title: "Store & Reheat",
                  description: "Store your meals and enjoy them whenever you want throughout the week.",
                  icon: "♨️"
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-xl border border-mealstock-green/10 relative hover:shadow-md transition-shadow"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-mealstock-orange flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <div className="text-center text-4xl mb-4 mt-4">
                    {item.icon}
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
        
        {/* Pricing section */}
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
                  className={`rounded-xl overflow-hidden flex flex-col h-full ${
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
                  <div className="p-8 bg-white flex flex-col flex-1">
                    <div>
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
                    </div>
                    <Button 
                      className={`w-full py-3 rounded-md font-medium mt-auto ${
                        plan.featured 
                        ? 'bg-mealstock-orange hover:bg-mealstock-orange/90 text-white' 
                        : 'bg-mealstock-green hover:bg-mealstock-green/90 text-white'
                      }`}
                      asChild
                    >
                      <Link to="/register">
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
