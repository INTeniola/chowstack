
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin } from 'lucide-react';

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (groupData: any) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ open, onClose, onSave }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [inviteOnly, setInviteOnly] = useState(false);
  const [tags, setTags] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would connect to Supabase in a real implementation
    const groupData = {
      name: groupName,
      description,
      location: useCurrentLocation ? 'Current Location' : location,
      visibility,
      inviteOnly,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    
    onSave(groupData);
    resetForm();
  };
  
  const resetForm = () => {
    setGroupName('');
    setDescription('');
    setLocation('');
    setVisibility('public');
    setInviteOnly(false);
    setTags('');
    setUseCurrentLocation(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">Create a New Group</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name <span className="text-red-500">*</span></Label>
              <Input
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter a name for your group"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this group about?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Location <span className="text-red-500">*</span></Label>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  id="use-current-location" 
                  checked={useCurrentLocation}
                  onCheckedChange={(checked) => {
                    setUseCurrentLocation(checked as boolean);
                  }}
                />
                <Label htmlFor="use-current-location" className="font-normal">
                  Use my current location
                </Label>
              </div>
              
              {!useCurrentLocation && (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    required={!useCurrentLocation}
                    disabled={useCurrentLocation}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Visibility</Label>
              <RadioGroup
                value={visibility}
                onValueChange={setVisibility}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="font-normal">
                    Public - Anyone can see and join
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="font-normal">
                    Private - Only visible to members
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="invite-only" 
                checked={inviteOnly}
                onCheckedChange={(checked) => {
                  setInviteOnly(checked as boolean);
                }}
              />
              <Label htmlFor="invite-only" className="font-normal">
                Invite only - New members must be approved
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., Neighborhood, Family, Office"
              />
              <p className="text-xs text-muted-foreground">
                Add tags to help others find your group
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
