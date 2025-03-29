
import React from 'react';
import { useRealtime } from '@/contexts/RealtimeContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PresenceIndicatorProps {
  userId: string;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  userId,
  showLabel = false,
  className,
  size = 'md'
}) => {
  const { getOnlineUsers } = useRealtime();
  const onlineUsers = getOnlineUsers();
  
  const isOnline = onlineUsers.some(user => user.user_id === userId);
  const userPresence = onlineUsers.find(user => user.user_id === userId);
  
  const statusColor = isOnline 
    ? userPresence?.status === 'busy' 
      ? 'bg-orange-500' 
      : userPresence?.status === 'away' 
        ? 'bg-yellow-500' 
        : 'bg-green-500'
    : 'bg-gray-400';
  
  const statusText = isOnline 
    ? userPresence?.status === 'busy' 
      ? 'Busy' 
      : userPresence?.status === 'away' 
        ? 'Away' 
        : 'Online'
    : 'Offline';
    
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-1.5", className)}>
            <div 
              className={cn(
                "rounded-full animate-pulse", 
                statusColor,
                sizeClasses[size]
              )} 
            />
            {showLabel && (
              <span className="text-xs text-muted-foreground">{statusText}</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusText}</p>
          {isOnline && userPresence?.online_at && (
            <p className="text-xs text-muted-foreground">
              Since {new Date(userPresence.online_at).toLocaleTimeString()}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
