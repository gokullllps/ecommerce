"use server";

import { headers } from "next/headers";
import {
  authenticateAdmin,
  createAdminSession,
  destroyAdminSession,
  getAdminSession,
} from "@/lib/auth/adminAuth";
import { AdminSession } from "@/lib/auth/adminSession";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  user?: Omit<AdminSession, "iat" | "exp">;
}

/**
 * Server Action to authenticate admin login and set the secure HTTP-only cookie.
 */
export async function loginAdminAction(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";

  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "localhost";

    const sessionData = await authenticateAdmin(email, password, clientIp);
    await createAdminSession(sessionData);

    return {
      success: true,
      user: sessionData,
    };
  } catch (error: unknown) {
    const msg = (error as Error)?.message || "Invalid email or password.";
    if (msg.includes("PABLO admin authentication is not configured")) {
      return {
        success: false,
        error: "PABLO admin authentication is not configured.",
      };
    }
    if (msg.includes("Too many")) {
      return {
        success: false,
        error: msg,
      };
    }
    return {
      success: false,
      error: "Invalid email or password.",
    };
  }
}

/**
 * Server Action to log out the current admin and clear the session cookie.
 */
export async function logoutAdminAction(): Promise<{ success: boolean }> {
  try {
    await destroyAdminSession();
    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Server Action to get the current authenticated session payload.
 */
export async function getCurrentAdminSessionAction(): Promise<{
  authenticated: boolean;
  user: AdminSession | null;
}> {
  try {
    const session = await getAdminSession();
    return {
      authenticated: !!session,
      user: session,
    };
  } catch {
    return {
      authenticated: false,
      user: null,
    };
  }
}
