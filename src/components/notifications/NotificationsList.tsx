
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Bell, X, Settings, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationItem from './NotificationItem';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import NotificationPreferences from './NotificationPreferences';

interface NotificationsListProps {
  onClose?: () => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [preferencesOpen, setPreferencesOpen] = React.useState(false);
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  const handleNavigateToNotifications = () => {
    if (onClose) onClose();
    navigate('/notifications');
  };
  
  return (
    <div className="rounded-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={handleMarkAllAsRead}
            >
              <Check className="h-4 w-4 mr-1" />
              <span className="text-xs">Mark all read</span>
            </Button>
          )}
          <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Notification Preferences</DialogTitle>
              </DialogHeader>
              <NotificationPreferences onClose={() => setPreferencesOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Separator />
      
      {notifications.length === 0 ? (
        <div className="p-6 text-center">
          <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <>
          <ScrollArea className="h-[350px]">
            <div className="space-y-1 p-2">
              {notifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onClose={onClose}
                />
              ))}
            </div>
          </ScrollArea>
          
          <Separator />
          
          <div className="p-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm h-auto py-2"
              onClick={handleNavigateToNotifications}
            >
              <span>View all notifications</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsList;
