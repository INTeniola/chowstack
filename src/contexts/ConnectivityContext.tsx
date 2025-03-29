
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ConnectivityState {
  isOnline: boolean;
  connectionQuality: 'unknown' | 'slow' | 'medium' | 'fast';
  lowBandwidthMode: boolean;
  setLowBandwidthMode: (enabled: boolean) => void;
  lastOnlineTime: Date | null;
}

const ConnectivityContext = createContext<ConnectivityState | undefined>(undefined);

export const ConnectivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'unknown' | 'slow' | 'medium' | 'fast'>('unknown');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(() => {
    // Try to get from localStorage
    const saved = localStorage.getItem('lowBandwidthMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(isOnline ? new Date() : null);
  const { toast } = useToast();

  // Save low bandwidth mode choice to localStorage
  useEffect(() => {
    localStorage.setItem('lowBandwidthMode', JSON.stringify(lowBandwidthMode));
  }, [lowBandwidthMode]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineTime(new Date());
      toast({ 
        title: "You're back online",
        description: "Content will now sync with the server",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({ 
        title: "You're offline",
        description: "Saved content is still available",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Monitor connection quality
  useEffect(() => {
    const checkConnectionQuality = () => {
      if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        // @ts-ignore - connection property exists but TypeScript doesn't know about it
        const connection = navigator.connection;
        
        if (connection) {
          // @ts-ignore - effectiveType property exists but TypeScript doesn't know about it
          const effectiveType = connection.effectiveType;
          
          if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            setConnectionQuality('slow');
          } else if (effectiveType === '3g') {
            setConnectionQuality('medium');
          } else if (effectiveType === '4g') {
            setConnectionQuality('fast');
          }
          
          // Recommend low bandwidth mode if connection is slow
          if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            if (!lowBandwidthMode) {
              toast({
                title: "Slow connection detected",
                description: "Consider enabling low bandwidth mode in settings",
                duration: 5000,
              });
            }
          }
        }
      }
    };
    
    checkConnectionQuality();
    
    // Try to listen for connection changes
    // @ts-ignore - connection property exists but TypeScript doesn't know about it
    const connection = navigator.connection;
    if (connection) {
      // @ts-ignore - addEventListener property exists but TypeScript doesn't know about it
      connection.addEventListener('change', checkConnectionQuality);
      return () => {
        // @ts-ignore - removeEventListener property exists but TypeScript doesn't know about it
        connection.removeEventListener('change', checkConnectionQuality);
      };
    }
    
    return undefined;
  }, [lowBandwidthMode, toast]);

  return (
    <ConnectivityContext.Provider value={{
      isOnline,
      connectionQuality,
      lowBandwidthMode,
      setLowBandwidthMode,
      lastOnlineTime,
    }}>
      {children}
    </ConnectivityContext.Provider>
  );
};

export const useConnectivity = (): ConnectivityState => {
  const context = useContext(ConnectivityContext);
  if (context === undefined) {
    throw new Error('useConnectivity must be used within a ConnectivityProvider');
  }
  return context;
};
