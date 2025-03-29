
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface CommunityOrderSectionProps {
  isCommunityOrder: boolean;
  onCommunityOrderChange: (value: boolean) => void;
  participants: string[];
  onParticipantsChange: (participants: string[]) => void;
}

const CommunityOrderSection: React.FC<CommunityOrderSectionProps> = ({
  isCommunityOrder,
  onCommunityOrderChange,
  participants,
  onParticipantsChange,
}) => {
  const [newParticipant, setNewParticipant] = useState('');
  
  const handleAddParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      const updatedParticipants = [...participants, newParticipant.trim()];
      onParticipantsChange(updatedParticipants);
      setNewParticipant('');
    }
  };
  
  const handleRemoveParticipant = (index: number) => {
    const updatedParticipants = [...participants];
    updatedParticipants.splice(index, 1);
    onParticipantsChange(updatedParticipants);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="community-order"
          checked={isCommunityOrder}
          onChange={(e) => onCommunityOrderChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-mealstock-lightGreen focus:ring-mealstock-lightGreen"
        />
        <Label htmlFor="community-order" className="text-sm font-medium text-gray-700">
          This is a community order
        </Label>
      </div>
      
      {isCommunityOrder && (
        <div className="pl-6 space-y-4">
          <p className="text-sm text-gray-600">
            Community orders allow you to split the order with friends or neighbors to save on delivery costs.
            Add the email addresses or phone numbers of participants below.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="participant" className="text-sm font-medium">
              Add Participants
            </Label>
            <div className="flex gap-2">
              <Input
                id="participant"
                placeholder="Email or phone number"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddParticipant}
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
          
          {participants.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Participants</Label>
              <div className="space-y-2">
                {participants.map((participant, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                  >
                    <span className="text-sm">{participant}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveParticipant(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-medium">How community orders work:</span> Each participant will receive an invitation to join this order. They can add items to the shared cart. Once all participants have confirmed, the order will be placed and delivered to a single address.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityOrderSection;
