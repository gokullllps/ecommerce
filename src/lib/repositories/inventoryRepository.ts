import { InventoryLog } from "@/types/admin";
import { Product } from "@/types/catalogue";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";
import { productsRepository } from "./productsRepository";

const FILENAME = "inventory.json";

export const inventoryRepository = {
  async getInventoryLogs(): Promise<InventoryLog[]> {
    const list = await readJsonFile<InventoryLog[]>(FILENAME, []);
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getInventoryLogsSync(): InventoryLog[] {
    const list = readJsonFileSync<InventoryLog[]>(FILENAME, []);
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async adjustInventory(
    productId: string,
    variantSku: string | undefined,
    delta: number,
    reason: string,
    adminName: string
  ): Promise<{ updatedProduct: Product; logEntry: InventoryLog }> {
    const product = await productsRepository.getProductById(productId);
    if (!product) {
      throw new Error(`Cannot adjust inventory: Product with ID "${productId}" not found.`);
    }

    let prevQty = product.stock ?? 10;
    let newQty = Math.max(0, prevQty + delta);
    let variantTitle: string | undefined;
    let updatedProductData: Partial<Product>;

    if (variantSku && product.variants && product.variants.length > 0) {
      const updatedVariants = product.variants.map((v) => {
        if (v.sku === variantSku) {
          prevQty = v.stock;
          newQty = Math.max(0, v.stock + delta);
          variantTitle = `${v.colorName} / ${v.sizeName}`;
          return { ...v, stock: newQty, isAvailable: newQty > 0 };
        }
        return v;
      });

      const totalVariantStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
      updatedProductData = {
        variants: updatedVariants,
        stock: totalVariantStock,
        isAvailable: totalVariantStock > 0,
      };
    } else {
      updatedProductData = {
        stock: newQty,
        isAvailable: newQty > 0,
      };
    }

    // 1. Update authoritative stock in productsRepository
    const updatedProduct = await productsRepository.updateProduct(productId, updatedProductData);

    // 2. Record immutable history in inventory.json
    const logEntry: InventoryLog = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      productId,
      productName: product.name,
      variantSku,
      variantTitle,
      previousQuantity: prevQty,
      newQuantity: newQty,
      adjustment: delta,
      reason,
      adminName,
      timestamp: new Date().toISOString(),
    };

    const logs = await this.getInventoryLogs();
    const updatedLogs = [logEntry, ...logs.slice(0, 199)];
    await writeJsonFile(FILENAME, updatedLogs);

    return { updatedProduct, logEntry };
  },
};
