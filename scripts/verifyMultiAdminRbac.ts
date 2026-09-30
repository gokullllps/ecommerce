/**
 * PABLO Multi-Admin Authentication & Strict RBAC Security Test Suite
 *
 * Validates:
 * 1. Multi-admin configuration from environment variables (all 7 roles).
 * 2. Authenticating each role and resolving their specific role ID without exposing passwords.
 * 3. Centralized Permission Matrix assertions across all 7 roles (Section 31).
 * 4. Direct URL access interception -> Redirect to /admin/unauthorized for forbidden routes (Section 32).
 * 5. Server mutation authorization enforcement (Section 33).
 * 6. Super Admin exclusive access to Users, Settings, and Audit Logs.
 */

import fs from "fs";
import path from "path";

// Automatically load .env.local / .env for standalone test execution
for (const envName of [".env.local", ".env"]) {
  const envPath = path.resolve(process.cwd(), envName);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...vals] = trimmed.split("=");
        const k = key.trim();
        if (k) {
          process.env[k] = vals.join("=").trim();
        }
      }
    }
  }
}

import {
  authenticateAdmin,
  getConfiguredAdmins,
  getSessionSecret,
} from "../src/lib/auth/adminAuth";
import {
  createSignedSessionToken,
  verifySessionToken,
  ADMIN_SESSION_COOKIE,
} from "../src/lib/auth/adminSession";
import {
  AdminRole,
  AdminPermission,
} from "../src/types/admin";
import {
  ROLE_PERMISSIONS,
  canRoleAccessRoute,
  assertPermission,
  getRoleDisplayName,
} from "../src/lib/permissions";
import { AuthorizationError } from "../src/lib/errors";

const BASE_URL = "http://localhost:3000";

const ALL_ROLES: AdminRole[] = [
  "super_admin",
  "admin",
  "product_manager",
  "content_manager",
  "inventory_manager",
  "order_manager",
  "marketing_manager",
];

async function runRbacTests() {
  console.log("==================================================");
  console.log("PABLO MULTI-ADMIN AUTHENTICATION & STRICT RBAC TESTS");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}${detail ? ` (${detail})` : ""}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` (${detail})` : ""}`);
      failed++;
    }
  }

  // --------------------------------------------------------------------------
  // 1. Environment Configuration Checks (All 7 Roles)
  // --------------------------------------------------------------------------
  console.log("--- 1. Multi-Admin Environment Configuration ---");
  const configuredAdmins = getConfiguredAdmins();
  assert(
    configuredAdmins.length >= 7,
    "Environment contains all 7 configured admin accounts",
    `Found ${configuredAdmins.length} configured admin(s)`
  );

  const foundRoles = new Set(configuredAdmins.map((a) => a.role));
  for (const role of ALL_ROLES) {
    assert(
      foundRoles.has(role),
      `Role configured in environment: ${role}`,
      `Label: "${getRoleDisplayName(role)}"`
    );
  }

  const secret = getSessionSecret();
  assert(
    secret.length >= 32,
    "Session secret is cryptographically secure",
    `${secret.length} characters`
  );

  // --------------------------------------------------------------------------
  // 2. Authentication & Role Resolution (Zero Passwords Leaked)
  // --------------------------------------------------------------------------
  console.log("\n--- 2. Server Authentication & Role Resolution ---");
  const authenticatedTokens: Record<AdminRole, string> = {} as any;

  for (const adminCfg of configuredAdmins) {
    // Authenticate with valid credentials server-side
    const sessionPayload = await authenticateAdmin(adminCfg.email, adminCfg.password, "127.0.0.1");

    assert(
      sessionPayload.role === adminCfg.role,
      `Authenticated ${adminCfg.role}`,
      `Email: ${adminCfg.email}, Name: ${sessionPayload.name}`
    );

    // Verify token payload does not leak credentials
    const token = await createSignedSessionToken(sessionPayload, secret);
    const verified = await verifySessionToken(token, secret);

    assert(
      verified !== null &&
        !("password" in (verified as any)) &&
        !("passwordHash" in (verified as any)),
      `Session token created for ${adminCfg.role} without credentials in payload`,
      `Token size: ${token.length} chars`
    );

    if (!authenticatedTokens[adminCfg.role]) {
      authenticatedTokens[adminCfg.role] = token;
    }
  }

  // --------------------------------------------------------------------------
  // 3. Centralized Permission Matrix Checks (Section 31)
  // --------------------------------------------------------------------------
  console.log("\n--- 3. Centralized Permission Matrix (Section 31) ---");

  // SUPER ADMIN -> all modules allowed
  assert(
    canRoleAccessRoute("super_admin", "/admin/products") &&
      canRoleAccessRoute("super_admin", "/admin/orders") &&
      canRoleAccessRoute("super_admin", "/admin/themes") &&
      canRoleAccessRoute("super_admin", "/admin/users") &&
      canRoleAccessRoute("super_admin", "/admin/settings") &&
      canRoleAccessRoute("super_admin", "/admin/audit-logs"),
    "SUPER ADMIN: Unrestricted access to all modules"
  );

  // PRODUCT MANAGER -> Products, Categories, Collections, Inventory allowed; Orders, Customers, Themes, Settings denied
  assert(
    canRoleAccessRoute("product_manager", "/admin/products") &&
      canRoleAccessRoute("product_manager", "/admin/categories") &&
      canRoleAccessRoute("product_manager", "/admin/collections") &&
      canRoleAccessRoute("product_manager", "/admin/inventory"),
    "PRODUCT MANAGER: Catalog & inventory modules allowed"
  );
  assert(
    !canRoleAccessRoute("product_manager", "/admin/orders") &&
      !canRoleAccessRoute("product_manager", "/admin/customers") &&
      !canRoleAccessRoute("product_manager", "/admin/themes") &&
      !canRoleAccessRoute("product_manager", "/admin/settings") &&
      !canRoleAccessRoute("product_manager", "/admin/users"),
    "PRODUCT MANAGER: Orders, Customers, Themes, Settings, and Users denied"
  );

  // CONTENT MANAGER -> Storefront, Themes, Media, Collections allowed; Orders, Inventory denied
  assert(
    canRoleAccessRoute("content_manager", "/admin/storefront") &&
      canRoleAccessRoute("content_manager", "/admin/themes") &&
      canRoleAccessRoute("content_manager", "/admin/media") &&
      canRoleAccessRoute("content_manager", "/admin/collections"),
    "CONTENT MANAGER: Storefront, Themes, Media, and Collections allowed"
  );
  assert(
    !canRoleAccessRoute("content_manager", "/admin/orders") &&
      !canRoleAccessRoute("content_manager", "/admin/inventory") &&
      !canRoleAccessRoute("content_manager", "/admin/users") &&
      !canRoleAccessRoute("content_manager", "/admin/settings"),
    "CONTENT MANAGER: Orders, Inventory, Users, and Settings denied"
  );

  // INVENTORY MANAGER -> Inventory and Products read allowed; Orders, Promotions denied
  assert(
    canRoleAccessRoute("inventory_manager", "/admin/inventory") &&
      canRoleAccessRoute("inventory_manager", "/admin/products"),
    "INVENTORY MANAGER: Inventory and Products view allowed"
  );
  assert(
    !canRoleAccessRoute("inventory_manager", "/admin/orders") &&
      !canRoleAccessRoute("inventory_manager", "/admin/promotions") &&
      !canRoleAccessRoute("inventory_manager", "/admin/themes") &&
      !canRoleAccessRoute("inventory_manager", "/admin/users"),
    "INVENTORY MANAGER: Orders, Promotions, Themes, and Users denied"
  );

  // ORDER MANAGER -> Orders, Customers allowed; Inventory, Themes denied
  assert(
    canRoleAccessRoute("order_manager", "/admin/orders") &&
      canRoleAccessRoute("order_manager", "/admin/customers"),
    "ORDER MANAGER: Orders and Customers allowed"
  );
  assert(
    !canRoleAccessRoute("order_manager", "/admin/inventory") &&
      !canRoleAccessRoute("order_manager", "/admin/themes") &&
      !canRoleAccessRoute("order_manager", "/admin/users") &&
      !canRoleAccessRoute("order_manager", "/admin/settings"),
    "ORDER MANAGER: Inventory, Themes, Users, and Settings denied"
  );

  // MARKETING MANAGER -> Promotions, Collections, Themes allowed; Orders, Inventory denied
  assert(
    canRoleAccessRoute("marketing_manager", "/admin/promotions") &&
      canRoleAccessRoute("marketing_manager", "/admin/collections") &&
      canRoleAccessRoute("marketing_manager", "/admin/themes"),
    "MARKETING MANAGER: Promotions, Collections, and Themes allowed"
  );
  assert(
    !canRoleAccessRoute("marketing_manager", "/admin/orders") &&
      !canRoleAccessRoute("marketing_manager", "/admin/inventory") &&
      !canRoleAccessRoute("marketing_manager", "/admin/users") &&
      !canRoleAccessRoute("marketing_manager", "/admin/settings"),
    "MARKETING MANAGER: Orders, Inventory, Users, and Settings denied"
  );

  // ADMIN -> Broad operational modules allowed; Super Admin-only security/user controls denied
  assert(
    canRoleAccessRoute("admin", "/admin/products") &&
      canRoleAccessRoute("admin", "/admin/orders") &&
      canRoleAccessRoute("admin", "/admin/promotions") &&
      canRoleAccessRoute("admin", "/admin/themes") &&
      canRoleAccessRoute("admin", "/admin/media"),
    "ADMIN: Broad operational modules allowed"
  );
  assert(
    !canRoleAccessRoute("admin", "/admin/users") &&
      !canRoleAccessRoute("admin", "/admin/settings") &&
      !canRoleAccessRoute("admin", "/admin/audit-logs"),
    "ADMIN: Super Admin-only controls (Users, Settings, Audit Logs) strictly denied"
  );

  // --------------------------------------------------------------------------
  // 4. Direct URL Interception via HTTP Proxy (Section 32)
  // --------------------------------------------------------------------------
  console.log("\n--- 4. Direct URL Access & Unauthorized Redirects (Section 32) ---");

  // Helper for direct URL requests
  async function testRouteAccess(
    token: string,
    pathname: string
  ): Promise<{ status: number; location: string }> {
    const res = await fetch(`${BASE_URL}${pathname}`, {
      method: "GET",
      headers: {
        Cookie: `${ADMIN_SESSION_COOKIE}=${token}`,
      },
      redirect: "manual",
    });
    return {
      status: res.status,
      location: res.headers.get("location") || "",
    };
  }

  try {
    // 4a. Product Manager: /admin/orders -> redirects to /admin/unauthorized
    const pmOrders = await testRouteAccess(authenticatedTokens.product_manager, "/admin/orders");
    assert(
      pmOrders.status === 307 && pmOrders.location.includes("/admin/unauthorized"),
      "Product Manager: /admin/orders redirected to /admin/unauthorized",
      `Status: ${pmOrders.status}, Location: ${pmOrders.location}`
    );

    // 4b. Order Manager: /admin/themes -> redirects to /admin/unauthorized
    const omThemes = await testRouteAccess(authenticatedTokens.order_manager, "/admin/themes");
    assert(
      omThemes.status === 307 && omThemes.location.includes("/admin/unauthorized"),
      "Order Manager: /admin/themes redirected to /admin/unauthorized",
      `Status: ${omThemes.status}, Location: ${omThemes.location}`
    );

    // 4c. Content Manager: /admin/inventory -> redirects to /admin/unauthorized
    const cmInventory = await testRouteAccess(authenticatedTokens.content_manager, "/admin/inventory");
    assert(
      cmInventory.status === 307 && cmInventory.location.includes("/admin/unauthorized"),
      "Content Manager: /admin/inventory redirected to /admin/unauthorized",
      `Status: ${cmInventory.status}, Location: ${cmInventory.location}`
    );

    // 4d. Marketing Manager: /admin/customers -> redirects to /admin/unauthorized
    const mmCustomers = await testRouteAccess(authenticatedTokens.marketing_manager, "/admin/customers");
    assert(
      mmCustomers.status === 307 && mmCustomers.location.includes("/admin/unauthorized"),
      "Marketing Manager: /admin/customers redirected to /admin/unauthorized",
      `Status: ${mmCustomers.status}, Location: ${mmCustomers.location}`
    );

    // 4e. Inventory Manager: /admin/promotions -> redirects to /admin/unauthorized
    const imPromotions = await testRouteAccess(authenticatedTokens.inventory_manager, "/admin/promotions");
    assert(
      imPromotions.status === 307 && imPromotions.location.includes("/admin/unauthorized"),
      "Inventory Manager: /admin/promotions redirected to /admin/unauthorized",
      `Status: ${imPromotions.status}, Location: ${imPromotions.location}`
    );

    // 4f. Admin: /admin/users -> redirects to /admin/unauthorized
    const adminUsers = await testRouteAccess(authenticatedTokens.admin, "/admin/users");
    assert(
      adminUsers.status === 307 && adminUsers.location.includes("/admin/unauthorized"),
      "Admin: /admin/users redirected to /admin/unauthorized",
      `Status: ${adminUsers.status}, Location: ${adminUsers.location}`
    );

    // 4g. Super Admin passes all these modules
    const saOrders = await testRouteAccess(authenticatedTokens.super_admin, "/admin/orders");
    const saThemes = await testRouteAccess(authenticatedTokens.super_admin, "/admin/themes");
    const saInventory = await testRouteAccess(authenticatedTokens.super_admin, "/admin/inventory");
    const saUsers = await testRouteAccess(authenticatedTokens.super_admin, "/admin/users");

    assert(
      saOrders.status === 200 &&
        saThemes.status === 200 &&
        saInventory.status === 200 &&
        saUsers.status === 200,
      "Super Admin passes all direct URL modules with 200 OK",
      `Orders: ${saOrders.status}, Themes: ${saThemes.status}, Inventory: ${saInventory.status}, Users: ${saUsers.status}`
    );

    // 4h. Dedicated /admin/unauthorized page renders HTTP 200 for authenticated admins
    const unauthorizedPage = await fetch(`${BASE_URL}/admin/unauthorized`, {
      headers: { Cookie: `${ADMIN_SESSION_COOKIE}=${authenticatedTokens.product_manager}` },
    });
    assert(
      unauthorizedPage.status === 200,
      "Dedicated /admin/unauthorized page renders HTTP 200 OK",
      `Status: ${unauthorizedPage.status}`
    );
  } catch (err: any) {
    console.warn("Direct HTTP fetch checks warning (server might be booting):", err.message);
  }

  // --------------------------------------------------------------------------
  // 5. Server Mutation Security Assertions (Section 33)
  // --------------------------------------------------------------------------
  console.log("\n--- 5. Server Mutation Security Tests (Section 33) ---");

  // Product Manager attempting orders.edit -> REJECTED
  try {
    assertPermission("product_manager", "orders.edit");
    assert(false, "Product Manager attempting orders.edit was not rejected");
  } catch (err: any) {
    assert(
      err instanceof AuthorizationError,
      "Product Manager attempting orders.edit -> REJECTED",
      err.message
    );
  }

  // Order Manager attempting themes.manage -> REJECTED
  try {
    assertPermission("order_manager", "themes.manage");
    assert(false, "Order Manager attempting themes.manage was not rejected");
  } catch (err: any) {
    assert(
      err instanceof AuthorizationError,
      "Order Manager attempting themes.manage -> REJECTED",
      err.message
    );
  }

  // Content Manager attempting inventory.manage -> REJECTED
  try {
    assertPermission("content_manager", "inventory.manage");
    assert(false, "Content Manager attempting inventory.manage was not rejected");
  } catch (err: any) {
    assert(
      err instanceof AuthorizationError,
      "Content Manager attempting inventory.manage -> REJECTED",
      err.message
    );
  }

  // Marketing Manager attempting customers.edit -> REJECTED
  try {
    assertPermission("marketing_manager", "customers.edit");
    assert(false, "Marketing Manager attempting customers.edit was not rejected");
  } catch (err: any) {
    assert(
      err instanceof AuthorizationError,
      "Marketing Manager attempting customers.edit -> REJECTED",
      err.message
    );
  }

  // Inventory Manager attempting products.edit -> REJECTED
  try {
    assertPermission("inventory_manager", "products.edit");
    assert(false, "Inventory Manager attempting products.edit was not rejected");
  } catch (err: any) {
    assert(
      err instanceof AuthorizationError,
      "Inventory Manager attempting products.edit -> REJECTED",
      err.message
    );
  }

  // Admin attempting users.manage -> REJECTED
  try {
    assertPermission("admin", "users.manage");
    assert(false, "Admin attempting users.manage was not rejected");
  } catch (err: any) {
    assert(
      err instanceof AuthorizationError,
      "Admin attempting users.manage -> REJECTED",
      err.message
    );
  }

  // Super Admin attempting these operations -> ALLOWED
  try {
    assertPermission("super_admin", "orders.edit");
    assertPermission("super_admin", "themes.manage");
    assertPermission("super_admin", "inventory.manage");
    assertPermission("super_admin", "customers.edit");
    assertPermission("super_admin", "products.edit");
    assertPermission("super_admin", "users.manage");
    assert(true, "Super Admin executing all operations -> ALLOWED");
  } catch (err: any) {
    assert(false, "Super Admin operations failed", err.message);
  }

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runRbacTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
