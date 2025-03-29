
import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackUserAction } from '@/lib/sentry';

// Connection quality types
type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'slow' | 'poor';

// Context type definition
type ConnectivityContextType = {
  isOnline: boolean;
  connectionQuality: ConnectionQuality;
  lowBandwidthMode: boolean;
  setLowBandwidthMode: (enabled: boolean) => void;
  lastOnlineTime: Date | null;
  dataConsumption: { images: number; fonts: number; total: number };
};

// Default context values
const defaultContext: ConnectivityContextType = {
  isOnline: true,
  connectionQuality: 'good',
  lowBandwidthMode: false,
  setLowBandwidthMode: () => {},
  lastOnlineTime: null,
  dataConsumption: { images: 0, fonts: 0, total: 0 }
};

// Create context
const ConnectivityContext = createContext<ConnectivityContextType>(defaultContext);

// Provider component
export const ConnectivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('good');
  const [lowBandwidthMode, setLowBandwidthMode] = useState(() => {
    try {
      // Check if user previously enabled low bandwidth mode
      const savedMode = localStorage.getItem('mealstock:lowBandwidthMode');
      return savedMode ? JSON.parse(savedMode) : false;
    } catch (e) {
      return false;
    }
  });
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(isOnline ? new Date() : null);
  const [dataConsumption, setDataConsumption] = useState({ images: 0, fonts: 0, total: 0 });

  // Save low bandwidth mode preference
  useEffect(() => {
    try {
      localStorage.setItem('mealstock:lowBandwidthMode', JSON.stringify(lowBandwidthMode));
    } catch (e) {
      console.error('Failed to save low bandwidth mode preference', e);
    }
  }, [lowBandwidthMode]);

  // Network status listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineTime(new Date());
      trackUserAction('connectivity_online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      trackUserAction('connectivity_offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Network quality detection
  useEffect(() => {
    // Function to check connection quality
    const checkConnectionQuality = async () => {
      if (!isOnline) {
        setConnectionQuality('poor');
        return;
      }

      try {
        // Use Network Information API if available
        if ('connection' in navigator && navigator.connection) {
          const connection = navigator.connection as any;
          
          if (connection.effectiveType === '4g' && !connection.saveData) {
            setConnectionQuality('excellent');
          } else if (connection.effectiveType === '4g' && connection.saveData) {
            setConnectionQuality('good');
          } else if (connection.effectiveType === '3g') {
            setConnectionQuality('fair');
          } else if (connection.effectiveType === '2g') {
            setConnectionQuality('slow');
          } else {
            // Fallback to speed test for unknown connection types
            await performSpeedTest();
          }
        } else {
          // Fallback for browsers without Network Information API
          await performSpeedTest();
        }
      } catch (error) {
        console.error('Error checking connection quality:', error);
        // Assume medium quality on error
        setConnectionQuality('fair');
      }
    };

    // Simple speed test by loading a small image and timing it
    const performSpeedTest = async () => {
      const startTime = Date.now();
      try {
        // Load a tiny image to test connection speed
        const response = await fetch('/favicon.ico', { cache: 'no-store' });
        const endTime = Date.now();
        const loadTime = endTime - startTime;

        // Classify connection based on load time
        if (loadTime < 100) {
          setConnectionQuality('excellent');
        } else if (loadTime < 300) {
          setConnectionQuality('good');
        } else if (loadTime < 750) {
          setConnectionQuality('fair');
        } else if (loadTime < 2000) {
          setConnectionQuality('slow');
        } else {
          setConnectionQuality('poor');
        }
      } catch (error) {
        console.error('Speed test failed:', error);
        setConnectionQuality('poor');
      }
    };

    // Check connection quality initially and on network changes
    checkConnectionQuality();

    // Recheck quality periodically and on visibility change
    const interval = setInterval(checkConnectionQuality, 60000); // Every minute
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkConnectionQuality();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOnline]);

  // Auto-enable low bandwidth mode for slow connections in Nigeria
  useEffect(() => {
    const checkForNigerianNetworks = async () => {
      try {
        // Note: In a real app, you would use a more reliable method to detect Nigerian networks
        // This is just a simple simulation for demo purposes
        
        // If connection is slow or poor, suggest low bandwidth mode
        if ((connectionQuality === 'slow' || connectionQuality === 'poor') && !lowBandwidthMode) {
          const shouldEnable = window.confirm(
            'We detected a slow connection. Would you like to enable low bandwidth mode to save data?'
          );
          
          if (shouldEnable) {
            setLowBandwidthMode(true);
          }
        }
      } catch (error) {
        console.error('Error checking for Nigerian networks:', error);
      }
    };
    
    // Only run this check once when the component mounts
    if (isOnline) {
      checkForNigerianNetworks();
    }
  }, [connectionQuality]);

  // Create context value
  const contextValue: ConnectivityContextType = {
    isOnline,
    connectionQuality,
    lowBandwidthMode,
    setLowBandwidthMode: (enabled: boolean) => {
      setLowBandwidthMode(enabled);
      trackUserAction('toggle_low_bandwidth_mode', { enabled });
    },
    lastOnlineTime,
    dataConsumption
  };

  return (
    <ConnectivityContext.Provider value={contextValue}>
      {children}
    </ConnectivityContext.Provider>
  );
};

// Hook for using the connectivity context
export const useConnectivity = () => {
  const context = useContext(ConnectivityContext);
  if (context === undefined) {
    throw new Error('useConnectivity must be used within a ConnectivityProvider');
  }
  return context;
};
