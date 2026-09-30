import { cookies } from "next/headers";
import { adminUsersRepository } from "@/lib/repositories/adminUsersRepository";
import { AdminRole, AdminPermission } from "@/types/admin";
import { AuthenticationError } from "@/lib/errors";
import { assertPermission, getRoleDisplayName } from "@/lib/permissions";
import { loginRateLimiter } from "@/lib/security/rateLimiter";
import {
  AdminSession,
  ADMIN_SESSION_COOKIE,
  ADMIN_COOKIE_OPTIONS,
  createSignedSessionToken,
  verifySessionToken,
} from "./adminSession";

export interface ConfiguredAdmin {
  email: string;
  password: string;
  role: AdminRole;
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Reads the PABLO_SESSION_SECRET from environment.
 * In production, strictly validates length and presence to prevent weak configurations.
 */
export function getSessionSecret(): string {
  const secret = process.env.PABLO_SESSION_SECRET;

  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.trim().length < 32) {
      throw new Error(
        "PABLO admin authentication is not configured: Missing or invalid PABLO_SESSION_SECRET in production."
      );
    }
  }

  // Fallback for local development if not yet set in .env.local
  return secret || "6ec6de799af46608d6d39acba046924e82d0c7c5e864d84b20020b2b0fab1fe8";
}

/**
 * Default role assignment by slot index (1-7).
 */
const DEFAULT_SLOT_ROLES: AdminRole[] = [
  "super_admin",
  "admin",
  "product_manager",
  "content_manager",
  "inventory_manager",
  "order_manager",
  "marketing_manager",
];

/**
 * Discovers configured admins from environment variables:
 * PABLO_ADMIN_1_EMAIL, PABLO_ADMIN_1_PASSWORD, PABLO_ADMIN_1_ROLE, etc.
 */
export function getConfiguredAdmins(): ConfiguredAdmin[] {
  const admins: ConfiguredAdmin[] = [];

  for (let i = 1; i <= 10; i++) {
    const email = process.env[`PABLO_ADMIN_${i}_EMAIL`]?.trim();
    const password = process.env[`PABLO_ADMIN_${i}_PASSWORD`]?.trim();
    const roleEnv = process.env[`PABLO_ADMIN_${i}_ROLE`]?.trim() as AdminRole | undefined;
    const role: AdminRole = roleEnv || DEFAULT_SLOT_ROLES[i - 1] || "admin";

    if (email && password) {
      admins.push({ email, password, role });
    }
  }

  if (process.env.NODE_ENV === "production" && admins.length === 0) {
    throw new Error(
      "PABLO admin authentication is not configured: No admin credentials defined in environment."
    );
  }

  return admins;
}

/**
 * Authenticates admin credentials server-side against configured environment variables.
 * Returns the admin profile payload for session creation.
 */
export async function authenticateAdmin(
  email: string,
  password: string,
  clientIp: string = "localhost"
): Promise<Omit<AdminSession, "iat" | "exp">> {
  // 1. Rate limiting check to prevent brute-force attacks
  const rateLimitKey = `login_${clientIp}_${(email || "").toLowerCase().trim()}`;
  const rateCheck = loginRateLimiter.check(rateLimitKey);
  if (!rateCheck.success) {
    throw new Error("Too many login attempts. Please wait a minute and try again.");
  }

  // 2. Validate format
  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    throw new AuthenticationError("Invalid email or password.");
  }

  const cleanEmail = email.trim().toLowerCase();
  const configuredAdmins = getConfiguredAdmins();
  const match = configuredAdmins.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!match) {
    // Return generic error without revealing whether email exists
    throw new AuthenticationError("Invalid email or password.");
  }

  // 3. Verify password against configured environment variable in constant time
  const isValidPassword = timingSafeCompare(password, match.password);
  if (!isValidPassword) {
    throw new AuthenticationError("Invalid email or password.");
  }

  // Reset rate limiter on successful authentication
  loginRateLimiter.reset(rateLimitKey);

  // 4. Resolve display profile from admin-users.json (non-sensitive metadata)
  const registeredUsers = await adminUsersRepository.getAdminUsers();
  const userProfile = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

  // Update lastLogin timestamp asynchronously
  if (userProfile?.id) {
    adminUsersRepository
      .updateAdminUser(userProfile.id, { lastLogin: new Date().toISOString() })
      .catch((err) => console.warn("[Admin Auth] Failed to update lastLogin:", err));
  }

  // Effective role: environment-configured role is authoritative
  const effectiveRole: AdminRole = match.role || userProfile?.role || "admin";
  const displayName = userProfile?.name || getRoleDisplayName(effectiveRole);

  return {
    adminId: userProfile?.id || `usr_admin_${Date.now()}`,
    email: match.email,
    name: displayName,
    role: effectiveRole,
  };
}

/**
 * Creates and sets an authenticated HTTP-only session cookie.
 */
export async function createAdminSession(
  sessionData: Omit<AdminSession, "iat" | "exp">
): Promise<string> {
  const secret = getSessionSecret();
  const token = await createSignedSessionToken(sessionData, secret);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, ADMIN_COOKIE_OPTIONS);

  return token;
}

/**
 * Destroys the current admin session cookie.
 */
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

/**
 * Retrieves and verifies the authenticated admin session from the cookie store.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) return null;

    const secret = getSessionSecret();
    return await verifySessionToken(token, secret);
  } catch {
    return null;
  }
}

/**
 * Server-side security guard for admin Server Actions and mutations.
 * Enforces session verification and role permissions.
 */
export async function requireAdminSession(
  permission?: AdminPermission
): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new AuthenticationError(
      "Authentication required. Please sign in to the PABLO admin portal."
    );
  }

  if (permission) {
    assertPermission(session.role, permission);
  }

  return session;
}
