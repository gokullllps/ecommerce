"use client";

import React, { useState } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { Product } from "@/types/catalogue";

interface InventoryHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterProduct?: Product | null;
}

export function InventoryHistoryDrawer({ isOpen, onClose, filterProduct }: InventoryHistoryDrawerProps) {
  const { inventoryLogs } = useAdminData();
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const logs = inventoryLogs.filter((log) => {
    if (filterProduct && log.productId !== filterProduct.id) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchP = log.productName?.toLowerCase().includes(q) || false;
      const matchS = log.variantSku?.toLowerCase().includes(q) || false;
      const matchR = log.reason?.toLowerCase().includes(q) || false;
      const matchA = log.adminName?.toLowerCase().includes(q) || false;
      return matchP || matchS || matchR || matchA;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border-l border-[rgba(17,17,17,0.10)] w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden animate-slideInRight">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(17,17,17,0.10)] bg-[#EAE8E1] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#111111] font-bold">
              AUDIT TRAIL &amp; STOCK LEDGER
            </span>
            <h2 className="text-base font-semibold text-[#111111] tracking-tight mt-0.5">
              {filterProduct ? `Inventory Log: ${filterProduct.name}` : "Comprehensive Stock Adjustment History"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[rgba(17,17,17,0.55)] hover:text-[#111111] rounded-lg hover:bg-[#EAE8E1]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-[rgba(17,17,17,0.10)] bg-[#F5F4F0]">
          <input
            type="text"
            placeholder="Search by product, SKU, administrator, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] text-xs placeholder-[rgba(17,17,17,0.40)] focus:outline-none focus:border-[#181818]"
          />
        </div>

        {/* History List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3 divide-y divide-[rgba(17,17,17,0.08)]">
          {logs.length === 0 ? (
            <div className="py-16 text-center text-[rgba(17,17,17,0.45)] text-xs">
              No inventory adjustments recorded matching the criteria.
            </div>
          ) : (
            logs.map((log) => {
              const formattedDate = new Date(log.timestamp).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              const isPositive = log.adjustment > 0;

              return (
                <div key={log.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-[#111111] text-xs">{log.productName || log.productId}</div>
                      {log.variantTitle && (
                        <div className="text-[11px] font-mono text-[#111111]">
                          Variant: {log.variantTitle} {log.variantSku && `(${log.variantSku})`}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                          isPositive
                            ? "bg-[rgba(17,17,17,0.06)] text-[#111111] border border-[rgba(17,17,17,0.12)]"
                            : "bg-[rgba(185,28,28,0.06)] text-[#b91c1c] border border-[rgba(185,28,28,0.20)]"
                        }`}
                      >
                        {isPositive ? `+${log.adjustment}` : log.adjustment} units
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] flex items-center justify-between text-[11px] font-mono">
                    <div className="text-[rgba(17,17,17,0.55)]">
                      Previous: <span className="font-semibold" style={{ color: "#111111" }}>{log.previousQuantity}</span> → New:{" "}
                      <span className="text-[#111111] font-bold">{log.newQuantity}</span>
                    </div>
                    <div className="text-[rgba(17,17,17,0.45)] text-[10px]">{formattedDate}</div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[rgba(17,17,17,0.45)]">
                    <div>
                      Reason: <span className="text-[rgba(17,17,17,0.65)]">{log.reason}</span>
                    </div>
                    <div>
                      Admin: <span className="text-[#111111]">{log.adminName}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[rgba(17,17,17,0.10)] bg-[#EAE8E1] flex items-center justify-between text-xs">
          <span className="text-[rgba(17,17,17,0.45)] font-mono text-[11px]">{logs.length} adjustment records</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded text-xs font-mono"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
