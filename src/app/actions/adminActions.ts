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
import { requireAdminSession } from "@/lib/auth/adminAuth";

/**
 * Loads all canonical data from JSON files on the server.
 * Requires active admin session with dashboard.view permission.
 */
export async function getCanonicalAdminData() {
  await requireAdminSession("dashboard.view");

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
  const session = await requireAdminSession("products.edit");
  const effectiveAdmin = session.name || adminName;
  const created = await productsRepository.createProduct(product);
  await auditLogsRepository.logAction(
    "PRODUCT_CREATED",
    `Product ${created.name}`,
    `Created SKU ${created.sku} via JSON repository`,
    effectiveAdmin,
    session.email
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
  const session = await requireAdminSession("products.edit");
  const effectiveAdmin = session.name || adminName;
  const updated = await productsRepository.updateProduct(product.id, product);
  await auditLogsRepository.logAction(
    "PRODUCT_UPDATED",
    `Product ${updated.name}`,
    `Updated details & price ₹${updated.price} in JSON file`,
    effectiveAdmin,
    session.email
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
  await requireAdminSession("products.edit");
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
  const session = await requireAdminSession("products.edit");
  const effectiveAdmin = session.name || adminName;
  const product = await productsRepository.getProductById(productId);
  const ok = await productsRepository.deleteProduct(productId);
  if (ok) {
    await auditLogsRepository.logAction(
      "PRODUCT_DELETED",
      `Product ${product?.name || productId}`,
      `Deleted from JSON repository`,
      effectiveAdmin,
      session.email
    );
  }
  return ok;
}

export async function serverArchiveProduct(
  productId: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("products.edit");
  const effectiveAdmin = session.name || adminName;
  const archived = await productsRepository.archiveProduct(productId);
  await auditLogsRepository.logAction(
    "PRODUCT_ARCHIVED",
    `Product ${archived.name}`,
    `Archived in JSON file`,
    effectiveAdmin,
    session.email
  );
  return archived;
}

export async function serverRestoreProduct(
  productId: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("products.edit");
  const effectiveAdmin = session.name || adminName;
  const restored = await productsRepository.restoreProduct(productId);
  await auditLogsRepository.logAction(
    "PRODUCT_RESTORED",
    `Product ${restored.name}`,
    `Restored active status in JSON file`,
    effectiveAdmin,
    session.email
  );
  return restored;
}

export async function serverDuplicateProduct(
  productId: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("products.edit");
  const effectiveAdmin = session.name || adminName;
  const duplicated = await productsRepository.duplicateProduct(productId);
  await auditLogsRepository.logAction(
    "PRODUCT_DUPLICATED",
    `Product ${duplicated.name}`,
    `Duplicated to SKU ${duplicated.sku} in JSON file`,
    effectiveAdmin,
    session.email
  );
  return duplicated;
}

export async function serverBulkUpdateProducts(
  ids: string[],
  updates: Partial<Product>,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("products.edit");
  const effectiveAdmin = session.name || adminName;
  const updated = await productsRepository.bulkUpdateProducts(ids, updates);
  await auditLogsRepository.logAction(
    "PRODUCT_BULK_UPDATED",
    `${ids.length} Products`,
    `Applied updates in JSON: ${Object.keys(updates).join(", ")}`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverBulkDeleteProducts(
  ids: string[],
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("products.edit");
  const effectiveAdmin = session.name || adminName;
  const ok = await productsRepository.bulkDeleteProducts(ids);
  if (ok) {
    await auditLogsRepository.logAction(
      "PRODUCT_BULK_DELETED",
      `${ids.length} Products`,
      `Deleted from JSON files`,
      effectiveAdmin,
      session.email
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
  const session = await requireAdminSession("categories.manage");
  const effectiveAdmin = session.name || adminName;
  const created = await categoriesRepository.createCategory(category);
  await auditLogsRepository.logAction(
    "CATEGORY_CREATED",
    `Category ${created.name}`,
    `Created /${created.slug} in JSON file`,
    effectiveAdmin,
    session.email
  );
  return created;
}

export async function serverUpdateCategory(
  category: AdminCategory,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("categories.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await categoriesRepository.updateCategory(category.id, category);
  await auditLogsRepository.logAction(
    "CATEGORY_UPDATED",
    `Category ${updated.name}`,
    `Updated /${updated.slug} in JSON file`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverDeleteCategory(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("categories.manage");
  const effectiveAdmin = session.name || adminName;
  const cat = await categoriesRepository.getCategoryById(id);
  const ok = await categoriesRepository.deleteCategory(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "CATEGORY_DELETED",
      `Category ${cat?.name || id}`,
      `Deleted from JSON file`,
      effectiveAdmin,
      session.email
    );
  }
  return ok;
}

export async function serverReorderCategories(
  categories: AdminCategory[],
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("categories.manage");
  const effectiveAdmin = session.name || adminName;
  const reordered = await categoriesRepository.reorderCategories(categories);
  await auditLogsRepository.logAction(
    "CATEGORY_REORDERED",
    "Category Hierarchy",
    "Persisted reordered sequence in categories.json",
    effectiveAdmin,
    session.email
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
  const session = await requireAdminSession("collections.manage");
  const effectiveAdmin = session.name || adminName;
  const created = await collectionsRepository.createCollection(collection);
  await auditLogsRepository.logAction(
    "COLLECTION_CREATED",
    `Collection ${created.name}`,
    `Created ${created.mode} collection in collections.json`,
    effectiveAdmin,
    session.email
  );
  return created;
}

export async function serverUpdateCollection(
  collection: AdminCollection,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("collections.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await collectionsRepository.updateCollection(collection.id, collection);
  await auditLogsRepository.logAction(
    "COLLECTION_UPDATED",
    `Collection ${updated.name}`,
    `Updated in collections.json`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverDeleteCollection(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("collections.manage");
  const effectiveAdmin = session.name || adminName;
  const col = await collectionsRepository.getCollectionById(id);
  const ok = await collectionsRepository.deleteCollection(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "COLLECTION_DELETED",
      `Collection ${col?.name || id}`,
      "Deleted from collections.json",
      effectiveAdmin,
      session.email
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
  const session = await requireAdminSession("collections.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await collectionsRepository.reorderCollectionProducts(id, productIds);
  await auditLogsRepository.logAction(
    "COLLECTION_PRODUCTS_REORDERED",
    `Collection ${updated.name}`,
    `Reordered ${productIds.length} products in collections.json`,
    effectiveAdmin,
    session.email
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
  const session = await requireAdminSession("inventory.manage");
  const effectiveAdmin = session.name || adminName;
  const result = await inventoryRepository.adjustInventory(
    productId,
    variantSku,
    delta,
    reason,
    effectiveAdmin
  );
  await auditLogsRepository.logAction(
    "STOCK_ADJUSTED",
    `${result.updatedProduct.name} ${variantSku ? `(${variantSku})` : ""}`,
    `Adjusted stock by ${delta >= 0 ? `+${delta}` : delta} (Reason: ${reason}). Persisted to products.json & inventory.json`,
    effectiveAdmin,
    session.email
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
  const session = await requireAdminSession("orders.edit");
  const effectiveAdmin = session.name || adminName;
  const updated = await ordersRepository.updateOrder(order.id, order);
  await auditLogsRepository.logAction(
    "ORDER_UPDATED",
    `Order ${order.orderNumber || order.id}`,
    `Updated order details in orders.json`,
    effectiveAdmin,
    session.email
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
  const session = await requireAdminSession("orders.edit");
  const effectiveAdmin = session.name || adminName;
  const updated = await ordersRepository.updateOrderStatus(orderId, status, trackingNumber, carrier);
  await auditLogsRepository.logAction(
    "ORDER_STATUS_CHANGED",
    `Order ${updated.orderNumber || orderId}`,
    `Status changed to ${status.toUpperCase()}${trackingNumber ? ` (Tracking: ${trackingNumber})` : ""} in orders.json`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverCancelOrder(
  orderId: string,
  reason: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("orders.edit");
  const effectiveAdmin = session.name || adminName;
  const updated = await ordersRepository.updateOrderStatus(orderId, "cancelled");
  await auditLogsRepository.logAction(
    "ORDER_CANCELLED",
    `Order ${updated.orderNumber || orderId}`,
    `Order cancelled with reason: "${reason}"`,
    effectiveAdmin,
    session.email
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
  const session = await requireAdminSession("customers.edit");
  const effectiveAdmin = session.name || adminName;
  const created = await customersRepository.createCustomer(customer);
  await auditLogsRepository.logAction(
    "CUSTOMER_CREATED",
    `Patron ${created.name}`,
    `Created customer profile for ${created.email}`,
    effectiveAdmin,
    session.email
  );
  return created;
}

export async function serverUpdateCustomer(
  customer: AdminCustomer,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("customers.edit");
  const effectiveAdmin = session.name || adminName;
  const updated = await customersRepository.updateCustomer(customer.id, customer);
  await auditLogsRepository.logAction(
    "CUSTOMER_UPDATED",
    `Patron ${updated.name}`,
    `Updated status to ${updated.status} / spend ₹${updated.totalSpent}`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverDeleteCustomer(
  customerId: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("customers.edit");
  const effectiveAdmin = session.name || adminName;
  const customer = await customersRepository.getCustomerById(customerId);
  const ok = await customersRepository.deleteCustomer(customerId);
  if (ok) {
    await auditLogsRepository.logAction(
      "CUSTOMER_DELETED",
      `Patron ${customer?.name || customerId}`,
      `Removed patron record from customers.json`,
      effectiveAdmin,
      session.email
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
  const session = await requireAdminSession("promotions.manage");
  const effectiveAdmin = session.name || adminName;
  const created = await promotionsRepository.createPromotion(promo);
  await auditLogsRepository.logAction(
    "PROMOTION_CREATED",
    `Privilege Code ${created.code}`,
    `Created ${created.type === "percentage" ? `${created.value}%` : `₹${created.value}`} discount in promotions.json`,
    effectiveAdmin,
    session.email
  );
  return created;
}

export async function serverUpdatePromotion(
  promo: AdminPromotion,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("promotions.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await promotionsRepository.updatePromotion(promo.id, promo);
  await auditLogsRepository.logAction(
    "PROMOTION_UPDATED",
    `Privilege Code ${updated.code}`,
    `Updated rules & limits in promotions.json`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverTogglePromotion(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("promotions.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await promotionsRepository.togglePromotion(id);
  await auditLogsRepository.logAction(
    "PROMOTION_TOGGLED",
    `Privilege Code ${updated.code}`,
    `Active status set to ${updated.isActive ? "ACTIVE" : "INACTIVE"}`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverDuplicatePromotion(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("promotions.manage");
  const effectiveAdmin = session.name || adminName;
  const duplicated = await promotionsRepository.duplicatePromotion(id);
  await auditLogsRepository.logAction(
    "PROMOTION_DUPLICATED",
    `Privilege Code ${duplicated.code}`,
    `Duplicated from promo ${id}`,
    effectiveAdmin,
    session.email
  );
  return duplicated;
}

export async function serverDeletePromotion(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("promotions.manage");
  const effectiveAdmin = session.name || adminName;
  const promo = await promotionsRepository.getPromotionById(id);
  const ok = await promotionsRepository.deletePromotion(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "PROMOTION_DELETED",
      `Privilege Code ${promo?.code || id}`,
      `Removed from promotions.json`,
      effectiveAdmin,
      session.email
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
  const session = await requireAdminSession("themes.manage");
  const effectiveAdmin = session.name || adminName;
  const created = await themesRepository.createTheme(theme);
  await auditLogsRepository.logAction(
    "THEME_CREATED",
    `Theme "${created.name}"`,
    `Created ${created.type} theme in themes.json`,
    effectiveAdmin,
    session.email
  );
  return created;
}

export async function serverUpdateTheme(
  theme: AdminThemeConfig,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("themes.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await themesRepository.updateTheme(theme.id, theme);
  await auditLogsRepository.logAction(
    "THEME_UPDATED",
    `Theme "${updated.name}"`,
    "Updated theme configuration in themes.json",
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverActivateTheme(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("themes.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await themesRepository.activateTheme(id);
  await auditLogsRepository.logAction(
    "THEME_ACTIVATED",
    `Theme "${updated.name}"`,
    `Activated theme for scope: ${updated.scope}`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverDeactivateTheme(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("themes.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await themesRepository.deactivateTheme(id);
  await auditLogsRepository.logAction(
    "THEME_DEACTIVATED",
    `Theme "${updated.name}"`,
    "Deactivated theme and returned to draft",
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverDuplicateTheme(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("themes.manage");
  const effectiveAdmin = session.name || adminName;
  const duplicated = await themesRepository.duplicateTheme(id);
  await auditLogsRepository.logAction(
    "THEME_DUPLICATED",
    `Theme "${duplicated.name}"`,
    `Duplicated from theme ${id}`,
    effectiveAdmin,
    session.email
  );
  return duplicated;
}

export async function serverDeleteTheme(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("themes.manage");
  const effectiveAdmin = session.name || adminName;
  const theme = await themesRepository.getThemeById(id);
  const ok = await themesRepository.deleteTheme(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "THEME_DELETED",
      `Theme "${theme?.name || id}"`,
      "Removed theme from themes.json",
      effectiveAdmin,
      session.email
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
  const session = await requireAdminSession("storefront.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await storefrontRepository.updateHeroSlides(slides);
  await auditLogsRepository.logAction(
    "HERO_SLIDES_UPDATED",
    "Storefront Hero",
    `Updated ${slides.length} hero slides in storefront.json`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverUpdateSections(
  sections: StorefrontSectionConfig[],
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("storefront.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await storefrontRepository.updateSections(sections);
  await auditLogsRepository.logAction(
    "SECTIONS_UPDATED",
    "Storefront Layout",
    `Updated layout and sequence of ${sections.length} homepage sections`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverUpdateStoreSettings(
  settings: Partial<StoreSettings>,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("settings.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await storefrontRepository.updateSettings(settings);
  await auditLogsRepository.logAction(
    "SETTINGS_UPDATED",
    "Commerce Platform Settings",
    `Updated store settings in storefront.json`,
    effectiveAdmin,
    session.email
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
  const session = await requireAdminSession("media.manage");
  const effectiveAdmin = session.name || adminName;
  const created = await mediaRepository.createMediaAsset(asset);
  await auditLogsRepository.logAction(
    "MEDIA_UPLOADED",
    `Asset ${asset.filename}`,
    `Registered metadata for ${asset.folder} (${asset.mimeType}) in media.json`,
    effectiveAdmin,
    session.email
  );
  return created;
}

export async function serverUpdateMediaAsset(
  asset: MediaAsset,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("media.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await mediaRepository.updateMediaAsset(asset.id, asset);
  await auditLogsRepository.logAction(
    "MEDIA_UPDATED",
    `Asset ${updated.filename}`,
    `Updated metadata and tags in media.json`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverDeleteMediaAsset(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("media.manage");
  const effectiveAdmin = session.name || adminName;
  const asset = await mediaRepository.getMediaAssetById(id);
  const ok = await mediaRepository.deleteMediaAsset(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "MEDIA_DELETED",
      `Asset ${asset?.filename || id}`,
      "Deleted media metadata record from media.json",
      effectiveAdmin,
      session.email
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
  const session = await requireAdminSession("users.manage");
  const effectiveAdmin = session.name || adminName;
  const created = await adminUsersRepository.createAdminUser(user);
  await auditLogsRepository.logAction(
    "ADMIN_USER_CREATED",
    `User ${created.name}`,
    `Assigned role ${created.role} with ${created.permissions.length} permissions in admin-users.json`,
    effectiveAdmin,
    session.email
  );
  return created;
}

export async function serverUpdateAdminUser(
  user: AdminUser,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("users.manage");
  const effectiveAdmin = session.name || adminName;
  const updated = await adminUsersRepository.updateAdminUser(user.id, user);
  await auditLogsRepository.logAction(
    "ADMIN_USER_UPDATED",
    `User ${updated.name}`,
    `Updated status ${updated.status} and role ${updated.role}`,
    effectiveAdmin,
    session.email
  );
  return updated;
}

export async function serverDeleteAdminUser(
  id: string,
  adminName: string = "Admin",
  role?: AdminRole
) {
  const session = await requireAdminSession("users.manage");
  const effectiveAdmin = session.name || adminName;
  const user = await adminUsersRepository.getAdminUserById(id);
  const ok = await adminUsersRepository.deleteAdminUser(id);
  if (ok) {
    await auditLogsRepository.logAction(
      "ADMIN_USER_DELETED",
      `User ${user?.name || id}`,
      "Removed administrative user account from admin-users.json",
      effectiveAdmin,
      session.email
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
  const session = await requireAdminSession();
  const effectiveAdmin = session.name || adminName;
  const effectiveEmail = session.email || adminEmail;
  return auditLogsRepository.logAction(action, resource, details, effectiveAdmin, effectiveEmail);
}
