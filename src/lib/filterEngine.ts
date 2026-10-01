import { Product } from "@/types/catalogue";
import {
  ActiveFilterState,
  CatalogueContext,
  FilterGroupConfig,
  FilterOptionItem,
} from "@/types/filters";
import { getDepartmentForProduct } from "@/data/products";

// Default initial filter state
export const INITIAL_FILTER_STATE: ActiveFilterState = {
  categories: [],
  productTypes: [],
  footwearTypes: [],
  accessoryTypes: [],
  sizes: [],
  colors: [],
  fits: [],
  materials: [],
  collections: [],
  minPrice: undefined,
  maxPrice: undefined,
  inStockOnly: false,
  saleOnly: false,
  newOnly: false,
  sort: "recommended",
};

/**
 * Standardize material naming for clean grouping
 */
export function normalizeMaterial(mat: string): string {
  const lower = mat.toLowerCase();
  if (lower.includes("cashmere")) return "Cashmere";
  if (lower.includes("wool")) return "Virgin Wool";
  if (lower.includes("silk")) return "Mulberry Silk";
  if (lower.includes("cotton")) return "Organic Cotton";
  if (lower.includes("linen")) return "Linen";
  if (lower.includes("leather") || lower.includes("calfskin")) return "Italian Leather";
  if (lower.includes("suede")) return "Suede";
  if (lower.includes("titanium")) return "Titanium";
  if (lower.includes("shearling")) return "Shearling";
  return mat;
}

/**
 * Map product to its specific contextual type
 */
export function getProductTypeIdentifier(p: Product): {
  department: "clothing" | "footwear" | "accessories";
  subtype: string;
} {
  const dept = getDepartmentForProduct(p);
  const cat = (p.category || "").toLowerCase();
  const sub = (p.subCategory || "").toLowerCase();

  if (dept === "footwear") {
    if (sub.includes("sneaker") || cat.includes("sneaker")) return { department: "footwear", subtype: "sneakers" };
    if (sub.includes("loafer") || cat.includes("loafer")) return { department: "footwear", subtype: "loafers" };
    if (sub.includes("boot") || cat.includes("boot")) return { department: "footwear", subtype: "boots" };
    if (sub.includes("slide") || cat.includes("slide")) return { department: "footwear", subtype: "slides" };
    if (sub.includes("sandal") || cat.includes("sandal")) return { department: "footwear", subtype: "sandals" };
    return { department: "footwear", subtype: "shoes" };
  }

  if (dept === "accessories") {
    if (sub.includes("bag") || cat.includes("bag") || sub.includes("briefcase") || sub.includes("tote"))
      return { department: "accessories", subtype: "bags" };
    if (sub.includes("wallet") || cat.includes("wallet") || sub.includes("cardholder"))
      return { department: "accessories", subtype: "wallets" };
    if (sub.includes("belt") || cat.includes("belt")) return { department: "accessories", subtype: "belts" };
    if (sub.includes("cap") || cat.includes("cap") || sub.includes("hat")) return { department: "accessories", subtype: "caps" };
    if (sub.includes("sunglass") || cat.includes("sunglass") || sub.includes("eyewear"))
      return { department: "accessories", subtype: "sunglasses" };
    if (sub.includes("sock") || cat.includes("sock")) return { department: "accessories", subtype: "socks" };
    return { department: "accessories", subtype: "other" };
  }

  // Clothing
  if (sub.includes("t-shirt") || cat === "t-shirts") return { department: "clothing", subtype: "t-shirts" };
  if (sub.includes("shirt") || cat === "shirts") return { department: "clothing", subtype: "shirts" };
  if (sub.includes("polo") || cat === "polos") return { department: "clothing", subtype: "polos" };
  if (sub.includes("trouser") || cat === "trousers") return { department: "clothing", subtype: "trousers" };
  if (sub.includes("cargo") || cat.includes("cargo")) return { department: "clothing", subtype: "cargo" };
  if (sub.includes("denim") || cat === "denim" || cat === "jeans") return { department: "clothing", subtype: "denim" };
  if (sub.includes("coat") || cat === "outerwear" || sub.includes("jacket")) return { department: "clothing", subtype: "outerwear" };
  if (sub.includes("knit") || cat === "knitwear" || sub.includes("cashmere")) return { department: "clothing", subtype: "knitwear" };
  if (sub.includes("hoodie") || sub.includes("sweatshirt") || cat === "sweatshirts") return { department: "clothing", subtype: "sweatshirts" };
  if (sub.includes("short") || cat === "shorts") return { department: "clothing", subtype: "shorts" };
  if (cat === "dresses" || sub.includes("dress")) return { department: "clothing", subtype: "dresses" };
  if (cat === "tops" || sub.includes("top")) return { department: "clothing", subtype: "tops" };
  if (sub.includes("blouse")) return { department: "clothing", subtype: "blouses" };
  if (sub.includes("skirt")) return { department: "clothing", subtype: "skirts" };

  return { department: "clothing", subtype: cat };
}

/**
 * Filter product against single dimension or group
 */
export function matchesFilterDimension(
  p: Product,
  dimension: keyof ActiveFilterState,
  state: ActiveFilterState,
  context: CatalogueContext
): boolean {
  // Category / Department dimension
  if (dimension === "categories") {
    if (state.categories.length === 0) return true;
    const dept = getDepartmentForProduct(p);
    return state.categories.includes(dept);
  }

  // Product Type (Clothing)
  if (dimension === "productTypes") {
    if (state.productTypes.length === 0) return true;
    const { department, subtype } = getProductTypeIdentifier(p);
    if (department !== "clothing") return false;
    return state.productTypes.some((t) => subtype === t.toLowerCase() || (p.category || "").toLowerCase() === t.toLowerCase());
  }

  // Footwear Type
  if (dimension === "footwearTypes") {
    if (state.footwearTypes.length === 0) return true;
    const { department, subtype } = getProductTypeIdentifier(p);
    if (department !== "footwear") return false;
    return state.footwearTypes.some((t) => subtype === t.toLowerCase());
  }

  // Accessory Type
  if (dimension === "accessoryTypes") {
    if (state.accessoryTypes.length === 0) return true;
    const { department, subtype } = getProductTypeIdentifier(p);
    if (department !== "accessories") return false;
    return state.accessoryTypes.some((t) => subtype === t.toLowerCase());
  }

  // Sizes (OR within size group)
  if (dimension === "sizes") {
    if (state.sizes.length === 0) return true;
    return p.sizes?.some((s) => {
      const label = s.name || s.size || "";
      return state.sizes.includes(label) && s.inStock !== false && s.available !== false;
    });
  }

  // Colors (OR within color group)
  if (dimension === "colors") {
    if (state.colors.length === 0) return true;
    return p.colors?.some((c) => state.colors.map((x) => x.toLowerCase()).includes(c.name.toLowerCase()));
  }

  // Fits
  if (dimension === "fits") {
    if (state.fits.length === 0) return true;
    if (!p.fit) return false;
    return state.fits.some((f) => p.fit.toLowerCase().includes(f.toLowerCase()));
  }

  // Materials
  if (dimension === "materials") {
    if (state.materials.length === 0) return true;
    if (!p.material) return false;
    const normalized = normalizeMaterial(p.material);
    return state.materials.some(
      (m) => normalized.toLowerCase() === m.toLowerCase() || p.material.toLowerCase().includes(m.toLowerCase())
    );
  }

  // Collections
  if (dimension === "collections") {
    if (state.collections.length === 0) return true;
    return p.collections?.some((c) => state.collections.includes(c));
  }

  // Price
  if (dimension === "minPrice" || dimension === "maxPrice") {
    const effectivePrice = p.salePrice || p.price;
    if (state.minPrice !== undefined && effectivePrice < state.minPrice) return false;
    if (state.maxPrice !== undefined && effectivePrice > state.maxPrice) return false;
    return true;
  }

  // Availability
  if (dimension === "inStockOnly") {
    if (!state.inStockOnly) return true;
    return p.isAvailable && p.stock > 0;
  }

  // Sale
  if (dimension === "saleOnly") {
    if (!state.saleOnly && !context.isSaleOnly) return true;
    return p.isSale || !!p.salePrice;
  }

  // New In
  if (dimension === "newOnly") {
    if (!state.newOnly && !context.isNewOnly) return true;
    return p.isNewArrival;
  }

  return true;
}

/**
 * Filter products against all active filter groups (AND across groups)
 * Optionally ignoring a specific dimension for calculating facet counts.
 */
export function filterProducts(
  products: Product[],
  state: ActiveFilterState,
  context: CatalogueContext,
  ignoreDimension?: keyof ActiveFilterState
): Product[] {
  return products.filter((p) => {
    // 0. Base Context Checks
    if (context.isSaleOnly && !p.isSale && !p.salePrice) return false;
    if (context.isNewOnly && !p.isNewArrival) return false;
    if (context.collectionSlug && !p.collections.includes(context.collectionSlug as any)) return false;

    // Check Department constraint from URL/route context
    if (context.department !== "all") {
      const prodDept = getDepartmentForProduct(p);
      if (prodDept !== context.department) return false;
    }

    // Check default subtype if provided by static route
    if (context.defaultSubtype && context.defaultSubtype !== "all") {
      const { subtype } = getProductTypeIdentifier(p);
      const cat = (p.category || "").toLowerCase();
      const sub = (p.subCategory || "").toLowerCase();
      const target = context.defaultSubtype.toLowerCase();
      const match = subtype === target || cat === target || sub === target || sub.includes(target);
      if (!match) return false;
    }

    // Check default category if provided by route context
    if (context.defaultCategory && context.defaultCategory !== "all") {
      const cat = (p.category || "").toLowerCase();
      const sub = (p.subCategory || "").toLowerCase();
      const target = context.defaultCategory.toLowerCase();
      const match =
        cat === target ||
        sub === target ||
        (target === "shirts" && (cat === "shirts" || sub.includes("shirt"))) ||
        (target === "trousers" && (cat === "trousers" || sub.includes("trouser"))) ||
        p.tags?.some((t) => t.toLowerCase() === target);
      if (!match) return false;
    }

    // 1. Categories
    if (ignoreDimension !== "categories" && !matchesFilterDimension(p, "categories", state, context)) return false;
    // 2. Product Types
    if (ignoreDimension !== "productTypes" && !matchesFilterDimension(p, "productTypes", state, context)) return false;
    // 3. Footwear Types
    if (ignoreDimension !== "footwearTypes" && !matchesFilterDimension(p, "footwearTypes", state, context)) return false;
    // 4. Accessory Types
    if (ignoreDimension !== "accessoryTypes" && !matchesFilterDimension(p, "accessoryTypes", state, context)) return false;
    // 5. Sizes
    if (ignoreDimension !== "sizes" && !matchesFilterDimension(p, "sizes", state, context)) return false;
    // 6. Colors
    if (ignoreDimension !== "colors" && !matchesFilterDimension(p, "colors", state, context)) return false;
    // 7. Fits
    if (ignoreDimension !== "fits" && !matchesFilterDimension(p, "fits", state, context)) return false;
    // 8. Materials
    if (ignoreDimension !== "materials" && !matchesFilterDimension(p, "materials", state, context)) return false;
    // 9. Collections
    if (ignoreDimension !== "collections" && !matchesFilterDimension(p, "collections", state, context)) return false;
    // 10. Price
    if (ignoreDimension !== "minPrice" && ignoreDimension !== "maxPrice" && !matchesFilterDimension(p, "minPrice", state, context))
      return false;
    // 11. Availability
    if (ignoreDimension !== "inStockOnly" && !matchesFilterDimension(p, "inStockOnly", state, context)) return false;
    // 12. Sale
    if (ignoreDimension !== "saleOnly" && !matchesFilterDimension(p, "saleOnly", state, context)) return false;
    // 13. New In
    if (ignoreDimension !== "newOnly" && !matchesFilterDimension(p, "newOnly", state, context)) return false;

    return true;
  });
}

/**
 * Sort products according to selected sort option
 */
export function sortProducts(products: Product[], sort: ActiveFilterState["sort"]): Product[] {
  const items = [...products];
  switch (sort) {
    case "price-asc":
      return items.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    case "price-desc":
      return items.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    case "newest":
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "popularity":
      return items.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
    case "name-asc":
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case "recommended":
    default:
      return items;
  }
}

/**
 * Generate Context-Aware Filter Groups with dynamic Facet Counts and Zero-Result Prevention
 */
export function generateFilterGroups(
  baseProducts: Product[],
  currentState: ActiveFilterState,
  context: CatalogueContext
): FilterGroupConfig[] {
  const groups: FilterGroupConfig[] = [];

  const isFootwear = context.department === "footwear";
  const isAccessories = context.department === "accessories";
  const isClothing = context.department === "clothing";
  const isBroad = context.department === "all";

  // Products matching all filters EXCEPT the dimension being evaluated
  // This allows accurate zero-result checking and realistic counts
  const getFacetCount = (
    dimension: keyof ActiveFilterState,
    testState: ActiveFilterState
  ): number => {
    const subset = filterProducts(baseProducts, testState, context);
    return subset.length;
  };

  // ─────────────────────────────────────────────────────────────
  // 1. BROAD CATEGORY (On broad pages: Men / Women / Kids)
  // ─────────────────────────────────────────────────────────────
  if (isBroad && !context.isSaleOnly && !context.isNewOnly) {
    const categoryDefs = [
      { id: "clothing", label: "Clothing" },
      { id: "footwear", label: "Footwear" },
      { id: "accessories", label: "Accessories" },
    ];
    const options: FilterOptionItem[] = categoryDefs
      .map((cat) => {
        const count = getFacetCount("categories", { ...currentState, categories: [cat.id] });
        return {
          id: cat.id,
          label: cat.label,
          count,
          disabled: count === 0 && !currentState.categories.includes(cat.id),
        };
      })
      .filter((opt) => opt.count > 0 || currentState.categories.includes(opt.id));

    if (options.length > 0) {
      groups.push({
        id: "category",
        label: "CATEGORY",
        type: "checkbox",
        options,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. PRODUCT TYPE (Men Clothing, Women Clothing, Kids Clothing)
  // ─────────────────────────────────────────────────────────────
  if (isClothing || context.isSaleOnly || context.isNewOnly) {
    let typeList: { id: string; label: string }[] = [];

    if (context.gender === "men") {
      typeList = [
        { id: "t-shirts", label: "T-Shirts" },
        { id: "shirts", label: "Shirts" },
        { id: "polos", label: "Polos" },
        { id: "trousers", label: "Trousers" },
        { id: "denim", label: "Denim" },
        { id: "outerwear", label: "Outerwear" },
        { id: "knitwear", label: "Knitwear" },
        { id: "sweatshirts", label: "Sweatshirts" },
        { id: "shorts", label: "Shorts" },
        { id: "cargo", label: "Cargo" },
      ];
    } else if (context.gender === "women") {
      typeList = [
        { id: "dresses", label: "Dresses" },
        { id: "tops", label: "Tops" },
        { id: "shirts", label: "Shirts" },
        { id: "blouses", label: "Blouses" },
        { id: "trousers", label: "Trousers" },
        { id: "denim", label: "Denim" },
        { id: "skirts", label: "Skirts" },
        { id: "knitwear", label: "Knitwear" },
        { id: "outerwear", label: "Outerwear" },
        { id: "sweatshirts", label: "Sweatshirts" },
      ];
    } else if (context.gender === "kids") {
      typeList = [
        { id: "t-shirts", label: "T-Shirts" },
        { id: "sweatshirts", label: "Hoodies & Sweats" },
        { id: "trousers", label: "Trousers" },
        { id: "outerwear", label: "Jackets & Outerwear" },
        { id: "knitwear", label: "Knitwear" },
      ];
    } else {
      // Sale or New-in general clothing types
      typeList = [
        { id: "outerwear", label: "Outerwear" },
        { id: "trousers", label: "Trousers" },
        { id: "knitwear", label: "Knitwear" },
        { id: "shirts", label: "Shirts" },
        { id: "t-shirts", label: "T-Shirts" },
        { id: "denim", label: "Denim" },
      ];
    }

    const options: FilterOptionItem[] = typeList
      .map((t) => {
        const count = getFacetCount("productTypes", {
          ...currentState,
          productTypes: currentState.productTypes.includes(t.id) ? currentState.productTypes : [...currentState.productTypes, t.id],
        });
        return {
          id: t.id,
          label: t.label,
          count,
          disabled: count === 0 && !currentState.productTypes.includes(t.id),
        };
      })
      .filter((opt) => opt.count > 0 || currentState.productTypes.includes(opt.id));

    if (options.length > 0) {
      groups.push({
        id: "productType",
        label: "PRODUCT TYPE",
        type: "checkbox",
        options,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 3. FOOTWEAR TYPE (Dedicated Footwear pages)
  // ─────────────────────────────────────────────────────────────
  if (isFootwear) {
    const footwearList = [
      { id: "sneakers", label: "Sneakers" },
      { id: "loafers", label: "Loafers" },
      { id: "boots", label: "Boots" },
      { id: "slides", label: "Slides" },
      { id: "sandals", label: "Sandals" },
    ];
    const options: FilterOptionItem[] = footwearList
      .map((fw) => {
        const count = getFacetCount("footwearTypes", {
          ...currentState,
          footwearTypes: currentState.footwearTypes.includes(fw.id)
            ? currentState.footwearTypes
            : [...currentState.footwearTypes, fw.id],
        });
        return {
          id: fw.id,
          label: fw.label,
          count,
          disabled: count === 0 && !currentState.footwearTypes.includes(fw.id),
        };
      })
      .filter((opt) => opt.count > 0 || currentState.footwearTypes.includes(opt.id));

    if (options.length > 0) {
      groups.push({
        id: "footwearType",
        label: "FOOTWEAR TYPE",
        type: "checkbox",
        options,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 4. ACCESSORY TYPE (Dedicated Accessories pages)
  // ─────────────────────────────────────────────────────────────
  if (isAccessories) {
    const accList = [
      { id: "bags", label: "Bags & Briefcases" },
      { id: "wallets", label: "Wallets & Small Leather" },
      { id: "belts", label: "Belts" },
      { id: "caps", label: "Caps & Hats" },
      { id: "sunglasses", label: "Sunglasses" },
      { id: "socks", label: "Socks" },
      { id: "other", label: "Other Accessories" },
    ];
    const options: FilterOptionItem[] = accList
      .map((acc) => {
        const count = getFacetCount("accessoryTypes", {
          ...currentState,
          accessoryTypes: currentState.accessoryTypes.includes(acc.id)
            ? currentState.accessoryTypes
            : [...currentState.accessoryTypes, acc.id],
        });
        return {
          id: acc.id,
          label: acc.label,
          count,
          disabled: count === 0 && !currentState.accessoryTypes.includes(acc.id),
        };
      })
      .filter((opt) => opt.count > 0 || currentState.accessoryTypes.includes(opt.id));

    if (options.length > 0) {
      groups.push({
        id: "accessoryType",
        label: "ACCESSORY TYPE",
        type: "checkbox",
        options,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 5. SIZE (Apparel or Footwear or Kids Age/Size)
  // ─────────────────────────────────────────────────────────────
  // Notice: Do NOT show size for accessories unless size exists on products
  if (!isAccessories) {
    const rawSizes = new Set<string>();
    baseProducts.forEach((p) => {
      // In footwear, only gather footwear sizes
      if (isFootwear && getDepartmentForProduct(p) !== "footwear") return;
      if (isClothing && getDepartmentForProduct(p) !== "clothing") return;
      p.sizes?.forEach((s) => {
        const val = s.name || s.size;
        if (val) rawSizes.add(val);
      });
    });

    const sizeArray = Array.from(rawSizes).sort((a, b) => {
      // Sort numbers numerically, strings by standard apparel order
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      const order = ["XS", "S", "M", "L", "XL", "XXL", "4Y", "6Y", "8Y", "10Y", "12Y", "14Y"];
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return a.localeCompare(b);
    });

    const options: FilterOptionItem[] = sizeArray
      .map((size) => {
        const count = getFacetCount("sizes", {
          ...currentState,
          sizes: currentState.sizes.includes(size) ? currentState.sizes : [...currentState.sizes, size],
        });
        return {
          id: size,
          label: size,
          count,
          disabled: count === 0 && !currentState.sizes.includes(size),
        };
      })
      .filter((opt) => opt.count > 0 || currentState.sizes.includes(opt.id));

    if (options.length > 0) {
      groups.push({
        id: "size",
        label: context.gender === "kids" ? "AGE / SIZE" : isFootwear ? "FOOTWEAR SIZE" : "SIZE",
        type: "checkbox",
        options,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 6. COLOR (Derived data with Swatches)
  // ─────────────────────────────────────────────────────────────
  const colorMap = new Map<string, string>();
  baseProducts.forEach((p) => {
    p.colors?.forEach((c) => {
      if (c.name) colorMap.set(c.name, c.hex || "#111111");
    });
  });

  const optionsColors: FilterOptionItem[] = Array.from(colorMap.entries())
    .map(([colorName, hex]) => {
      const count = getFacetCount("colors", {
        ...currentState,
        colors: currentState.colors.includes(colorName) ? currentState.colors : [...currentState.colors, colorName],
      });
      return {
        id: colorName,
        label: colorName,
        hex,
        count,
        disabled: count === 0 && !currentState.colors.includes(colorName),
      };
    })
    .filter((opt) => opt.count > 0 || currentState.colors.includes(opt.id));

  if (optionsColors.length > 0) {
    groups.push({
      id: "color",
      label: "COLOR",
      type: "swatch",
      options: optionsColors,
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 7. FIT (Only for clothing, NEVER for footwear or accessories)
  // ─────────────────────────────────────────────────────────────
  if (!isFootwear && !isAccessories && context.gender !== "kids") {
    const rawFits = new Set<string>();
    baseProducts.forEach((p) => {
      if (p.fit) rawFits.add(p.fit);
    });

    const optionsFits: FilterOptionItem[] = Array.from(rawFits)
      .map((fit) => {
        const count = getFacetCount("fits", {
          ...currentState,
          fits: currentState.fits.includes(fit) ? currentState.fits : [...currentState.fits, fit],
        });
        return {
          id: fit,
          label: fit,
          count,
          disabled: count === 0 && !currentState.fits.includes(fit),
        };
      })
      .filter((opt) => opt.count > 0 || currentState.fits.includes(opt.id));

    if (optionsFits.length > 0) {
      groups.push({
        id: "fit",
        label: "FIT",
        type: "checkbox",
        options: optionsFits,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 8. MATERIAL
  // ─────────────────────────────────────────────────────────────
  const rawMaterials = new Set<string>();
  baseProducts.forEach((p) => {
    if (p.material) rawMaterials.add(normalizeMaterial(p.material));
  });

  const optionsMaterials: FilterOptionItem[] = Array.from(rawMaterials)
    .sort()
    .map((mat) => {
      const count = getFacetCount("materials", {
        ...currentState,
        materials: currentState.materials.includes(mat) ? currentState.materials : [...currentState.materials, mat],
      });
      return {
        id: mat,
        label: mat,
        count,
        disabled: count === 0 && !currentState.materials.includes(mat),
      };
    })
    .filter((opt) => opt.count > 0 || currentState.materials.includes(opt.id));

  if (optionsMaterials.length > 0) {
    groups.push({
      id: "material",
      label: "MATERIAL",
      type: "checkbox",
      options: optionsMaterials,
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 9. COLLECTION
  // ─────────────────────────────────────────────────────────────
  if (!context.collectionSlug) {
    const rawCollections = new Set<string>();
    baseProducts.forEach((p) => {
      p.collections?.forEach((c) => rawCollections.add(c));
    });

    const formatCollection = (id: string) => {
      return id
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    };

    const optionsCollections: FilterOptionItem[] = Array.from(rawCollections)
      .map((col) => {
        const count = getFacetCount("collections", {
          ...currentState,
          collections: currentState.collections.includes(col) ? currentState.collections : [...currentState.collections, col],
        });
        return {
          id: col,
          label: formatCollection(col),
          count,
          disabled: count === 0 && !currentState.collections.includes(col),
        };
      })
      .filter((opt) => opt.count > 0 || currentState.collections.includes(opt.id));

    if (optionsCollections.length > 0) {
      groups.push({
        id: "collection",
        label: "COLLECTION",
        type: "checkbox",
        options: optionsCollections,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 10. AVAILABILITY, SALE, NEW IN TOGGLES
  // ─────────────────────────────────────────────────────────────
  const inStockCount = getFacetCount("inStockOnly", { ...currentState, inStockOnly: true });
  const saleCount = getFacetCount("saleOnly", { ...currentState, saleOnly: true });
  const newCount = getFacetCount("newOnly", { ...currentState, newOnly: true });

  const toggles: FilterOptionItem[] = [
    {
      id: "inStockOnly",
      label: "In Stock Only",
      count: inStockCount,
      disabled: inStockCount === 0 && !currentState.inStockOnly,
    },
  ];

  if (!context.isSaleOnly) {
    toggles.push({
      id: "saleOnly",
      label: "Archival Sale",
      count: saleCount,
      disabled: saleCount === 0 && !currentState.saleOnly,
    });
  }

  if (!context.isNewOnly) {
    toggles.push({
      id: "newOnly",
      label: "New In Season",
      count: newCount,
      disabled: newCount === 0 && !currentState.newOnly,
    });
  }

  groups.push({
    id: "availability",
    label: "AVAILABILITY",
    type: "toggle",
    options: toggles,
  });

  return groups;
}

/**
 * Get min and max price bounds from the base catalogue
 */
export function getCataloguePriceBounds(products: Product[]): [number, number] {
  if (products.length === 0) return [0, 5000];
  let min = Infinity;
  let max = -Infinity;
  products.forEach((p) => {
    const pr = p.salePrice || p.price;
    if (pr < min) min = pr;
    if (pr > max) max = pr;
  });
  return [Math.floor(min / 10) * 10, Math.ceil(max / 10) * 10];
}
