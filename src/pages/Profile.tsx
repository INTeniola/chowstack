
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderHistory } from '@/components/orders/OrderHistory';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
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
            <h1 className="text-2xl md:text-3xl font-bold text-mealstock-brown">My Account</h1>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="bg-white p-6 rounded-lg border">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="orders" className="bg-white p-6 rounded-lg border">
              <OrderHistory />
            </TabsContent>
            
            <TabsContent value="favorites" className="bg-white p-6 rounded-lg border">
              <div className="py-8 text-center">
                <h3 className="text-lg font-medium mb-2">Favorite Meals</h3>
                <p className="text-muted-foreground">You haven't saved any favorites yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => navigate('/discovery')}
                >
                  Browse Meals
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="bg-white p-6 rounded-lg border">
              <div className="py-8 text-center">
                <h3 className="text-lg font-medium mb-2">Payment Methods</h3>
                <p className="text-muted-foreground">You haven't added any payment methods yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                >
                  Add Payment Method
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
