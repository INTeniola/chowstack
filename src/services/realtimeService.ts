
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Track shared progress across clients
export const createProgressChannel = (channelId: string): {
  channel: RealtimeChannel;
  updateProgress: (value: number) => void;
  close: () => void;
} => {
  const channel = supabase.channel(`progress:${channelId}`);
  
  const subscription = channel.subscribe();
  
  const updateProgress = (value: number) => {
    channel.send({
      type: 'broadcast',
      event: 'progress',
      payload: { value }
    });
  };
  
  const close = () => {
    supabase.removeChannel(channel);
  };
  
  return {
    channel,
    updateProgress,
    close
  };
};

// Create a channel for real-time chat
export const createChatChannel = (channelId: string): {
  channel: RealtimeChannel;
  sendMessage: (message: string, userId: string, userName: string) => void;
  close: () => void;
} => {
  const channel = supabase.channel(`chat:${channelId}`);
  
  const subscription = channel.subscribe();
  
  const sendMessage = (message: string, userId: string, userName: string) => {
    channel.send({
      type: 'broadcast',
      event: 'message',
      payload: { 
        message, 
        userId, 
        userName, 
        timestamp: new Date().toISOString() 
      }
    });
  };
  
  const close = () => {
    supabase.removeChannel(channel);
  };
  
  return {
    channel,
    sendMessage,
    close
  };
};

// Send a real-time notification to specific users
export const sendDirectNotification = async (
  recipientId: string,
  title: string,
  content: string,
  type: string,
  relatedId?: string
) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: recipientId,
        title,
        content,
        type,
        related_id: relatedId,
        read: false
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Create a broadcast announcement
export const createBroadcast = async (
  title: string,
  content: string,
  type: 'flash_sale' | 'limited_offer' | 'community_event',
  targetGroup: string = 'all',
  expiresAt?: Date
) => {
  const userId = supabase.auth.getUser().then(({ data }) => data.user?.id);
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  try {
    const { data, error } = await supabase
      .from('broadcasts')
      .insert({
        sender_id: await userId,
        title,
        content,
        type,
        target_group: targetGroup,
        expires_at: expiresAt?.toISOString()
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating broadcast:', error);
    throw error;
  }
};

// Update user presence
export const updateUserPresence = async (
  status: 'online' | 'away' | 'busy',
  locationData?: { lat: number; lng: number }
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    // First check if user exists in presence table
    const { data: existingPresence } = await supabase
      .from('presence')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (existingPresence) {
      // Update existing presence
      const { data, error } = await supabase
        .from('presence')
        .update({
          status,
          last_seen: new Date().toISOString(),
          location_data: locationData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      return data;
    } else {
      // Insert new presence
      const { data, error } = await supabase
        .from('presence')
        .insert({
          user_id: user.id,
          status,
          last_seen: new Date().toISOString(),
          location_data: locationData
        });
        
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error updating presence:', error);
    throw error;
  }
};
