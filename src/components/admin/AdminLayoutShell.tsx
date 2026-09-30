"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { AdminDataProvider } from "@/context/AdminDataContext";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

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
