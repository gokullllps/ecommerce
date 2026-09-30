import { Product } from "@/types/catalogue";
import {
  AdminCategory,
  AdminCollection,
  AdminOrder,
  OrderStatus,
  AdminCustomer,
  AdminPromotion,
  AdminThemeConfig,
  StoreSettings,
  StorefrontHeroSlide,
  StorefrontSectionConfig,
  MediaAsset,
  AdminUser,
  AuditLogEntry,
  InventoryLog,
} from "@/types/admin";
import { StorefrontData } from "../storefrontRepository";

export interface IProductsRepository {
  getProducts(): Promise<Product[]>;
  getProductsSync?(): Product[];
  getProductById(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: Product): Promise<Product>;
  updateProduct(id: string, data: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  archiveProduct(id: string): Promise<Product>;
  restoreProduct(id: string): Promise<Product>;
  duplicateProduct(id: string): Promise<Product>;
  bulkUpdateProducts(ids: string[], updates: Partial<Product>): Promise<Product[]>;
  bulkDeleteProducts(ids: string[]): Promise<boolean>;
}

export interface ICategoriesRepository {
  getCategories(): Promise<AdminCategory[]>;
  getCategoriesSync?(): AdminCategory[];
  getCategoryById(id: string): Promise<AdminCategory | undefined>;
  getCategoryBySlug(slug: string): Promise<AdminCategory | undefined>;
  createCategory(category: AdminCategory): Promise<AdminCategory>;
  updateCategory(id: string, data: Partial<AdminCategory>): Promise<AdminCategory>;
  deleteCategory(id: string): Promise<boolean>;
  reorderCategories(newOrder: AdminCategory[]): Promise<AdminCategory[]>;
  getCategoryTree(): Promise<Array<AdminCategory & { children: AdminCategory[] }>>;
}

export interface ICollectionsRepository {
  getCollections(): Promise<AdminCollection[]>;
  getCollectionsSync?(): AdminCollection[];
  getCollectionById(id: string): Promise<AdminCollection | undefined>;
  getCollectionBySlug(slug: string): Promise<AdminCollection | undefined>;
  createCollection(collection: AdminCollection): Promise<AdminCollection>;
  updateCollection(id: string, data: Partial<AdminCollection>): Promise<AdminCollection>;
  deleteCollection(id: string): Promise<boolean>;
  reorderCollectionProducts(id: string, productIds: string[]): Promise<AdminCollection>;
}

export interface IInventoryRepository {
  getInventoryLogs(): Promise<InventoryLog[]>;
  getInventoryLogsSync?(): InventoryLog[];
  adjustInventory(
    productId: string,
    variantSku: string | undefined,
    delta: number,
    reason: string,
    adminName: string
  ): Promise<{ updatedProduct: Product; logEntry: InventoryLog }>;
}

export interface IOrdersRepository {
  getOrders(): Promise<AdminOrder[]>;
  getOrdersSync?(): AdminOrder[];
  getOrderById(id: string): Promise<AdminOrder | undefined>;
  createOrder(order: AdminOrder): Promise<AdminOrder>;
  updateOrder(id: string, data: Partial<AdminOrder>): Promise<AdminOrder>;
  updateOrderStatus(
    id: string,
    status: OrderStatus,
    trackingNumber?: string,
    carrier?: string
  ): Promise<AdminOrder>;
  deleteOrder(id: string): Promise<boolean>;
}

export interface ICustomersRepository {
  getCustomers(): Promise<AdminCustomer[]>;
  getCustomersSync?(): AdminCustomer[];
  getCustomerById(id: string): Promise<AdminCustomer | undefined>;
  getCustomerByEmail(email: string): Promise<AdminCustomer | undefined>;
  createCustomer(customer: AdminCustomer): Promise<AdminCustomer>;
  updateCustomer(id: string, data: Partial<AdminCustomer>): Promise<AdminCustomer>;
  deleteCustomer(id: string): Promise<boolean>;
}

export interface IPromotionsRepository {
  getPromotions(): Promise<AdminPromotion[]>;
  getPromotionsSync?(): AdminPromotion[];
  getPromotionById(id: string): Promise<AdminPromotion | undefined>;
  getPromotionByCode(code: string): Promise<AdminPromotion | undefined>;
  createPromotion(promo: AdminPromotion): Promise<AdminPromotion>;
  updatePromotion(id: string, data: Partial<AdminPromotion>): Promise<AdminPromotion>;
  togglePromotion(id: string): Promise<AdminPromotion>;
  duplicatePromotion(id: string): Promise<AdminPromotion>;
  deletePromotion(id: string): Promise<boolean>;
}

export interface IThemesRepository {
  getThemes(): Promise<AdminThemeConfig[]>;
  getThemesSync?(): AdminThemeConfig[];
  getThemeById(id: string): Promise<AdminThemeConfig | undefined>;
  getActiveTheme(scope?: string, date?: Date): Promise<AdminThemeConfig>;
  createTheme(theme: AdminThemeConfig): Promise<AdminThemeConfig>;
  updateTheme(id: string, data: Partial<AdminThemeConfig>): Promise<AdminThemeConfig>;
  activateTheme(id: string): Promise<AdminThemeConfig>;
  deactivateTheme(id: string): Promise<AdminThemeConfig>;
  duplicateTheme(id: string): Promise<AdminThemeConfig>;
  deleteTheme(id: string): Promise<boolean>;
}

export interface IStorefrontRepository {
  getStorefrontData(): Promise<StorefrontData>;
  getStorefrontDataSync?(): StorefrontData;
  updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings>;
  updateHeroSlides(slides: StorefrontHeroSlide[]): Promise<StorefrontHeroSlide[]>;
  updateSections(sections: StorefrontSectionConfig[]): Promise<StorefrontSectionConfig[]>;
}

export interface IMediaRepository {
  getMediaAssets(): Promise<MediaAsset[]>;
  getMediaAssetsSync?(): MediaAsset[];
  getMediaAssetById(id: string): Promise<MediaAsset | undefined>;
  createMediaAsset(asset: MediaAsset): Promise<MediaAsset>;
  updateMediaAsset(id: string, data: Partial<MediaAsset>): Promise<MediaAsset>;
  deleteMediaAsset(id: string): Promise<boolean>;
}

export interface IAdminUsersRepository {
  getAdminUsers(): Promise<AdminUser[]>;
  getAdminUsersSync?(): AdminUser[];
  getAdminUserById(id: string): Promise<AdminUser | undefined>;
  createAdminUser(user: AdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, data: Partial<AdminUser>): Promise<AdminUser>;
  deleteAdminUser(id: string): Promise<boolean>;
}

export interface IAuditLogsRepository {
  getAuditLogs(): Promise<AuditLogEntry[]>;
  getAuditLogsSync?(): AuditLogEntry[];
  logAction(
    action: string,
    resource: string,
    details: string,
    adminName: string,
    adminEmail?: string
  ): Promise<AuditLogEntry>;
}
