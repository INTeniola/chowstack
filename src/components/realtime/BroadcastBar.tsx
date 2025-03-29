
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useRealtime } from '@/contexts/RealtimeContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Broadcast {
  id: string;
  type: 'flash_sale' | 'limited_offer' | 'community_event';
  title: string;
  content: string;
  expires_at: string | null;
}

export const BroadcastBar: React.FC = () => {
  const { subscribe } = useRealtime();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [currentBroadcastIndex, setCurrentBroadcastIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  
  // Fetch active broadcasts
  useEffect(() => {
    const fetchBroadcasts = async () => {
      const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching broadcasts:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setBroadcasts(data as Broadcast[]);
      }
    };
    
    fetchBroadcasts();
    
    // Subscribe to broadcast changes
    const unsubscribe = subscribe<Broadcast>(
      'broadcasts',
      'INSERT',
      (payload) => {
        if (payload.new) {
          setBroadcasts(prev => [payload.new, ...prev]);
        }
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, [subscribe]);
  
  // Rotate broadcasts every 8 seconds if multiple exist
  useEffect(() => {
    if (broadcasts.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentBroadcastIndex(prevIndex => 
        (prevIndex + 1) % broadcasts.filter(b => !dismissed[b.id]).length
      );
    }, 8000);
    
    return () => clearInterval(interval);
  }, [broadcasts, dismissed]);
  
  // Filter out dismissed broadcasts
  const activeBroadcasts = broadcasts.filter(b => !dismissed[b.id]);
  
  if (activeBroadcasts.length === 0) {
    return null;
  }
  
  const currentBroadcast = activeBroadcasts[currentBroadcastIndex % activeBroadcasts.length];
  
  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'flash_sale': return 'bg-red-600 dark:bg-red-700';
      case 'limited_offer': return 'bg-amber-600 dark:bg-amber-700';
      case 'community_event': return 'bg-blue-600 dark:bg-blue-700';
      default: return 'bg-primary';
    }
  };
  
  return (
    <div className={cn(
      "px-4 py-2 text-white relative overflow-hidden",
      getBackgroundColor(currentBroadcast.type)
    )}>
      <div className="container-custom flex items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="font-semibold">{currentBroadcast.title}</span>
          <span className="text-sm">{currentBroadcast.content}</span>
          
          {currentBroadcast.expires_at && (
            <Badge variant="outline" className="bg-white/20 text-white border-white/20 text-xs whitespace-nowrap">
              Ends {new Date(currentBroadcast.expires_at).toLocaleDateString()}
            </Badge>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full text-white hover:bg-white/20 hover:text-white"
          onClick={() => setDismissed(prev => ({ ...prev, [currentBroadcast.id]: true }))}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  );
};

// Adding Badge component here as it's used and might not be imported at the top
import { Badge } from '@/components/ui/badge';
