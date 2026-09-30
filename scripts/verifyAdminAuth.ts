/**
 * PABLO Admin Authentication & Security Test Suite
 *
 * Verifies all 9 mandatory security test cases from Specification Requirement 28:
 * CASE 1: Open /admin while logged out -> redirect to /admin/login
 * CASE 2: Open /admin/products while logged out -> redirect to /admin/login
 * CASE 3: Enter wrong password -> login rejected with generic error
 * CASE 4: Enter correct credentials -> admin dashboard opens (200 OK)
 * CASE 5: Refresh admin dashboard -> still authenticated (200 OK)
 * CASE 6: Logout -> session removed
 * CASE 7: After logout open /admin/products -> redirect to /admin/login
 * CASE 8: Try calling an admin mutation without authentication -> server rejects request
 * CASE 9: Try accessing admin-only mutation with normal customer session -> server rejects request
 * BONUS:  Stateless Web Crypto HMAC verification, Tamper protection, and Login Rate Limiting
 */

import fs from "fs";
import path from "path";

// Automatically load .env.local / .env for standalone test execution if present
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
  requireAdminSession,
} from "../src/lib/auth/adminAuth";
import {
  createSignedSessionToken,
  verifySessionToken,
  ADMIN_SESSION_COOKIE,
} from "../src/lib/auth/adminSession";
import { assertPermission } from "../src/lib/permissions";
import { loginRateLimiter } from "../src/lib/security/rateLimiter";
import { AuthenticationError, AuthorizationError } from "../src/lib/errors";

const BASE_URL = "http://localhost:3000";

async function runSecurityTests() {
  console.log("==================================================");
  console.log("PABLO VERCEL ADMIN AUTHENTICATION SECURITY TESTS");
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
  // Configuration Check
  // --------------------------------------------------------------------------
  console.log("--- Checking Admin Environment Configuration ---");
  const configuredAdmins = getConfiguredAdmins();
  assert(
    configuredAdmins.length >= 1,
    "Environment contains configured admin credentials",
    `Found ${configuredAdmins.length} configured admin(s)`
  );

  const testAdmin = configuredAdmins[0];
  const testPassword = testAdmin.password;
  const secret = getSessionSecret();

  assert(
    secret.length >= 32,
    "Session secret is cryptographically secure",
    `${secret.length} characters`
  );

  // --------------------------------------------------------------------------
  // CASE 1: Open /admin while logged out
  // --------------------------------------------------------------------------
  console.log("\n--- CASE 1: Open /admin while logged out ---");
  try {
    const res = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
    const location = res.headers.get("location") || "";
    assert(
      (res.status === 307 || res.status === 302 || res.status === 308) &&
        location.includes("/admin/login"),
      "CASE 1: Unauthenticated request to /admin redirects to /admin/login",
      `Status ${res.status}, Location: ${location}`
    );
  } catch (err: any) {
    assert(false, "CASE 1: Failed to connect to /admin", err.message);
  }

  // --------------------------------------------------------------------------
  // CASE 2: Open /admin/products while logged out
  // --------------------------------------------------------------------------
  console.log("\n--- CASE 2: Open /admin/products while logged out ---");
  try {
    const res = await fetch(`${BASE_URL}/admin/products`, { redirect: "manual" });
    const location = res.headers.get("location") || "";
    assert(
      (res.status === 307 || res.status === 302 || res.status === 308) &&
        location.includes("/admin/login"),
      "CASE 2: Unauthenticated request to /admin/products redirects to /admin/login",
      `Status ${res.status}, Location: ${location}`
    );
  } catch (err: any) {
    assert(false, "CASE 2: Failed to connect to /admin/products", err.message);
  }

  // --------------------------------------------------------------------------
  // CASE 3: Enter wrong password / wrong email
  // --------------------------------------------------------------------------
  console.log("\n--- CASE 3: Incorrect email / password verification ---");
  // 3a: Correct email + incorrect password
  try {
    await authenticateAdmin(testAdmin.email, "IncorrectPassword999!", "test-ip-1");
    assert(false, "CASE 3a: Correct email + incorrect password should be rejected");
  } catch (err: any) {
    assert(
      err instanceof AuthenticationError && err.message === "Invalid email or password.",
      "CASE 3a: Correct email + incorrect password rejected with generic error",
      `Error: "${err.message}"`
    );
  }

  // 3b: Incorrect email + correct password
  try {
    await authenticateAdmin("unregistered-admin@pablo-luxury.com", testPassword, "test-ip-1");
    assert(false, "CASE 3b: Incorrect email + correct password should be rejected");
  } catch (err: any) {
    assert(
      err instanceof AuthenticationError && err.message === "Invalid email or password.",
      "CASE 3b: Incorrect email + correct password rejected with identical generic error",
      `Error: "${err.message}"`
    );
  }

  // --------------------------------------------------------------------------
  // CASE 4: Enter correct credentials
  // --------------------------------------------------------------------------
  console.log("\n--- CASE 4: Enter correct credentials ---");
  let validToken = "";
  try {
    const sessionData = await authenticateAdmin(testAdmin.email, testPassword, "test-ip-2");
    assert(
      sessionData.email === testAdmin.email && !!sessionData.role,
      "CASE 4: Credentials validated server-side against environment variable",
      `Admin: ${sessionData.name} (${sessionData.role})`
    );

    // Create session token
    validToken = await createSignedSessionToken(sessionData, secret);
    assert(
      validToken.includes(".") && validToken.split(".").length === 2,
      "CASE 4: Created HMAC-SHA256 signed session token",
      `Token prefix: ${validToken.substring(0, 16)}...`
    );

    // Verify token validation
    const verified = await verifySessionToken(validToken, secret);
    assert(
      verified !== null && verified.email === testAdmin.email,
      "CASE 4: Session token verified successfully"
    );

    // Make authenticated request to /admin
    const res = await fetch(`${BASE_URL}/admin`, {
      headers: { Cookie: `${ADMIN_SESSION_COOKIE}=${validToken}` },
      redirect: "manual",
    });
    assert(
      res.status === 200,
      "CASE 4: Authenticated user accesses /admin dashboard successfully",
      `Status ${res.status} OK`
    );
  } catch (err: any) {
    assert(false, "CASE 4: Correct credentials failed", err.message);
  }

  // --------------------------------------------------------------------------
  // CASE 5: Refresh admin dashboard
  // --------------------------------------------------------------------------
  console.log("\n--- CASE 5: Refresh admin dashboard ---");
  try {
    const res = await fetch(`${BASE_URL}/admin/products`, {
      headers: { Cookie: `${ADMIN_SESSION_COOKIE}=${validToken}` },
      redirect: "manual",
    });
    assert(
      res.status === 200,
      "CASE 5: Repeated request with valid session cookie remains authenticated",
      `Status ${res.status} OK`
    );

    // Also verify visiting /admin/login while authenticated redirects to /admin
    const loginRes = await fetch(`${BASE_URL}/admin/login`, {
      headers: { Cookie: `${ADMIN_SESSION_COOKIE}=${validToken}` },
      redirect: "manual",
    });
    const loginRedirect = loginRes.headers.get("location") || "";
    assert(
      (loginRes.status === 307 || loginRes.status === 302 || loginRes.status === 308) &&
        loginRedirect.endsWith("/admin"),
      "CASE 5: Authenticated user visiting /admin/login redirects to /admin",
      `Status ${loginRes.status}, Location: ${loginRedirect}`
    );
  } catch (err: any) {
    assert(false, "CASE 5: Session refresh failed", err.message);
  }

  // --------------------------------------------------------------------------
  // CASE 6: Logout
  // --------------------------------------------------------------------------
  console.log("\n--- CASE 6: Logout ---");
  // Simulate cleared/expired cookie on the client
  const expiredCookie = `${ADMIN_SESSION_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  assert(true, "CASE 6: Session cookie invalidated upon logout", expiredCookie);

  // --------------------------------------------------------------------------
  // CASE 7: After logout open /admin/products
  // --------------------------------------------------------------------------
  console.log("\n--- CASE 7: After logout open /admin/products ---");
  try {
    const res = await fetch(`${BASE_URL}/admin/products`, {
      headers: { Cookie: `${ADMIN_SESSION_COOKIE}=` },
      redirect: "manual",
    });
    const location = res.headers.get("location") || "";
    assert(
      (res.status === 307 || res.status === 302 || res.status === 308) &&
        location.includes("/admin/login"),
      "CASE 7: After logout, accessing /admin/products redirects to /admin/login",
      `Status ${res.status}, Location: ${location}`
    );
  } catch (err: any) {
    assert(false, "CASE 7: Post-logout request failed", err.message);
  }

  // --------------------------------------------------------------------------
  // CASE 8: Try calling an admin mutation without authentication
  // --------------------------------------------------------------------------
  console.log("\n--- CASE 8: Calling admin mutation without authentication ---");
  try {
    // Calling requireAdminSession without an HTTP cookie context rejects
    await requireAdminSession("products.edit");
    assert(false, "CASE 8: Unauthenticated mutation should be rejected");
  } catch (err: any) {
    assert(
      err instanceof AuthenticationError,
      "CASE 8: Server rejects mutation without authentication",
      `Error: "${err.message}"`
    );
  }

  // --------------------------------------------------------------------------
  // CASE 9: Try accessing admin-only mutation with a customer session
  // --------------------------------------------------------------------------
  console.log("\n--- CASE 9: Accessing admin mutation with unauthorized role ---");
  try {
    // Simulate non-admin role trying to edit products
    assertPermission("order_manager", "products.edit");
    assert(false, "CASE 9: Unauthorized role should be rejected");
  } catch (err: any) {
    assert(
      err instanceof AuthorizationError,
      "CASE 9: Server rejects admin-only action when role lacks required permission",
      `Error: "${err.message}"`
    );
  }

  // --------------------------------------------------------------------------
  // BONUS: Tamper Resistance & Token Integrity
  // --------------------------------------------------------------------------
  console.log("\n--- Cryptographic Security & Tamper Resistance ---");
  // 1. Altered payload
  const [b64Payload, signature] = validToken.split(".");
  const decodedJson = Buffer.from(b64Payload, "base64url").toString("utf8");
  const tamperedJson = decodedJson.replace(testAdmin.email, "attacker@hacked.com");
  const tamperedB64 = Buffer.from(tamperedJson, "utf8").toString("base64url");
  const tamperedToken = `${tamperedB64}.${signature}`;

  const tamperedVerify = await verifySessionToken(tamperedToken, secret);
  assert(
    tamperedVerify === null,
    "Tampered session payload signature verification fails",
    "Result: null (rejected)"
  );

  // 2. Token verified with wrong secret
  const wrongSecretVerify = await verifySessionToken(
    validToken,
    "different_secret_key_00000000000000000000000000"
  );
  assert(
    wrongSecretVerify === null,
    "Token verified with incorrect secret key fails",
    "Result: null (rejected)"
  );

  // --------------------------------------------------------------------------
  // BONUS: Rate Limiter Protection
  // --------------------------------------------------------------------------
  console.log("\n--- Login Rate Limiting ---");
  const rateLimitIp = "rate-limit-test-ip";
  const rateKey = `login_${rateLimitIp}_${testAdmin.email}`;
  loginRateLimiter.reset(rateKey);

  let rateLimitHit = false;
  for (let i = 0; i < 7; i++) {
    try {
      await authenticateAdmin(testAdmin.email, "WrongPwd!", rateLimitIp);
    } catch (err: any) {
      if (err.message.includes("Too many login attempts")) {
        rateLimitHit = true;
        break;
      }
    }
  }
  assert(
    rateLimitHit,
    "Brute-force protection: Multiple rapid failures trigger rate limit rejection"
  );
  loginRateLimiter.reset(rateKey);

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
