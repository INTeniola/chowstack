
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MealFeedbackButton } from '@/components/feedback/MealFeedbackButton';
import { mockOrders } from '@/utils/mockData/orders';

// For demo purposes, we'll use mock data
// In a real app, this would be fetched from the backend
const fetchOrders = async (userId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockOrders;
};

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export function OrderHistory() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => fetchOrders(user?.id || ''),
    enabled: !!user?.id
  });
  
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Please sign in to view your order history.</p>
        <Button className="mt-4" onClick={() => window.location.href = '/login'}>
          Sign In
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Order History</h2>
        <p className="text-muted-foreground mb-6">
          View and manage your previous orders
        </p>
      </div>
      
      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-32 bg-gray-100 dark:bg-gray-800"></CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 bg-muted/30 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Order #{order.orderNumber}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-mealstock-brown">₦{order.total.toLocaleString()}</span>
                    <Button variant="outline" size="sm">
                      Track Order
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={item.image || '/placeholder.svg'} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h5 className="font-medium">{item.name}</h5>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>₦{item.price.toLocaleString()}</span>
                          {order.status === 'delivered' && (
                            <MealFeedbackButton mealId={item.id} orderId={order.id} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
