"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { AdminDataProvider } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { canRoleAccessRoute } from "@/lib/permissions";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isReady } = useAdminAuth();
  const isLoginPage = pathname === "/admin/login";
  const isUnauthorizedPage = pathname === "/admin/unauthorized";

  useEffect(() => {
    if (isReady && currentUser && !isLoginPage && !isUnauthorizedPage) {
      if (!canRoleAccessRoute(currentUser.role, pathname)) {
        router.replace("/admin/unauthorized");
      }
    }
  }, [isReady, currentUser, pathname, isLoginPage, isUnauthorizedPage, router]);

  if (isLoginPage) {
    return (
      <div className="pablo-admin min-h-screen" style={{ backgroundColor: "#EAE8E1" }}>
        {children}
      </div>
    );
  }

  return (
    <AdminDataProvider>
      <div className="pablo-admin flex min-h-screen" style={{ backgroundColor: "#EAE8E1" }}>
        <AdminSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <AdminTopBar />
          <main className="flex-1 overflow-x-hidden">
            <div className="a-page">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminDataProvider>
  );
}
