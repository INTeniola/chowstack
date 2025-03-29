
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Users } from 'lucide-react';

const MapView: React.FC = () => {
  // In a real implementation, we would integrate with a Map API like Google Maps or Mapbox
  // For now, we'll show a placeholder with mock data
  const [mapApiKey, setMapApiKey] = useState('');
  const [isMapKeyEntered, setIsMapKeyEntered] = useState(false);
  
  const handleSubmitApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapApiKey.trim()) {
      setIsMapKeyEntered(true);
    }
  };
  
  const mockGroups = [
    { id: 'g1', name: 'Lekki Phase 1 Neighbors', members: 12, location: 'Lekki Phase 1', position: { top: '40%', left: '60%' } },
    { id: 'g2', name: 'Tech Park Office Lunch', members: 28, location: 'Victoria Island', position: { top: '30%', left: '45%' } },
    { id: 'g3', name: 'University Health Club', members: 15, location: 'Yaba', position: { top: '55%', left: '30%' } },
    { id: 'g4', name: 'Weekend BBQ Club', members: 8, location: 'Ikoyi', position: { top: '45%', left: '50%' } },
    { id: 'g5', name: 'Ajah Residents', members: 17, location: 'Ajah', position: { top: '20%', left: '75%' } },
  ];
  
  if (!isMapKeyEntered) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center max-w-md mx-auto space-y-4">
            <h3 className="text-xl font-medium">Map Integration</h3>
            <p className="text-muted-foreground">
              To view the map of nearby group orders, please enter your Map API key.
              In a real implementation, this would be handled through Supabase securely.
            </p>
            
            <form onSubmit={handleSubmitApiKey} className="space-y-4 mt-4">
              <Input
                placeholder="Enter Map API Key"
                value={mapApiKey}
                onChange={(e) => setMapApiKey(e.target.value)}
              />
              <Button type="submit" className="w-full">
                View Map
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search locations..."
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>
      
      <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden border">
        {/* This would be a real map in production */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
        
        {/* Mock group markers */}
        {mockGroups.map((group) => (
          <div 
            key={group.id}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: group.position.top, left: group.position.left }}
          >
            <div className="bg-white p-2 rounded-lg shadow-lg flex items-center space-x-2 cursor-pointer hover:bg-gray-50 border border-border">
              <MapPin className="h-4 w-4 text-mealstock-green" />
              <div>
                <p className="text-sm font-medium">{group.name}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {group.members} members
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Current location indicator */}
        <div 
          className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: '50%', left: '55%' }}
        >
          <div className="h-4 w-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
          <div className="h-12 w-12 bg-blue-500/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        Note: In a production environment, this would use a real map integration with Mapbox or Google Maps.
      </p>
    </div>
  );
};

export default MapView;
