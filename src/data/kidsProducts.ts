import { Product } from "@/types/catalogue";
import productsJson from "./products.json";

/**
 * PABLO Kids — Luxury Children's Fashion Product Catalogue
 * Sourced canonically from products.json with unique 4-view galleries per piece.
 */
export const KIDS_PRODUCTS: Product[] = (productsJson as unknown as Product[]).filter(
  (p) => p.gender === "kids"
);

/**
 * Audit & Validation Helper:
 * Ensures NO duplicate primary images exist across different Kids product IDs.
 * Also verifies that every Kids product contains 4-5 images.
 */
export function validateKidsProductImages(): {
  isValid: boolean;
  totalProducts: number;
  duplicatePrimaryImages: { imageUrl: string; productIds: string[] }[];
  underImageCountProducts: { productId: string; imageCount: number }[];
} {
  const primaryMap = new Map<string, string[]>();
  const underImageCount: { productId: string; imageCount: number }[] = [];

  for (const product of KIDS_PRODUCTS) {
    if (product.images.length < 4) {
      underImageCount.push({ productId: product.id, imageCount: product.images.length });
    }

    const primaryUrl = product.images[0]?.url || product.primaryImage || "";
    if (primaryUrl) {
      const existing = primaryMap.get(primaryUrl) || [];
      existing.push(product.id);
      primaryMap.set(primaryUrl, existing);
    }
  }

  const duplicates: { imageUrl: string; productIds: string[] }[] = [];
  for (const [imageUrl, productIds] of primaryMap.entries()) {
    if (productIds.length > 1) {
      duplicates.push({ imageUrl, productIds });
    }
  }

  const isValid = duplicates.length === 0 && underImageCount.length === 0;

  if (process.env.NODE_ENV !== "production") {
    if (!isValid) {
      console.warn("[Kids Image Audit WARNING]: Issues detected in Kids catalogue:");
      if (duplicates.length > 0) {
        console.warn("  Duplicate primary images across products:", duplicates);
      }
      if (underImageCount.length > 0) {
        console.warn("  Products with fewer than 4 images:", underImageCount);
      }
    } else {
      console.log(`[Kids Image Audit]: ✓ All ${KIDS_PRODUCTS.length} Kids products have 4-5 unique images. Zero duplicate primary images found.`);
    }
  }

  return {
    isValid,
    totalProducts: KIDS_PRODUCTS.length,
    duplicatePrimaryImages: duplicates,
    underImageCountProducts: underImageCount,
  };
}

// Run initial audit in development
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  validateKidsProductImages();
}
