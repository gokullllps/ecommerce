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

export function matchesCategory(p: Product, category: string): boolean {
  if (!category || category === "all") return true;
  const target = category.toLowerCase().trim();
  const c = (p.category || "").toLowerCase();
  const sub = (p.subCategory || "").toLowerCase();
  const dept = (getDepartmentForProduct(p) || "").toLowerCase();
  const tags = (p.tags || []).map((t) => t.toLowerCase());

  if (target === "shirts") {
    return c === "shirts" || sub.includes("shirt") || tags.includes("shirt") || tags.includes("shirts");
  }
  if (target === "trousers" || target === "bottoms") {
    return (
      c === "trousers" ||
      sub.includes("trouser") ||
      sub.includes("pants") ||
      sub.includes("palazzo") ||
      tags.includes("trousers") ||
      tags.includes("bottoms")
    );
  }
  if (target === "polos") {
    return c === "polos" || sub.includes("polo") || tags.includes("polo");
  }
  if (target === "denim") {
    return c === "denim" || c === "jeans" || sub.includes("jeans") || sub.includes("denim") || tags.includes("denim");
  }
  if (target === "outerwear") {
    return (
      c === "outerwear" ||
      sub.includes("coat") ||
      sub.includes("jacket") ||
      sub.includes("blazer") ||
      sub.includes("trench") ||
      tags.includes("outerwear")
    );
  }
  if (target === "knitwear") {
    return (
      c === "knitwear" ||
      sub.includes("sweater") ||
      sub.includes("cardigan") ||
      sub.includes("knit") ||
      tags.includes("knitwear")
    );
  }
  if (target === "sweatshirts") {
    return c === "sweatshirts" || sub.includes("hoodie") || sub.includes("sweatshirt") || tags.includes("sweatshirt");
  }
  if (target === "shorts") {
    return c === "shorts" || sub.includes("short") || tags.includes("shorts");
  }
  if (target === "footwear" || target === "shoes") {
    return (
      dept === "footwear" ||
      c === "footwear" ||
      ["loafers", "boots", "sneakers", "slides", "sandals", "heels", "mules", "derbies"].some(
        (f) => sub.includes(f) || c.includes(f)
      )
    );
  }
  if (target === "accessories") {
    return (
      dept === "accessories" ||
      c === "accessories" ||
      c === "bags" ||
      [
        "bag",
        "briefcase",
        "tote",
        "belt",
        "jewelry",
        "glove",
        "scarf",
        "cap",
        "hat",
        "sunglass",
        "sock",
        "wallet",
        "eyewear",
      ].some((a) => sub.includes(a) || c.includes(a))
    );
  }
  if (target === "tops") {
    return (
      c === "tops" ||
      c === "shirts" ||
      sub.includes("top") ||
      sub.includes("blouse") ||
      sub.includes("tank") ||
      sub.includes("shirt") ||
      tags.includes("tops")
    );
  }
  if (target === "dresses") {
    return c === "dresses" || sub.includes("dress") || tags.includes("dresses");
  }
  if (target === "t-shirts") {
    return c === "t-shirts" || sub.includes("tee") || sub.includes("t-shirt") || tags.includes("t-shirts");
  }

  return c === target || sub === target || tags.includes(target);
}

export { KIDS_PRODUCTS, validateKidsProductImages };
