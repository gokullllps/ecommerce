import { AdminUser, AdminRole, AdminPermission } from "@/types/admin";

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
    "settings.manage",
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
  content_manager: [
    "dashboard.view",
    "storefront.manage",
    "themes.manage",
    "media.manage",
  ],
  marketing_manager: [
    "dashboard.view",
    "promotions.manage",
    "themes.manage",
    "collections.manage",
  ],
};

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

import { AuthorizationError } from "@/lib/errors";

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

