
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReheatingInstruction } from '@/types/preservationTypes';
import { Microwave, Flame, Fan } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReheatingInstructionsProps {
  instructions: ReheatingInstruction[];
}

const ReheatingInstructions: React.FC<ReheatingInstructionsProps> = ({ instructions }) => {
  if (!instructions || instructions.length === 0) {
    return <p className="text-sm text-muted-foreground">No reheating instructions available.</p>;
  }

  // Get available methods
  const availableMethods = instructions.map(instr => instr.method);

  return (
    <div className="my-4">
      <h4 className="text-sm font-medium mb-2">Reheating Instructions</h4>
      
      <Tabs defaultValue={availableMethods[0]}>
        <TabsList className="w-full">
          {availableMethods.includes('microwave') && (
            <TabsTrigger value="microwave" className="flex-1">
              <Microwave className="h-4 w-4 mr-2" />
              <span>Microwave</span>
            </TabsTrigger>
          )}
          
          {availableMethods.includes('oven') && (
            <TabsTrigger value="oven" className="flex-1">
              <Flame className="h-4 w-4 mr-2" />
              <span>Oven</span>
            </TabsTrigger>
          )}
          
          {availableMethods.includes('stovetop') && (
            <TabsTrigger value="stovetop" className="flex-1">
              <Flame className="h-4 w-4 mr-2" />
              <span>Stovetop</span>
            </TabsTrigger>
          )}
          
          {availableMethods.includes('air_fryer') && (
            <TabsTrigger value="air_fryer" className="flex-1">
              <Fan className="h-4 w-4 mr-2" />
              <span>Air Fryer</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        {instructions.map((instruction) => (
          <TabsContent key={instruction.method} value={instruction.method}>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium mb-2 flex justify-between">
                  <span>
                    {instruction.duration.value} {instruction.duration.unit}
                  </span>
                  {instruction.temperature && (
                    <span>{instruction.temperature}°C</span>
                  )}
                </div>
                
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  {instruction.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ReheatingInstructions;
