// Database entity interfaces for the e-commerce application

export interface User {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  images: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  inventory: ProductInventory[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  rating?: number;
  reviewCount?: number;
}

export interface ProductSize {
  size: string;
  label: string;
  available: boolean;
}

export interface ProductColor {
  color: string;
  name: string;
  hexCode: string;
  available: boolean;
}

export interface ProductInventory {
  size: string;
  color: string;
  quantity: number;
  sku: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  price: number;
  addedAt: Date;
  updatedAt: Date;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  user: Pick<User, 'id' | 'email' | 'displayName'>;
  items: PurchaseItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: PurchaseStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  product: Pick<Product, 'id' | 'name' | 'images' | 'brand'>;
  quantity: number;
  size: string;
  color: string;
  price: number;
  total: number;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export type PurchaseStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Wishlist {
  id: string;
  userId: string;
  productIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  user: Pick<User, 'id' | 'displayName'>;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Firestore document data types (without id field)
export type UserData = Omit<User, 'id'>;
export type ProductData = Omit<Product, 'id'>;
export type CartItemData = Omit<CartItem, 'id'>;
export type CartData = Omit<Cart, 'id'>;
export type PurchaseData = Omit<Purchase, 'id'>;
export type WishlistData = Omit<Wishlist, 'id'>;
export type ReviewData = Omit<Review, 'id'>;

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Query filters
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface PurchaseFilters {
  status?: PurchaseStatus;
  startDate?: Date;
  endDate?: Date;
  minTotal?: number;
  maxTotal?: number;
}