export type AdminRole =
  | "super_admin"
  | "admin"
  | "content_manager"
  | "product_manager"
  | "inventory_manager"
  | "order_manager"
  | "marketing_manager";

export type AdminPermission =
  | "dashboard.view"
  | "products.view"
  | "products.edit"
  | "categories.manage"
  | "collections.manage"
  | "orders.view"
  | "orders.edit"
  | "customers.view"
  | "customers.edit"
  | "inventory.manage"
  | "promotions.manage"
  | "storefront.manage"
  | "themes.manage"
  | "media.manage"
  | "users.manage"
  | "settings.manage"
  | "audit.view";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  permissions: AdminPermission[];
  status: "active" | "inactive";
  lastLogin: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export interface AdminOrderItem {
  productId: string;
  title: string;
  sku: string;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: AdminOrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  fulfillmentStatus: "unfulfilled" | "partially_fulfilled" | "fulfilled";
  status: OrderStatus;
  createdAt: string;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "active" | "inactive" | "vip";
  city: string;
  country: string;
  joinedAt: string;
  notes?: string;
  address?: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName?: string;
  variantId?: string;
  variantSku?: string;
  variantTitle?: string;
  previousQuantity: number;
  newQuantity: number;
  adjustment: number;
  adminName: string;
  timestamp: string;
  reason: string;
}

export interface AdminPromotion {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "percentage" | "fixed_amount";
  value: number; // e.g. 10 for 10% or 500 for ₹500
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableTo: "all" | "categories" | "collections" | "products";
  targetIds?: string[];
}

export interface StorefrontHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  desktopImage: string;
  mobileImage?: string;
  alignment: "left" | "center" | "right";
  isActive: boolean;
  order: number;
}

export interface StorefrontSectionConfig {
  id: string;
  type: "hero" | "new_in" | "categories" | "featured_collection" | "editorial" | "ticker";
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  contentRef?: string;
}

export interface AdminThemeConfig {
  id: string;
  name: string;
  description: string;
  type: "festival" | "seasonal" | "campaign" | "sale" | "custom";
  scope: "all" | "men" | "women" | "kids" | "footwear" | "accessories";
  priority: number;
  status: "active" | "scheduled" | "draft" | "archived";
  startAt?: string;
  endAt?: string;
  timezone: string;
  tokens: {
    primaryBg: string;
    primaryText: string;
    darkSurface: string;
    accent: string;
    borderColor: string;
  };
  navbar?: {
    bannerMessage?: string;
    bannerBg?: string;
    bannerTextColor?: string;
  };
  hero?: {
    headline?: string;
    tagline?: string;
    bgImage?: string;
  };
  ticker?: {
    enabled: boolean;
    text: string;
    speed: number;
  };
  decorations?: {
    style: "none" | "snow" | "sparkles" | "confetti" | "lanterns";
    density: "low" | "medium" | "high";
  };
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  folder: "products" | "heroes" | "campaigns" | "themes" | "general";
  tags: string[];
  dimensions?: { width: number; height: number };
  uploadedAt: string;
}

export interface AuditLogEntry {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  currency: string;
  currencySymbol: string;
  country: string;
  taxRate: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  maintenanceMode: boolean;
  defaultThemeId: string;
  seoTitle: string;
  seoDescription: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  gender: "men" | "women" | "kids" | "all";
  description: string;
  image?: string;
  displayOrder: number;
  status: "active" | "inactive";
  seoTitle?: string;
  seoDescription?: string;
}

export type CollectionMode = "manual" | "rule_based";

export interface CollectionRule {
  id: string;
  field:
    | "category"
    | "gender"
    | "minPrice"
    | "maxPrice"
    | "tag"
    | "isSale"
    | "isNewArrival"
    | "isBestSeller"
    | "isFeatured";
  operator: "equals" | "greater_than" | "less_than" | "contains";
  value: string | number | boolean;
}

export interface AdminCollection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  banner?: string;
  status: "draft" | "active" | "archived" | "scheduled";
  startDate?: string;
  endDate?: string;
  gender: "all" | "men" | "women" | "kids";
  seoTitle?: string;
  seoDescription?: string;
  mode: CollectionMode;
  productIds: string[];
  rules?: CollectionRule[];
  label?: string;
  category?: string;
  updatedAt?: string;
}
