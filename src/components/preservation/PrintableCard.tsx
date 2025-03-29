
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { MealPreservationGuide, PreservationMethod } from '@/types/preservationTypes';

interface PrintableCardProps {
  guide: MealPreservationGuide;
  selectedMethod: PreservationMethod;
}

const PrintableCard: React.FC<PrintableCardProps> = ({ guide, selectedMethod }) => {
  const printInstructions = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // Get the matching preservation instruction
    const preservationInstruction = guide.preservationInstructions.find(
      instr => instr.method === selectedMethod
    );
    
    // Get reheating instruction (just use the first one for simplicity)
    const reheatingInstruction = guide.reheatingInstructions[0];
    
    // Create HTML content for the print window
    printWindow.document.write(`
      <html>
        <head>
          <title>Meal Preservation Guide - ${guide.mealName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .card { border: 1px solid #ccc; padding: 15px; max-width: 400px; margin: 0 auto; }
            .header { display: flex; margin-bottom: 15px; }
            .image { width: 80px; height: 80px; object-fit: cover; margin-right: 15px; }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .method { font-size: 14px; color: #666; margin-bottom: 15px; }
            .section-title { font-size: 14px; font-weight: bold; margin-bottom: 5px; }
            .instructions { margin-bottom: 15px; }
            .instruction { font-size: 12px; margin-bottom: 3px; }
            .qr-code { width: 100px; height: 100px; margin: 10px auto; display: block; }
            .footer { font-size: 10px; color: #999; text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <img src="${guide.imageUrl}" class="image" alt="${guide.mealName}" />
              <div>
                <div class="title">${guide.mealName}</div>
                <div class="method">Storage Method: ${selectedMethod}</div>
              </div>
            </div>
            
            ${preservationInstruction ? `
            <div class="section-title">Storage Instructions:</div>
            <div class="instructions">
              <div class="instruction">Duration: ${preservationInstruction.duration.value} ${preservationInstruction.duration.unit}</div>
              ${preservationInstruction.tips.map(tip => `<div class="instruction">• ${tip}</div>`).join('')}
            </div>` : ''}
            
            ${reheatingInstruction ? `
            <div class="section-title">Reheating Instructions (${reheatingInstruction.method}):</div>
            <div class="instructions">
              <div class="instruction">Duration: ${reheatingInstruction.duration.value} ${reheatingInstruction.duration.unit}</div>
              ${reheatingInstruction.steps.map((step, i) => `<div class="instruction">${i+1}. ${step}</div>`).join('')}
            </div>` : ''}
            
            ${guide.customNotes ? `
            <div class="section-title">Custom Notes:</div>
            <div class="instructions">
              <div class="instruction">${guide.customNotes}</div>
            </div>` : ''}
            
            <div class="section-title">Scan for Audio Instructions:</div>
            <img src="${guide.qrCodeUrl}" class="qr-code" alt="QR Code for Audio Instructions" />
            
            <div class="footer">
              Generated on ${new Date().toLocaleDateString()}
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  
  return (
    <div className="mt-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={printInstructions}
      >
        <Printer className="h-4 w-4 mr-2" />
        Print Instruction Card
      </Button>
    </div>
  );
};

export default PrintableCard;
