import { Product } from "./catalogue";

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  image: string;
  color: string;
  colorHex?: string;
  size: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  slug?: string;
  addedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: "card" | "upi" | "netbanking" | "cod";
  status: "confirmed" | "processing" | "dispatched" | "delivered";
}
