
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { ConnectivitySettings } from '@/components/settings/ConnectivitySettings';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { OrderHistory } from '@/components/orders/OrderHistory';
import { UserRatings } from '@/components/ratings/UserRatings';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import NotificationsList from '@/components/notifications/NotificationsList';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
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
            <h1 className="text-2xl md:text-3xl font-bold text-mealstock-brown">Account Settings</h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="connectivity">Connectivity Settings</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="ratings">My Ratings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="bg-white p-6 rounded-lg border">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="bg-white p-6 rounded-lg border">
              <NotificationsList />
            </TabsContent>
            
            <TabsContent value="connectivity" className="bg-white p-6 rounded-lg border">
              <ConnectivitySettings />
            </TabsContent>
            
            <TabsContent value="orders" className="bg-white p-6 rounded-lg border">
              <OrderHistory />
            </TabsContent>
            
            <TabsContent value="ratings" className="bg-white p-6 rounded-lg border">
              <UserRatings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
