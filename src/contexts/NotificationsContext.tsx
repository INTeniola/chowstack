
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
  // Mock user ID - in a real app this would come from authentication
  const currentUserId = "current-user";
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  
  // Calculate unread notifications count
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Load notifications and preferences
  useEffect(() => {
    // Load user's notifications
    const userNotifications = getUserNotifications(currentUserId);
    setNotifications(userNotifications);
    
    // Load user's preferences
    const userPreferences = getUserNotificationPreferences(currentUserId);
    setPreferences(userPreferences);
    
    // Set up polling to refresh notifications (in a real app, use websockets/push notifications)
    const interval = setInterval(() => {
      setNotifications(getUserNotifications(currentUserId));
    }, 30000); // Check for new notifications every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Mark a notification as read
  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications(getUserNotifications(currentUserId));
  };
  
  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(currentUserId);
    setNotifications(getUserNotifications(currentUserId));
  };
  
  // Delete a notification
  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
    setNotifications(getUserNotifications(currentUserId));
  };
  
  // Update notification preferences
  const handleUpdatePreferences = (newPreferences: NotificationPreferences) => {
    updateUserNotificationPreferences(currentUserId, newPreferences);
    setPreferences(newPreferences);
  };
  
  // Reply to a message (driver or support)
  const handleSendReply = async (
    message: string, 
    recipientId: string, 
    originalNotificationId: string,
    isDriverMessage: boolean
  ) => {
    await sendReplyMessage(
      recipientId,
      message,
      currentUserId,
      "Customer", // In a real app, get the actual name
      originalNotificationId,
      isDriverMessage
    );
    
    // Refresh notifications
    setNotifications(getUserNotifications(currentUserId));
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
