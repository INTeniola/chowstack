
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { OrderHistory } from '@/components/orders/OrderHistory';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-mealstock-cream/30">
        <div className="container-custom py-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-2" 
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center">
              <ShoppingBag className="h-6 w-6 mr-2 text-mealstock-green" />
              <h1 className="text-2xl md:text-3xl font-bold text-mealstock-brown">My Orders</h1>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <OrderHistory />
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={() => navigate('/discovery')} 
              className="bg-mealstock-green hover:bg-mealstock-green/90"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
