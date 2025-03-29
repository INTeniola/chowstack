
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Clock, ChevronRight, MessageCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

// Mock group data
const mockGroups = [
  {
    id: 'g1',
    name: 'Lekki Phase 1 Neighbors',
    description: 'Weekly meal prep group for Lekki Phase 1 residents',
    location: 'Lekki Phase 1, Lagos',
    distance: '0.8 km',
    members: 12,
    status: 'open',
    orderClosingTime: '3 hours',
    tags: ['Weekly', 'Neighborhood'],
    admin: 'Jane Doe'
  },
  {
    id: 'g2',
    name: 'Tech Park Office Lunch',
    description: 'Daily lunch orders for Tech Park office workers',
    location: 'Victoria Island, Lagos',
    distance: '3.2 km',
    members: 28,
    status: 'open',
    orderClosingTime: '1 hour',
    tags: ['Office', 'Daily'],
    admin: 'Michael Smith'
  },
  {
    id: 'g3',
    name: 'University Health Club',
    description: 'Healthy meal options for fitness enthusiasts',
    location: 'Yaba, Lagos',
    distance: '5.6 km',
    members: 15,
    status: 'open',
    orderClosingTime: '5 hours',
    tags: ['Fitness', 'Health'],
    admin: 'David Johnson'
  },
  {
    id: 'g4',
    name: 'Weekend BBQ Club',
    description: 'Weekend barbecue enthusiasts sharing orders',
    location: 'Ikoyi, Lagos',
    distance: '4.1 km',
    members: 8,
    status: 'closed',
    orderClosingTime: 'Closed',
    tags: ['Weekend', 'BBQ'],
    admin: 'Sarah Williams'
  }
];

const myGroups = [
  {
    id: 'mg1',
    name: 'Family Weekly Meal Prep',
    description: 'Our family weekly meal prep group',
    location: 'Lekki, Lagos',
    distance: '0.2 km',
    members: 4,
    status: 'open',
    orderClosingTime: '2 days',
    tags: ['Family', 'Weekly'],
    admin: 'You'
  }
];

const GroupOrderCard: React.FC<{
  group: typeof mockGroups[0];
  isMyGroup?: boolean;
}> = ({ group, isMyGroup = false }) => {
  const joinGroup = () => {
    toast({
      title: "Joined Group",
      description: `You've successfully joined ${group.name}!`,
    });
  };

  const manageGroup = () => {
    toast({
      title: "Managing Group",
      description: "Opening group management options...",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{group.name}</CardTitle>
            <CardDescription className="mt-1">{group.description}</CardDescription>
          </div>
          <div>
            {group.status === 'open' ? (
              <Badge className="bg-green-500 hover:bg-green-600">Open</Badge>
            ) : (
              <Badge variant="secondary">Closed</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{group.location} • {group.distance}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">{group.members} members • Admin: {group.admin}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">Closing in {group.orderClosingTime}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {group.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-mealstock-green flex items-center"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          <span>Chat</span>
        </Button>
        {isMyGroup ? (
          <Button onClick={manageGroup}>
            Manage Group
          </Button>
        ) : (
          <Button onClick={joinGroup} disabled={group.status === 'closed'}>
            Join Group
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const GroupOrders: React.FC = () => {
  const [searchFilter, setSearchFilter] = useState('');
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="nearby">
        <TabsList>
          <TabsTrigger value="nearby">Nearby Groups</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nearby" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockGroups.map(group => (
              <GroupOrderCard key={group.id} group={group} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my-groups" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map(group => (
              <GroupOrderCard key={group.id} group={group} isMyGroup={true} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupOrders;
