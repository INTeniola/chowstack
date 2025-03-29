
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  
  // Mock order details (in a real app, this would come from the order placement API response)
  const orderDetails = {
    orderId: 'ORD' + Math.floor(100000 + Math.random() * 900000),
    orderDate: new Date().toLocaleDateString(),
    deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    deliveryTimeSlot: '10:00 AM - 2:00 PM',
    paymentMethod: 'Paystack',
    paymentStatus: 'Paid',
    items: [
      {
        name: 'Jollof Rice Pack',
        quantity: 2,
        price: 2500,
      },
      {
        name: 'Egusi Soup with Pounded Yam',
        quantity: 1,
        price: 3000,
      },
    ],
    subtotal: 8000,
    deliveryFee: 1500,
    discount: 800,
    tax: 540,
    total: 9240,
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-mealstock-cream">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-10 w-10 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-center text-mealstock-brown mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Thank you for your order. We've received your order and will begin processing it right away.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold text-mealstock-brown mb-4">Order Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium">{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{orderDetails.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Date</p>
                  <p className="font-medium">{orderDetails.deliveryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Time</p>
                  <p className="font-medium">{orderDetails.deliveryTimeSlot}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{orderDetails.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="font-medium text-green-600">{orderDetails.paymentStatus}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-mealstock-brown mb-4">Items</h2>
              
              <div className="space-y-3">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₦{orderDetails.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>₦{orderDetails.deliveryFee.toLocaleString()}</span>
                </div>
                {orderDetails.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₦{orderDetails.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>VAT (7.5%)</span>
                  <span>₦{orderDetails.tax.toLocaleString()}</span>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₦{orderDetails.total.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• You will receive an order confirmation email shortly.</li>
                <li>• We'll notify you when your order is being prepared.</li>
                <li>• Track your order status in your account dashboard.</li>
                <li>• You'll receive delivery updates via SMS and email.</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/discovery')}
                variant="outline"
              >
                Continue Shopping
              </Button>
              
              <Button onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
