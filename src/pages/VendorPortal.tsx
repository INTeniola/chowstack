
import React, { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VendorDashboard from "@/components/vendor/VendorDashboard";
import VendorInventory from "@/components/vendor/VendorInventory";
import VendorOrders from "@/components/vendor/VendorOrders";
import VendorPromotions from "@/components/vendor/VendorPromotions";
import VendorAnalytics from "@/components/vendor/VendorAnalytics";
import VendorCommunication from "@/components/vendor/VendorCommunication";
import VendorLogin from "@/components/vendor/VendorLogin";
import { useVendorAuth } from "@/hooks/useVendorAuth";

const VendorPortal: React.FC = () => {
  const { vendor, isAuthenticated, isLoading } = useVendorAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-mealstock-green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated || !vendor) {
    return <VendorLogin />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container-custom py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-mealstock-brown">Vendor Portal</h1>
              <p className="text-muted-foreground mt-2">
                Manage your business, track orders, and connect with customers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome, {vendor.name}</span>
            </div>
          </div>
          
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-4">
              <VendorDashboard vendor={vendor} />
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4">
              <VendorInventory vendor={vendor} />
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-4">
              <VendorOrders vendor={vendor} />
            </TabsContent>
            
            <TabsContent value="promotions" className="space-y-4">
              <VendorPromotions vendor={vendor} />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <VendorAnalytics vendor={vendor} />
            </TabsContent>
            
            <TabsContent value="communication" className="space-y-4">
              <VendorCommunication vendor={vendor} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VendorPortal;
