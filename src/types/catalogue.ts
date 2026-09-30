export type GenderId = "men" | "women" | "kids";

export type CategoryId =
  | "new-in"
  | "t-shirts"
  | "shirts"
  | "polos"
  | "trousers"
  | "jeans"
  | "denim"
  | "cargo-utility"
  | "shorts"
  | "knitwear"
  | "outerwear"
  | "hoodies-sweatshirts"
  | "sweatshirts"
  | "activewear"
  | "footwear"
  | "bags"
  | "accessories"
  | "dresses"
  | "tops"
  | "bottoms";

export type CollectionId =
  | "new-season"
  | "new-in"
  | "best-sellers"
  | "essentials"
  | "editorial"
  | "limited-edition"
  | "evening"
  | "casual"
  | "formal"
  | "sale";

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  subcategories: SubCategory[];
  gender?: GenderId;
}

export interface Collection {
  id: CollectionId;
  name: string;
  slug: string;
  description: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
  imageOverride?: string;
  images?: ProductImage[];
}

export interface ColorVariant {
  name: string;
  value: string;
  hex?: string;
  inStock?: boolean;
  images: ProductImage[];
}

export interface ProductSize {
  name?: string;
  size?: string;
  inStock?: boolean;
  available?: boolean;
}

export interface ProductImage {
  id?: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
  isHover?: boolean;
  variantSku?: string;
  viewType?: "front" | "back" | "detail" | "lifestyle" | "alternate";
}

export interface ProductVariant {
  id?: string;
  sku: string;
  colorName: string;
  sizeName: string;
  material?: string;
  stock: number;
  priceOverride?: number;
  imageOverride?: string;
  isAvailable?: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  gender?: GenderId;
  department?: "clothing" | "footwear" | "accessories";
  category: CategoryId;
  subCategory?: string;
  collections: CollectionId[];
  description: string;
  shortDescription?: string;
  brand?: string;
  productType?: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  images: ProductImage[];
  primaryImage?: string;
  hoverImage?: string;
  videoUrl?: string;
  colors: ProductColor[];
  colorVariants?: ColorVariant[];
  badge?: string;
  discountPercent?: number;
  sizes: ProductSize[];
  variants?: ProductVariant[];
  stock: number;
  reservedStock?: number;
  lowStockThreshold?: number;
  material: string;
  fit: string;
  careInstructions?: string;
  deliveryInfo?: string;
  returnsInfo?: string;
  tags: string[];
  isAvailable: boolean;
  status?: "active" | "draft" | "archived";
  isNewArrival: boolean;
  isSale: boolean;
  isBestSeller?: boolean;
  isLimitedEdition?: boolean;
  popularityScore: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt?: string;
}

export type SortOption =
  | "recommended"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "popularity"
  | "name-asc";

export interface FilterState {
  gender?: GenderId | "all";
  category?: CategoryId | "all";
  subCategory?: string;
  collection?: CollectionId | "all";
  sizes: string[];
  colors: string[];
  fits: string[];
  materials: string[];
  priceRange?: [number, number];
  inStockOnly?: boolean;
  saleOnly?: boolean;
  newArrivalsOnly?: boolean;
  searchQuery?: string;
  sort: SortOption;
}
