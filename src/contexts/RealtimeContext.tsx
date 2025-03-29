
import React, { createContext, useContext, useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { toast } from 'sonner';

// Realtime subscription types
export type SubscriptionEvent = 'INSERT' | 'UPDATE' | 'DELETE';
export type SubscriptionTable = 'orders' | 'order_items' | 'community_groups' | 'group_members' | 'meals' | 'vendors' | 'messages' | 'notifications' | 'presence' | 'broadcasts';

interface RealtimeContextType {
  subscribe: <T = any>(
    table: SubscriptionTable,
    event: SubscriptionEvent,
    callback: (payload: { old: T | null; new: T }) => void
  ) => () => void;
  presenceChannel: RealtimeChannel | null;
  updatePresence: (presence: Record<string, any>) => Promise<void>;
  getOnlineUsers: () => Record<string, any>[];
  connectionStatus: 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isOnline } = useConnectivity();
  const [channels, setChannels] = useState<RealtimeChannel[]>([]);
  const [presenceChannel, setPresenceChannel] = useState<RealtimeChannel | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'CONNECTING' | 'DISCONNECTED'>(
    'DISCONNECTED'
  );

  // Initialize and clean up channels
  useEffect(() => {
    if (!user || !isOnline) {
      // Clean up existing channels when user logs out or goes offline
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      setChannels([]);
      setPresenceChannel(null);
      setConnectionStatus('DISCONNECTED');
      return;
    }

    setConnectionStatus('CONNECTING');

    // Initialize presence channel for online status
    const presenceChannelInstance = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    presenceChannelInstance
      .on('presence', { event: 'sync' }, () => {
        setConnectionStatus('CONNECTED');
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Set initial presence once subscribed
          await presenceChannelInstance.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
            status: 'online'
          });
        }
      });

    setPresenceChannel(presenceChannelInstance);

    // Return cleanup function
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      if (presenceChannelInstance) {
        supabase.removeChannel(presenceChannelInstance);
      }
    };
  }, [user, isOnline]);

  // Handle connection status changes
  useEffect(() => {
    if (!isOnline && connectionStatus === 'CONNECTED') {
      setConnectionStatus('DISCONNECTED');
      toast.error('Connection lost', {
        description: 'Realtime updates are temporarily unavailable.'
      });
    } else if (isOnline && connectionStatus === 'DISCONNECTED' && user) {
      setConnectionStatus('CONNECTING');
      // Reconnect logic happens in the other useEffect
    }
  }, [isOnline, connectionStatus, user]);

  // Subscribe to a table
  const subscribe = <T = any>(
    table: SubscriptionTable, 
    event: SubscriptionEvent,
    callback: (payload: { old: T | null; new: T }) => void
  ) => {
    if (!user || !isOnline) {
      return () => {}; // Return no-op function if user is not logged in or offline
    }

    const channel = supabase.channel(`table-changes:${table}`);
    
    channel.on(
      'postgres_changes',
      {
        event: event,
        schema: 'public',
        table: table
      },
      (payload) => callback(payload as any)
    ).subscribe();

    setChannels(prev => [...prev, channel]);

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
      setChannels(prev => prev.filter(ch => ch !== channel));
    };
  };

  // Update user presence
  const updatePresence = async (presence: Record<string, any>) => {
    if (!presenceChannel || !user) return Promise.reject('Not connected');
    
    try {
      await presenceChannel.track({
        user_id: user.id,
        online_at: new Date().toISOString(),
        ...presence
      });
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update presence:', error);
      return Promise.reject(error);
    }
  };

  // Get online users from presence state
  const getOnlineUsers = () => {
    if (!presenceChannel) return [];
    
    const presenceState = presenceChannel.presenceState();
    const onlineUsers: Record<string, any>[] = [];
    
    Object.keys(presenceState).forEach(userId => {
      const userPresence = presenceState[userId][0];
      onlineUsers.push(userPresence);
    });
    
    return onlineUsers;
  };

  const value = {
    subscribe,
    presenceChannel,
    updatePresence,
    getOnlineUsers,
    connectionStatus
  };

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
};
