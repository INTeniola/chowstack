
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DeliveryOption } from '@/types/checkoutTypes';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface DeliveryOptionsProps {
  options: DeliveryOption[];
  selectedOption: DeliveryOption;
  onOptionChange: (option: DeliveryOption) => void;
  deliveryDate: Date;
  onDateChange: (date: Date) => void;
  timeSlot: string;
  onTimeSlotChange: (slot: string) => void;
}

const timeSlots = [
  '8:00 AM - 12:00 PM',
  '10:00 AM - 2:00 PM',
  '12:00 PM - 4:00 PM',
  '2:00 PM - 6:00 PM',
  '4:00 PM - 8:00 PM',
];

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  options,
  selectedOption,
  onOptionChange,
  deliveryDate,
  onDateChange,
  timeSlot,
  onTimeSlotChange,
}) => {
  // Calculate the earliest possible delivery date based on the selected option
  const getEarliestDeliveryDate = () => {
    return addDays(new Date(), selectedOption.estimatedDays > 0 ? selectedOption.estimatedDays : 1);
  };
  
  // Disable dates that are too soon for the selected delivery option
  const disableDate = (date: Date) => {
    const earliestDate = getEarliestDeliveryDate();
    return date < earliestDate;
  };
  
  // Format the delivery date
  const formattedDate = format(deliveryDate, 'MMMM d, yyyy');
  
  return (
    <div className="space-y-6">
      {/* Delivery Methods */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-mealstock-brown">Delivery Method</h3>
        
        <RadioGroup 
          value={selectedOption.id} 
          onValueChange={(value) => {
            const option = options.find(opt => opt.id === value);
            if (option) {
              onOptionChange(option);
              
              // Reset delivery date if it's now invalid
              const earliestDate = addDays(
                new Date(), 
                option.estimatedDays > 0 ? option.estimatedDays : 1
              );
              if (deliveryDate < earliestDate) {
                onDateChange(earliestDate);
              }
            }
          }}
          className="space-y-3"
        >
          {options.map((option) => (
            <div key={option.id} className="flex items-start space-x-3">
              <RadioGroupItem value={option.id} id={`delivery-${option.id}`} className="mt-1" />
              <div className="grid gap-1.5">
                <Label 
                  htmlFor={`delivery-${option.id}`}
                  className="font-medium cursor-pointer"
                >
                  {option.name}
                </Label>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">{option.description}</p>
                  <p className="text-sm font-medium">₦{option.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Delivery Date and Time Slot */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-medium text-mealstock-brown">Delivery Date & Time</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="delivery-date" className="text-sm">Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="delivery-date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deliveryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? formattedDate : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={(date) => date && onDateChange(date)}
                  disabled={disableDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {selectedOption.estimatedDays > 0 && (
              <p className="text-xs text-gray-500">
                The earliest delivery date is {format(getEarliestDeliveryDate(), 'MMMM d, yyyy')} based on your selection.
              </p>
            )}
          </div>
          
          {/* Time Slot Selection */}
          <div className="space-y-2">
            <Label htmlFor="time-slot" className="text-sm">Delivery Time Slot</Label>
            <RadioGroup 
              value={timeSlot} 
              onValueChange={onTimeSlotChange}
              className="space-y-2"
            >
              {timeSlots.map((slot) => (
                <div key={slot} className="flex items-center space-x-2">
                  <RadioGroupItem value={slot} id={`time-${slot}`} />
                  <Label htmlFor={`time-${slot}`} className="cursor-pointer">
                    {slot}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOptions;
