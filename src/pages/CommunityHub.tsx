
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GroupOrders from '@/components/community/GroupOrders';
import MapView from '@/components/community/MapView';
import BulletinBoard from '@/components/community/BulletinBoard';
import TipsSection from '@/components/community/TipsSection';
import CreateGroupModal from '@/components/community/CreateGroupModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CommunityHub: React.FC = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  
  const handleCreateGroup = (groupData: any) => {
    // This would connect to Supabase in a real implementation
    console.log('Creating group:', groupData);
    toast({
      title: 'Group Created',
      description: `Your group "${groupData.name}" has been created successfully!`,
    });
    setIsCreateGroupOpen(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container-custom py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-mealstock-brown">Community Hub</h1>
              <p className="text-muted-foreground mt-2">
                Connect with others, join group orders, and share food experiences
              </p>
            </div>
            
            <button 
              onClick={() => setIsCreateGroupOpen(true)}
              className="btn-primary inline-flex items-center"
            >
              <span>Create a Group</span>
            </button>
          </div>
          
          <Tabs defaultValue="groups" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="groups">Group Orders</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="bulletin">Bulletin Board</TabsTrigger>
              <TabsTrigger value="tips">Food Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="groups" className="space-y-4">
              <GroupOrders />
            </TabsContent>
            
            <TabsContent value="map">
              <MapView />
            </TabsContent>
            
            <TabsContent value="bulletin" className="space-y-4">
              <BulletinBoard />
            </TabsContent>
            
            <TabsContent value="tips" className="space-y-4">
              <TipsSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <CreateGroupModal 
        open={isCreateGroupOpen} 
        onClose={() => setIsCreateGroupOpen(false)}
        onSave={handleCreateGroup}
      />
      
      <Footer />
    </div>
  );
};

export default CommunityHub;
