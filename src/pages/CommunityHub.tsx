
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GroupOrders from '@/components/community/GroupOrders';
import MapView from '@/components/community/MapView';
import BulletinBoard from '@/components/community/BulletinBoard';
import TipsSection from '@/components/community/TipsSection';
import CreateGroupModal from '@/components/community/CreateGroupModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRealtime } from '@/contexts/RealtimeContext';
import { ActiveUsers } from '@/components/realtime/ActiveUsers';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { GroupChat } from '@/components/realtime/GroupChat';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessagesSquare, Plus } from 'lucide-react';

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  member_count: number;
  created_at: string;
}

const CommunityHub: React.FC = () => {
  const { user } = useAuth();
  const { subscribe } = useRealtime();
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [userGroups, setUserGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);
  
  // Load user's community groups
  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('group_members')
          .select(`
            group_id,
            community_groups(id, name, description, member_count, created_at)
          `)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          const groups = data
            .map(item => item.community_groups as CommunityGroup)
            .filter(Boolean);
            
          setUserGroups(groups);
          
          if (groups.length > 0 && !selectedGroup) {
            setSelectedGroup(groups[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching user groups:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserGroups();
    
    // Subscribe to group member changes
    const unsubscribe = subscribe<{ group_id: string }>('group_members', 'INSERT', (payload) => {
      if (payload.new && payload.new.user_id === user?.id) {
        // Fetch the group details
        const fetchGroupDetails = async () => {
          const { data, error } = await supabase
            .from('community_groups')
            .select('id, name, description, member_count, created_at')
            .eq('id', payload.new.group_id)
            .single();
            
          if (!error && data) {
            setUserGroups(prev => [...prev, data]);
            // Select the new group
            setSelectedGroup(data);
            
            toast.success('You joined a new group!', {
              description: `You are now a member of ${data.name}`
            });
          }
        };
        
        fetchGroupDetails();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [user, subscribe]);
  
  const handleCreateGroup = async (groupData: any) => {
    if (!user) return;
    
    try {
      // Insert group
      const { data: groupData, error: groupError } = await supabase
        .from('community_groups')
        .insert({
          name: groupData.name,
          description: groupData.description,
          created_by: user.id,
          location_name: groupData.location || null,
          location_lat: groupData.coordinates?.lat || null,
          location_lng: groupData.coordinates?.lng || null
        })
        .select();
        
      if (groupError) throw groupError;
      
      if (groupData && groupData[0]) {
        const newGroupId = groupData[0].id;
        
        // Add creator as a member
        const { error: memberError } = await supabase
          .from('group_members')
          .insert({
            group_id: newGroupId,
            user_id: user.id
          });
          
        if (memberError) throw memberError;
        
        toast.success('Group Created', {
          description: `Your group "${groupData[0].name}" has been created successfully!`,
        });
        
        setIsCreateGroupOpen(false);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group', {
        description: 'Please try again later'
      });
    }
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
            
            <div className="flex items-center gap-3">
              <ActiveUsers showCount />
              
              <Button 
                onClick={() => setIsCreateGroupOpen(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Create a Group</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
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
            
            <div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>My Groups</span>
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsCreateGroupOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
                
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2].map(i => (
                      <Card key={i} className="p-4 animate-pulse">
                        <div className="h-6 bg-muted rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </Card>
                    ))}
                  </div>
                ) : userGroups.length === 0 ? (
                  <Card className="p-4 text-center">
                    <p className="text-muted-foreground mb-2">You're not in any groups yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsCreateGroupOpen(true)}
                    >
                      Create or Join a Group
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {userGroups.map(group => (
                      <Card 
                        key={group.id} 
                        className={`p-3 cursor-pointer transition-colors ${
                          selectedGroup?.id === group.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedGroup(group)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{group.name}</h3>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
                          </span>
                        </div>
                        {group.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {group.description}
                          </p>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
                
                {selectedGroup && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <MessagesSquare className="h-5 w-5" />
                        <span>Group Chat</span>
                      </h2>
                    </div>
                    
                    <GroupChat 
                      groupId={selectedGroup.id} 
                      groupName={selectedGroup.name} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
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
