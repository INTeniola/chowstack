
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
}

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '20250329-001',
    userId: '123',
    date: '2025-03-29T10:30:00Z',
    status: 'delivered',
    total: 24999,
    items: [
      {
        id: 'meal1',
        name: 'Nigerian Jollof Rice Bundle',
        quantity: 3,
        price: 5999,
        image: 'https://images.unsplash.com/photo-1644783943890-d788c3740979'
      },
      {
        id: 'meal2',
        name: 'Egusi Soup with Pounded Yam',
        quantity: 1,
        price: 6999,
        image: 'https://images.unsplash.com/photo-1643301128183-056d5dc64dee'
      }
    ],
    shippingAddress: '123 Main Street, Lagos, Nigeria'
  },
  {
    id: '2',
    orderNumber: '20250325-002',
    userId: '123',
    date: '2025-03-25T14:15:00Z',
    status: 'shipped',
    total: 18999,
    items: [
      {
        id: 'meal3',
        name: 'Afang Soup with Semovita',
        quantity: 2,
        price: 7499,
        image: 'https://images.unsplash.com/photo-1643301126313-d07353a443fb'
      },
      {
        id: 'meal4',
        name: 'Suya Platter',
        quantity: 1,
        price: 3999,
        image: 'https://images.unsplash.com/photo-1655123996172-13ef46db8432'
      }
    ],
    shippingAddress: '123 Main Street, Lagos, Nigeria'
  },
  {
    id: '3',
    orderNumber: '20250320-003',
    userId: '123',
    date: '2025-03-20T09:45:00Z',
    status: 'processing',
    total: 29999,
    items: [
      {
        id: 'meal5',
        name: 'Family Meal Bundle',
        quantity: 1,
        price: 29999,
        image: 'https://images.unsplash.com/photo-1619220388844-7a26760d5043'
      }
    ],
    shippingAddress: '123 Main Street, Lagos, Nigeria'
  },
  {
    id: '4',
    orderNumber: '20250315-004',
    userId: '123',
    date: '2025-03-15T16:20:00Z',
    status: 'cancelled',
    total: 14999,
    items: [
      {
        id: 'meal6',
        name: 'Vegetarian Special Pack',
        quantity: 1,
        price: 14999,
        image: 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75'
      }
    ],
    shippingAddress: '123 Main Street, Lagos, Nigeria'
  }
];
