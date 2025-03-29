
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MealPackage } from '@/components/MealPackageCard';
import { generateMealPreservationGuide } from '@/services/preservationService';
import { PreservationMethod } from '@/types/preservationTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';
import FreshnessTimeline from './FreshnessTimeline';
import PreservationMethodSelector from './PreservationMethodSelector';
import ReheatingInstructions from './ReheatingInstructions';
import CustomNotes from './CustomNotes';
import VoiceInstructions from './VoiceInstructions';
import PrintableCard from './PrintableCard';

interface PreservationGuideProps {
  meal: MealPackage;
}

const PreservationGuide: React.FC<PreservationGuideProps> = ({ meal }) => {
  // Query to fetch preservation guide
  const { data: guide, isLoading, error } = useQuery({
    queryKey: ['preservationGuide', meal.id],
    queryFn: () => generateMealPreservationGuide(meal),
  });
  
  // State for selected preservation method
  const [selectedMethod, setSelectedMethod] = useState<PreservationMethod>('refrigerate');
  
  // Update selected method when guide loads
  useEffect(() => {
    if (guide && guide.preservationInstructions.length > 0) {
      setSelectedMethod(guide.preservationInstructions[0].method);
    }
  }, [guide]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Package className="h-5 w-5 mr-2 text-muted-foreground" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
          <div className="space-y-3 mt-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !guide) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Preservation Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Could not load preservation instructions for this meal.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Extract available preservation methods
  const availableMethods = guide.preservationInstructions.map(instr => instr.method);
  
  // Get the current preservation instruction based on selected method
  const currentInstruction = guide.preservationInstructions.find(
    instr => instr.method === selectedMethod
  );
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Package className="h-5 w-5 mr-2 text-muted-foreground" />
          Preservation Guide
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
            <img 
              src={meal.imageUrl} 
              alt={meal.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{meal.name}</h3>
            <p className="text-sm text-muted-foreground">
              {meal.cuisineType[0]} • {meal.mealCount} meals
            </p>
          </div>
        </div>
        
        <FreshnessTimeline 
          guide={guide} 
          selectedMethod={selectedMethod} 
        />
        
        <Separator className="my-4" />
        
        <PreservationMethodSelector 
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
          availableMethods={availableMethods}
        />
        
        {currentInstruction && (
          <div className="my-4">
            <h4 className="text-sm font-medium mb-2">Storage Tips</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {currentInstruction.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        
        <Separator className="my-4" />
        
        <ReheatingInstructions 
          instructions={guide.reheatingInstructions} 
        />
        
        <Separator className="my-4" />
        
        <VoiceInstructions 
          audioUrl={guide.audioInstructionUrl || ''}
          qrCodeUrl={guide.qrCodeUrl || ''}
        />
        
        <Separator className="my-4" />
        
        <CustomNotes 
          guideId={guide.id}
          initialNotes={guide.customNotes}
          onNotesUpdated={(notes) => {
            guide.customNotes = notes;
          }}
        />
        
        <PrintableCard 
          guide={guide}
          selectedMethod={selectedMethod}
        />
      </CardContent>
    </Card>
  );
};

export default PreservationGuide;
