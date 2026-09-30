"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { AdminUser, AdminRole, AdminPermission } from "@/types/admin";
import { getCurrentAdminSessionAction, logoutAdminAction } from "@/app/actions/authActions";
import { can, ROLE_PERMISSIONS } from "@/lib/permissions";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  role: AdminRole | null;
  logout: () => Promise<void>;
  switchRole: (role: AdminRole) => void;
  hasPermission: (permission: AdminPermission) => boolean;
  refreshSession: () => Promise<void>;
  isReady: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const refreshSession = useCallback(async () => {
    try {
      const res = await getCurrentAdminSessionAction();
      if (res.authenticated && res.user) {
        setIsAuthenticated(true);
        setCurrentUser({
          id: res.user.adminId,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          status: "active",
          permissions: ROLE_PERMISSIONS[res.user.role] || [],
          lastLogin: new Date().toISOString(),
        });
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const logout = useCallback(async () => {
    try {
      await logoutAdminAction();
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, []);

  const switchRole = useCallback((newRole: AdminRole) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        role: newRole,
        permissions: ROLE_PERMISSIONS[newRole] || [],
      };
    });
  }, []);

  const hasPermission = useCallback(
    (permission: AdminPermission): boolean => {
      if (!isAuthenticated || !currentUser) return false;
      return can(currentUser, permission);
    },
    [isAuthenticated, currentUser]
  );

  const value = useMemo<AdminAuthContextType>(
    () => ({
      isAuthenticated,
      currentUser,
      role: currentUser?.role || null,
      logout,
      switchRole,
      hasPermission,
      refreshSession,
      isReady,
    }),
    [isAuthenticated, currentUser, logout, switchRole, hasPermission, refreshSession, isReady]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
