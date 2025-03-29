
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useRealtime } from '@/contexts/RealtimeContext';
import { createChatChannel } from '@/services/realtimeService';
import { SendHorizonal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ActiveUsers } from './ActiveUsers';

interface GroupChatProps {
  groupId: string;
  groupName: string;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  group_id: string;
  message: string;
  created_at: string;
  read: boolean;
  senderName?: string;
  senderAvatar?: string;
}

interface RealtimeMessage {
  message: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export const GroupChat: React.FC<GroupChatProps> = ({ groupId, groupName }) => {
  const { user } = useAuth();
  const { subscribe } = useRealtime();
  const [messages, setMessages] = useState<(ChatMessage | RealtimeMessage)[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [realtimeChannel, setRealtimeChannel] = useState<ReturnType<typeof createChatChannel> | null>(null);
  
  // Initialize the realtime chat channel
  useEffect(() => {
    if (!groupId) return undefined;
    
    const channel = createChatChannel(`group-${groupId}`);
    setRealtimeChannel(channel);
    
    // Listen for real-time messages
    channel.channel.on('broadcast', { event: 'message' }, (payload) => {
      const message = payload.payload as RealtimeMessage;
      // Only add if not from current user (those will be added directly)
      if (message.userId !== user?.id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });
    
    return () => {
      channel.close();
    };
  }, [groupId, user?.id]);
  
  // Load existing messages from the database
  useEffect(() => {
    const fetchMessages = async () => {
      if (!groupId || !user) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id, 
            sender_id, 
            group_id, 
            message, 
            created_at, 
            read,
            profiles(name, avatar_url)
          `)
          .eq('group_id', groupId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          const formattedMessages = data.map(msg => ({
            id: msg.id,
            sender_id: msg.sender_id,
            group_id: msg.group_id,
            message: msg.message,
            created_at: msg.created_at,
            read: msg.read,
            senderName: msg.profiles?.name || 'Unknown User',
            senderAvatar: msg.profiles?.avatar_url
          }));
          
          setMessages(formattedMessages);
          
          // Mark messages as read
          if (formattedMessages.some(msg => !msg.read && msg.sender_id !== user.id)) {
            await supabase
              .from('messages')
              .update({ read: true })
              .eq('group_id', groupId)
              .neq('sender_id', user.id);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new database messages
    const unsubscribe = subscribe<ChatMessage>('messages', 'INSERT', (payload) => {
      if (payload.new && payload.new.group_id === groupId) {
        // Fetch the sender info
        const fetchSenderInfo = async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();
            
          if (!error && data) {
            const message = {
              ...payload.new,
              senderName: data.name,
              senderAvatar: data.avatar_url
            };
            
            setMessages(prev => [...prev, message]);
            scrollToBottom();
            
            // Mark as read if not from current user
            if (payload.new.sender_id !== user.id) {
              await supabase
                .from('messages')
                .update({ read: true })
                .eq('id', payload.new.id);
            }
          }
        };
        
        fetchSenderInfo();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [groupId, user, subscribe]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || !groupId) return;
    
    setSending(true);
    
    try {
      // Store in database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          group_id: groupId,
          message: inputMessage.trim(),
          read: false
        })
        .select();
        
      if (error) throw error;
      
      // Send realtime message
      if (realtimeChannel) {
        realtimeChannel.sendMessage(
          inputMessage.trim(),
          user.id,
          user.name || 'User'
        );
      }
      
      // Add to local state immediately for responsiveness
      setMessages(prev => [
        ...prev, 
        {
          id: data?.[0]?.id || `local-${Date.now()}`,
          sender_id: user.id,
          group_id: groupId,
          message: inputMessage.trim(),
          created_at: new Date().toISOString(),
          read: false,
          senderName: user.name || 'You',
          senderAvatar: user.avatar
        }
      ]);
      
      setInputMessage('');
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const isUserMessage = (message: ChatMessage | RealtimeMessage): boolean => {
    return 'sender_id' in message 
      ? message.sender_id === user?.id 
      : message.userId === user?.id;
  };
  
  const renderMessage = (message: ChatMessage | RealtimeMessage, index: number) => {
    const isCurrentUser = isUserMessage(message);
    const timestamp = 'created_at' in message ? message.created_at : message.timestamp;
    const formattedTime = format(new Date(timestamp), 'h:mm a');
    const senderName = 'senderName' in message ? message.senderName : message.userName;
    
    return (
      <div
        key={`${'id' in message ? message.id : `temp-${index}`}`}
        className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} gap-2 mb-4`}
      >
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage 
            src={'senderAvatar' in message ? message.senderAvatar : undefined} 
            alt={senderName} 
          />
          <AvatarFallback>
            {senderName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="max-w-[70%]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              {senderName}
            </span>
            <span className="text-xs text-muted-foreground">
              {formattedTime}
            </span>
          </div>
          
          <div 
            className={`${
              isCurrentUser 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            } rounded-lg px-3 py-2 text-sm`}
          >
            {message.message || ('message' in message ? message.message : '')}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-[500px] border rounded-md">
      <div className="p-3 border-b flex justify-between items-center">
        <div>
          <h3 className="font-medium">{groupName} Chat</h3>
          <p className="text-xs text-muted-foreground">
            Chat with group members in real-time
          </p>
        </div>
        <ActiveUsers groupId={groupId} maxVisible={3} />
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Be the first!</p>
          </div>
        ) : (
          <div>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="resize-none"
            rows={1}
            disabled={!user}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || sending || !user}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
