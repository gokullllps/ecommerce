"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Product } from "@/types/catalogue";
import {
  AdminOrder,
  AdminCustomer,
  AdminPromotion,
  AdminThemeConfig,
  AdminUser,
  StorefrontHeroSlide,
  StorefrontSectionConfig,
  StoreSettings,
  MediaAsset,
  AuditLogEntry,
  OrderStatus,
  AdminCategory,
  AdminCollection,
  InventoryLog,
} from "@/types/admin";
import {
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_PROMOTIONS,
  INITIAL_THEMES,
  INITIAL_HERO_SLIDES,
  INITIAL_SECTIONS,
  INITIAL_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ADMIN_USERS,
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_INVENTORY_LOGS,
} from "@/lib/admin/initialData";
import { ALL_PRODUCTS } from "@/data/products";
import {
  getCanonicalAdminData,
  serverAddProduct,
  serverUpdateProduct,
  serverDeleteProduct,
  serverArchiveProduct,
  serverRestoreProduct,
  serverDuplicateProduct,
  serverBulkUpdateProducts,
  serverBulkDeleteProducts,
  serverAddCategory,
  serverUpdateCategory,
  serverDeleteCategory,
  serverReorderCategories,
  serverAddCollection,
  serverUpdateCollection,
  serverDeleteCollection,
  serverReorderCollectionProducts,
  serverAdjustInventory,
  serverUpdateOrder,
  serverUpdateOrderStatus,
  serverCancelOrder,
  serverCreateCustomer,
  serverUpdateCustomer,
  serverDeleteCustomer,
  serverAddPromotion,
  serverUpdatePromotion,
  serverTogglePromotion,
  serverDuplicatePromotion,
  serverDeletePromotion,
  serverCreateTheme,
  serverUpdateTheme,
  serverActivateTheme,
  serverDeactivateTheme,
  serverDuplicateTheme,
  serverDeleteTheme,
  serverUpdateHeroSlides,
  serverUpdateSections,
  serverUpdateStoreSettings,
  serverAddMediaAsset,
  serverUpdateMediaAsset,
  serverDeleteMediaAsset,
  serverCreateAdminUser,
  serverUpdateAdminUser,
  serverDeleteAdminUser,
  serverLogAction,
} from "@/app/actions/adminActions";
import { can } from "@/lib/permissions";

const STORAGE_KEY = "pablo_admin_store_v1";
const MIGRATION_KEY = "pablo_json_migrated_v1";

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockCount: number;
  activePromotionsCount: number;
  activeThemeName: string;
}

export interface AdminDataContextType {
  // State
  products: Product[];
  categories: AdminCategory[];
  collections: AdminCollection[];
  inventoryLogs: InventoryLog[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  promotions: AdminPromotion[];
  themes: AdminThemeConfig[];
  activeTheme: AdminThemeConfig;
  heroSlides: StorefrontHeroSlide[];
  sections: StorefrontSectionConfig[];
  settings: StoreSettings;
  mediaAssets: MediaAsset[];
  auditLogs: AuditLogEntry[];
  adminUsers: AdminUser[];
  currentAdmin: AdminUser;
  metrics: DashboardMetrics;
  isHydrated: boolean;

  // Products
  setCurrentAdminRole: (userId: string) => void;
  updateProduct: (updated: Product) => void;
  addProduct: (newProduct: Product) => void;
  deleteProduct: (productId: string) => void;
  duplicateProduct: (productId: string) => Product | null;
  archiveProduct: (productId: string) => void;
  restoreProduct: (productId: string) => void;
  bulkUpdateProducts: (ids: string[], updates: Partial<Product>) => void;
  bulkDeleteProducts: (ids: string[]) => void;

  // Categories
  addCategory: (category: AdminCategory) => void;
  updateCategory: (category: AdminCategory) => void;
  deleteCategory: (categoryId: string) => void;
  reorderCategories: (newCategories: AdminCategory[]) => void;

  // Collections
  addCollection: (collection: AdminCollection) => void;
  updateCollection: (collection: AdminCollection) => void;
  deleteCollection: (collectionId: string) => void;
  reorderCollectionProducts: (collectionId: string, productIds: string[]) => void;

  // Inventory
  adjustStock: (productId: string, variantSku: string | undefined, delta: number, reason: string) => void;

  // Orders
  updateOrder: (order: AdminOrder) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, carrier?: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;

  // Customers
  createCustomer: (customer: AdminCustomer) => void;
  updateCustomer: (customer: AdminCustomer) => void;
  deleteCustomer: (customerId: string) => void;

  // Promotions
  addPromotion: (promo: AdminPromotion) => void;
  updatePromotion: (promo: AdminPromotion) => void;
  togglePromotion: (promoId: string) => void;
  duplicatePromotion: (promoId: string) => void;
  deletePromotion: (promoId: string) => void;

  // Themes
  createTheme: (theme: AdminThemeConfig) => void;
  updateTheme: (theme: AdminThemeConfig) => void;
  activateTheme: (themeId: string) => void;
  deactivateTheme: (themeId: string) => void;
  duplicateTheme: (themeId: string) => void;
  deleteTheme: (themeId: string) => void;

  // Storefront & Settings
  updateHeroSlides: (slides: StorefrontHeroSlide[]) => void;
  updateSections: (sections: StorefrontSectionConfig[]) => void;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;

  // Media
  addMediaAsset: (asset: MediaAsset) => void;
  updateMediaAsset: (asset: MediaAsset) => void;
  deleteMediaAsset: (assetId: string) => void;

  // Admin Users
  createAdminUser: (user: AdminUser) => void;
  updateAdminUser: (user: AdminUser) => void;
  deleteAdminUser: (userId: string) => void;

  // Utilities
  logAction: (action: string, resource: string, details: string) => void;
  resetToDefaults: () => void;
  refreshData: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Entities state
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_CATEGORIES);
  const [collections, setCollections] = useState<AdminCollection[]>(INITIAL_COLLECTIONS);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(INITIAL_INVENTORY_LOGS);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<AdminCustomer[]>(INITIAL_CUSTOMERS);
  const [promotions, setPromotions] = useState<AdminPromotion[]>(INITIAL_PROMOTIONS);
  const [themes, setThemes] = useState<AdminThemeConfig[]>(INITIAL_THEMES);
  const [heroSlides, setHeroSlides] = useState<StorefrontHeroSlide[]>(INITIAL_HERO_SLIDES);
  const [sections, setSections] = useState<StorefrontSectionConfig[]>(INITIAL_SECTIONS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser>(INITIAL_ADMIN_USERS[0]);

  const refreshData = useCallback(async () => {
    try {
      const canonical = await getCanonicalAdminData();
      if (canonical) {
        setProducts(canonical.products);
        setCategories(canonical.categories);
        setCollections(canonical.collections);
        setInventoryLogs(canonical.inventoryLogs);
        setOrders(canonical.orders);
        setCustomers(canonical.customers);
        setPromotions(canonical.promotions);
        setThemes(canonical.themes);
        setHeroSlides(canonical.heroSlides);
        setSections(canonical.sections);
        setSettings(canonical.settings);
        setMediaAssets(canonical.mediaAssets);
        setAuditLogs(canonical.auditLogs);
        setAdminUsers(canonical.adminUsers);
        if (canonical.adminUsers && canonical.adminUsers.length > 0) {
          setCurrentAdmin((prev) => canonical.adminUsers.find((u) => u.id === prev.id) || canonical.adminUsers[0]);
        }
      }
    } catch (err) {
      console.error("[Admin Storage] Failed to refresh data:", err);
    }
  }, []);

  // Load canonical data on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const canonical = await getCanonicalAdminData();

        if (isMounted && canonical) {
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem(STORAGE_KEY);
            const isMigrated = localStorage.getItem(MIGRATION_KEY);

            if (stored && !isMigrated) {
              try {
                const parsed = JSON.parse(stored);
                localStorage.setItem(MIGRATION_KEY, "true");

                if (parsed.products && Array.isArray(parsed.products)) {
                  const canonicalIds = new Set(canonical.products.map((p) => p.id));
                  const unmigrated = parsed.products.filter((p: Product) => !canonicalIds.has(p.id));
                  for (const up of unmigrated) {
                    await serverAddProduct(up, "Migration Service");
                    canonical.products.unshift(up);
                  }
                }
              } catch (migrationErr) {
                console.warn("[Admin Storage] Migration notice:", migrationErr);
              }
            }
          }

          setProducts(canonical.products);
          setCategories(canonical.categories);
          setCollections(canonical.collections);
          setInventoryLogs(canonical.inventoryLogs);
          setOrders(canonical.orders);
          setCustomers(canonical.customers);
          setPromotions(canonical.promotions);
          setThemes(canonical.themes);
          setHeroSlides(canonical.heroSlides);
          setSections(canonical.sections);
          setSettings(canonical.settings);
          setMediaAssets(canonical.mediaAssets);
          setAuditLogs(canonical.auditLogs);
          setAdminUsers(canonical.adminUsers);

          if (canonical.adminUsers && canonical.adminUsers.length > 0) {
            setCurrentAdmin(canonical.adminUsers[0]);
          }
        }
      } catch (err) {
        console.error("[Admin Storage] Initialization error:", err);
      } finally {
        if (isMounted) setIsHydrated(true);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute Active Theme
  const activeTheme = useMemo<AdminThemeConfig>(() => {
    const live = themes.find((t) => t.status === "active");
    return live || themes[0] || INITIAL_THEMES[0];
  }, [themes]);

  // Compute Live Metrics
  const metrics = useMemo<DashboardMetrics>(() => {
    const totalRev = orders.reduce((sum, o) => {
      if (o.paymentStatus === "paid") {
        return sum + o.total;
      }
      return sum;
    }, 0);

    const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
    const avgOrderValue = paidOrders.length > 0 ? Math.round(totalRev / paidOrders.length) : 0;
    const lowStock = products.filter((p) => (p.stock ?? 0) <= (p.lowStockThreshold ?? 5)).length;
    const activePromos = promotions.filter((p) => p.isActive).length;

    return {
      totalRevenue: totalRev,
      totalOrders: orders.length,
      averageOrderValue: avgOrderValue,
      totalProducts: products.length,
      totalCustomers: customers.length,
      lowStockCount: lowStock,
      activePromotionsCount: activePromos,
      activeThemeName: activeTheme.name,
    };
  }, [orders, products, customers, promotions, activeTheme]);

  const setCurrentAdminRole = useCallback(
    (userId: string) => {
      const user = adminUsers.find((u) => u.id === userId);
      if (user) {
        setCurrentAdmin(user);
      }
    },
    [adminUsers]
  );

  // 1. Product Actions
  const updateProduct = useCallback(
    (updated: Product) => {
      const withTimestamp = { ...updated, updatedAt: new Date().toISOString() };
      setProducts((prev) => {
        const next = prev.map((p) => (p.id === updated.id ? withTimestamp : p));
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ products: next }));
          } catch {}
        }
        return next;
      });
      serverUpdateProduct(withTimestamp, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const addProduct = useCallback(
    (newProduct: Product) => {
      const now = new Date().toISOString();
      const productWithDates: Product = {
        ...newProduct,
        createdAt: newProduct.createdAt || now,
        updatedAt: now,
      };
      setProducts((prev) => {
        const next = [productWithDates, ...prev];
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ products: next }));
          } catch {}
        }
        return next;
      });
      serverAddProduct(productWithDates, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== productId);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ products: next }));
          } catch {}
        }
        return next;
      });
      serverDeleteProduct(productId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const duplicateProduct = useCallback(
    (productId: string): Product | null => {
      const original = products.find((p) => p.id === productId);
      if (!original) return null;

      const randomSuffix = Math.floor(Math.random() * 8999 + 1000);
      const newSku = `${original.sku}-COPY-${randomSuffix}`;
      const newSlug = `${original.slug}-copy-${randomSuffix}`;
      const now = new Date().toISOString();

      const duplicated: Product = {
        ...original,
        id: `pab-dup-${Date.now()}`,
        name: `${original.name} (Copy)`,
        sku: newSku,
        slug: newSlug,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      };

      setProducts((prev) => [duplicated, ...prev]);
      serverDuplicateProduct(productId, currentAdmin.name, currentAdmin.role).catch(console.error);
      return duplicated;
    },
    [products, currentAdmin]
  );

  const archiveProduct = useCallback(
    (productId: string) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: "archived" as const, updatedAt: new Date().toISOString() } : p))
      );
      serverArchiveProduct(productId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const restoreProduct = useCallback(
    (productId: string) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: "active" as const, updatedAt: new Date().toISOString() } : p))
      );
      serverRestoreProduct(productId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const bulkUpdateProducts = useCallback(
    (ids: string[], updates: Partial<Product>) => {
      const now = new Date().toISOString();
      setProducts((prev) =>
        prev.map((p) => (ids.includes(p.id) ? { ...p, ...updates, updatedAt: now } : p))
      );
      serverBulkUpdateProducts(ids, updates, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const bulkDeleteProducts = useCallback(
    (ids: string[]) => {
      setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
      serverBulkDeleteProducts(ids, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  // 2. Category Actions
  const addCategory = useCallback(
    (category: AdminCategory) => {
      setCategories((prev) => [...prev, category]);
      serverAddCategory(category, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const updateCategory = useCallback(
    (category: AdminCategory) => {
      setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
      serverUpdateCategory(category, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const deleteCategory = useCallback(
    (categoryId: string) => {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId && c.parentId !== categoryId));
      serverDeleteCategory(categoryId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const reorderCategories = useCallback(
    (newCategories: AdminCategory[]) => {
      setCategories(newCategories);
      serverReorderCategories(newCategories, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  // 3. Collection Actions
  const addCollection = useCallback(
    (collection: AdminCollection) => {
      const now = new Date().toISOString();
      const withTimestamp = { ...collection, updatedAt: now };
      setCollections((prev) => [...prev, withTimestamp]);
      serverAddCollection(withTimestamp, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const updateCollection = useCallback(
    (collection: AdminCollection) => {
      const now = new Date().toISOString();
      const withTimestamp = { ...collection, updatedAt: now };
      setCollections((prev) => prev.map((c) => (c.id === collection.id ? withTimestamp : c)));
      serverUpdateCollection(withTimestamp, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const deleteCollection = useCallback(
    (colId: string) => {
      setCollections((prev) => prev.filter((c) => c.id !== colId));
      serverDeleteCollection(colId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const reorderCollectionProducts = useCallback(
    (collectionId: string, productIds: string[]) => {
      const target = collections.find((c) => c.id === collectionId);
      if (!target) return;
      const updated: AdminCollection = {
        ...target,
        productIds,
        updatedAt: new Date().toISOString(),
      };
      setCollections((prev) => prev.map((c) => (c.id === collectionId ? updated : c)));
      serverReorderCollectionProducts(collectionId, productIds, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [collections, currentAdmin]
  );

  // 4. Inventory Actions
  const adjustStock = useCallback(
    (productId: string, variantSku: string | undefined, delta: number, reason: string) => {
      serverAdjustInventory(productId, variantSku, delta, reason, currentAdmin.name, currentAdmin.role)
        .then(({ updatedProduct, logEntry }) => {
          setProducts((prev) => prev.map((p) => (p.id === productId ? updatedProduct : p)));
          setInventoryLogs((prev) => [logEntry, ...prev.slice(0, 199)]);
        })
        .catch(console.error);
    },
    [currentAdmin]
  );

  // 5. Order Actions
  const updateOrder = useCallback(
    (order: AdminOrder) => {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
      serverUpdateOrder(order, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus, trackingNumber?: string, carrier?: string) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status,
              ...(trackingNumber !== undefined && { trackingNumber }),
              ...(carrier !== undefined && { carrier }),
              ...(status === "shipped" && { fulfillmentStatus: "fulfilled" }),
              ...(status === "delivered" && { fulfillmentStatus: "fulfilled" }),
              ...(status === "refunded" && { paymentStatus: "refunded" }),
            };
          }
          return o;
        })
      );
      serverUpdateOrderStatus(orderId, status, trackingNumber, carrier, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const cancelOrder = useCallback(
    (orderId: string, reason: string) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
      serverCancelOrder(orderId, reason, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  // 6. Customer Actions
  const createCustomer = useCallback(
    (customer: AdminCustomer) => {
      setCustomers((prev) => [customer, ...prev]);
      serverCreateCustomer(customer, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const updateCustomer = useCallback(
    (customer: AdminCustomer) => {
      setCustomers((prev) => prev.map((c) => (c.id === customer.id ? customer : c)));
      serverUpdateCustomer(customer, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const deleteCustomer = useCallback(
    (customerId: string) => {
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
      serverDeleteCustomer(customerId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  // 7. Promotion Actions
  const addPromotion = useCallback(
    (promo: AdminPromotion) => {
      setPromotions((prev) => [promo, ...prev]);
      serverAddPromotion(promo, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const updatePromotion = useCallback(
    (promo: AdminPromotion) => {
      setPromotions((prev) => prev.map((p) => (p.id === promo.id ? promo : p)));
      serverUpdatePromotion(promo, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const togglePromotion = useCallback(
    (promoId: string) => {
      setPromotions((prev) =>
        prev.map((p) => (p.id === promoId ? { ...p, isActive: !p.isActive } : p))
      );
      serverTogglePromotion(promoId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const duplicatePromotion = useCallback(
    (promoId: string) => {
      const original = promotions.find((p) => p.id === promoId);
      if (!original) return;
      const duplicated: AdminPromotion = {
        ...original,
        id: `promo_${Date.now()}`,
        code: `${original.code}_COPY_${Math.floor(Math.random() * 1000)}`,
        title: `${original.title} (Copy)`,
        usedCount: 0,
        isActive: false,
      };
      setPromotions((prev) => [duplicated, ...prev]);
      serverDuplicatePromotion(promoId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [promotions, currentAdmin]
  );

  const deletePromotion = useCallback(
    (promoId: string) => {
      setPromotions((prev) => prev.filter((p) => p.id !== promoId));
      serverDeletePromotion(promoId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  // 8. Theme Actions
  const createTheme = useCallback(
    (theme: AdminThemeConfig) => {
      setThemes((prev) => [...prev, theme]);
      serverCreateTheme(theme, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const updateTheme = useCallback(
    (theme: AdminThemeConfig) => {
      setThemes((prev) => prev.map((t) => (t.id === theme.id ? theme : t)));
      serverUpdateTheme(theme, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const activateTheme = useCallback(
    (themeId: string) => {
      const target = themes.find((t) => t.id === themeId);
      if (!target) return;
      setThemes((prev) =>
        prev.map((t) => {
          if (t.id === themeId) return { ...t, status: "active" as const };
          if (t.scope === target.scope && t.status === "active") return { ...t, status: "draft" as const };
          return t;
        })
      );
      serverActivateTheme(themeId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [themes, currentAdmin]
  );

  const deactivateTheme = useCallback(
    (themeId: string) => {
      setThemes((prev) =>
        prev.map((t) => (t.id === themeId ? { ...t, status: "draft" as const } : t))
      );
      serverDeactivateTheme(themeId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const duplicateTheme = useCallback(
    (themeId: string) => {
      const original = themes.find((t) => t.id === themeId);
      if (!original) return;
      const duplicated: AdminThemeConfig = {
        ...original,
        id: `theme_${Date.now()}`,
        name: `${original.name} (Copy)`,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setThemes((prev) => [...prev, duplicated]);
      serverDuplicateTheme(themeId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [themes, currentAdmin]
  );

  const deleteTheme = useCallback(
    (themeId: string) => {
      setThemes((prev) => prev.filter((t) => t.id !== themeId));
      serverDeleteTheme(themeId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  // 9. Storefront & Settings Actions
  const updateHeroSlides = useCallback(
    (slides: StorefrontHeroSlide[]) => {
      setHeroSlides(slides);
      serverUpdateHeroSlides(slides, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const updateSections = useCallback(
    (newSections: StorefrontSectionConfig[]) => {
      setSections(newSections);
      serverUpdateSections(newSections, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const updateStoreSettings = useCallback(
    (newSettings: Partial<StoreSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
      serverUpdateStoreSettings(newSettings, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  // 10. Media Actions
  const addMediaAsset = useCallback(
    (asset: MediaAsset) => {
      setMediaAssets((prev) => [asset, ...prev]);
      serverAddMediaAsset(asset, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const updateMediaAsset = useCallback(
    (asset: MediaAsset) => {
      setMediaAssets((prev) => prev.map((m) => (m.id === asset.id ? asset : m)));
      serverUpdateMediaAsset(asset, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const deleteMediaAsset = useCallback(
    (assetId: string) => {
      setMediaAssets((prev) => prev.filter((m) => m.id !== assetId));
      serverDeleteMediaAsset(assetId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  // 11. Admin User Actions
  const createAdminUser = useCallback(
    (user: AdminUser) => {
      setAdminUsers((prev) => [...prev, user]);
      serverCreateAdminUser(user, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const updateAdminUser = useCallback(
    (user: AdminUser) => {
      setAdminUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
      if (user.id === currentAdmin.id) {
        setCurrentAdmin(user);
      }
      serverUpdateAdminUser(user, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  const deleteAdminUser = useCallback(
    (userId: string) => {
      setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
      serverDeleteAdminUser(userId, currentAdmin.name, currentAdmin.role).catch(console.error);
    },
    [currentAdmin]
  );

  // 12. Utilities
  const logAction = useCallback(
    (action: string, resource: string, details: string) => {
      serverLogAction(action, resource, details, currentAdmin.name, currentAdmin.email)
        .then((entry) => setAuditLogs((prev) => [entry, ...prev]))
        .catch(console.error);
    },
    [currentAdmin]
  );

  const resetToDefaults = useCallback(() => {
    refreshData();
  }, [refreshData]);

  const value = useMemo<AdminDataContextType>(
    () => ({
      products,
      categories,
      collections,
      inventoryLogs,
      orders,
      customers,
      promotions,
      themes,
      activeTheme,
      heroSlides,
      sections,
      settings,
      mediaAssets,
      auditLogs,
      adminUsers,
      currentAdmin,
      metrics,
      isHydrated,
      setCurrentAdminRole,
      updateProduct,
      addProduct,
      deleteProduct,
      duplicateProduct,
      archiveProduct,
      restoreProduct,
      bulkUpdateProducts,
      bulkDeleteProducts,
      addCategory,
      updateCategory,
      deleteCategory,
      reorderCategories,
      addCollection,
      updateCollection,
      deleteCollection,
      reorderCollectionProducts,
      adjustStock,
      updateOrder,
      updateOrderStatus,
      cancelOrder,
      createCustomer,
      updateCustomer,
      deleteCustomer,
      addPromotion,
      updatePromotion,
      togglePromotion,
      duplicatePromotion,
      deletePromotion,
      createTheme,
      updateTheme,
      activateTheme,
      deactivateTheme,
      duplicateTheme,
      deleteTheme,
      updateHeroSlides,
      updateSections,
      updateStoreSettings,
      addMediaAsset,
      updateMediaAsset,
      deleteMediaAsset,
      createAdminUser,
      updateAdminUser,
      deleteAdminUser,
      logAction,
      resetToDefaults,
      refreshData,
    }),
    [
      products,
      categories,
      collections,
      inventoryLogs,
      orders,
      customers,
      promotions,
      themes,
      activeTheme,
      heroSlides,
      sections,
      settings,
      mediaAssets,
      auditLogs,
      adminUsers,
      currentAdmin,
      metrics,
      isHydrated,
      setCurrentAdminRole,
      updateProduct,
      addProduct,
      deleteProduct,
      duplicateProduct,
      archiveProduct,
      restoreProduct,
      bulkUpdateProducts,
      bulkDeleteProducts,
      addCategory,
      updateCategory,
      deleteCategory,
      reorderCategories,
      addCollection,
      updateCollection,
      deleteCollection,
      reorderCollectionProducts,
      adjustStock,
      updateOrder,
      updateOrderStatus,
      cancelOrder,
      createCustomer,
      updateCustomer,
      deleteCustomer,
      addPromotion,
      updatePromotion,
      togglePromotion,
      duplicatePromotion,
      deletePromotion,
      createTheme,
      updateTheme,
      activateTheme,
      deactivateTheme,
      duplicateTheme,
      deleteTheme,
      updateHeroSlides,
      updateSections,
      updateStoreSettings,
      addMediaAsset,
      updateMediaAsset,
      deleteMediaAsset,
      createAdminUser,
      updateAdminUser,
      deleteAdminUser,
      logAction,
      resetToDefaults,
      refreshData,
    ]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}
