
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PaymentMethod } from '@/types/checkoutTypes';
import { mockPaymentGateways } from '@/utils/mockData/paymentGateways';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  // Filter out unavailable payment methods
  const availableGateways = mockPaymentGateways.filter(gateway => gateway.isAvailable);
  
  return (
    <div className="space-y-6">
      <RadioGroup 
        value={selectedMethod} 
        onValueChange={(value) => onMethodChange(value as PaymentMethod)}
        className="space-y-4"
      >
        {availableGateways.map((gateway) => (
          <div key={gateway.id} className="flex items-start space-x-3">
            <RadioGroupItem value={gateway.type} id={`payment-${gateway.id}`} className="mt-1" />
            <div className="grid gap-1.5 flex-1">
              <Label 
                htmlFor={`payment-${gateway.id}`}
                className="font-medium cursor-pointer flex items-center gap-2"
              >
                {gateway.name}
                {/* In a real app, this would be an actual image */}
                <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-xs">Icon</div>
              </Label>
              <p className="text-sm text-gray-500">{gateway.description}</p>
              
              {/* Method-specific forms */}
              {selectedMethod === gateway.type && (
                <div className="mt-3 pl-1">
                  {gateway.type === 'paystack' && <PaystackForm />}
                  {gateway.type === 'flutterwave' && <FlutterwaveForm />}
                  {gateway.type === 'bank_transfer' && <BankTransferInfo />}
                  {gateway.type === 'mobile_money' && <MobileMoneyForm />}
                  {gateway.type === 'cash_on_delivery' && <CashOnDeliveryInfo />}
                </div>
              )}
              
              {gateway.processingFee > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Processing fee: {gateway.processingFee}%
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <p className="text-sm text-gray-600">
          All payment information is encrypted and secure. We do not store your card details.
        </p>
      </div>
    </div>
  );
};

// Payment method-specific forms

const PaystackForm = () => (
  <div className="space-y-3">
    <div className="space-y-1">
      <Label htmlFor="card-number">Card Number</Label>
      <Input id="card-number" placeholder="1234 5678 9012 3456" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label htmlFor="expiry">Expiry Date</Label>
        <Input id="expiry" placeholder="MM/YY" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="cvv">CVV</Label>
        <Input id="cvv" placeholder="123" type="password" />
      </div>
    </div>
  </div>
);

const FlutterwaveForm = () => (
  <div className="space-y-3">
    <p className="text-sm">You will be redirected to Flutterwave to complete your payment securely.</p>
  </div>
);

const BankTransferInfo = () => (
  <div className="space-y-3">
    <div className="bg-gray-50 p-3 rounded-md">
      <p className="text-sm font-medium">Bank Details:</p>
      <div className="text-sm space-y-1 mt-2">
        <p>Bank Name: MealStock Nigeria Ltd</p>
        <p>Account Number: 0123456789</p>
        <p>Bank: First Bank of Nigeria</p>
        <p>Reference: Your order ID will be provided after order placement</p>
      </div>
    </div>
    <p className="text-xs text-gray-500">
      Your order will be processed once payment is confirmed (typically within 24 hours).
    </p>
  </div>
);

const MobileMoneyForm = () => (
  <div className="space-y-3">
    <div className="space-y-1">
      <Label htmlFor="phone-number">Phone Number</Label>
      <Input id="phone-number" placeholder="e.g., 08012345678" />
    </div>
    <div className="space-y-1">
      <Label htmlFor="provider">Provider</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Select Provider
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-50"><path d="m6 9 6 6 6-6"/></svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="p-1">
            <Button variant="ghost" className="w-full justify-start">MTN Mobile Money</Button>
            <Button variant="ghost" className="w-full justify-start">Airtel Money</Button>
            <Button variant="ghost" className="w-full justify-start">Glo Mobile Money</Button>
            <Button variant="ghost" className="w-full justify-start">9Mobile Money</Button>
            <Button variant="ghost" className="w-full justify-start">Paga</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
);

const CashOnDeliveryInfo = () => (
  <div className="space-y-3">
    <p className="text-sm">
      Pay in cash when your order is delivered. Please ensure you have the exact amount, as our delivery personnel may not have change.
    </p>
    <p className="text-xs text-orange-600 font-medium">
      Note: For orders above ₦20,000, a deposit of 20% may be required to confirm your order.
    </p>
  </div>
);

export default PaymentMethods;
