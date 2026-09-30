import { Product } from "@/types/catalogue";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";

const FILENAME = "products.json";

function validateProductMedia(p: Product, idx: number): void {
  const checkUrl = (url: unknown, field: string) => {
    if (typeof url === "string" && url.trim().toLowerCase().startsWith("blob:")) {
      throw new Error(
        `[Validation Error] Product "${p.name || p.id || idx}" has an unpersisted blob URL in ${field}: "${url}". Product image has not been persisted yet. Blob URLs cannot be saved to repository.`
      );
    }
  };

  checkUrl(p.primaryImage, "primaryImage");
  checkUrl(p.hoverImage, "hoverImage");

  if (Array.isArray(p.images)) {
    p.images.forEach((img, imgIdx) => {
      checkUrl(img?.url, `images[${imgIdx}].url`);
    });
  }

  if (Array.isArray(p.variants)) {
    p.variants.forEach((v, vIdx) => {
      checkUrl(v?.imageOverride, `variants[${vIdx}].imageOverride`);
    });
  }

  if (Array.isArray(p.colors)) {
    p.colors.forEach((c, cIdx) => {
      checkUrl(c?.imageOverride, `colors[${cIdx}].imageOverride`);
      if (Array.isArray(c?.images)) {
        c.images.forEach((img, imgIdx) => {
          checkUrl(img?.url, `colors[${cIdx}].images[${imgIdx}].url`);
        });
      }
    });
  }

  if (Array.isArray(p.colorVariants)) {
    p.colorVariants.forEach((cv, cvIdx) => {
      if (Array.isArray(cv?.images)) {
        cv.images.forEach((img, imgIdx) => {
          checkUrl(img?.url, `colorVariants[${cvIdx}].images[${imgIdx}].url`);
        });
      }
    });
  }
}

function validateProducts(products: Product[]): void {
  const seenIds = new Set<string>();
  const seenSkus = new Set<string>();

  products.forEach((p, idx) => {
    if (!p.id) {
      throw new Error(`[Validation Error] Product at index ${idx} is missing mandatory ID.`);
    }
    if (seenIds.has(p.id)) {
      console.warn(`[Validation Warning] Duplicate Product ID found: ${p.id}`);
    }
    seenIds.add(p.id);

    if (p.sku) {
      if (seenSkus.has(p.sku)) {
        console.warn(`[Validation Warning] Duplicate SKU found: ${p.sku}`);
      }
      seenSkus.add(p.sku);
    }

    validateProductMedia(p, idx);
  });
}

export const productsRepository = {
  async getProducts(): Promise<Product[]> {
    const products = await readJsonFile<Product[]>(FILENAME, []);
    validateProducts(products);
    return products;
  },

  getProductsSync(): Product[] {
    const products = readJsonFileSync<Product[]>(FILENAME, []);
    return products;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id);
  },

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find((p) => p.slug === slug);
  },

  async createProduct(newProduct: Product): Promise<Product> {
    const products = await this.getProducts();
    const now = new Date().toISOString();
    const product: Product = {
      ...newProduct,
      createdAt: newProduct.createdAt || now,
      updatedAt: now,
    };

    const updatedList = [product, ...products];
    validateProducts(updatedList);
    await writeJsonFile(FILENAME, updatedList);
    return product;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID "${id}" does not exist in repository.`);
    }

    const updated: Product = {
      ...products[index],
      ...updates,
      id, // Immutable ID
      updatedAt: new Date().toISOString(),
    };

    products[index] = updated;
    validateProducts(products);
    await writeJsonFile(FILENAME, products);
    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;

    await writeJsonFile(FILENAME, filtered);
    return true;
  },

  async archiveProduct(id: string): Promise<Product> {
    return this.updateProduct(id, { status: "archived", isAvailable: false });
  },

  async restoreProduct(id: string): Promise<Product> {
    return this.updateProduct(id, { status: "active", isAvailable: true });
  },

  async duplicateProduct(id: string): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product) {
      throw new Error(`Cannot duplicate: Product with ID "${id}" not found.`);
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newId = `${product.id}-copy-${Date.now().toString(36)}`;
    const newSku = `${product.sku}-COPY-${randomSuffix}`;
    const newSlug = `${product.slug}-copy-${randomSuffix.toLowerCase()}`;
    const now = new Date().toISOString();

    const duplicatedVariants = product.variants?.map((v, idx) => ({
      ...v,
      id: `var-${Date.now()}-${idx}`,
      sku: `${v.sku}-COPY-${idx + 1}`,
    }));

    const duplicated: Product = {
      ...product,
      id: newId,
      sku: newSku,
      name: `${product.name} (Copy)`,
      slug: newSlug,
      status: "draft",
      variants: duplicatedVariants,
      createdAt: now,
      updatedAt: now,
    };

    return this.createProduct(duplicated);
  },

  async bulkUpdateProducts(ids: string[], updates: Partial<Product>): Promise<Product[]> {
    const products = await this.getProducts();
    const now = new Date().toISOString();
    const idSet = new Set(ids);

    const updatedList = products.map((p) => (idSet.has(p.id) ? { ...p, ...updates, updatedAt: now } : p));
    validateProducts(updatedList);
    await writeJsonFile(FILENAME, updatedList);
    return updatedList.filter((p) => idSet.has(p.id));
  },

  async bulkDeleteProducts(ids: string[]): Promise<boolean> {
    const products = await this.getProducts();
    const idSet = new Set(ids);
    const filtered = products.filter((p) => !idSet.has(p.id));
    await writeJsonFile(FILENAME, filtered);
    return true;
  },
};
