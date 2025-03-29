
import React from 'react';
import { Refrigerator, Snowflake, Home } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PreservationMethod } from '@/types/preservationTypes';

interface PreservationMethodSelectorProps {
  selectedMethod: PreservationMethod;
  onMethodChange: (method: PreservationMethod) => void;
  availableMethods: PreservationMethod[];
}

const PreservationMethodSelector: React.FC<PreservationMethodSelectorProps> = ({ 
  selectedMethod, 
  onMethodChange,
  availableMethods
}) => {
  // Generate tabs dynamically based on available methods
  return (
    <div className="my-4">
      <h4 className="text-sm font-medium mb-2">Storage Method</h4>
      <Tabs value={selectedMethod} onValueChange={(value) => onMethodChange(value as PreservationMethod)}>
        <TabsList className="w-full">
          {availableMethods.includes('refrigerate') && (
            <TabsTrigger value="refrigerate" className="flex-1">
              <Refrigerator className="h-4 w-4 mr-2" />
              <span>Refrigerate</span>
            </TabsTrigger>
          )}
          
          {availableMethods.includes('freeze') && (
            <TabsTrigger value="freeze" className="flex-1">
              <Snowflake className="h-4 w-4 mr-2" />
              <span>Freeze</span>
            </TabsTrigger>
          )}
          
          {availableMethods.includes('room_temperature') && (
            <TabsTrigger value="room_temperature" className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              <span>Room Temp</span>
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default PreservationMethodSelector;
