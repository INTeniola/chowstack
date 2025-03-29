
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { MapPin, Loader2, CheckCircle } from 'lucide-react';
import { DeliveryAddress } from '@/types/checkoutTypes';

interface AddressFormProps {
  onAddressUpdate: (address: DeliveryAddress) => void;
  defaultAddress?: DeliveryAddress;
}

const AddressForm: React.FC<AddressFormProps> = ({ onAddressUpdate, defaultAddress }) => {
  const [address, setAddress] = useState<DeliveryAddress>(defaultAddress || {
    street: '',
    city: '',
    state: 'Lagos',
    zipCode: '',
    country: 'Nigeria',
    isVerified: false,
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [savedAsDefault, setSavedAsDefault] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value,
      isVerified: false,
    }));
  };

  const handleVerifyAddress = async () => {
    // Simulate address verification
    setIsVerifying(true);

    try {
      // In a real app, this would be an API call to verify the address
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful verification
      setAddress(prev => ({
        ...prev,
        isVerified: true,
      }));

      onAddressUpdate({
        ...address,
        isVerified: true,
      });

      toast.success("Address verified successfully");
    } catch (error) {
      toast.error("Could not verify address. Please check your input and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveAsDefault = (checked: boolean) => {
    setSavedAsDefault(checked);
    // In a real app, this would save the address to the user's profile
    if (checked) {
      toast.success("Address saved as default");
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // In a real app, this would be a reverse geocoding API call
            // For demo purposes, we'll simulate it with a timeout
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulate getting an address from coordinates
            const mockAddress: DeliveryAddress = {
              street: "123 Detected Street",
              city: "Lagos",
              state: "Lagos",
              zipCode: "100001",
              country: "Nigeria",
              isVerified: true,
              coordinates: {
                latitude,
                longitude
              }
            };
            
            setAddress(mockAddress);
            onAddressUpdate(mockAddress);
            
            toast.success("Location detected successfully");
          } catch (error) {
            toast.error("Could not determine your location. Please enter your address manually.");
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Please enable location access or enter your address manually.");
          setIsLoadingLocation(false);
        }
      );
    } else {
      toast.error("Your browser doesn't support geolocation. Please enter your address manually.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Delivery Address</h3>
        <Button 
          type="button" 
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={isLoadingLocation}
          className="flex items-center gap-2"
        >
          {isLoadingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          {isLoadingLocation ? "Detecting..." : "Use Current Location"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="street" className="text-sm font-medium">Street Address</label>
          <Textarea
            id="street"
            name="street"
            value={address.street}
            onChange={handleChange}
            placeholder="Enter your street address"
            className="min-h-[80px]"
          />
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">City</label>
            <Input
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="state" className="text-sm font-medium">State</label>
            <Input
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="zipCode" className="text-sm font-medium">Zip/Postal Code</label>
          <Input
            id="zipCode"
            name="zipCode"
            value={address.zipCode}
            onChange={handleChange}
            placeholder="Postal Code"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">Country</label>
          <Input
            id="country"
            name="country"
            value={address.country}
            onChange={handleChange}
            placeholder="Country"
            disabled
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="defaultAddress"
            checked={savedAsDefault}
            onCheckedChange={handleSaveAsDefault}
          />
          <label htmlFor="defaultAddress" className="text-sm cursor-pointer">
            Save as default address
          </label>
        </div>
        
        <Button
          type="button"
          onClick={handleVerifyAddress}
          disabled={!address.street || !address.city || !address.state || isVerifying}
          className="flex items-center gap-2"
        >
          {address.isVerified ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Verified
            </>
          ) : isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Address"
          )}
        </Button>
      </div>

      {address.isVerified && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          This address has been verified and is eligible for delivery.
        </div>
      )}
    </div>
  );
};

export default AddressForm;
