
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface SavePlanModalProps {
  onSave: (planName: string) => void;
  onCancel: () => void;
  open: boolean;
  isSaving?: boolean;
}

const SavePlanModal: React.FC<SavePlanModalProps> = ({ onSave, onCancel, open, isSaving = false }) => {
  const [planName, setPlanName] = useState('');
  const [internalSaving, setInternalSaving] = useState(false);
  
  // Reset form state when modal opens/closes
  useEffect(() => {
    if (open) {
      setPlanName('');
      setInternalSaving(false);
    }
  }, [open]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!planName.trim()) {
      return; // Don't submit if name is empty
    }
    
    setInternalSaving(true);
    
    // Call the parent's onSave method
    onSave(planName);
  };

  // Use either the internal or external saving state
  const isSubmitting = internalSaving || isSaving;
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open && !isSubmitting) {
        onCancel();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Meal Plan</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="plan-name">Plan Name</Label>
            <Input 
              id="plan-name" 
              value={planName} 
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="My Meal Plan"
              className="w-full"
              autoFocus
              disabled={isSubmitting}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !planName.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Plan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SavePlanModal;
