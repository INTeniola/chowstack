
// Integration with SMS gateways for notifications

import { supabase } from '@/integrations/supabase/client';
import { trackApiFailure, trackPerformance } from '@/lib/sentry';

// SMS notification types
export enum SmsNotificationType {
  ORDER_CONFIRMATION = 'order_confirmation',
  DELIVERY_UPDATE = 'delivery_update',
  AUTHENTICATION = 'authentication',
  SPECIAL_OFFER = 'special_offer',
  PAYMENT_CONFIRMATION = 'payment_confirmation'
}

// SMS providers
export enum SmsProvider {
  TERMII = 'termii',
  TWILIO = 'twilio',
  AFRICASTALKING = 'africastalking',
  INFOBIP = 'infobip'
}

// SMS message request interface
export interface SmsRequest {
  to: string;
  message: string;
  type: SmsNotificationType;
  provider?: SmsProvider;
  reference?: string;
  senderId?: string;
  metadata?: Record<string, any>;
}

// SMS response interface
export interface SmsResponse {
  success: boolean;
  messageId?: string;
  reference?: string;
  message: string;
}

// Send SMS notification
export const sendSms = async (
  request: SmsRequest
): Promise<SmsResponse> => {
  const startTime = performance.now();
  const provider = request.provider || SmsProvider.TERMII; // Default provider
  
  try {
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        ...request,
        provider
      }
    });
    
    if (error) throw error;
    
    const endTime = performance.now();
    trackPerformance('send-sms', endTime - startTime, true, { 
      provider,
      type: request.type
    });
    
    return data;
  } catch (error) {
    const endTime = performance.now();
    trackPerformance('send-sms', endTime - startTime, false, { 
      provider, 
      type: request.type 
    });
    trackApiFailure('sms', provider, error, request);
    
    console.error(`Error sending SMS via ${provider}:`, error);
    return {
      success: false,
      message: 'Failed to send SMS. Please try again.'
    };
  }
};

// Send order confirmation SMS
export const sendOrderConfirmationSms = async (
  phoneNumber: string,
  orderReference: string,
  orderItems: number,
  totalAmount: number,
  estimatedDelivery: string,
  provider?: SmsProvider
): Promise<SmsResponse> => {
  const message = `Your order #${orderReference} with ${orderItems} item(s) for NGN ${totalAmount.toFixed(2)} has been confirmed. Estimated delivery: ${estimatedDelivery}. Thank you for choosing MealStock!`;
  
  return sendSms({
    to: phoneNumber,
    message,
    type: SmsNotificationType.ORDER_CONFIRMATION,
    provider,
    reference: orderReference,
    metadata: { orderReference, orderItems, totalAmount, estimatedDelivery }
  });
};

// Send delivery update SMS
export const sendDeliveryUpdateSms = async (
  phoneNumber: string,
  orderReference: string,
  status: 'preparing' | 'out_for_delivery' | 'nearby' | 'delivered' | 'delayed',
  estimatedArrival?: string,
  delayReason?: string,
  provider?: SmsProvider
): Promise<SmsResponse> => {
  let message = '';
  
  switch (status) {
    case 'preparing':
      message = `Your order #${orderReference} is being prepared. We'll notify you when it's on the way.`;
      break;
    case 'out_for_delivery':
      message = `Your order #${orderReference} is out for delivery. ${estimatedArrival ? `Estimated arrival: ${estimatedArrival}.` : ''}`;
      break;
    case 'nearby':
      message = `Your delivery for order #${orderReference} is nearby. Please prepare to receive it.`;
      break;
    case 'delivered':
      message = `Your order #${orderReference} has been delivered. Enjoy your meal! Please rate your experience on the app.`;
      break;
    case 'delayed':
      message = `We apologize, but your order #${orderReference} has been delayed. ${delayReason ? `Reason: ${delayReason}.` : ''} ${estimatedArrival ? `New estimated arrival: ${estimatedArrival}.` : ''}`;
      break;
    default:
      message = `Update on your order #${orderReference}: ${status}. ${estimatedArrival ? `Estimated arrival: ${estimatedArrival}.` : ''}`;
  }
  
  return sendSms({
    to: phoneNumber,
    message,
    type: SmsNotificationType.DELIVERY_UPDATE,
    provider,
    reference: orderReference,
    metadata: { orderReference, status, estimatedArrival, delayReason }
  });
};

// Send authentication code SMS
export const sendAuthenticationSms = async (
  phoneNumber: string,
  code: string,
  expiryMinutes: number = 10,
  provider?: SmsProvider
): Promise<SmsResponse> => {
  const message = `Your MealStock verification code is ${code}. It expires in ${expiryMinutes} minutes. Do not share this with anyone.`;
  
  return sendSms({
    to: phoneNumber,
    message,
    type: SmsNotificationType.AUTHENTICATION,
    provider,
    metadata: { expiryMinutes }
  });
};

// Send special offer SMS
export const sendSpecialOfferSms = async (
  phoneNumber: string,
  offerTitle: string,
  discount: string,
  expiryDate: string,
  promoCode: string,
  provider?: SmsProvider
): Promise<SmsResponse> => {
  const message = `${offerTitle}: Get ${discount} off your next order with code ${promoCode}. Valid until ${expiryDate}. Order now on MealStock.`;
  
  return sendSms({
    to: phoneNumber,
    message,
    type: SmsNotificationType.SPECIAL_OFFER,
    provider,
    metadata: { offerTitle, discount, expiryDate, promoCode }
  });
};

// Send payment confirmation SMS
export const sendPaymentConfirmationSms = async (
  phoneNumber: string,
  orderReference: string,
  amount: number,
  paymentMethod: string,
  transactionReference: string,
  provider?: SmsProvider
): Promise<SmsResponse> => {
  const message = `Payment of NGN ${amount.toFixed(2)} for order #${orderReference} via ${paymentMethod} has been confirmed. Transaction reference: ${transactionReference}. Thank you for your payment.`;
  
  return sendSms({
    to: phoneNumber,
    message,
    type: SmsNotificationType.PAYMENT_CONFIRMATION,
    provider,
    reference: transactionReference,
    metadata: { orderReference, amount, paymentMethod, transactionReference }
  });
};

// Check SMS delivery status
export const checkSmsStatus = async (
  messageId: string,
  provider: SmsProvider = SmsProvider.TERMII
): Promise<{
  delivered: boolean;
  status: string;
  deliveredAt?: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-sms-status', {
      body: {
        messageId,
        provider
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    trackApiFailure('sms', 'check-status', error, { messageId, provider });
    console.error('Error checking SMS status:', error);
    
    return {
      delivered: false,
      status: 'unknown'
    };
  }
};
