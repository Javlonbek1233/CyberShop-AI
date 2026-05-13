import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  isFlashSale?: boolean;
  discountPrice?: number;
  rating?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin';
  wishlist: string[];
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: any;
  trackingNumber?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'flash_sale';
  isRead: boolean;
  createdAt: any;
}
