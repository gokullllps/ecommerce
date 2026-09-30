"use server";

import {
  productsRepository,
  categoriesRepository,
  collectionsRepository,
  inventoryRepository,
  themesRepository,
  promotionsRepository,
  ordersRepository,
  customersRepository,
  storefrontRepository,
  mediaRepository,
  auditLogsRepository,
  adminUsersRepository,
} from "@/lib/repositories";
import { Product } from "@/types/catalogue";
import {
  AdminCategory,
  AdminCollection,
  OrderStatus,
  AdminOrder,
  AdminCustomer,
  AdminPromotion,
  AdminThemeConfig,
  StoreSettings,
  StorefrontHeroSlide,
  StorefrontSectionConfig,
  MediaAsset,
  AdminUser,
  AdminRole,
  AuditLogEntry,
} from "@/types/admin";
import { revalidatePath } from "next/cache";
import { persistProductImageFile } from "@/lib/services/uploadService";
import { ValidationError } from "@/lib/errors";
import { assertPermission } from "@/lib/permissions";

/**
 * Loads all canonical data from JSON files on the server.
 */
export async function getCanonicalAdminData() {
  const [
    products,
    categories,
    collections,
    inventoryLogs,
    orders,
    customers,
    promotions,
    themes,
    storefrontData,
    mediaAssets,
    auditLogs,
    adminUsers,
  ] = await Promise.all([
    productsRepository.getProducts(),
    categoriesRepository.getCategories(),
    collectionsRepository.getCollections(),
    inventoryRepository.getInventoryLogs(),
    ordersRepository.getOrders(),
    customersRepository.getCustomers(),
    promotionsRepository.getPromotions(),
    themesRepository.getThemes(),
    storefrontRepository.getStorefrontData(),
    mediaRepository.getMediaAssets(),
    auditLogsRepository.getAuditLogs(),
    adminUsersRepository.getAdminUsers(),
  ]);

  return {
    products,
    categories,
    collections,
    inventoryLogs,
    orders,
    customers,
    promotions,
    themes,
    settings: storefrontData.settings,
    heroSlides: storefrontData.heroSlides,
    sections: storefrontData.sections,
    mediaAssets,
    auditLogs,
    adminUsers,
  };
}

// ==========================================
// 1. PRODUCTS
// ==========================================
export async function serverAddProduct(
  product: Product,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "products.edit");
  const created = await productsRepository.createProduct(product);
  await auditLogsRepository.logAction(
    "PRODUCT_CREATED",
    `Product ${created.name}`,
    `Created SKU ${created.sku} via JSON repository`,
    adminName
  );
  try {
    revalidatePath("/");
    revalidatePath("/men");
    revalidatePath("/women");
    revalidatePath("/kids");
    revalidatePath("/footwear");
    revalidatePath("/accessories");
    revalidatePath("/sale");
    revalidatePath("/new-in");
    revalidatePath(`/product/${created.slug}`);
    revalidatePath("/admin/products");
  } catch {}
  return created;
}

export async function serverUpdateProduct(
  product: Product,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "products.edit");
  const updated = await productsRepository.updateProduct(product.id, product);
  await auditLogsRepository.logAction(
    "PRODUCT_UPDATED",
    `Product ${updated.name}`,
    `Updated details & price ₹${updated.price} in JSON file`,
    adminName
  );
  try {
    revalidatePath("/");
    revalidatePath("/men");
    revalidatePath("/women");
    revalidatePath("/kids");
    revalidatePath("/footwear");
    revalidatePath("/accessories");
    revalidatePath("/sale");
    revalidatePath("/new-in");
    revalidatePath(`/product/${updated.slug}`);
    revalidatePath("/admin/products");
  } catch {}
  return updated;
}

export async function serverUploadProductImage(
  formData: FormData,
  role?: AdminRole
) {
  if (role) assertPermission(role, "products.edit");
  const files = formData.getAll("files") as File[];
  const singleFile = formData.get("file") as File | null;
  const productId = (formData.get("productId") as string) || "prod";

  const filesToUpload: File[] = [];
  if (singleFile && singleFile.size > 0) filesToUpload.push(singleFile);
  for (const f of files) {
    if (f && f.size > 0 && !filesToUpload.includes(f)) filesToUpload.push(f);
  }

  if (filesToUpload.length === 0) {
    throw new ValidationError("No image files provided for upload.");
  }

  const results = [];
  for (const f of filesToUpload) {
    const res = await persistProductImageFile(f, productId);
    results.push(res);
  }

  return {
    success: true,
    data: results,
    url: results[0]?.url,
  };
}

export async function serverDeleteProduct(
  productId: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "products.edit");
  const product = await productsRepository.getProductById(productId);
  const ok = await productsRepository.deleteProduct(productId);
  if (ok) {
    await auditLogsRepository.logAction(
      "PRODUCT_DELETED",
      `Product ${product?.name || productId}`,
      `Deleted from JSON repository`,
      adminName
    );
  }
  return ok;
}

export async function serverArchiveProduct(
  productId: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "products.edit");
  const archived = await productsRepository.archiveProduct(productId);
  await auditLogsRepository.logAction(
    "PRODUCT_ARCHIVED",
    `Product ${archived.name}`,
    `Archived in JSON file`,
    adminName
  );
  return archived;
}

export async function serverRestoreProduct(
  productId: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "products.edit");
  const restored = await productsRepository.restoreProduct(productId);
  await auditLogsRepository.logAction(
    "PRODUCT_RESTORED",
    `Product ${restored.name}`,
    `Restored active status in JSON file`,
    adminName
  );
  return restored;
}

export async function serverDuplicateProduct(
  productId: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "products.edit");
  const duplicated = await productsRepository.duplicateProduct(productId);
  await auditLogsRepository.logAction(
    "PRODUCT_DUPLICATED",
    `Product ${duplicated.name}`,
    `Duplicated to SKU ${duplicated.sku} in JSON file`,
    adminName
  );
  return duplicated;
}

export async function serverBulkUpdateProducts(
  ids: string[],
  updates: Partial<Product>,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "products.edit");
  const updated = await productsRepository.bulkUpdateProducts(ids, updates);
  await auditLogsRepository.logAction(
    "PRODUCT_BULK_UPDATED",
    `${ids.length} Products`,
    `Applied updates in JSON: ${Object.keys(updates).join(", ")}`,
    adminName
  );
  return updated;
}

export async function serverBulkDeleteProducts(
  ids: string[],
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "products.edit");
  const ok = await productsRepository.bulkDeleteProducts(ids);
  if (ok) {
    await auditLogsRepository.logAction(
      "PRODUCT_BULK_DELETED",
      `${ids.length} Products`,
      `Deleted from JSON files`,
      adminName
    );
  }
  return ok;
}

// ==========================================
// 2. CATEGORIES
// ==========================================
export async function serverAddCategory(
  category: AdminCategory,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "categories.manage");
  const created = await categoriesRepository.createCategory(category);
  await auditLogsRepository.logAction(
    "CATEGORY_CREATED",
    `Category ${created.name}`,
    `Created /${created.slug} in JSON file`,
    adminName
  );
  return created;
}

export async function serverUpdateCategory(
  category: AdminCategory,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "categories.manage");
  const updated = await categoriesRepository.updateCategory(category.id, category);
  await auditLogsRepository.logAction(
    "CATEGORY_UPDATED",
    `Category ${updated.name}`,
    `Updated /${updated.slug} in JSON file`,
    adminName
  );
  return updated;
}

export async function serverDeleteCategory(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "categories.manage");
  const cat = await categoriesRepository.getCategoryById(id);
  const ok = await categoriesRepository.deleteCategory(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "CATEGORY_DELETED",
      `Category ${cat?.name || id}`,
      `Deleted from JSON file`,
      adminName
    );
  }
  return ok;
}

export async function serverReorderCategories(
  categories: AdminCategory[],
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "categories.manage");
  const reordered = await categoriesRepository.reorderCategories(categories);
  await auditLogsRepository.logAction(
    "CATEGORY_REORDERED",
    "Category Hierarchy",
    "Persisted reordered sequence in categories.json",
    adminName
  );
  return reordered;
}

// ==========================================
// 3. COLLECTIONS
// ==========================================
export async function serverAddCollection(
  collection: AdminCollection,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "collections.manage");
  const created = await collectionsRepository.createCollection(collection);
  await auditLogsRepository.logAction(
    "COLLECTION_CREATED",
    `Collection ${created.name}`,
    `Created ${created.mode} collection in collections.json`,
    adminName
  );
  return created;
}

export async function serverUpdateCollection(
  collection: AdminCollection,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "collections.manage");
  const updated = await collectionsRepository.updateCollection(collection.id, collection);
  await auditLogsRepository.logAction(
    "COLLECTION_UPDATED",
    `Collection ${updated.name}`,
    `Updated in collections.json`,
    adminName
  );
  return updated;
}

export async function serverDeleteCollection(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "collections.manage");
  const col = await collectionsRepository.getCollectionById(id);
  const ok = await collectionsRepository.deleteCollection(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "COLLECTION_DELETED",
      `Collection ${col?.name || id}`,
      "Deleted from collections.json",
      adminName
    );
  }
  return ok;
}

export async function serverReorderCollectionProducts(
  id: string,
  productIds: string[],
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "collections.manage");
  const updated = await collectionsRepository.reorderCollectionProducts(id, productIds);
  await auditLogsRepository.logAction(
    "COLLECTION_PRODUCTS_REORDERED",
    `Collection ${updated.name}`,
    `Reordered ${productIds.length} products in collections.json`,
    adminName
  );
  return updated;
}

// ==========================================
// 4. INVENTORY
// ==========================================
export async function serverAdjustInventory(
  productId: string,
  variantSku: string | undefined,
  delta: number,
  reason: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "inventory.manage");
  const result = await inventoryRepository.adjustInventory(
    productId,
    variantSku,
    delta,
    reason,
    adminName
  );
  await auditLogsRepository.logAction(
    "STOCK_ADJUSTED",
    `${result.updatedProduct.name} ${variantSku ? `(${variantSku})` : ""}`,
    `Adjusted stock by ${delta >= 0 ? `+${delta}` : delta} (Reason: ${reason}). Persisted to products.json & inventory.json`,
    adminName
  );
  return result;
}

// ==========================================
// 5. ORDERS
// ==========================================
export async function serverUpdateOrder(
  order: AdminOrder,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "orders.edit");
  const updated = await ordersRepository.updateOrder(order.id, order);
  await auditLogsRepository.logAction(
    "ORDER_UPDATED",
    `Order ${order.orderNumber || order.id}`,
    `Updated order details in orders.json`,
    adminName
  );
  return updated;
}

export async function serverUpdateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  carrier?: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "orders.edit");
  const updated = await ordersRepository.updateOrderStatus(orderId, status, trackingNumber, carrier);
  await auditLogsRepository.logAction(
    "ORDER_STATUS_CHANGED",
    `Order ${updated.orderNumber || orderId}`,
    `Status changed to ${status.toUpperCase()}${trackingNumber ? ` (Tracking: ${trackingNumber})` : ""} in orders.json`,
    adminName
  );
  return updated;
}

export async function serverCancelOrder(
  orderId: string,
  reason: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "orders.edit");
  const updated = await ordersRepository.updateOrderStatus(orderId, "cancelled");
  await auditLogsRepository.logAction(
    "ORDER_CANCELLED",
    `Order ${updated.orderNumber || orderId}`,
    `Order cancelled with reason: "${reason}"`,
    adminName
  );
  return updated;
}

// ==========================================
// 6. CUSTOMERS
// ==========================================
export async function serverCreateCustomer(
  customer: AdminCustomer,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "customers.edit");
  const created = await customersRepository.createCustomer(customer);
  await auditLogsRepository.logAction(
    "CUSTOMER_CREATED",
    `Patron ${created.name}`,
    `Created customer profile for ${created.email}`,
    adminName
  );
  return created;
}

export async function serverUpdateCustomer(
  customer: AdminCustomer,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "customers.edit");
  const updated = await customersRepository.updateCustomer(customer.id, customer);
  await auditLogsRepository.logAction(
    "CUSTOMER_UPDATED",
    `Patron ${updated.name}`,
    `Updated status to ${updated.status} / spend ₹${updated.totalSpent}`,
    adminName
  );
  return updated;
}

export async function serverDeleteCustomer(
  customerId: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "customers.edit");
  const customer = await customersRepository.getCustomerById(customerId);
  const ok = await customersRepository.deleteCustomer(customerId);
  if (ok) {
    await auditLogsRepository.logAction(
      "CUSTOMER_DELETED",
      `Patron ${customer?.name || customerId}`,
      `Removed patron record from customers.json`,
      adminName
    );
  }
  return ok;
}

// ==========================================
// 7. PROMOTIONS
// ==========================================
export async function serverAddPromotion(
  promo: AdminPromotion,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "promotions.manage");
  const created = await promotionsRepository.createPromotion(promo);
  await auditLogsRepository.logAction(
    "PROMOTION_CREATED",
    `Privilege Code ${created.code}`,
    `Created ${created.type === "percentage" ? `${created.value}%` : `₹${created.value}`} discount in promotions.json`,
    adminName
  );
  return created;
}

export async function serverUpdatePromotion(
  promo: AdminPromotion,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "promotions.manage");
  const updated = await promotionsRepository.updatePromotion(promo.id, promo);
  await auditLogsRepository.logAction(
    "PROMOTION_UPDATED",
    `Privilege Code ${updated.code}`,
    `Updated rules & limits in promotions.json`,
    adminName
  );
  return updated;
}

export async function serverTogglePromotion(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "promotions.manage");
  const updated = await promotionsRepository.togglePromotion(id);
  await auditLogsRepository.logAction(
    "PROMOTION_TOGGLED",
    `Privilege Code ${updated.code}`,
    `Active status set to ${updated.isActive ? "ACTIVE" : "INACTIVE"}`,
    adminName
  );
  return updated;
}

export async function serverDuplicatePromotion(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "promotions.manage");
  const duplicated = await promotionsRepository.duplicatePromotion(id);
  await auditLogsRepository.logAction(
    "PROMOTION_DUPLICATED",
    `Privilege Code ${duplicated.code}`,
    `Duplicated from promo ${id}`,
    adminName
  );
  return duplicated;
}

export async function serverDeletePromotion(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "promotions.manage");
  const promo = await promotionsRepository.getPromotionById(id);
  const ok = await promotionsRepository.deletePromotion(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "PROMOTION_DELETED",
      `Privilege Code ${promo?.code || id}`,
      `Removed from promotions.json`,
      adminName
    );
  }
  return ok;
}

// ==========================================
// 8. THEMES
// ==========================================
export async function serverCreateTheme(
  theme: AdminThemeConfig,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "themes.manage");
  const created = await themesRepository.createTheme(theme);
  await auditLogsRepository.logAction(
    "THEME_CREATED",
    `Theme "${created.name}"`,
    `Created ${created.type} theme in themes.json`,
    adminName
  );
  return created;
}

export async function serverUpdateTheme(
  theme: AdminThemeConfig,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "themes.manage");
  const updated = await themesRepository.updateTheme(theme.id, theme);
  await auditLogsRepository.logAction(
    "THEME_UPDATED",
    `Theme "${updated.name}"`,
    "Updated theme configuration in themes.json",
    adminName
  );
  return updated;
}

export async function serverActivateTheme(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "themes.manage");
  const updated = await themesRepository.activateTheme(id);
  await auditLogsRepository.logAction(
    "THEME_ACTIVATED",
    `Theme "${updated.name}"`,
    `Activated theme for scope: ${updated.scope}`,
    adminName
  );
  return updated;
}

export async function serverDeactivateTheme(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "themes.manage");
  const updated = await themesRepository.deactivateTheme(id);
  await auditLogsRepository.logAction(
    "THEME_DEACTIVATED",
    `Theme "${updated.name}"`,
    "Deactivated theme and returned to draft",
    adminName
  );
  return updated;
}

export async function serverDuplicateTheme(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "themes.manage");
  const duplicated = await themesRepository.duplicateTheme(id);
  await auditLogsRepository.logAction(
    "THEME_DUPLICATED",
    `Theme "${duplicated.name}"`,
    `Duplicated from theme ${id}`,
    adminName
  );
  return duplicated;
}

export async function serverDeleteTheme(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "themes.manage");
  const theme = await themesRepository.getThemeById(id);
  const ok = await themesRepository.deleteTheme(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "THEME_DELETED",
      `Theme "${theme?.name || id}"`,
      "Removed theme from themes.json",
      adminName
    );
  }
  return ok;
}

// ==========================================
// 9. STOREFRONT CONTENT CMS
// ==========================================
export async function serverUpdateHeroSlides(
  slides: StorefrontHeroSlide[],
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "storefront.manage");
  const updated = await storefrontRepository.updateHeroSlides(slides);
  await auditLogsRepository.logAction(
    "HERO_SLIDES_UPDATED",
    "Storefront Hero",
    `Updated ${slides.length} hero slides in storefront.json`,
    adminName
  );
  return updated;
}

export async function serverUpdateSections(
  sections: StorefrontSectionConfig[],
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "storefront.manage");
  const updated = await storefrontRepository.updateSections(sections);
  await auditLogsRepository.logAction(
    "SECTIONS_UPDATED",
    "Storefront Layout",
    `Updated layout and sequence of ${sections.length} homepage sections`,
    adminName
  );
  return updated;
}

export async function serverUpdateStoreSettings(
  settings: Partial<StoreSettings>,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "settings.manage");
  const updated = await storefrontRepository.updateSettings(settings);
  await auditLogsRepository.logAction(
    "SETTINGS_UPDATED",
    "Commerce Platform Settings",
    `Updated store settings in storefront.json`,
    adminName
  );
  return updated;
}

// ==========================================
// 10. MEDIA ASSETS
// ==========================================
export async function serverAddMediaAsset(
  asset: MediaAsset,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "media.manage");
  const created = await mediaRepository.createMediaAsset(asset);
  await auditLogsRepository.logAction(
    "MEDIA_UPLOADED",
    `Asset ${asset.filename}`,
    `Registered metadata for ${asset.folder} (${asset.mimeType}) in media.json`,
    adminName
  );
  return created;
}

export async function serverUpdateMediaAsset(
  asset: MediaAsset,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "media.manage");
  const updated = await mediaRepository.updateMediaAsset(asset.id, asset);
  await auditLogsRepository.logAction(
    "MEDIA_UPDATED",
    `Asset ${updated.filename}`,
    `Updated metadata and tags in media.json`,
    adminName
  );
  return updated;
}

export async function serverDeleteMediaAsset(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "media.manage");
  const asset = await mediaRepository.getMediaAssetById(id);
  const ok = await mediaRepository.deleteMediaAsset(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "MEDIA_DELETED",
      `Asset ${asset?.filename || id}`,
      "Deleted media metadata record from media.json",
      adminName
    );
  }
  return ok;
}

// ==========================================
// 11. ADMIN USERS & ROLES
// ==========================================
export async function serverCreateAdminUser(
  user: AdminUser,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "users.manage");
  const created = await adminUsersRepository.createAdminUser(user);
  await auditLogsRepository.logAction(
    "ADMIN_USER_CREATED",
    `User ${created.name}`,
    `Assigned role ${created.role} with ${created.permissions.length} permissions in admin-users.json`,
    adminName
  );
  return created;
}

export async function serverUpdateAdminUser(
  user: AdminUser,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "users.manage");
  const updated = await adminUsersRepository.updateAdminUser(user.id, user);
  await auditLogsRepository.logAction(
    "ADMIN_USER_UPDATED",
    `User ${updated.name}`,
    `Updated status ${updated.status} and role ${updated.role}`,
    adminName
  );
  return updated;
}

export async function serverDeleteAdminUser(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  if (role) assertPermission(role, "users.manage");
  const user = await adminUsersRepository.getAdminUserById(id);
  const ok = await adminUsersRepository.deleteAdminUser(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "ADMIN_USER_DELETED",
      `User ${user?.name || id}`,
      "Removed administrative user account from admin-users.json",
      adminName
    );
  }
  return ok;
}

// ==========================================
// 12. AUDIT LOGGING
// ==========================================
export async function serverLogAction(
  action: string,
  resource: string,
  details: string,
  adminName: string,
  adminEmail: string = "admin@pablo-luxury.com"
): Promise<AuditLogEntry> {
  return auditLogsRepository.logAction(action, resource, details, adminName, adminEmail);
}
