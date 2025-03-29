
import React, { useEffect, useState } from 'react';
import { useRealtime } from '@/contexts/RealtimeContext';
import { useAuth } from '@/hooks/useAuth';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { updateUserPresence } from '@/services/realtimeService';

interface LocationTrackerProps {
  orderId?: string;
  driverId?: string;
  isDriver?: boolean;
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

interface LocationData {
  lat: number;
  lng: number;
  timestamp: string;
  accuracy?: number;
}

export const LocationTracker: React.FC<LocationTrackerProps> = ({
  orderId,
  driverId,
  isDriver = false,
  onLocationUpdate
}) => {
  const { user } = useAuth();
  const { isOnline } = useConnectivity();
  const { subscribe, updatePresence } = useRealtime();
  const [tracking, setTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  
  // Subscribe to driver location updates if we're a customer
  useEffect(() => {
    if (!isDriver && driverId && isOnline) {
      // Find driver's location through presence data
      const unsubscribe = subscribe('presence', 'UPDATE', (payload) => {
        if (payload.new && payload.new.user_id === driverId && payload.new.location_data) {
          const locationData = payload.new.location_data as LocationData;
          setCurrentLocation(locationData);
          
          if (onLocationUpdate) {
            onLocationUpdate({
              lat: locationData.lat,
              lng: locationData.lng
            });
          }
        }
      });
      
      return () => {
        unsubscribe();
      };
    }
    
    return undefined;
  }, [isDriver, driverId, isOnline, subscribe, onLocationUpdate]);
  
  // Start/stop location tracking for drivers
  useEffect(() => {
    if (!isDriver || !tracking || !isOnline) return undefined;
    
    const handleSuccess = async (position: GeolocationPosition) => {
      const locationData: LocationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: new Date().toISOString(),
        accuracy: position.coords.accuracy
      };
      
      setCurrentLocation(locationData);
      
      try {
        // Update presence with location data
        await updatePresence({
          status: 'online',
          location_data: locationData
        });
        
        // Also update in database for persistence
        await updateUserPresence('online', {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        
        if (onLocationUpdate) {
          onLocationUpdate({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
      } catch (err) {
        console.error('Error updating location:', err);
      }
    };
    
    const handleError = (err: GeolocationPositionError) => {
      console.error('Geolocation error:', err);
      setError(
        err.code === 1
          ? 'Location permission denied. Please enable location services.'
          : 'Unable to retrieve your location. Please try again.'
      );
      setTracking(false);
    };
    
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    };
    
    // Get initial position
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
    
    // Watch position for changes
    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
    setWatchId(id);
    
    // Cleanup
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isDriver, tracking, isOnline, updatePresence, onLocationUpdate]);
  
  const toggleTracking = () => {
    if (tracking && watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    
    setTracking(!tracking);
    setError(null);
  };
  
  // Driver controls
  if (isDriver) {
    return (
      <div className="space-y-2">
        <Button 
          onClick={toggleTracking}
          variant={tracking ? "destructive" : "default"}
          className="w-full"
        >
          {tracking ? (
            <>
              <Navigation className="mr-2 h-4 w-4" />
              Stop Sharing Location
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Start Sharing Location
            </>
          )}
        </Button>
        
        {error && (
          <div className="bg-amber-100 text-amber-800 p-2 rounded-md text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {tracking && currentLocation && (
          <div className="text-xs text-muted-foreground">
            Sharing: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            {currentLocation.accuracy && (
              <span> (±{Math.round(currentLocation.accuracy)}m)</span>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // Customer view - just show status
  return driverId && currentLocation ? (
    <div className="flex items-center gap-2 text-sm">
      <MapPin className="h-4 w-4 text-green-500" />
      <span>Driver location is being tracked</span>
    </div>
  ) : (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4" />
      <span>Driver location unavailable</span>
    </div>
  );
};
