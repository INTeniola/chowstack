import React, { useState } from 'react';
import { Vendor } from '@/hooks/useVendorAuth';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, ArrowDown, ArrowUp, Eye, Truck, CheckCircle, XCircle } from 'lucide-react';
import { 
  sendOrderStatusNotification, 
  sendDeliveryUpdateNotification 
} from '@/services/notificationService';

interface VendorOrdersProps {
  vendor: Vendor;
}

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  packageName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentMethod: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  expectedDelivery: string;
}

// Mock order data
const mockOrders: Order[] = [
  {
    id: 'ORD-2023-1001',
    customerId: 'cust123',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    customerPhone: '555-123-4567',
    deliveryAddress: '123 Main St, Anytown, CA 12345',
    items: [
      {
        id: 'item1',
        packageName: 'Family Meal Bundle',
        quantity: 2,
        price: 79.99,
        total: 159.98,
      },
      {
        id: 'item2',
        packageName: 'Breakfast Essentials',
        quantity: 1,
        price: 52.99,
        total: 52.99,
      }
    ],
    subtotal: 212.97,
    tax: 17.04,
    deliveryFee: 5.99,
    total: 236.00,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    notes: 'Please leave at the door',
    createdAt: '2023-10-18T10:30:00Z',
    updatedAt: '2023-10-18T10:45:00Z',
    expectedDelivery: '2023-10-20',
  },
  {
    id: 'ORD-2023-1002',
    customerId: 'cust456',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    customerPhone: '555-234-5678',
    deliveryAddress: '456 Oak Ave, Somewhere, CA 56789',
    items: [
      {
        id: 'item3',
        packageName: 'Vegetarian Weekly Pack',
        quantity: 1,
        price: 67.99,
        total: 67.99,
      }
    ],
    subtotal: 67.99,
    tax: 5.44,
    deliveryFee: 5.99,
    total: 79.42,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'PayPal',
    notes: '',
    createdAt: '2023-10-19T09:15:00Z',
    updatedAt: '2023-10-19T09:15:00Z',
    expectedDelivery: '2023-10-21',
  },
  {
    id: 'ORD-2023-1003',
    customerId: 'cust789',
    customerName: 'Michael Brown',
    customerEmail: 'michael@example.com',
    customerPhone: '555-345-6789',
    deliveryAddress: '789 Pine St, Elsewhere, CA 98765',
    items: [
      {
        id: 'item4',
        packageName: 'Protein Power Pack',
        quantity: 3,
        price: 85.99,
        total: 257.97,
      }
    ],
    subtotal: 257.97,
    tax: 20.64,
    deliveryFee: 0, // Free delivery
    total: 278.61,
    status: 'preparing',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    notes: 'Please call when arriving',
    createdAt: '2023-10-19T14:20:00Z',
    updatedAt: '2023-10-19T14:30:00Z',
    expectedDelivery: '2023-10-21',
  },
  {
    id: 'ORD-2023-1004',
    customerId: 'cust012',
    customerName: 'Emily Davis',
    customerEmail: 'emily@example.com',
    customerPhone: '555-456-7890',
    deliveryAddress: '101 Maple Dr, Nowhere, CA 43210',
    items: [
      {
        id: 'item5',
        packageName: 'Family Meal Bundle',
        quantity: 1,
        price: 79.99,
        total: 79.99,
      },
      {
        id: 'item6',
        packageName: 'Breakfast Essentials',
        quantity: 2,
        price: 52.99,
        total: 105.98,
      }
    ],
    subtotal: 185.97,
    tax: 14.88,
    deliveryFee: 5.99,
    total: 206.84,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    notes: '',
    createdAt: '2023-10-15T11:45:00Z',
    updatedAt: '2023-10-17T15:30:00Z',
    expectedDelivery: '2023-10-17',
  },
  {
    id: 'ORD-2023-1005',
    customerId: 'cust345',
    customerName: 'David Wilson',
    customerEmail: 'david@example.com',
    customerPhone: '555-567-8901',
    deliveryAddress: '202 Elm St, Someplace, CA 54321',
    items: [
      {
        id: 'item7',
        packageName: 'Vegetarian Weekly Pack',
        quantity: 2,
        price: 67.99,
        total: 135.98,
      }
    ],
    subtotal: 135.98,
    tax: 10.88,
    deliveryFee: 5.99,
    total: 152.85,
    status: 'ready',
    paymentStatus: 'paid',
    paymentMethod: 'PayPal',
    notes: 'Delivery instructions: gate code #1234',
    createdAt: '2023-10-19T16:10:00Z',
    updatedAt: '2023-10-19T16:45:00Z',
    expectedDelivery: '2023-10-21',
  },
];

const VendorOrders: React.FC<VendorOrdersProps> = ({ vendor }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<{ field: keyof Order; direction: 'asc' | 'desc' }>({
    field: 'createdAt',
    direction: 'desc',
  });
  
  // Filter orders based on status and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus ? order.status === filterStatus : true;
    const matchesSearch = searchTerm
      ? order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });
  
  // Sort orders based on the selected sort field and direction
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aValue = a[sortBy.field];
    const bValue = b[sortBy.field];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortBy.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortBy.direction === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });
  
  const toggleSort = (field: keyof Order) => {
    if (sortBy.field === field) {
      setSortBy({
        field,
        direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortBy({
        field,
        direction: 'asc',
      });
    }
  };
  
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Confirmed</Badge>;
      case 'preparing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Preparing</Badge>;
      case 'ready':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Ready</Badge>;
      case 'in_transit':
        return <Badge className="bg-amber-500 hover:bg-amber-600">In Transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };
  
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    );
    setOrders(updatedOrders);
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus, updatedAt: new Date().toISOString() });
    }
    
    // Send notification to customer
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Mock customer ID
      const customerId = order.customerId;
      
      if (newStatus === 'preparing' || newStatus === 'confirmed' || newStatus === 'cancelled') {
        sendOrderStatusNotification(
          customerId,
          orderId,
          newStatus.replace('_', ' '),
          `Your order #${orderId} is now ${newStatus.replace('_', ' ')}.`
        );
      } else if (newStatus === 'in_transit' || newStatus === 'ready') {
        sendDeliveryUpdateNotification(
          customerId,
          orderId,
          newStatus === 'in_transit' ? 'on the way' : 'ready for pickup',
          newStatus === 'in_transit' ? 'Estimated delivery in 30 minutes' : undefined
        );
      } else if (newStatus === 'delivered') {
        sendOrderStatusNotification(
          customerId,
          orderId,
          'delivered',
          'Your order has been delivered. Enjoy your meal!'
        );
      }
    }
    
    toast({
      title: "Order status updated",
      description: `Order ${orderId} has been marked as ${newStatus.replace('_', ' ')}.`,
    });
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'in_transit', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
      return null;
    }
    
    return statusFlow[currentIndex + 1];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value || undefined)}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="All Orders" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer" 
                        onClick={() => toggleSort('id')}
                      >
                        <div className="flex items-center">
                          Order ID
                          {sortBy.field === 'id' && (
                            sortBy.direction === 'asc' 
                              ? <ArrowUp className="ml-1 h-4 w-4" /> 
                              : <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead 
                        className="cursor-pointer" 
                        onClick={() => toggleSort('createdAt')}
                      >
                        <div className="flex items-center">
                          Date
                          {sortBy.field === 'createdAt' && (
                            sortBy.direction === 'asc' 
                              ? <ArrowUp className="ml-1 h-4 w-4" /> 
                              : <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => toggleSort('total')}
                      >
                        <div className="flex items-center">
                          Total
                          {sortBy.field === 'total' && (
                            sortBy.direction === 'asc' 
                              ? <ArrowUp className="ml-1 h-4 w-4" /> 
                              : <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={order.paymentStatus === 'paid' ? 'outline' : 'secondary'}
                              className={
                                order.paymentStatus === 'paid' 
                                  ? 'border-green-500 text-green-600' 
                                  : order.paymentStatus === 'refunded'
                                    ? 'border-red-500 text-red-600'
                                    : ''
                              }
                            >
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewOrderDetails(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                  onClick={() => {
                                    const nextStatus = getNextStatus(order.status);
                                    if (nextStatus) {
                                      updateOrderStatus(order.id, nextStatus);
                                    }
                                  }}
                                >
                                  {order.status === 'pending' && 'Confirm'}
                                  {order.status === 'confirmed' && 'Prepare'}
                                  {order.status === 'preparing' && 'Ready'}
                                  {order.status === 'ready' && <Truck className="h-4 w-4" />}
                                  {order.status === 'in_transit' && <CheckCircle className="h-4 w-4" />}
                                </Button>
                              )}
                              
                              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-500 text-red-600 hover:bg-red-50"
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View and manage orders scheduled for today.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View and prepare for upcoming scheduled deliveries.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Review your order history and completed deliveries.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Order Details: {selectedOrder.id}</span>
                  {getStatusBadge(selectedOrder.status)}
                </DialogTitle>
                <DialogDescription>
                  Placed on {formatDate(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Customer Information</h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{selectedOrder.customerName}</p>
                      <p>{selectedOrder.customerEmail}</p>
                      <p>{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Delivery Address</h4>
                    <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Order Items</h4>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.packageName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal:</span>
                    <span className="text-sm">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tax:</span>
                    <span className="text-sm">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Delivery Fee:</span>
                    <span className="text-sm">${selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Payment Method:</span>
                      <span className="ml-2">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="font-medium">Payment Status:</span>
                      <span className="ml-2">
                        <Badge 
                          variant={selectedOrder.paymentStatus === 'paid' ? 'outline' : 'secondary'}
                          className={
                            selectedOrder.paymentStatus === 'paid' 
                              ? 'border-green-500 text-green-600' 
                              : selectedOrder.paymentStatus === 'refunded'
                                ? 'border-red-500 text-red-600'
                                : ''
                          }
                        >
                          {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                        </Badge>
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Expected Delivery:</span>
                      <span className="ml-2">{selectedOrder.expectedDelivery}</span>
                    </div>
                  </div>
                  
                  {selectedOrder.notes && (
                    <div className="mt-2">
                      <span className="font-medium text-sm">Customer Notes:</span>
                      <p className="text-sm mt-1 p-2 bg-muted rounded-md">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <div className="flex gap-2 w-full sm:w-auto sm:justify-end">
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'cancelled');
                      }}
                    >
                      Cancel Order
                    </Button>
                    
                    {getNextStatus(selectedOrder.status) && (
                      <Button
                        onClick={() => {
                          const nextStatus = getNextStatus(selectedOrder.status);
                          if (nextStatus) {
                            updateOrderStatus(selectedOrder.id, nextStatus);
                          }
                        }}
                      >
                        {selectedOrder.status === 'pending' && 'Confirm Order'}
                        {selectedOrder.status === 'confirmed' && 'Start Preparing'}
                        {selectedOrder.status === 'preparing' && 'Mark as Ready'}
                        {selectedOrder.status === 'ready' && 'Start Delivery'}
                        {selectedOrder.status === 'in_transit' && 'Mark as Delivered'}
                      </Button>
                    )}
                  </div>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorOrders;
