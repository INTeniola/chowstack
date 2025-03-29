
import React from 'react';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { Wifi, WifiOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function OfflineIndicator() {
  const { isOnline, connectionQuality, lowBandwidthMode, setLowBandwidthMode } = useConnectivity();
  const navigate = useNavigate();
  
  if (isOnline) {
    // Don't show anything when online, except for slow connections
    if (connectionQuality !== 'slow') {
      return null;
    }
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={isOnline ? "outline" : "destructive"}
            size="sm"
            className="w-full flex items-center justify-center shadow-lg"
          >
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                {connectionQuality === 'slow' ? 'Slow Connection' : 'Connected'}
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 mr-2" />
                You're Offline - Some features limited
              </>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Connection Settings</SheetTitle>
            <SheetDescription>
              {isOnline
                ? "You're connected to the internet, but your connection may be slow."
                : "You're currently offline. Some content is available from cache."}
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="lowbw">Low Bandwidth Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Reduces image quality and disables non-essential features
                </div>
              </div>
              <Switch
                id="lowbw"
                checked={lowBandwidthMode}
                onCheckedChange={setLowBandwidthMode}
              />
            </div>
            
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigate('/settings');
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
