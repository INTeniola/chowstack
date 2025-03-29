
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocationTracker } from '@/components/realtime/LocationTracker';

interface LocationMapProps {
  orderId: string;
  driverId?: string;
  isDriver?: boolean;
}

export const LocationMap: React.FC<LocationMapProps> = ({ 
  orderId, 
  driverId,
  isDriver = false 
}) => {
  const [locationData, setLocationData] = useState<{ lat: number; lng: number } | null>(null);
  
  // In a real implementation, this would load a map with the driver's location
  // For this example, we're just displaying the coordinates
  
  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setLocationData(location);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {isDriver ? 'Share Your Location' : 'Driver Location'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <LocationTracker 
            orderId={orderId}
            driverId={driverId}
            isDriver={isDriver}
            onLocationUpdate={handleLocationUpdate}
          />
          
          {locationData && (
            <div className="bg-muted p-3 rounded-md text-sm">
              <div className="font-medium mb-1">Current Coordinates:</div>
              <div>Latitude: {locationData.lat.toFixed(6)}</div>
              <div>Longitude: {locationData.lng.toFixed(6)}</div>
              <p className="text-xs text-muted-foreground mt-2">
                In a real implementation, this would display an interactive map with the location.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
