
import React, { useState } from 'react';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { 
  Wifi, 
  WifiOff, 
  Settings,
  Gauge,
  Download,
  Upload,
  BatteryLow
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export function DataSaverDialog() {
  const { isOnline, connectionQuality, lowBandwidthMode, setLowBandwidthMode } = useConnectivity();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  // Estimated data savings (this would be tracked in a real app)
  const [estimatedSavings, setEstimatedSavings] = useState({
    percent: 60,
    megabytes: 12.5,
  });
  
  const handleToggleLowBandwidth = (checked: boolean) => {
    setLowBandwidthMode(checked);
    
    toast({
      title: checked ? "Low bandwidth mode enabled" : "Low bandwidth mode disabled",
      description: checked 
        ? "Images and content will be optimized to save data" 
        : "Full quality content will be loaded",
    });
  };
  
  // Quality indicator based on connection quality
  const getQualityIndicator = () => {
    switch (connectionQuality) {
      case 'excellent':
        return { color: 'bg-green-500', bars: 4, text: 'Excellent' };
      case 'good':
        return { color: 'bg-green-400', bars: 3, text: 'Good' };
      case 'fair':
        return { color: 'bg-yellow-400', bars: 2, text: 'Fair' };
      case 'slow':
        return { color: 'bg-orange-400', bars: 1, text: 'Slow' };
      case 'poor':
        return { color: 'bg-red-500', bars: 1, text: 'Poor' };
      default:
        return { color: 'bg-gray-400', bars: 0, text: 'Unknown' };
    }
  };
  
  const qualityIndicator = getQualityIndicator();
  
  // Get estimated wait times based on connection quality
  const getEstimatedLoadTimes = () => {
    switch (connectionQuality) {
      case 'excellent':
        return { 
          list: '< 1 second', 
          details: '< 2 seconds',
          checkout: '< 5 seconds'
        };
      case 'good':
        return { 
          list: '1-2 seconds', 
          details: '2-3 seconds',
          checkout: '5-10 seconds'
        };
      case 'fair':
        return { 
          list: '2-4 seconds', 
          details: '4-8 seconds',
          checkout: '10-20 seconds'
        };
      case 'slow':
        return { 
          list: '5-10 seconds', 
          details: '10-20 seconds',
          checkout: '20-45 seconds'
        };
      case 'poor':
        return { 
          list: '> 10 seconds', 
          details: '> 20 seconds',
          checkout: '> 45 seconds'
        };
      default:
        return { 
          list: 'Unknown', 
          details: 'Unknown',
          checkout: 'Unknown'
        };
    }
  };
  
  const loadTimes = getEstimatedLoadTimes();
  
  // Recommendation based on connection quality
  const getRecommendation = () => {
    switch (connectionQuality) {
      case 'excellent':
      case 'good':
        return lowBandwidthMode 
          ? "Your connection is good. You can disable low bandwidth mode for better quality." 
          : "Your connection is good. No changes needed.";
      case 'fair':
        return lowBandwidthMode 
          ? "Low bandwidth mode is recommended for your connection."
          : "Consider enabling low bandwidth mode for faster browsing.";
      case 'slow':
      case 'poor':
        return lowBandwidthMode 
          ? "Low bandwidth mode is helping with your slow connection."
          : "We strongly recommend enabling low bandwidth mode to improve performance.";
      default:
        return "Enable low bandwidth mode to save data.";
    }
  };
  
  const connectionColor = isOnline 
    ? qualityIndicator.color
    : 'bg-red-500';
    
  const buttonVariant = isOnline
    ? (connectionQuality === 'slow' || connectionQuality === 'poor' ? "outline" : "ghost")
    : "destructive";
  
  const buttonText = isOnline
    ? `Connection: ${qualityIndicator.text}`
    : "You're Offline";
    
  const buttonIcon = isOnline ? <Wifi className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          size="sm"
          className="flex items-center gap-2"
        >
          {buttonIcon}
          {buttonText}
          {lowBandwidthMode && (
            <span className="ml-1 text-xs bg-green-500 text-white px-1 rounded">Data Saver</span>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Network Settings
          </DialogTitle>
          <DialogDescription>
            Optimize your browsing experience based on your network conditions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Connection Status */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Connection Status</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${connectionColor}`}></div>
                <span className="text-sm">{isOnline ? qualityIndicator.text : "Offline"}</span>
              </div>
              
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-4 w-1 rounded-sm ${i < qualityIndicator.bars ? qualityIndicator.color : 'bg-gray-200'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Data Saver Mode */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="low-bandwidth" className="text-sm font-medium">Data Saver Mode</Label>
                <p className="text-xs text-muted-foreground">Reduces image quality and optimizes content loading</p>
              </div>
              <Switch
                id="low-bandwidth"
                checked={lowBandwidthMode}
                onCheckedChange={handleToggleLowBandwidth}
              />
            </div>
            
            {lowBandwidthMode && (
              <div className="mt-2 space-y-1 rounded-md bg-green-50 p-3 dark:bg-green-950">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-green-600 dark:text-green-400">Estimated data savings</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{estimatedSavings.percent}%</span>
                </div>
                <Progress value={estimatedSavings.percent} className="h-1.5" />
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <Download className="h-3 w-3 mr-1" />
                  <span>~{estimatedSavings.megabytes} MB saved on this session</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Estimated Load Times */}
          {isOnline && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Estimated Load Times</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Meal listings:</p>
                  <p>{loadTimes.list}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Meal details:</p>
                  <p>{loadTimes.details}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-muted-foreground">Checkout process:</p>
                  <p>{loadTimes.checkout}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Recommendation */}
          <div className="rounded-md bg-muted p-3">
            <div className="flex gap-2 items-start">
              {connectionQuality === 'slow' || connectionQuality === 'poor' ? (
                <BatteryLow className="h-4 w-4 mt-0.5 flex-shrink-0" />
              ) : (
                <Wifi className="h-4 w-4 mt-0.5 flex-shrink-0" />
              )}
              <p className="text-sm">{getRecommendation()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
