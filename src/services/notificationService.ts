import { toast } from '@/hooks/use-toast';
import { generateAudioInstructions } from './elevenLabsService';

// Notification types
export type NotificationType = 
  | 'orderStatus' 
  | 'deliveryUpdate' 
  | 'mealExpiration' 
  | 'supportMessage'
  | 'driverMessage';

export type NotificationChannel = 
  | 'inApp' 
  | 'sms' 
  | 'voice';

export type NotificationPreferences = {
  [key in NotificationType]: {
    enabled: boolean;
    channels: NotificationChannel[];
  };
};

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  orderId?: string;
  mealId?: string;
  senderId?: string;
  senderName?: string;
  recipientId: string;
}

// Default user preferences
export const defaultNotificationPreferences: NotificationPreferences = {
  orderStatus: {
    enabled: true,
    channels: ['inApp', 'sms']
  },
  deliveryUpdate: {
    enabled: true,
    channels: ['inApp', 'sms']
  },
  mealExpiration: {
    enabled: true,
    channels: ['inApp']
  },
  supportMessage: {
    enabled: true,
    channels: ['inApp', 'sms']
  },
  driverMessage: {
    enabled: true,
    channels: ['inApp', 'sms']
  }
};

// Mock function to send SMS - in a real app this would connect to an SMS gateway
const sendSMS = async (phoneNumber: string, message: string): Promise<boolean> => {
  console.log(`SMS to ${phoneNumber}: ${message}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};

// Mock function to get user's phone number - in a real app this would come from user profile
const getUserPhoneNumber = (userId: string): string => {
  return "+1234567890"; // Mock phone number
};

// Mock function to get user notification preferences - in a real app this would be stored in database
let userPreferences: { [userId: string]: NotificationPreferences } = {};

export const getUserNotificationPreferences = (userId: string): NotificationPreferences => {
  if (!userPreferences[userId]) {
    userPreferences[userId] = { ...defaultNotificationPreferences };
  }
  return userPreferences[userId];
};

export const updateUserNotificationPreferences = (
  userId: string, 
  preferences: NotificationPreferences
): void => {
  userPreferences[userId] = preferences;
};

// In-memory store for notifications - in a real app this would be in a database
let notifications: Notification[] = [];

// Send notification through multiple channels based on user preferences
export const sendNotification = async (
  notification: Omit<Notification, 'id' | 'timestamp' | 'read'>,
  phoneNumber?: string
): Promise<string> => {
  const newNotification: Notification = {
    ...notification,
    id: Math.random().toString(36).substring(2, 15),
    timestamp: new Date(),
    read: false
  };
  
  // Add to in-app notifications
  notifications.push(newNotification);
  
  // Get user preferences
  const preferences = getUserNotificationPreferences(notification.recipientId);
  const notificationConfig = preferences[notification.type];
  
  if (notificationConfig.enabled) {
    // Show in-app toast for immediate feedback
    if (notificationConfig.channels.includes('inApp')) {
      toast({
        title: notification.title,
        description: notification.message,
      });
    }
    
    // Send SMS if enabled for this notification type
    if (notificationConfig.channels.includes('sms')) {
      const userPhone = phoneNumber || getUserPhoneNumber(notification.recipientId);
      await sendSMS(userPhone, `${notification.title}: ${notification.message}`);
    }
    
    // Generate voice notification if enabled
    if (notificationConfig.channels.includes('voice') && notification.type === 'deliveryUpdate') {
      try {
        // Generate audio for the notification
        const audioUrl = await generateAudioInstructions(
          notification.title,
          [], // No preservation instructions for notifications
          []  // No reheating instructions for notifications
        );
        console.log(`Voice notification generated: ${audioUrl}`);
        
        // In a real app, this would trigger a call to the user's phone
        // or play the audio in the app
      } catch (error) {
        console.error("Failed to generate voice notification:", error);
      }
    }
  }
  
  return newNotification.id;
};

// Get all notifications for a user
export const getUserNotifications = (userId: string): Notification[] => {
  return notifications
    .filter(notification => notification.recipientId === userId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): void => {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = (userId: string): void => {
  notifications
    .filter(notification => notification.recipientId === userId)
    .forEach(notification => { notification.read = true; });
};

// Delete a notification
export const deleteNotification = (notificationId: string): void => {
  notifications = notifications.filter(n => n.id !== notificationId);
};

// Send order status notification
export const sendOrderStatusNotification = async (
  recipientId: string,
  orderId: string,
  status: string,
  details?: string
): Promise<string> => {
  return sendNotification({
    type: 'orderStatus',
    title: `Order ${status}`,
    message: details || `Your order #${orderId} is now ${status}.`,
    recipientId,
    orderId
  });
};

// Send delivery update notification
export const sendDeliveryUpdateNotification = async (
  recipientId: string,
  orderId: string,
  status: string,
  estimatedTime?: string
): Promise<string> => {
  let message = `Your order #${orderId} delivery status: ${status}`;
  if (estimatedTime) {
    message += `. Estimated arrival: ${estimatedTime}`;
  }
  
  return sendNotification({
    type: 'deliveryUpdate',
    title: 'Delivery Update',
    message,
    recipientId,
    orderId
  });
};

// Send meal expiration reminder
export const sendMealExpirationReminder = async (
  recipientId: string,
  mealId: string,
  mealName: string,
  expiryDate: Date
): Promise<string> => {
  const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return sendNotification({
    type: 'mealExpiration',
    title: 'Meal Expiration Reminder',
    message: `${mealName} will expire in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Enjoy it soon!`,
    recipientId,
    mealId
  });
};

// Send message from customer support
export const sendSupportMessage = async (
  recipientId: string,
  message: string,
  supportAgentId: string,
  supportAgentName: string
): Promise<string> => {
  return sendNotification({
    type: 'supportMessage',
    title: 'Message from Customer Support',
    message,
    recipientId,
    senderId: supportAgentId,
    senderName: supportAgentName
  });
};

// Send message from delivery driver
export const sendDriverMessage = async (
  recipientId: string,
  message: string,
  driverId: string,
  driverName: string,
  orderId: string
): Promise<string> => {
  return sendNotification({
    type: 'driverMessage',
    title: 'Message from Delivery Driver',
    message,
    recipientId,
    senderId: driverId,
    senderName: driverName,
    orderId
  });
};

// Reply to a message (driver or support)
export const sendReplyMessage = async (
  recipientId: string,
  message: string,
  senderId: string,
  senderName: string,
  originalNotificationId: string,
  isDriverMessage: boolean
): Promise<string> => {
  // Find the original notification to keep the context
  const originalNotification = notifications.find(n => n.id === originalNotificationId);
  
  return sendNotification({
    type: isDriverMessage ? 'driverMessage' : 'supportMessage',
    title: `Reply to ${isDriverMessage ? 'Driver' : 'Support'}`,
    message,
    recipientId,
    senderId,
    senderName,
    orderId: originalNotification?.orderId
  });
};
