
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationsHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({ 
  unreadCount, 
  onMarkAllAsRead 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl md:text-2xl font-bold flex items-center">
          <Bell className="h-6 w-6 mr-2" />
          Notifications
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMarkAllAsRead}
            className="hidden md:flex"
          >
            <Check className="h-4 w-4 mr-1" />
            Mark all as read
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationsHeader;
