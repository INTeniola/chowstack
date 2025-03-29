
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddressForm from '@/components/checkout/AddressForm';
import DeliveryOptions from '@/components/checkout/DeliveryOptions';
import PaymentMethods from '@/components/checkout/PaymentMethods';
import OrderSummary from '@/components/checkout/OrderSummary';
import CommunityOrderSection from '@/components/checkout/CommunityOrderSection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import {
  DeliveryAddress,
  PaymentMethod,
  Order,
  OrderSummary as OrderSummaryType,
  DeliverySchedule,
  DeliveryOption,
} from '@/types/checkoutTypes';
import { mockDeliveryOptions } from '@/utils/mockData/paymentGateways';

// This would come from a cart context or state management in a real app
const mockCartItems = [
  {
    id: '1',
    name: 'Jollof Rice Pack',
    price: 2500,
    quantity: 2,
    image: '/placeholder.svg',
    vendorId: 'v1',
    vendorName: 'Lagos Kitchen',
  },
  {
    id: '2',
    name: 'Egusi Soup with Pounded Yam',
    price: 3000,
    quantity: 1,
    image: '/placeholder.svg',
    vendorId: 'v2',
    vendorName: 'Naija Delicacies',
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState<DeliveryAddress | null>(null);
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOption>(mockDeliveryOptions[0]);
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 2:00 PM');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [isCommunityOrder, setIsCommunityOrder] = useState(false);
  const [communityParticipants, setCommunityParticipants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate order summary
  const calculateOrderSummary = (): OrderSummaryType => {
    const subtotal = mockCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = selectedDeliveryOption.price;
    // Assuming bulk discount of 10% for orders over ₦10,000
    const discount = subtotal > 10000 ? subtotal * 0.1 : 0;
    const tax = (subtotal - discount) * 0.075; // 7.5% VAT in Nigeria
    const total = subtotal + deliveryFee + tax - discount;
    const savings = discount; // Simple savings calculation
    
    return {
      subtotal,
      deliveryFee,
      discount,
      tax,
      total,
      savings,
    };
  };
  
  const handleAddressUpdate = (newAddress: DeliveryAddress) => {
    setAddress(newAddress);
    setIsAddressVerified(newAddress.isVerified);
  };
  
  const handleDeliveryOptionChange = (option: DeliveryOption) => {
    setSelectedDeliveryOption(option);
  };
  
  const handleDateChange = (date: Date) => {
    setDeliveryDate(date);
  };
  
  const handleTimeSlotChange = (slot: string) => {
    setTimeSlot(slot);
  };
  
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };
  
  const handleRecurringChange = (isRecurring: boolean) => {
    setIsRecurring(isRecurring);
  };
  
  const handleRecurringFrequencyChange = (frequency: 'weekly' | 'biweekly' | 'monthly') => {
    setRecurringFrequency(frequency);
  };
  
  const handleCommunityOrderChange = (isCommunity: boolean) => {
    setIsCommunityOrder(isCommunity);
  };
  
  const handleParticipantsChange = (participants: string[]) => {
    setCommunityParticipants(participants);
  };
  
  const handlePlaceOrder = async () => {
    if (!address) {
      toast({
        title: "Address Required",
        description: "Please add a delivery address to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isAddressVerified) {
      toast({
        title: "Address Verification Required",
        description: "Please verify your address before placing your order.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Create delivery schedule
    const deliverySchedule: DeliverySchedule = {
      items: mockCartItems,
      date: deliveryDate,
      timeSlot,
      address,
      deliveryOption: selectedDeliveryOption,
    };
    
    // Create order object
    const order: Order = {
      userId: 'user123', // This would come from auth
      items: mockCartItems,
      deliverySchedules: [deliverySchedule],
      paymentMethod,
      orderSummary: calculateOrderSummary(),
      status: 'pending',
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      recurringEndDate: isRecurring ? new Date(new Date().setMonth(new Date().getMonth() + 3)) : undefined, // Default 3 months
      createdAt: new Date(),
    };
    
    try {
      // In a real app, this would be an API call
      console.log('Placing order:', order);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful order placement
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed. Redirecting to confirmation page...",
      });
      
      // Redirect to order confirmation page
      setTimeout(() => {
        navigate('/order-confirmation');
      }, 1500);
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate the summary anytime relevant state changes
  const orderSummary = calculateOrderSummary();
  
  return (
    <div className="min-h-screen flex flex-col bg-mealstock-cream">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-mealstock-brown mb-6">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-mealstock-brown mb-4">Delivery Address</h2>
                <AddressForm onAddressUpdate={handleAddressUpdate} />
              </div>
              
              {/* Delivery Options Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-mealstock-brown mb-4">Delivery Options</h2>
                <DeliveryOptions 
                  options={mockDeliveryOptions}
                  selectedOption={selectedDeliveryOption}
                  onOptionChange={handleDeliveryOptionChange}
                  deliveryDate={deliveryDate}
                  onDateChange={handleDateChange}
                  timeSlot={timeSlot}
                  onTimeSlotChange={handleTimeSlotChange}
                />
              </div>
              
              {/* Recurring Orders */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-mealstock-brown mb-4">Recurring Orders</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={isRecurring}
                      onChange={(e) => handleRecurringChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-mealstock-lightGreen focus:ring-mealstock-lightGreen"
                    />
                    <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                      Make this a recurring order
                    </label>
                  </div>
                  
                  {isRecurring && (
                    <div className="pl-6 space-y-3">
                      <p className="text-sm text-gray-600">
                        Your order will be automatically placed at the selected frequency with the same items.
                      </p>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Frequency</label>
                        <div className="flex flex-wrap gap-2">
                          {['weekly', 'biweekly', 'monthly'].map((freq) => (
                            <button
                              key={freq}
                              type="button"
                              className={`px-4 py-2 text-sm rounded-md ${
                                recurringFrequency === freq
                                  ? 'bg-mealstock-lightGreen text-white'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                              onClick={() => handleRecurringFrequencyChange(freq as any)}
                            >
                              {freq.charAt(0).toUpperCase() + freq.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Community Order Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-mealstock-brown mb-4">Community Order</h2>
                <CommunityOrderSection 
                  isCommunityOrder={isCommunityOrder}
                  onCommunityOrderChange={handleCommunityOrderChange}
                  participants={communityParticipants}
                  onParticipantsChange={handleParticipantsChange}
                />
              </div>
              
              {/* Payment Methods */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-mealstock-brown mb-4">Payment Method</h2>
                <PaymentMethods 
                  selectedMethod={paymentMethod}
                  onMethodChange={handlePaymentMethodChange}
                />
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <OrderSummary 
                  summary={orderSummary}
                  items={mockCartItems}
                />
                
                <Button
                  onClick={handlePlaceOrder}
                  disabled={!address || !isAddressVerified || isLoading}
                  className="w-full mt-6"
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </Button>
                
                <p className="text-xs text-gray-500 mt-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
