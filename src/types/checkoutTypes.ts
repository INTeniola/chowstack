export type DeliveryAddress = {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isVerified?: boolean;
  coordinates?: Coordinates;
};

export type PaymentMethod = 
  | 'paystack' 
  | 'flutterwave' 
  | 'bank_transfer' 
  | 'mobile_money' 
  | 'cash_on_delivery';

export type PaymentGateway = {
  id: string;
  name: string;
  type: PaymentMethod;
  icon: string;
  description: string;
  processingFee: number;
  isAvailable: boolean;
};

export type DeliveryOption = {
  id: string;
  name: string;
  description: string;
  estimatedDays: number;
  price: number;
};

export type DeliverySchedule = {
  orderId?: string;
  items: CartItem[];
  date: Date;
  timeSlot: string;
  address: DeliveryAddress;
  deliveryOption: DeliveryOption;
};

export type OrderSummary = {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  savings: number;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendorId: string;
  vendorName: string;
};

export type Order = {
  id?: string;
  userId: string;
  items: CartItem[];
  deliverySchedules: DeliverySchedule[];
  paymentMethod: PaymentMethod;
  orderSummary: OrderSummary;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  isRecurring: boolean;
  recurringFrequency?: 'weekly' | 'biweekly' | 'monthly';
  recurringEndDate?: Date;
  createdAt: Date;
};

export type CommunityOrder = {
  id?: string;
  mainOrderId: string;
  userId: string;
  participantIds: string[];
  items: {
    userId: string;
    items: CartItem[];
  }[];
  deliverySchedule: DeliverySchedule;
  paymentStatus: {
    userId: string;
    status: 'pending' | 'paid';
  }[];
  orderSummary: OrderSummary;
  status: 'gathering' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
};

export interface Coordinates {
  latitude: number;
  longitude: number;
}
