
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { RealtimeChannel } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"

import { cn } from "@/lib/utils"

interface SyncedProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  syncId?: string;
  syncChannel?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// Synced Progress component that can receive realtime updates
const SyncedProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  SyncedProgressProps
>(({ className, value: initialValue, syncId, syncChannel, ...props }, ref) => {
  const [value, setValue] = React.useState(initialValue || 0);
  const channelRef = React.useRef<RealtimeChannel | null>(null);
  
  React.useEffect(() => {
    // Update from props when they change
    if (initialValue !== undefined) {
      setValue(initialValue);
    }
  }, [initialValue]);
  
  React.useEffect(() => {
    // If syncId and syncChannel are provided, subscribe to realtime updates
    if (syncId && syncChannel) {
      channelRef.current = supabase.channel(`progress:${syncChannel}:${syncId}`)
        .on('broadcast', { event: 'progress' }, (payload) => {
          if (payload.payload && typeof payload.payload.value === 'number') {
            setValue(payload.payload.value);
          }
        })
        .subscribe();
      
      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
        }
      };
    }
    return undefined;
  }, [syncId, syncChannel]);
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
SyncedProgress.displayName = "SyncedProgress";

export { Progress, SyncedProgress }
