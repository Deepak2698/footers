export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  videos?: string[];
  category: string;
  subcategory: string;
  brand: string;
  rating: number;
  reviews: Review[];
  specifications: Specification[];
  faqs: FAQ[];
  stock: number;
  availability: 'in-stock' | 'out-of-stock' | 'pre-order';
  deliveryEstimate: string;
  tags: string[];
  seller: Seller;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: string;
}

export interface Specification {
  name: string;
  value: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Seller {
  id: string;
  name: string;
  logo: string;
  rating: number;
  totalSales: number;
  responseTime: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  orders: Order[];
  wishlist: string[];
  cart: CartItem[];
  paymentMethods: PaymentMethod[];
  isSeller?: boolean;
  isAdmin?: boolean;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount?: number;
  deliveryAmount: number;
  finalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  billingAddress: Address;
  trackingId?: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  discount?: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially-refunded';

export interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'net-banking' | 'wallet' | 'cod';
  details: {
    upiId?: string;
    cardNumber?: string;
    cardHolder?: string;
    expiry?: string;
    bankName?: string;
    walletType?: string;
  };
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
  productCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  products: string[];
  isActive: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  applicableCategories?: string[];
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  ratings: number[];
  availability: string[];
  deliveryTime: string[];
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'discount';
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'trending';
  text: string;
  url?: string;
}

export interface AIRecommendation {
  type: 'similar' | 'trending' | 'personalized' | 'frequently-bought';
  products: Product[];
  reason: string;
}
