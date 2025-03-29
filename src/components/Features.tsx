
import React from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  ThumbsUp,
  ShoppingBag,
  Phone
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <ShoppingBag className="h-10 w-10 text-mealstock-green" />,
      title: "Bulk Delivery",
      description: "Get multiple meals delivered at once, reducing delivery costs and packaging waste."
    },
    {
      icon: <Calendar className="h-10 w-10 text-mealstock-green" />,
      title: "Weekly Planning",
      description: "Plan your meals for the entire week and have them delivered in one go."
    },
    {
      icon: <Clock className="h-10 w-10 text-mealstock-green" />,
      title: "Ready to Heat",
      description: "All meals come ready to heat and eat whenever you're hungry."
    },
    {
      icon: <DollarSign className="h-10 w-10 text-mealstock-green" />,
      title: "Cost Effective",
      description: "Save money with bulk pricing and reduced delivery fees."
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-mealstock-green" />,
      title: "Nigerian Cuisine",
      description: "Enjoy traditional and modern Nigerian dishes prepared by expert chefs."
    },
    {
      icon: <Phone className="h-10 w-10 text-mealstock-green" />,
      title: "Mobile Ordering",
      description: "Order easily from your phone with real-time updates and notifications."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-mealstock-brown mb-4">
            Why Choose MealStock?
          </h2>
          <p className="text-lg text-mealstock-brown/80 max-w-2xl mx-auto">
            We make meal planning and preparation effortless with our convenient bulk delivery service.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-mealstock-cream/50 p-6 rounded-xl border border-mealstock-green/10 hover:border-mealstock-green/30 transition-all hover:shadow-md"
            >
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-mealstock-green/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-mealstock-brown mb-2">
                {feature.title}
              </h3>
              <p className="text-mealstock-brown/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
