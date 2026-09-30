import { Product } from "@/types/catalogue";
import { KIDS_PRODUCTS, validateKidsProductImages } from "./kidsProducts";
import productsJson from "./products.json";

// Canonical product catalogue loaded from canonical JSON
export const ALL_PRODUCTS: Product[] = productsJson as unknown as Product[];

// Department classification lookup
export function getDepartmentForProduct(p: Product): "clothing" | "footwear" | "accessories" {
  if (p.department) return p.department;
  const cat = (p.category || "").toLowerCase();
  const sub = (p.subCategory || "").toLowerCase();
  if (
    ["footwear", "sneakers", "loafers", "boots", "slides", "sandals", "derbies", "mules", "slipons", "heels"].includes(cat) ||
    ["footwear", "sneakers", "loafers", "boots", "slides", "sandals", "derbies", "mules", "slipons", "heels"].includes(sub)
  ) {
    return "footwear";
  }
  if (
    ["accessories", "bags", "wallets", "belts", "caps", "sunglasses", "socks", "jewelry", "scarves", "gloves", "hats", "eyewear", "small-leather-goods", "briefcases", "totes", "crossbody", "hobo-bags"].includes(cat) ||
    ["accessories", "bags", "wallets", "belts", "caps", "sunglasses", "socks", "jewelry", "scarves", "gloves", "hats", "eyewear", "small-leather-goods", "briefcases", "totes", "crossbody", "hobo-bags"].includes(sub)
  ) {
    return "accessories";
  }
  return "clothing";
}

// Helper functions for easy filtering across all components
export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByGender(gender: "men" | "women" | "kids"): Product[] {
  return ALL_PRODUCTS.filter((p) => (p.gender || "men") === gender);
}

export function getProductsByDepartment(
  department: "clothing" | "footwear" | "accessories",
  gender?: "men" | "women" | "kids"
): Product[] {
  return ALL_PRODUCTS.filter((p) => {
    if (gender && (p.gender || "men") !== gender) return false;
    return getDepartmentForProduct(p) === department;
  });
}

export function getProductsBySubtype(
  subtype: string,
  department?: "clothing" | "footwear" | "accessories",
  gender?: "men" | "women" | "kids"
): Product[] {
  const norm = subtype.toLowerCase();
  return ALL_PRODUCTS.filter((p) => {
    if (gender && (p.gender || "men") !== gender) return false;
    if (department && getDepartmentForProduct(p) !== department) return false;
    const cat = (p.category || "").toLowerCase();
    const sub = (p.subCategory || "").toLowerCase();
    return cat === norm || sub === norm || p.tags.some((t) => t.toLowerCase() === norm);
  });
}

export function getProductsByCategory(category: string, gender?: "men" | "women" | "kids"): Product[] {
  return ALL_PRODUCTS.filter((p) => {
    if (gender && (p.gender || "men") !== gender) return false;
    return p.category === category || p.subCategory === category;
  });
}

export function getNewArrivals(limit?: number): Product[] {
  const items = ALL_PRODUCTS.filter((p) => p.isNewArrival);
  return limit ? items.slice(0, limit) : items;
}

export function getBestsellers(limit?: number): Product[] {
  const items = [...ALL_PRODUCTS].sort((a, b) => b.popularityScore - a.popularityScore);
  return limit ? items.slice(0, limit) : items;
}

export function getSaleProducts(limit?: number): Product[] {
  const items = ALL_PRODUCTS.filter((p) => p.isSale);
  return limit ? items.slice(0, limit) : items;
}

export function searchProducts(query: string): Product[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return ALL_PRODUCTS.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
      p.material.toLowerCase().includes(q) ||
      (p.gender && p.gender.toLowerCase().includes(q)) ||
      p.collections.some((c) => c.toLowerCase().includes(q)) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export { KIDS_PRODUCTS, validateKidsProductImages };
