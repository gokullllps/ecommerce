import { GenderId, SortOption } from "./catalogue";

export type DepartmentId = "all" | "clothing" | "footwear" | "accessories";

export type FilterGroupId =
  | "category"
  | "productType"
  | "footwearType"
  | "accessoryType"
  | "size"
  | "color"
  | "price"
  | "fit"
  | "material"
  | "collection"
  | "availability"
  | "sale"
  | "newIn";

export interface CatalogueContext {
  gender: GenderId | "all" | "sale" | "new-in";
  department: DepartmentId;
  defaultSubtype?: string;
  defaultCategory?: string;
  isSaleOnly?: boolean;
  isNewOnly?: boolean;
  collectionSlug?: string;
}

export interface ActiveFilterState {
  categories: string[];
  productTypes: string[];
  footwearTypes: string[];
  accessoryTypes: string[];
  sizes: string[];
  colors: string[];
  fits: string[];
  materials: string[];
  collections: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  saleOnly: boolean;
  newOnly: boolean;
  sort: SortOption;
}

export interface FilterOptionItem {
  id: string;
  label: string;
  count: number;
  disabled?: boolean;
  hex?: string; // Optional for color swatches
}

export interface FilterGroupConfig {
  id: FilterGroupId;
  label: string;
  type: "checkbox" | "swatch" | "price" | "toggle";
  options: FilterOptionItem[];
}
