
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface SavePlanModalProps {
  onSave: (planName: string) => void;
  onCancel: () => void;
  open: boolean;
}

const SavePlanModal: React.FC<SavePlanModalProps> = ({ onSave, onCancel, open }) => {
  const [planName, setPlanName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!planName.trim()) {
      return; // Don't submit if name is empty
    }
    
    setIsSaving(true);
    
    try {
      onSave(planName);
      // Reset form and state after saving
      setPlanName('');
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open && !isSaving) {
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
              disabled={isSaving}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !planName.trim()}>
              {isSaving ? (
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
