import { AdminUser, AdminRole, AdminPermission } from "@/types/admin";
import { AuthorizationError } from "@/lib/errors";

export const ROLE_DISPLAY_NAMES: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  product_manager: "Product Manager",
  content_manager: "Content Manager",
  inventory_manager: "Inventory Manager",
  order_manager: "Order Manager",
  marketing_manager: "Marketing Manager",
};

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    "dashboard.view",
    "products.view",
    "products.edit",
    "categories.manage",
    "collections.manage",
    "orders.view",
    "orders.edit",
    "customers.view",
    "customers.edit",
    "inventory.manage",
    "promotions.manage",
    "storefront.manage",
    "themes.manage",
    "media.manage",
    "users.manage",
    "settings.manage",
    "audit.view",
  ],
  admin: [
    "dashboard.view",
    "products.view",
    "products.edit",
    "categories.manage",
    "collections.manage",
    "orders.view",
    "orders.edit",
    "customers.view",
    "customers.edit",
    "inventory.manage",
    "promotions.manage",
    "storefront.manage",
    "themes.manage",
    "media.manage",
  ],
  product_manager: [
    "dashboard.view",
    "products.view",
    "products.edit",
    "categories.manage",
    "collections.manage",
    "inventory.manage",
    "media.manage",
  ],
  content_manager: [
    "dashboard.view",
    "collections.manage",
    "storefront.manage",
    "themes.manage",
    "media.manage",
  ],
  inventory_manager: [
    "dashboard.view",
    "products.view",
    "inventory.manage",
  ],
  order_manager: [
    "dashboard.view",
    "orders.view",
    "orders.edit",
    "customers.view",
    "customers.edit",
  ],
  marketing_manager: [
    "dashboard.view",
    "promotions.manage",
    "collections.manage",
    "themes.manage",
  ],
};

/**
 * Route-to-Permission mapping for all admin routes.
 */
export const ROUTE_PERMISSION_MAP: Record<string, AdminPermission> = {
  "/admin/products": "products.view",
  "/admin/categories": "categories.manage",
  "/admin/collections": "collections.manage",
  "/admin/orders": "orders.view",
  "/admin/customers": "customers.view",
  "/admin/inventory": "inventory.manage",
  "/admin/promotions": "promotions.manage",
  "/admin/storefront": "storefront.manage",
  "/admin/themes": "themes.manage",
  "/admin/media": "media.manage",
  "/admin/users": "users.manage",
  "/admin/settings": "settings.manage",
  "/admin/audit-logs": "audit.view",
};

/**
 * Resolves human-readable label for an admin role.
 */
export function getRoleDisplayName(role: AdminRole): string {
  return ROLE_DISPLAY_NAMES[role] || "Admin";
}

/**
 * Resolves the required permission for an admin route pathname.
 */
export function getRequiredPermissionForRoute(pathname: string): AdminPermission | null {
  // Exact match or prefix match (e.g. /admin/orders/123 -> /admin/orders)
  for (const [routePrefix, permission] of Object.entries(ROUTE_PERMISSION_MAP)) {
    if (pathname === routePrefix || pathname.startsWith(`${routePrefix}/`)) {
      return permission;
    }
  }

  // Dashboard root
  if (pathname === "/admin" || pathname === "/admin/") {
    return "dashboard.view";
  }

  return null;
}

/**
 * Evaluates whether a role is authorized to access a given URL pathname.
 */
export function canRoleAccessRoute(role: AdminRole | undefined, pathname: string): boolean {
  if (!role) return false;
  if (role === "super_admin") return true;

  // Common routes accessible by all authenticated admins
  if (
    pathname === "/admin" ||
    pathname === "/admin/" ||
    pathname === "/admin/unauthorized" ||
    pathname === "/admin/login"
  ) {
    return true;
  }

  const requiredPermission = getRequiredPermissionForRoute(pathname);
  if (!requiredPermission) {
    // If not a recognized restricted subroute, allow
    return true;
  }

  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return rolePermissions.includes(requiredPermission);
}

/**
 * Checks whether an admin user has a specific permission.
 * Super Admins always have full permissions.
 */
export function can(user: AdminUser | null | undefined, permission: AdminPermission): boolean {
  if (!user) return false;
  if (user.role === "super_admin") return true;
  if (user.status === "inactive") return false;

  if (user.permissions && user.permissions.includes(permission)) {
    return true;
  }

  const roleDefaults = ROLE_PERMISSIONS[user.role];
  if (roleDefaults && roleDefaults.includes(permission)) {
    return true;
  }

  return false;
}

/**
 * Asserts permission, throwing an AuthorizationError if unauthorized.
 * Used at Server Action boundary.
 */
export function assertPermission(userRole: AdminRole | undefined, permission: AdminPermission): void {
  if (!userRole) {
    throw new AuthorizationError(`[Security Exception] Missing administrative role.`);
  }
  if (userRole === "super_admin") return;

  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  if (!rolePermissions.includes(permission)) {
    throw new AuthorizationError(
      `[Security Exception] Role "${userRole}" is unauthorized to perform action requiring "${permission}".`
    );
  }
}
