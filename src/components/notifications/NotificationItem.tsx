
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Check, 
  Package, 
  Truck, 
  Clock, 
  MessageCircle, 
  X, 
  CornerDownRight, 
  AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Notification } from '@/services/notificationService';
import { useNotifications } from '@/contexts/NotificationsContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const { markAsRead, deleteNotification, sendReply } = useNotifications();
  const navigate = useNavigate();
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(notification.id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };
  
  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Determine if this is a driver message or support message
      const isDriverMessage = notification.type === 'driverMessage';
      
      await sendReply(
        replyMessage,
        notification.senderId || '',
        notification.id,
        isDriverMessage
      );
      
      setReplyMessage('');
      setIsReplying(false);
      markAsRead(notification.id);
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClick = () => {
    markAsRead(notification.id);
    
    if (notification.actionUrl) {
      if (onClose) onClose();
      navigate(notification.actionUrl);
    } else if (
      notification.type === 'driverMessage' || 
      notification.type === 'supportMessage'
    ) {
      setIsReplying(true);
    }
  };
  
  // Get the icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'orderStatus':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'deliveryUpdate':
        return <Truck className="h-5 w-5 text-green-500" />;
      case 'mealExpiration':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'supportMessage':
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case 'driverMessage':
        return <Truck className="h-5 w-5 text-indigo-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <>
      <div 
        className={cn(
          "flex items-start p-3 rounded-md cursor-pointer hover:bg-muted transition-colors",
          !notification.read && "bg-muted/50"
        )}
        onClick={handleClick}
      >
        <div className="mr-3 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 space-y-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <p className={cn(
              "text-sm font-medium leading-none",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </p>
            <div className="flex items-center gap-1">
              {!notification.read && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5" 
                  onClick={handleMarkAsRead}
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5" 
                onClick={handleDelete}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {format(new Date(notification.timestamp), 'MMM d, h:mm a')}
            </span>
            
            {(notification.type === 'driverMessage' || notification.type === 'supportMessage') && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReplying(true);
                }}
              >
                <CornerDownRight className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={isReplying} onOpenChange={setIsReplying}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Reply to {notification.senderName || (notification.type === 'supportMessage' ? 'Support' : 'Driver')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Original message:</p>
              <p className="text-sm">{notification.message}</p>
            </div>
            
            <Textarea
              placeholder="Type your reply here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReply}
              disabled={!replyMessage.trim() || isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationItem;
