import { NextResponse } from "next/server";
import { getCanonicalAdminData } from "@/app/actions/adminActions";
import {
  productsRepository,
  categoriesRepository,
  collectionsRepository,
  inventoryRepository,
} from "@/lib/repositories";
import { cognitoAuth } from "@/lib/auth/cognito";
import { AdminUser } from "@/types/admin";
import { getAdminSession } from "@/lib/auth/adminAuth";
import { can, ROLE_PERMISSIONS } from "@/lib/permissions";
import { adminActionRateLimiter } from "@/lib/security/rateLimiter";
import { logger } from "@/lib/logger";

/**
 * Hardened Admin Data API Endpoint
 *
 * Enforces:
 * - Rate limiting (100 req/min per IP/token)
 * - Secure HTTP-only session cookie / AWS Cognito session
 * - Server-side RBAC validation
 * - Strict audit logging
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("x-admin-token") || undefined;
    const ip = req.headers.get("x-forwarded-for") || "local_admin";

    // Rate limiting
    const rateCheck = adminActionRateLimiter.check(`admin_api_${ip}`);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many administrative requests. Please slow down." },
        { status: 429 }
      );
    }

    // Authenticate caller (HTTP-only session cookie or Bearer token)
    const session = await getAdminSession();
    let authUser: AdminUser | null = session
      ? {
          id: session.adminId,
          name: session.name,
          email: session.email,
          role: session.role,
          status: "active",
          permissions: ROLE_PERMISSIONS[session.role] || [],
          lastLogin: new Date().toISOString(),
        }
      : null;

    if (!authUser) {
      const auth = await cognitoAuth.resolveAdminUser(authHeader);
      if (auth.isAuthenticated && auth.user) {
        authUser = auth.user;
      }
    }

    if (!authUser) {
      logger.warn("AUTH", "Blocked unauthenticated access to /api/admin/data", { ip });
      return NextResponse.json(
        { error: "Unauthorized: Valid administrative session required." },
        { status: 401 }
      );
    }

    // Role permission check
    if (!can(authUser, "dashboard.view")) {
      logger.warn("RBAC", "Forbidden: Admin user lacks dashboard.view permission", {
        userId: authUser.id,
        role: authUser.role,
      });
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to view administrative data." },
        { status: 403 }
      );
    }

    const data = await getCanonicalAdminData();

    // Redact sensitive details for non-super_admin
    if (authUser.role !== "super_admin") {
      return NextResponse.json({
        ...data,
        adminUsers: data.adminUsers.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          lastLogin: u.lastLogin,
        })),
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    logger.error("API", "Failed to fetch canonical admin data", { error: error.message });
    return NextResponse.json({ error: "Failed to load canonical admin data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("x-admin-token") || undefined;
    const ip = req.headers.get("x-forwarded-for") || "local_admin";

    // Rate limiting
    const rateCheck = adminActionRateLimiter.check(`admin_api_mut_${ip}`);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many administrative mutation requests." },
        { status: 429 }
      );
    }

    // Authenticate caller
    const session = await getAdminSession();
    let authUser: AdminUser | null = session
      ? {
          id: session.adminId,
          name: session.name,
          email: session.email,
          role: session.role,
          status: "active",
          permissions: ROLE_PERMISSIONS[session.role] || [],
          lastLogin: new Date().toISOString(),
        }
      : null;

    if (!authUser) {
      const auth = await cognitoAuth.resolveAdminUser(authHeader);
      if (auth.isAuthenticated && auth.user) {
        authUser = auth.user;
      }
    }

    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized: Valid administrative session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case "CREATE_PRODUCT": {
        if (!can(authUser, "products.edit")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const result = await productsRepository.createProduct(payload);
        return NextResponse.json(result);
      }
      case "UPDATE_PRODUCT": {
        if (!can(authUser, "products.edit")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const result = await productsRepository.updateProduct(payload.id, payload);
        return NextResponse.json(result);
      }
      case "DELETE_PRODUCT": {
        if (!can(authUser, "products.edit")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const result = await productsRepository.deleteProduct(payload.id);
        return NextResponse.json({ success: result });
      }
      case "ADJUST_INVENTORY": {
        if (!can(authUser, "inventory.manage")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const result = await inventoryRepository.adjustInventory(
          payload.productId,
          payload.variantSku,
          payload.delta,
          payload.reason,
          authUser.name || "Admin"
        );
        return NextResponse.json(result);
      }
      case "CREATE_CATEGORY": {
        if (!can(authUser, "categories.manage")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const result = await categoriesRepository.createCategory(payload);
        return NextResponse.json(result);
      }
      case "UPDATE_CATEGORY": {
        if (!can(authUser, "categories.manage")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const result = await categoriesRepository.updateCategory(payload.id, payload);
        return NextResponse.json(result);
      }
      case "DELETE_CATEGORY": {
        if (!can(authUser, "categories.manage")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const result = await categoriesRepository.deleteCategory(payload.id);
        return NextResponse.json({ success: result });
      }
      case "CREATE_COLLECTION": {
        if (!can(authUser, "collections.manage")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const result = await collectionsRepository.createCollection(payload);
        return NextResponse.json(result);
      }
      case "UPDATE_COLLECTION": {
        if (!can(authUser, "collections.manage")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const result = await collectionsRepository.updateCollection(payload.id, payload);
        return NextResponse.json(result);
      }
      case "DELETE_COLLECTION": {
        if (!can(authUser, "collections.manage")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const result = await collectionsRepository.deleteCollection(payload.id);
        return NextResponse.json({ success: result });
      }
      default:
        return NextResponse.json({ error: `Unknown action "${action}"` }, { status: 400 });
    }
  } catch (error: any) {
    logger.error("API", "Failed to process mutation", { error: error.message });
    return NextResponse.json({ error: error.message || "Mutation failed" }, { status: 500 });
  }
}
