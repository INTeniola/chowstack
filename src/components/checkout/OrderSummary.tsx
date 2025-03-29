
import React from 'react';
import { CartItem, OrderSummary as OrderSummaryType } from '@/types/checkoutTypes';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  summary: OrderSummaryType;
  items: CartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ summary, items }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-mealstock-brown mb-4">Order Summary</h2>
      
      {/* Items list */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div className="flex items-start gap-2">
              <div className="bg-gray-100 h-12 w-12 rounded-md flex items-center justify-center text-xs text-gray-500">
                Img
              </div>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.quantity} x ₦{item.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  From: {item.vendorName}
                </p>
              </div>
            </div>
            <p className="text-sm font-medium">
              ₦{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      {/* Summary calculations */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₦{summary.subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Delivery Fee</span>
          <span>₦{summary.deliveryFee.toLocaleString()}</span>
        </div>
        
        {summary.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-₦{summary.discount.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span>VAT (7.5%)</span>
          <span>₦{summary.tax.toLocaleString()}</span>
        </div>
      </div>
      
      <Separator className="my-3" />
      
      {/* Total */}
      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>₦{summary.total.toLocaleString()}</span>
      </div>
      
      {/* Savings */}
      {summary.savings > 0 && (
        <div className="mt-3 bg-green-50 text-green-800 p-2 rounded-md text-sm">
          <p className="font-medium">You save ₦{summary.savings.toLocaleString()}</p>
          <p className="text-xs text-green-700">
            Bulk order discount applied to your order.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
