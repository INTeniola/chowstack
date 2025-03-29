
import React from 'react';
import { Bell, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import NotificationItem from './NotificationItem';
import { Notification } from '@/services/notificationService';

interface NotificationsListViewProps {
  notifications: Notification[];
  handleMarkAllAsRead: () => void;
  unreadCount: number;
  searchTerm: string;
}

const NotificationsListView: React.FC<NotificationsListViewProps> = ({ 
  notifications, 
  handleMarkAllAsRead,
  unreadCount,
  searchTerm
}) => {
  return (
    <>
      {unreadCount > 0 && (
        <div className="md:hidden mb-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            className="w-full"
          >
            <Check className="h-4 w-4 mr-1" />
            Mark all as read
          </Button>
        </div>
      )}
      
      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground mb-1">No notifications found</p>
          <p className="text-xs text-muted-foreground">
            {searchTerm 
              ? 'Try a different search term' 
              : 'You will see your notifications here'}
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[450px] pr-4 -mr-4">
          <div className="space-y-1">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </>
  );
};

export default NotificationsListView;
