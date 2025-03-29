
import React, { useState, useEffect } from 'react';
import { useRealtime } from '@/contexts/RealtimeContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  avatar_url?: string;
}

interface ActiveUsersProps {
  groupId?: string;
  maxVisible?: number;
  showCount?: boolean;
}

export const ActiveUsers: React.FC<ActiveUsersProps> = ({
  groupId,
  maxVisible = 5,
  showCount = true
}) => {
  const { getOnlineUsers } = useRealtime();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const onlineUsers = getOnlineUsers();
  
  // Fetch user info for all online users
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (onlineUsers.length === 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // Get user IDs from online presence
        const userIds = onlineUsers.map(user => user.user_id);
        
        // If group ID is provided, filter by group members
        let filteredUserIds = userIds;
        
        if (groupId) {
          const { data: groupMembers, error: groupError } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', groupId);
            
          if (groupError) throw groupError;
          
          const groupMemberIds = groupMembers.map(member => member.user_id);
          filteredUserIds = userIds.filter(id => groupMemberIds.includes(id));
        }
        
        if (filteredUserIds.length === 0) {
          setUsers([]);
          setLoading(false);
          return;
        }
        
        // Get user profiles
        const { data: userProfiles, error: profilesError } = await supabase
          .from('users')
          .select('id, full_name, avatar_url')
          .in('id', filteredUserIds);
          
        if (profilesError) throw profilesError;
        
        if (userProfiles) {
          // Map the returned data to match our User interface
          const mappedUsers: User[] = userProfiles.map(profile => ({
            id: profile.id,
            name: profile.full_name || 'Unknown User',
            avatar_url: profile.avatar_url
          }));
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, [onlineUsers, groupId]);
  
  if (loading) {
    return (
      <div className="flex items-center gap-1">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
      </div>
    );
  }
  
  if (users.length === 0) {
    return <div className="text-sm text-muted-foreground">No active users</div>;
  }
  
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;
  
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        <TooltipProvider>
          {visibleUsers.map(user => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={user.avatar_url} alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
        
        {remainingCount > 0 && showCount && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
            +{remainingCount}
          </div>
        )}
      </div>
      
      {showCount && (
        <span className="ml-2 text-sm text-muted-foreground">
          {users.length} active
        </span>
      )}
    </div>
  );
};
