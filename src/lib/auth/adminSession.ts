import { AdminRole } from "@/types/admin";

export interface AdminSession {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  iat: number;
  exp: number;
}

export const ADMIN_SESSION_COOKIE = "pablo_admin_session";

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24, // 24 hours
};

/**
 * Returns the session secret. In production, fails securely if secret is not set.
 */
export function getSafeSessionSecret(): string {
  const secret = process.env.PABLO_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return "";
    }
    return "6ec6de799af46608d6d39acba046924e82d0c7c5e864d84b20020b2b0fab1fe8";
  }
  return secret;
}

// URL-safe base64 helpers compatible with Edge and Node.js runtimes
function base64UrlEncode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf8").toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64url").toString("utf8");
  }
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return atob(b64);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64url");
  }
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return base64UrlEncode(binary);
}

function base64UrlToBytes(str: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(str, "base64url"));
  }
  const binary = base64UrlDecode(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates an HMAC-SHA256 signed stateless session token.
 */
export async function createSignedSessionToken(
  sessionData: Omit<AdminSession, "iat" | "exp">,
  secret: string,
  expiresInSeconds: number = 60 * 60 * 24
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullSession: AdminSession = {
    ...sessionData,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const payloadJson = JSON.stringify(fullSession);
  const payloadB64 = base64UrlEncode(payloadJson);

  const enc = new TextEncoder();
  const key = await getHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(payloadB64)
  );

  const signatureB64 = bytesToBase64Url(new Uint8Array(signatureBuffer));
  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies an HMAC-SHA256 signed session token. Returns null if invalid or expired.
 */
export async function verifySessionToken(
  token: string | undefined | null,
  secret: string
): Promise<AdminSession | null> {
  if (!secret) return null;
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signatureB64] = parts;
  if (!payloadB64 || !signatureB64) return null;

  try {
    const enc = new TextEncoder();
    const key = await getHmacKey(secret);
    const signatureBytes = base64UrlToBytes(signatureB64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      enc.encode(payloadB64)
    );

    if (!isValid) return null;

    const payloadJson = base64UrlDecode(payloadB64);
    const payload = JSON.parse(payloadJson) as AdminSession;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      return null; // Expired session
    }

    return payload;
  } catch {
    return null;
  }
}
