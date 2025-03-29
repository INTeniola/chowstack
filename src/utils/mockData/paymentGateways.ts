
import { PaymentGateway, DeliveryOption } from '@/types/checkoutTypes';

export const mockPaymentGateways: PaymentGateway[] = [
  {
    id: '1',
    name: 'Paystack',
    type: 'paystack',
    icon: '/payment-icons/paystack.svg',
    description: 'Secure online payments with Paystack',
    processingFee: 1.5,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Flutterwave',
    type: 'flutterwave',
    icon: '/payment-icons/flutterwave.svg',
    description: 'Fast and secure payments with Flutterwave',
    processingFee: 1.4,
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Bank Transfer',
    type: 'bank_transfer',
    icon: '/payment-icons/bank.svg',
    description: 'Pay via bank transfer to our account',
    processingFee: 0,
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Mobile Money',
    type: 'mobile_money',
    icon: '/payment-icons/mobile-money.svg',
    description: 'Pay with your mobile money wallet',
    processingFee: 1.0,
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Cash on Delivery',
    type: 'cash_on_delivery',
    icon: '/payment-icons/cash.svg',
    description: 'Pay when your order is delivered',
    processingFee: 0,
    isAvailable: true,
  },
];

export const mockDeliveryOptions: DeliveryOption[] = [
  {
    id: '1',
    name: 'Standard Delivery',
    description: '3-5 business days',
    estimatedDays: 4,
    price: 1500,
  },
  {
    id: '2',
    name: 'Express Delivery',
    description: '1-2 business days',
    estimatedDays: 1,
    price: 3000,
  },
  {
    id: '3',
    name: 'Scheduled Delivery',
    description: 'Choose your preferred date and time',
    estimatedDays: 0,
    price: 2000,
  },
];
