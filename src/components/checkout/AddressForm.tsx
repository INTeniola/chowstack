
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { DeliveryAddress } from '@/types/checkoutTypes';
import { Check } from 'lucide-react';

interface AddressFormProps {
  onAddressUpdate: (address: DeliveryAddress) => void;
  initialAddress?: DeliveryAddress;
}

// Nigerian states
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
  "Yobe", "Zamfara"
];

const AddressForm: React.FC<AddressFormProps> = ({ onAddressUpdate, initialAddress }) => {
  const [address, setAddress] = useState<DeliveryAddress>(
    initialAddress || {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      landmark: '',
      isVerified: false,
    }
  );
  
  const [isVerifying, setIsVerifying] = useState(false);
  
  const handleChange = (field: keyof DeliveryAddress, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
      isVerified: false, // Reset verification when address changes
    }));
  };
  
  const verifyAddress = async () => {
    // Check if required fields are filled
    if (!address.street || !address.city || !address.state) {
      toast({
        title: "Incomplete Address",
        description: "Please fill all required fields to verify your address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // In a real app, this would be an API call to a service like Google Maps or a local address verification service
      // For this example, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate a 90% chance of successful verification
      const isSuccessful = Math.random() < 0.9;
      
      if (isSuccessful) {
        const verifiedAddress: DeliveryAddress = {
          ...address,
          isVerified: true,
        };
        
        setAddress(verifiedAddress);
        onAddressUpdate(verifiedAddress);
        
        toast({
          title: "Address Verified",
          description: "Your delivery address has been verified successfully.",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "We couldn't verify your address. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error verifying address:', error);
      toast({
        title: "Verification Error",
        description: "There was an error verifying your address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.isVerified) {
      verifyAddress();
    } else {
      onAddressUpdate(address);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="street" className="font-medium">
          Street Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="street"
          placeholder="Enter your street address"
          value={address.street}
          onChange={(e) => handleChange('street', e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="font-medium">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            placeholder="Enter your city"
            value={address.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state" className="font-medium">
            State <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={address.state} 
            onValueChange={(value) => handleChange('state', value)}
          >
            <SelectTrigger id="state">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {nigerianStates.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="font-medium">
            Postal Code
          </Label>
          <Input
            id="postalCode"
            placeholder="Enter postal code (if available)"
            value={address.postalCode || ''}
            onChange={(e) => handleChange('postalCode', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="landmark" className="font-medium">
            Nearest Landmark
          </Label>
          <Input
            id="landmark"
            placeholder="E.g., Near First Bank"
            value={address.landmark || ''}
            onChange={(e) => handleChange('landmark', e.target.value)}
          />
        </div>
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit"
          disabled={isVerifying}
          variant={address.isVerified ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          {address.isVerified ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span>Address Verified</span>
            </>
          ) : (
            <span>{isVerifying ? "Verifying..." : "Verify Address"}</span>
          )}
        </Button>
        
        {address.isVerified && (
          <p className="text-sm text-green-600 mt-2">
            Your delivery address has been successfully verified.
          </p>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
