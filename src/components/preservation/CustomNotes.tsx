
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { saveCustomNote } from '@/services/preservationDbService';
import { Edit, Save } from 'lucide-react';

interface CustomNotesProps {
  guideId: string;
  initialNotes?: string;
  onNotesUpdated: (notes: string) => void;
}

const CustomNotes: React.FC<CustomNotesProps> = ({ guideId, initialNotes = '', onNotesUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    try {
      setIsSaving(true);
      await saveCustomNote(guideId, notes);
      onNotesUpdated(notes);
      setIsEditing(false);
      toast({
        title: "Notes saved",
        description: "Your custom notes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving notes",
        description: "There was a problem saving your notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing && !notes) {
    return (
      <div className="my-4">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Add Custom Notes
        </Button>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="my-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Your Custom Notes</h4>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-3 bg-muted/40 rounded-md text-sm">
          {notes || "No custom notes added yet."}
        </div>
      </div>
    );
  }

  return (
    <div className="my-4">
      <h4 className="text-sm font-medium mb-2">Add Your Custom Notes</h4>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add your own notes for future reference..."
        className="mb-2"
      />
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setNotes(initialNotes);
            setIsEditing(false);
          }}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSaveNotes}
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Notes
        </Button>
      </div>
    </div>
  );
};

export default CustomNotes;
