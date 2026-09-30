"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { OrderStatus } from "@/types/admin";

type DateRange = "today" | "7d" | "30d" | "90d";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:    { bg: "rgba(17,17,17,0.04)",   color: "rgba(17,17,17,0.55)" },
  confirmed:  { bg: "#181818",                color: "#FFFFFF" },
  processing: { bg: "rgba(17,17,17,0.07)",   color: "rgba(17,17,17,0.70)" },
  packed:     { bg: "rgba(17,17,17,0.09)",   color: "#111111" },
  shipped:    { bg: "rgba(17,17,17,0.07)",   color: "rgba(17,17,17,0.70)" },
  delivered:  { bg: "rgba(17,17,17,0.06)",   color: "#111111" },
  cancelled:  { bg: "rgba(185,28,28,0.07)",  color: "#b91c1c" },
  returned:   { bg: "rgba(17,17,17,0.05)",   color: "rgba(17,17,17,0.55)" },
  refunded:   { bg: "rgba(17,17,17,0.04)",   color: "rgba(17,17,17,0.50)" },
};

const RANGE_FACTOR: Record<DateRange, number> = { today: 0.15, "7d": 0.45, "30d": 1, "90d": 2.6 };

const CHART_DATA = [
  { label: "Mon", rev: 142000 },
  { label: "Tue", rev: 235000 },
  { label: "Wed", rev: 185000 },
  { label: "Thu", rev: 320000 },
  { label: "Fri", rev: 410000 },
  { label: "Sat", rev: 540000 },
  { label: "Sun", rev: 480000 },
];
const CHART_MAX = 580000;

export default function AdminDashboardPage() {
  const {
    metrics, orders, products, customers, auditLogs, updateOrderStatus,
  } = useAdminData();
  const { currentUser } = useAdminAuth();
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const factor = RANGE_FACTOR[dateRange];
  const displayRevenue = Math.round(metrics.totalRevenue * factor);
  const displayOrders  = Math.max(1, Math.round(metrics.totalOrders * factor));

  const lowStockItems = useMemo(
    () => products.filter((p) => (p.stock ?? 10) <= 5).slice(0, 6),
    [products]
  );

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === "pending" || o.status === "processing"),
    [orders]
  );

  return (
    <div className="space-y-8">

      {/* ── Page header ── */}
      <div className="a-page-header">
        <div>
          <h1 className="a-page-title">Dashboard</h1>
          <p className="a-page-subtitle">
            Welcome back, {currentUser?.name ?? "Admin"} — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Date range selector */}
          <div className="a-filter-group">
            {(["today", "7d", "30d", "90d"] as DateRange[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`a-filter-pill ${dateRange === r ? "active" : ""}`}
              >
                {r === "today" ? "Today" : r.toUpperCase()}
              </button>
            ))}
          </div>

          <Link href="/admin/products" className="a-btn-primary">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </Link>
        </div>
      </div>

      {/* ── 4 Metric cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="a-metric">
          <div className="a-metric-label">Revenue</div>
          <div className="a-metric-value">₹{displayRevenue.toLocaleString("en-IN")}</div>
          <div className="a-metric-sub">{dateRange === "today" ? "Today" : `Last ${dateRange}`}</div>
        </div>
        <div className="a-metric">
          <div className="a-metric-label">Orders</div>
          <div className="a-metric-value">{displayOrders}</div>
          <div className="a-metric-sub">{pendingOrders.length} pending action</div>
        </div>
        <div className="a-metric">
          <div className="a-metric-label">Avg. Order Value</div>
          <div className="a-metric-value">₹{metrics.averageOrderValue.toLocaleString("en-IN")}</div>
          <div className="a-metric-sub">Per completed order</div>
        </div>
        <div className="a-metric">
          <div className="a-metric-label">Products</div>
          <div className="a-metric-value">{metrics.totalProducts}</div>
          <div className="a-metric-sub">
            {metrics.lowStockCount > 0 ? (
              <span style={{ color: "#b91c1c" }}>{metrics.lowStockCount} low stock</span>
            ) : "All stocked"}
          </div>
        </div>
      </div>

      {/* ── Main 2-col layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: chart + orders table */}
        <div className="lg:col-span-2 space-y-6">

          {/* Revenue chart */}
          <div className="a-chart-container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-medium" style={{ color: "#111111" }}>Revenue</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(17,17,17,0.45)" }}>Last 7 days</div>
              </div>
              <div className="text-xs font-mono" style={{ color: "rgba(17,17,17,0.45)" }}>
                ₹{CHART_DATA.reduce((s, p) => s + p.rev, 0).toLocaleString("en-IN")}
              </div>
            </div>

            <div className="relative" style={{ height: "160px" }}>
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="dash-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#111111" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#111111" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid */}
                {[40, 80, 120].map((y) => (
                  <line key={y} x1="0" y1={y} x2="600" y2={y}
                    stroke="rgba(17,17,17,0.06)" strokeDasharray="3 3" />
                ))}
                <line x1="0" y1="155" x2="600" y2="155" stroke="rgba(17,17,17,0.10)" />

                {/* Area */}
                <path
                  d={`M 0 ${155 - (CHART_DATA[0].rev / CHART_MAX) * 130}
                    ${CHART_DATA.map((p, i) => `L ${(i / (CHART_DATA.length - 1)) * 600} ${155 - (p.rev / CHART_MAX) * 130}`).join(" ")}
                    L 600 155 L 0 155 Z`}
                  fill="url(#dash-grad)"
                />
                {/* Line */}
                <path
                  d={`M 0 ${155 - (CHART_DATA[0].rev / CHART_MAX) * 130}
                    ${CHART_DATA.map((p, i) => `L ${(i / (CHART_DATA.length - 1)) * 600} ${155 - (p.rev / CHART_MAX) * 130}`).join(" ")}`}
                  fill="none" stroke="#181818" strokeWidth="1.5"
                />
                {/* Dots */}
                {CHART_DATA.map((p, i) => {
                  const cx = (i / (CHART_DATA.length - 1)) * 600;
                  const cy = 155 - (p.rev / CHART_MAX) * 130;
                  return <circle key={p.label} cx={cx} cy={cy} r="3" fill="#181818" stroke="#FFFFFF" strokeWidth="1.5" />;
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[10px] font-mono mt-3" style={{ color: "rgba(17,17,17,0.38)" }}>
              {CHART_DATA.map((p) => (
                <span key={p.label}>{p.label}</span>
              ))}
            </div>
          </div>

          {/* Orders table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium" style={{ color: "#111111" }}>Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs transition-colors"
                style={{ color: "rgba(17,17,17,0.45)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#111111")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(17,17,17,0.45)")}
              >
                View all →
              </Link>
            </div>

            <div className="a-table-wrap">
              <table className="a-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map((o) => {
                    const s = STATUS_STYLE[o.status] ?? STATUS_STYLE.pending;
                    return (
                      <tr key={o.id}>
                        <td className="font-mono text-xs font-semibold" style={{ color: "#111111" }}>
                          {o.orderNumber}
                        </td>
                        <td>
                          <div className="font-medium text-xs" style={{ color: "#111111" }}>{o.customerName}</div>
                          <div className="text-[11px]" style={{ color: "rgba(17,17,17,0.40)" }}>{o.customerEmail}</div>
                        </td>
                        <td className="font-mono text-xs font-semibold" style={{ color: "#111111" }}>
                          ₹{o.total.toLocaleString("en-IN")}
                        </td>
                        <td>
                          <span
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
                            style={{ backgroundColor: s.bg, color: s.color }}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="text-xs" style={{ color: "rgba(17,17,17,0.45)" }}>
                          {new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {o.status === "pending" && (
                              <button type="button"
                                onClick={() => updateOrderStatus(o.id, "processing")}
                                className="a-btn-primary text-[10px] py-1 px-2"
                              >
                                Accept
                              </button>
                            )}
                            {o.status === "processing" && (
                              <button type="button"
                                onClick={() => updateOrderStatus(o.id, "shipped")}
                                className="a-btn-secondary text-[10px] py-1 px-2"
                              >
                                Ship
                              </button>
                            )}
                            <Link href="/admin/orders" className="a-btn-ghost text-[10px] py-1 px-2">
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Low stock */}
          <div className="a-card-padded">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#111111" }}>
                Low Stock
              </h3>
              <Link href="/admin/inventory"
                className="text-xs transition-colors"
                style={{ color: "rgba(17,17,17,0.40)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#111111")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(17,17,17,0.40)")}
              >
                Manage →
              </Link>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="text-xs py-2" style={{ color: "rgba(17,17,17,0.40)" }}>
                All products adequately stocked.
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate" style={{ color: "#111111" }}>{p.name}</div>
                      <div className="text-[11px] font-mono" style={{ color: "rgba(17,17,17,0.38)" }}>{p.sku}</div>
                    </div>
                    <span className="text-[10px] font-semibold shrink-0" style={{ color: "#b91c1c" }}>
                      {p.stock ?? 0} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="a-card-padded">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#111111" }}>
              Recent Activity
            </h3>
            <div className="space-y-3">
              {auditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="pb-3 last:pb-0" style={{ borderBottom: "1px solid rgba(17,17,17,0.06)" }}>
                  <div className="text-xs font-medium" style={{ color: "#111111" }}>{log.action}</div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px]" style={{ color: "rgba(17,17,17,0.40)" }}>
                    <span>{log.adminName}</span>
                    <span>·</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="a-card-padded">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#111111" }}>
              Quick Links
            </h3>
            <div className="space-y-1">
              {[
                { href: "/admin/products",   label: "Add Product" },
                { href: "/admin/orders",     label: "View Orders" },
                { href: "/admin/promotions", label: "Promotions" },
                { href: "/admin/themes",     label: "Theme Manager" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-1.5 text-xs transition-colors"
                  style={{ color: "rgba(17,17,17,0.55)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#111111")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(17,17,17,0.55)")}
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
