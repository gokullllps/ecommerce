"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { AuditLogEntry } from "@/types/admin";

export default function AdminAuditLogsPage() {
  const { auditLogs, refreshData } = useAdminData();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (actionFilter !== "all") {
        if (!log.action.toLowerCase().includes(actionFilter.toLowerCase())) {
          return false;
        }
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchAction = log.action.toLowerCase().includes(q);
        const matchAdmin = log.adminName.toLowerCase().includes(q) || log.adminEmail.toLowerCase().includes(q);
        const matchResource = log.resource.toLowerCase().includes(q);
        const matchDetails = log.details.toLowerCase().includes(q);
        return matchAction || matchAdmin || matchResource || matchDetails;
      }
      return true;
    });
  }, [auditLogs, actionFilter, searchTerm]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage]);

  const getActionBadgeColor = (action: string) => {
    if (action.includes("DELETE") || action.includes("CANCEL")) {
      return "bg-[rgba(185,28,28,0.06)] text-[#b91c1c] border-[rgba(185,28,28,0.20)]";
    }
    if (action.includes("CREATE") || action.includes("RESTORE") || action.includes("ACTIVATE")) {
      return "bg-[rgba(17,17,17,0.06)] text-[#111111] border-[rgba(17,17,17,0.12)]";
    }
    if (action.includes("UPDATE") || action.includes("ADJUST") || action.includes("REORDER")) {
      return "bg-[rgba(17,17,17,0.07)] text-[#111111] border-[rgba(17,17,17,0.12)]";
    }
    return "bg-[rgba(17,17,17,0.05)] text-slate-300 border-[rgba(17,17,17,0.10)]";
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Audit Logs</span>
          </div>
          <h1 className="a-page-title">
            COMPLIANCE & SYSTEM AUDIT TRAIL
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Immutable chronological record of administrative actions, pricing alterations, inventory adjustments, and status transitions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-3.5 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded-lg text-xs font-semibold flex items-center gap-2 border border-[rgba(17,17,17,0.15)] self-start sm:self-auto"
        >
          <svg className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          {isRefreshing ? "Refreshing..." : "Refresh Audit Feed"}
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search audit trail by admin, action, resource, or details..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] placeholder-[rgba(17,17,17,0.40)] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by action category"
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">Module Scope: All</option>
              <option value="product">Products & Merchandising</option>
              <option value="category">Category Architecture</option>
              <option value="collection">Collections</option>
              <option value="stock">Inventory & Stock</option>
              <option value="order">Orders & Shipments</option>
              <option value="customer">Patrons</option>
              <option value="promotion">Promotions</option>
              <option value="theme">Themes</option>
              <option value="settings">Settings</option>
              <option value="media">Media</option>
              <option value="user">Admin Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-xl bg-white border border-[rgba(17,17,17,0.10)] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#EAE8E1]/70 border-b border-[rgba(17,17,17,0.10)] text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin Patron</th>
                <th className="py-3 px-4">Operation</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Action Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,17,17,0.08)]">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[rgba(17,17,17,0.55)]">
                    No audit records located matching current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#EAE8E1]/30 transition-colors">
                    <td className="py-4 px-4 font-mono text-[rgba(17,17,17,0.55)] whitespace-nowrap text-[11px]">
                      {new Date(log.timestamp).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#111111]">{log.adminName}</div>
                      <div className="text-[10px] text-[rgba(17,17,17,0.45)] font-mono">{log.adminEmail}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-medium max-w-xs truncate" style={{ color: "#111111" }}>
                      {log.resource}
                    </td>

                    <td className="py-4 px-4 text-[rgba(17,17,17,0.65)] max-w-md">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[rgba(17,17,17,0.10)] text-xs">
            <span className="text-[rgba(17,17,17,0.55)]">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-[#EAE8E1] disabled:opacity-50 text-[#111111]"
              >
                Previous
              </button>
              <span className="font-mono px-2" style={{ color: "#111111" }}>
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-[#EAE8E1] disabled:opacity-50 text-[#111111]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
