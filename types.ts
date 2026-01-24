
export type Category = 'Coffee' | 'Tea' | 'Brunch' | 'Pastries' | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  calories?: number;
  tags?: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: CartItem[];
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered';
  timestamp: number;
  total: number;
  userName: string;
}

export type ViewType = 'Customer' | 'Kitchen' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: ViewType;
}

export interface PaymentDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
}
