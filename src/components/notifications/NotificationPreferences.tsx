
import React, { useState } from 'react';
import { CheckCircle2, Bell, Truck, Clock, MessageCircle, Phone, Volume, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/contexts/NotificationsContext';
import { NotificationChannel, NotificationPreferences as Preferences, NotificationType } from '@/services/notificationService';

interface NotificationPreferencesProps {
  onClose?: () => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ onClose }) => {
  const { preferences, updatePreferences } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState<Preferences>({...preferences});
  
  const handleSave = () => {
    updatePreferences(localPreferences);
    if (onClose) onClose();
  };
  
  const handleToggleType = (type: NotificationType) => {
    setLocalPreferences(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        enabled: !prev[type].enabled
      }
    }));
  };
  
  const handleToggleChannel = (type: NotificationType, channel: NotificationChannel) => {
    setLocalPreferences(prev => {
      const currentChannels = prev[type].channels;
      const newChannels = currentChannels.includes(channel)
        ? currentChannels.filter(ch => ch !== channel)
        : [...currentChannels, channel];
      
      return {
        ...prev,
        [type]: {
          ...prev[type],
          channels: newChannels
        }
      };
    });
  };
  
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'orderStatus':
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case 'deliveryUpdate':
        return <Truck className="h-5 w-5 text-green-500" />;
      case 'mealExpiration':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'supportMessage':
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case 'driverMessage':
        return <MessageSquare className="h-5 w-5 text-indigo-500" />;
    }
  };
  
  const getChannelIcon = (channel: NotificationChannel) => {
    switch (channel) {
      case 'inApp':
        return <Bell className="h-4 w-4 text-muted-foreground" />;
      case 'sms':
        return <Phone className="h-4 w-4 text-muted-foreground" />;
      case 'voice':
        return <Volume className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const notificationTypes: {type: NotificationType; label: string}[] = [
    { type: 'orderStatus', label: 'Order Status Updates' },
    { type: 'deliveryUpdate', label: 'Delivery Updates' },
    { type: 'mealExpiration', label: 'Meal Expiration Reminders' },
    { type: 'supportMessage', label: 'Customer Support Messages' },
    { type: 'driverMessage', label: 'Delivery Driver Messages' }
  ];
  
  const channels: {channel: NotificationChannel; label: string}[] = [
    { channel: 'inApp', label: 'In-App' },
    { channel: 'sms', label: 'SMS' },
    { channel: 'voice', label: 'Voice (ElevenLabs)' }
  ];
  
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {notificationTypes.map(({ type, label }) => (
          <div key={type} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getTypeIcon(type)}
                <Label htmlFor={`enable-${type}`} className="font-medium">
                  {label}
                </Label>
              </div>
              <Switch
                id={`enable-${type}`}
                checked={localPreferences[type].enabled}
                onCheckedChange={() => handleToggleType(type)}
              />
            </div>
            
            {localPreferences[type].enabled && (
              <div className="ml-7 space-y-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Receive via:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {channels.map(({ channel, label }) => (
                    <div 
                      key={`${type}-${channel}`} 
                      className={`flex items-center p-2 rounded-md cursor-pointer border transition-colors ${
                        localPreferences[type].channels.includes(channel)
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      }`}
                      onClick={() => handleToggleChannel(type, channel)}
                    >
                      <div className="mr-2">
                        {getChannelIcon(channel)}
                      </div>
                      <span className="text-xs">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Separator className="my-3" />
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
