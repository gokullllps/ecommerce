"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminRole } from "@/types/admin";
import { getRoleDisplayName } from "@/lib/permissions";

const ROLES: { id: AdminRole; label: string }[] = [
  { id: "super_admin",       label: "Super Admin" },
  { id: "admin",             label: "Admin" },
  { id: "product_manager",   label: "Product Manager" },
  { id: "content_manager",   label: "Content Manager" },
  { id: "inventory_manager", label: "Inventory Manager" },
  { id: "order_manager",     label: "Order Manager" },
  { id: "marketing_manager", label: "Marketing Manager" },
];

export function AdminTopBar() {
  const router = useRouter();
  const { metrics, activeTheme, products, orders, customers, themes } = useAdminData();
  const { currentUser, switchRole, logout } = useAdminAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userRef   = useRef<HTMLDivElement>(null);
  const notifRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (userRef.current   && !userRef.current.contains(e.target as Node))   setUserMenuOpen(false);
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { products: [], orders: [], customers: [] };
    return {
      products:  products.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)).slice(0, 4),
      orders:    orders.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)).slice(0, 3),
      customers: customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 3),
    };
  }, [searchQuery, products, orders, customers]);

  const hasResults = searchResults.products.length > 0 || searchResults.orders.length > 0 || searchResults.customers.length > 0;
  const hasAlerts  = metrics.lowStockCount > 0;

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-6"
      style={{
        backgroundColor: "#EAE8E1",
        borderBottom: "1px solid rgba(17,17,17,0.10)",
      }}
    >
      {/* ── Search ── */}
      <div ref={searchRef} className="relative flex-1 max-w-xs">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
          style={{ color: "rgba(17,17,17,0.35)" }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          className="a-input w-full pl-8 pr-3 py-1.5 text-xs"
          style={{ fontSize: "12px" }}
        />

        {/* Results dropdown */}
        {searchOpen && searchQuery.trim() && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden a-fade-in z-50"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(17,17,17,0.12)",
              boxShadow: "0 8px 24px rgba(17,17,17,0.10)",
            }}
          >
            {!hasResults ? (
              <div className="px-4 py-3 text-xs" style={{ color: "rgba(17,17,17,0.45)" }}>
                No results for &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <div className="py-1">
                {searchResults.products.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold" style={{ color: "rgba(17,17,17,0.35)" }}>
                      Products
                    </div>
                    {searchResults.products.map((p) => (
                      <button key={p.id} onClick={() => { setSearchOpen(false); router.push("/admin/products"); }}
                        className="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
                        style={{ color: "#111111" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(17,17,17,0.04)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <span className="truncate">{p.name}</span>
                        <span className="ml-3 font-mono text-[11px] shrink-0" style={{ color: "rgba(17,17,17,0.40)" }}>₹{p.price.toLocaleString("en-IN")}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.orders.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold" style={{ color: "rgba(17,17,17,0.35)" }}>
                      Orders
                    </div>
                    {searchResults.orders.map((o) => (
                      <button key={o.id} onClick={() => { setSearchOpen(false); router.push("/admin/orders"); }}
                        className="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
                        style={{ color: "#111111" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(17,17,17,0.04)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <span>{o.orderNumber} · {o.customerName}</span>
                        <span className="ml-3 font-mono text-[11px] shrink-0" style={{ color: "rgba(17,17,17,0.40)" }}>₹{o.total.toLocaleString("en-IN")}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.customers.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold" style={{ color: "rgba(17,17,17,0.35)" }}>
                      Customers
                    </div>
                    {searchResults.customers.map((c) => (
                      <button key={c.id} onClick={() => { setSearchOpen(false); router.push("/admin/customers"); }}
                        className="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
                        style={{ color: "#111111" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(17,17,17,0.04)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <span>{c.name}</span>
                        <span className="ml-3 text-[11px] shrink-0" style={{ color: "rgba(17,17,17,0.40)" }}>{c.city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Right side ── */}
      <div className="flex items-center gap-1">

        {/* Theme badge */}
        <Link
          href="/admin/themes"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-xs"
          style={{ color: "rgba(17,17,17,0.50)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(17,17,17,0.05)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}
          title="Active theme"
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#111111", opacity: 0.4 }} />
          <span className="truncate max-w-[100px]" style={{ fontFamily: "var(--a-font-body)" }}>{activeTheme.name}</span>
        </Link>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded transition-colors"
            style={{ color: "rgba(17,17,17,0.45)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(17,17,17,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = "#111111"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(17,17,17,0.45)"; }}
            aria-label="Notifications"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {hasAlerts && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#b91c1c" }} />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 mt-1 w-64 rounded-lg overflow-hidden a-fade-in z-50"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(17,17,17,0.12)",
                boxShadow: "0 8px 24px rgba(17,17,17,0.10)",
              }}
            >
              <div className="px-4 py-3 border-b text-xs font-medium" style={{ borderColor: "rgba(17,17,17,0.08)", color: "#111111" }}>
                Alerts
              </div>
              <div className="p-2 space-y-1">
                {hasAlerts ? (
                  <Link href="/admin/inventory" onClick={() => setNotifOpen(false)}
                    className="flex items-start gap-2.5 p-2.5 rounded-md text-xs transition-colors block"
                    style={{ color: "#b91c1c" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(185,28,28,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <span className="font-medium">{metrics.lowStockCount} items low on stock</span>
                  </Link>
                ) : (
                  <div className="px-2.5 py-2 text-xs" style={{ color: "rgba(17,17,17,0.45)" }}>No active alerts</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded transition-colors ml-1"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(17,17,17,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: "#181818", color: "#FFFFFF" }}
            >
              {currentUser?.name?.substring(0, 2).toUpperCase() ?? "AD"}
            </div>
            <div className="hidden sm:block text-left leading-none">
              <div className="text-xs font-medium truncate max-w-[100px]" style={{ color: "#111111" }}>
                {currentUser?.name}
              </div>
              <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "rgba(17,17,17,0.55)" }}>
                {getRoleDisplayName(currentUser?.role || "admin")}
              </div>
            </div>
            <svg className="w-3 h-3 hidden sm:block" style={{ color: "rgba(17,17,17,0.35)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 mt-1 w-56 rounded-lg overflow-hidden a-fade-in z-50"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(17,17,17,0.12)",
                boxShadow: "0 8px 24px rgba(17,17,17,0.10)",
              }}
            >
              {/* Current user */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(17,17,17,0.08)" }}>
                <div className="text-xs font-medium" style={{ color: "#111111" }}>{currentUser?.name}</div>
                <div className="text-[11px] mt-0.5 truncate" style={{ color: "rgba(17,17,17,0.45)" }}>{currentUser?.email}</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold mt-1" style={{ color: "#111111" }}>
                  {getRoleDisplayName(currentUser?.role || "admin")}
                </div>
              </div>

              {/* RBAC simulator */}
              <div className="py-1" style={{ borderBottom: "1px solid rgba(17,17,17,0.08)" }}>
                <div className="px-4 py-1.5 text-[9px] uppercase tracking-widest font-bold" style={{ color: "rgba(17,17,17,0.35)" }}>
                  Simulate Role
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { switchRole(r.id); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-1.5 text-xs flex items-center justify-between transition-colors"
                    style={
                      currentUser?.role === r.id
                        ? { color: "#111111", fontWeight: 600 }
                        : { color: "rgba(17,17,17,0.60)" }
                    }
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(17,17,17,0.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <span>{r.label}</span>
                    {currentUser?.role === r.id && (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="py-1">
                <Link href="/admin/settings" onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-1.5 text-xs transition-colors"
                  style={{ color: "rgba(17,17,17,0.60)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(17,17,17,0.04)"; (e.currentTarget as HTMLAnchorElement).style.color = "#111111"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(17,17,17,0.60)"; }}
                >
                  Settings
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    setUserMenuOpen(false);
                    window.location.href = "/admin/login";
                  }}
                  className="w-full text-left px-4 py-1.5 text-xs transition-colors"
                  style={{ color: "#b91c1c" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(185,28,28,0.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminTopBar;
