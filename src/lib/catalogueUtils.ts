import { FilterState, Product, SortOption } from "@/types/catalogue";

export function formatPrice(amount: number): string {
  // Format prices as INR (₹XX,XXX)
  const displayAmount = amount < 10000 ? amount * 100 : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(displayAmount);
}

export function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products.filter((product) => {
    // 1. Category filter
    if (filters.category && filters.category !== "all") {
      if (product.category !== filters.category) {
        return false;
      }
    }

    // 2. Subcategory filter
    if (filters.subCategory) {
      if (product.subCategory !== filters.subCategory) {
        return false;
      }
    }

    // 3. Collection filter
    if (filters.collection && filters.collection !== "all") {
      if (!product.collections.includes(filters.collection)) {
        return false;
      }
    }

    // 4. Sizes filter
    if (filters.sizes && filters.sizes.length > 0) {
      const hasSize = product.sizes.some((s: any) => {
        const name = s.name || s.size;
        const inStock = s.inStock !== false && s.available !== false;
        return name && filters.sizes.includes(name) && inStock;
      });
      if (!hasSize) return false;
    }

    // 5. Colors filter
    if (filters.colors && filters.colors.length > 0) {
      const hasColor = product.colors.some((c) =>
        filters.colors.includes(c.name)
      );
      if (!hasColor) return false;
    }

    // 6. Fits filter
    if (filters.fits && filters.fits.length > 0) {
      if (!filters.fits.some((f) => product.fit.toLowerCase().includes(f.toLowerCase()))) {
        return false;
      }
    }

    // 7. Materials filter
    if (filters.materials && filters.materials.length > 0) {
      if (!filters.materials.some((m) => product.material.toLowerCase().includes(m.toLowerCase()))) {
        return false;
      }
    }

    // 8. Price range filter
    if (filters.priceRange) {
      const activePrice = product.salePrice ?? product.price;
      const [min, max] = filters.priceRange;
      if (activePrice < min || activePrice > max) {
        return false;
      }
    }

    // 9. Availability filter
    if (filters.inStockOnly) {
      if (!product.isAvailable || product.stock <= 0) {
        return false;
      }
    }

    // 10. Sale only filter
    if (filters.saleOnly) {
      if (!product.isSale) {
        return false;
      }
    }

    // 11. New arrivals only filter
    if (filters.newArrivalsOnly) {
      if (!product.isNewArrival) {
        return false;
      }
    }

    return true;
  });
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const cloned = [...products];

  switch (sort) {
    case "newest":
      return cloned.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "price-asc":
      return cloned.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    case "price-desc":
      return cloned.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    case "popularity":
      return cloned.sort((a, b) => b.popularityScore - a.popularityScore);
    case "recommended":
    default:
      return cloned;
  }
}

export function extractFilterOptions(products: Product[]) {
  const sizeSet = new Set<string>();
  const colorMap = new Map<string, string>();
  const fitSet = new Set<string>();
  const materialSet = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;

  for (const product of products) {
    for (const s of product.sizes) {
      const label = (s as any).name || (s as any).size;
      if (label) sizeSet.add(label);
    }
    for (const c of product.colors) {
      colorMap.set(c.name, c.hex);
    }
    if (product.fit) {
      fitSet.add(product.fit);
    }
    if (product.material) {
      materialSet.add(product.material);
    }
    const currentPrice = product.salePrice ?? product.price;
    if (currentPrice < minPrice) minPrice = currentPrice;
    if (currentPrice > maxPrice) maxPrice = currentPrice;
  }

  return {
    sizes: Array.from(sizeSet),
    colors: Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex })),
    fits: Array.from(fitSet),
    materials: Array.from(materialSet),
    priceBounds: [minPrice === Infinity ? 0 : minPrice, maxPrice === 0 ? 3000 : maxPrice] as [number, number],
  };
}
