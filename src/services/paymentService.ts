
// Integration with Nigerian payment gateways

import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/types/checkoutTypes';
import { trackApiFailure, trackPerformance } from '@/lib/sentry';
import { sendNotification } from './notificationService';

// Payment gateway options
export enum PaymentGateway {
  PAYSTACK = 'paystack',
  FLUTTERWAVE = 'flutterwave',
  BANK_TRANSFER = 'bank_transfer',
  MOBILE_MONEY = 'mobile_money',
  CASH_ON_DELIVERY = 'cash_on_delivery'
}

// Payment status
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

// Payment request interface
export interface PaymentRequest {
  amount: number;
  currency: string;
  email: string;
  reference?: string;
  metadata?: Record<string, any>;
  callback_url?: string;
  orderItems?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping?: {
    address: string;
    city: string;
    state: string;
    postalCode?: string;
    country?: string;
  };
  customer?: {
    name: string;
    phone?: string;
  };
}

// Payment response interface
export interface PaymentResponse {
  success: boolean;
  reference: string;
  message: string;
  redirectUrl?: string;
  status: PaymentStatus;
  gatewayResponse?: any;
}

// Initialize payment with Paystack
export const initiatePaystackPayment = async (
  paymentRequest: PaymentRequest
): Promise<PaymentResponse> => {
  const startTime = performance.now();
  
  try {
    const { data, error } = await supabase.functions.invoke('payment-paystack-initialize', {
      body: paymentRequest
    });
    
    if (error) throw error;
    
    const endTime = performance.now();
    trackPerformance('payment-paystack-initialize', endTime - startTime, true, { 
      amount: paymentRequest.amount 
    });
    
    return data;
  } catch (error) {
    const endTime = performance.now();
    trackPerformance('payment-paystack-initialize', endTime - startTime, false, { 
      amount: paymentRequest.amount 
    });
    trackApiFailure('paystack', 'initialize', error, paymentRequest);
    
    console.error('Error initializing Paystack payment:', error);
    return {
      success: false,
      reference: paymentRequest.reference || '',
      message: 'Failed to initialize payment. Please try again.',
      status: PaymentStatus.FAILED
    };
  }
};

// Initialize payment with Flutterwave
export const initiateFlutterwavePayment = async (
  paymentRequest: PaymentRequest
): Promise<PaymentResponse> => {
  const startTime = performance.now();
  
  try {
    const { data, error } = await supabase.functions.invoke('payment-flutterwave-initialize', {
      body: paymentRequest
    });
    
    if (error) throw error;
    
    const endTime = performance.now();
    trackPerformance('payment-flutterwave-initialize', endTime - startTime, true, { 
      amount: paymentRequest.amount 
    });
    
    return data;
  } catch (error) {
    const endTime = performance.now();
    trackPerformance('payment-flutterwave-initialize', endTime - startTime, false, { 
      amount: paymentRequest.amount 
    });
    trackApiFailure('flutterwave', 'initialize', error, paymentRequest);
    
    console.error('Error initializing Flutterwave payment:', error);
    return {
      success: false,
      reference: paymentRequest.reference || '',
      message: 'Failed to initialize payment. Please try again.',
      status: PaymentStatus.FAILED
    };
  }
};

// Process bank transfer payment
export const processBankTransferPayment = async (
  paymentRequest: PaymentRequest
): Promise<PaymentResponse> => {
  // For bank transfers, we generate instructions and wait for manual confirmation
  const reference = paymentRequest.reference || `BTR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  try {
    // Store the pending payment in the database
    const { error } = await supabase.from('pending_payments').insert({
      reference,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      customer_email: paymentRequest.email,
      payment_method: PaymentGateway.BANK_TRANSFER,
      status: PaymentStatus.PENDING,
      created_at: new Date().toISOString(),
      metadata: paymentRequest.metadata
    });
    
    if (error) throw error;
    
    // Return bank transfer instructions
    return {
      success: true,
      reference,
      message: 'Please complete your bank transfer using the provided details',
      status: PaymentStatus.PENDING,
      gatewayResponse: {
        accountName: 'MealStock Nigeria Ltd',
        accountNumber: '0123456789',
        bankName: 'First Bank of Nigeria',
        transferReference: reference
      }
    };
  } catch (error) {
    trackApiFailure('bank-transfer', 'process', error, paymentRequest);
    console.error('Error processing bank transfer:', error);
    
    return {
      success: false,
      reference,
      message: 'Failed to process bank transfer request. Please try again.',
      status: PaymentStatus.FAILED
    };
  }
};

// Process mobile money payment
export const processMobileMoneyPayment = async (
  paymentRequest: PaymentRequest & { 
    mobile: { 
      number: string; 
      provider: string; 
    } 
  }
): Promise<PaymentResponse> => {
  const startTime = performance.now();
  
  try {
    const { data, error } = await supabase.functions.invoke('payment-mobile-money', {
      body: paymentRequest
    });
    
    if (error) throw error;
    
    const endTime = performance.now();
    trackPerformance('payment-mobile-money', endTime - startTime, true, { 
      amount: paymentRequest.amount,
      provider: paymentRequest.mobile.provider
    });
    
    return data;
  } catch (error) {
    const endTime = performance.now();
    trackPerformance('payment-mobile-money', endTime - startTime, false, { 
      amount: paymentRequest.amount,
      provider: paymentRequest.mobile.provider
    });
    trackApiFailure('mobile-money', 'process', error, paymentRequest);
    
    console.error('Error processing mobile money payment:', error);
    return {
      success: false,
      reference: paymentRequest.reference || '',
      message: 'Failed to process mobile money payment. Please try again.',
      status: PaymentStatus.FAILED
    };
  }
};

// Process cash on delivery payment
export const processCashOnDeliveryPayment = async (
  paymentRequest: PaymentRequest
): Promise<PaymentResponse> => {
  const reference = paymentRequest.reference || `COD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  try {
    // Store the pending payment in the database
    const { error } = await supabase.from('pending_payments').insert({
      reference,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      customer_email: paymentRequest.email,
      payment_method: PaymentGateway.CASH_ON_DELIVERY,
      status: PaymentStatus.PENDING,
      created_at: new Date().toISOString(),
      metadata: paymentRequest.metadata
    });
    
    if (error) throw error;
    
    return {
      success: true,
      reference,
      message: 'Your cash on delivery order has been confirmed',
      status: PaymentStatus.PENDING
    };
  } catch (error) {
    trackApiFailure('cash-on-delivery', 'process', error, paymentRequest);
    console.error('Error processing cash on delivery:', error);
    
    return {
      success: false,
      reference,
      message: 'Failed to process cash on delivery request. Please try again.',
      status: PaymentStatus.FAILED
    };
  }
};

// Process payment based on selected method
export const processPayment = async (
  paymentRequest: PaymentRequest & { 
    paymentMethod: PaymentMethod;
    mobile?: { 
      number: string; 
      provider: string; 
    };
  }
): Promise<PaymentResponse> => {
  try {
    let response: PaymentResponse;
    
    switch (paymentRequest.paymentMethod) {
      case PaymentGateway.PAYSTACK:
        response = await initiatePaystackPayment(paymentRequest);
        break;
      case PaymentGateway.FLUTTERWAVE:
        response = await initiateFlutterwavePayment(paymentRequest);
        break;
      case PaymentGateway.MOBILE_MONEY:
        if (!paymentRequest.mobile) {
          throw new Error('Mobile details are required for mobile money payments');
        }
        response = await processMobileMoneyPayment({
          ...paymentRequest,
          mobile: paymentRequest.mobile
        });
        break;
      case PaymentGateway.BANK_TRANSFER:
        response = await processBankTransferPayment(paymentRequest);
        break;
      case PaymentGateway.CASH_ON_DELIVERY:
        response = await processCashOnDeliveryPayment(paymentRequest);
        break;
      default:
        throw new Error('Unsupported payment method');
    }
    
    // Notify the user of the payment status
    if (response.success) {
      sendNotification({
        type: 'orderStatus',
        title: 'Payment Initiated',
        message: `Your payment (${response.reference}) has been initiated. ${response.message}`,
        recipientId: paymentRequest.metadata?.userId || '',
        orderId: paymentRequest.metadata?.orderId
      });
    } else {
      sendNotification({
        type: 'orderStatus',
        title: 'Payment Failed',
        message: `There was an issue with your payment: ${response.message}`,
        recipientId: paymentRequest.metadata?.userId || '',
        orderId: paymentRequest.metadata?.orderId
      });
    }
    
    return response;
  } catch (error) {
    trackApiFailure('payment', 'process', error, paymentRequest);
    console.error('Error processing payment:', error);
    
    return {
      success: false,
      reference: paymentRequest.reference || '',
      message: 'An error occurred while processing your payment. Please try again.',
      status: PaymentStatus.FAILED
    };
  }
};

// Verify payment status
export const verifyPayment = async (
  reference: string,
  gateway: PaymentGateway
): Promise<PaymentResponse> => {
  const startTime = performance.now();
  
  try {
    const { data, error } = await supabase.functions.invoke('payment-verify', {
      body: {
        reference,
        gateway
      }
    });
    
    if (error) throw error;
    
    const endTime = performance.now();
    trackPerformance('payment-verify', endTime - startTime, true, { gateway });
    
    return data;
  } catch (error) {
    const endTime = performance.now();
    trackPerformance('payment-verify', endTime - startTime, false, { gateway });
    trackApiFailure('payment', 'verify', error, { reference, gateway });
    
    console.error('Error verifying payment:', error);
    return {
      success: false,
      reference,
      message: 'Failed to verify payment status. Please contact support.',
      status: PaymentStatus.PENDING
    };
  }
};
