
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Notification, 
  NotificationPreferences,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUserNotificationPreferences,
  updateUserNotificationPreferences,
  defaultNotificationPreferences,
  sendReplyMessage
} from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRealtime } from '@/contexts/RealtimeContext';
import { useAuth } from '@/hooks/useAuth';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updatePreferences: (preferences: NotificationPreferences) => void;
  sendReply: (message: string, recipientId: string, originalNotificationId: string, isDriverMessage: boolean) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { subscribe } = useRealtime();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  
  // Calculate unread notifications count
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Load notifications and preferences
  useEffect(() => {
    if (!user) return;
    
    // Load user's notifications from Supabase
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setNotifications(data.map(item => ({
            id: item.id,
            type: item.type as any,
            title: item.title,
            message: item.content,
            timestamp: new Date(item.created_at),
            read: item.read,
            actionUrl: item.action_url,
            orderId: item.related_id,
            recipientId: item.user_id
          })));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Subscribe to new notifications
    const unsubscribe = subscribe('notifications', 'INSERT', (payload) => {
      if (payload.new && payload.new.user_id === user.id) {
        const newNotification: Notification = {
          id: payload.new.id,
          type: payload.new.type as any,
          title: payload.new.title,
          message: payload.new.content,
          timestamp: new Date(payload.new.created_at),
          read: payload.new.read,
          actionUrl: payload.new.action_url,
          orderId: payload.new.related_id,
          recipientId: payload.new.user_id
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        // Show toast for new notification
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    });
    
    // Load user's preferences
    const userPreferences = getUserNotificationPreferences(user.id);
    setPreferences(userPreferences);
    
    return () => {
      unsubscribe();
    };
  }, [user, subscribe]);
  
  // Mark a notification as read
  const handleMarkAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Delete a notification
  const handleDeleteNotification = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  // Update notification preferences
  const handleUpdatePreferences = (newPreferences: NotificationPreferences) => {
    updateUserNotificationPreferences(user?.id || '', newPreferences);
    setPreferences(newPreferences);
  };
  
  // Reply to a message (driver or support)
  const handleSendReply = async (
    message: string, 
    recipientId: string, 
    originalNotificationId: string,
    isDriverMessage: boolean
  ) => {
    if (!user) throw new Error('User not authenticated');
    
    await sendReplyMessage(
      recipientId,
      message,
      user.id,
      user.name || "Customer", // Use user name if available
      originalNotificationId,
      isDriverMessage
    );
    
    // Use the local service to update UI immediately
    const response = await sendReplyMessage(
      recipientId,
      message,
      user.id,
      user.name || "Customer",
      originalNotificationId,
      isDriverMessage
    );
    
    return response;
  };
  
  return (
    <NotificationsContext.Provider 
      value={{
        notifications,
        unreadCount,
        preferences,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        deleteNotification: handleDeleteNotification,
        updatePreferences: handleUpdatePreferences,
        sendReply: handleSendReply
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
