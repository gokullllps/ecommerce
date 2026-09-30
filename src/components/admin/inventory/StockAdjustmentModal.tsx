"use client";

import React, { useState, useEffect } from "react";
import { Product, ProductVariant } from "@/types/catalogue";
import { useAdminData } from "@/context/AdminDataContext";

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  variant?: ProductVariant | null;
}

const COMMON_REASONS = [
  "New shipment / Atelier restock",
  "Damaged stock / Defective item removed",
  "Inventory audit / Recount correction",
  "Customer return / Restocked to inventory",
  "Sample / Editorial photoshoot loan",
  "Bespoke VIP order allocation",
];

export function StockAdjustmentModal({ isOpen, onClose, product, variant }: StockAdjustmentModalProps) {
  const { adjustStock } = useAdminData();
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(10);
  const [selectedReason, setSelectedReason] = useState<string>(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setAdjustmentDelta(10);
      setSelectedReason(COMMON_REASONS[0]);
      setCustomReason("");
    }
  }, [isOpen, product, variant]);

  if (!isOpen || !product) return null;

  const currentStock = variant ? variant.stock : product.stock ?? 10;
  const newStock = Math.max(0, currentStock + adjustmentDelta);
  const finalReason = selectedReason === "Custom" ? customReason.trim() : selectedReason;

  const handleApply = () => {
    if (!finalReason) {
      alert("Please provide a reason for this inventory adjustment.");
      return;
    }

    adjustStock(product.id, variant?.sku, adjustmentDelta, finalReason);
    onClose();
  };

  return (
    <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[rgba(17,17,17,0.10)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(17,17,17,0.10)] bg-[#EAE8E1] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#111111] font-bold">
              STOCK LEDGER ADJUSTMENT
            </span>
            <h2 className="text-base font-semibold text-[#111111] tracking-tight mt-0.5">
              {variant ? `Adjust Variant: ${variant.colorName} / ${variant.sizeName}` : `Adjust Product: ${product.name}`}
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-[rgba(17,17,17,0.65)]">
          {/* Target Item Snapshot */}
          <div className="p-3.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] rounded-xl flex items-center gap-3">
            <div className="w-12 h-14 rounded bg-[#F5F4F0] overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.primaryImage || product.images?.[0]?.url || "/images/categories/knitwear.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-semibold text-[#111111] text-xs">{product.name}</div>
              <div className="text-[10px] font-mono text-[#111111] mt-0.5">
                SKU: {variant ? variant.sku : product.sku}
              </div>
              <div className="text-[10px] text-[rgba(17,17,17,0.55)] mt-0.5">
                Threshold: ≤ {product.lowStockThreshold ?? 5} units
              </div>
            </div>
          </div>

          {/* Mathematical Calculation Card */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#F5F4F0] border border-[rgba(17,17,17,0.10)] rounded-xl text-center">
            <div>
              <div className="text-[10px] font-mono uppercase text-[rgba(17,17,17,0.45)]">Current Units</div>
              <div className="text-xl font-mono font-semibold text-[#111111] mt-1">{currentStock}</div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase text-[rgba(17,17,17,0.45)]">Adjustment</div>
              <div
                className={`text-xl font-mono font-bold mt-1 ${
                  adjustmentDelta > 0
                    ? "text-[#111111]"
                    : adjustmentDelta < 0
                    ? "text-[#b91c1c]"
                    : "text-[#111111]"
                }`}
              >
                {adjustmentDelta > 0 ? `+${adjustmentDelta}` : adjustmentDelta}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase text-[rgba(17,17,17,0.45)]">New Result</div>
              <div className="text-xl font-mono font-bold text-[#111111] mt-1">{newStock}</div>
            </div>
          </div>

          {/* Delta Input & Quick Presets */}
          <div className="space-y-2">
            <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] font-semibold">
              Adjustment Quantity (+ / -)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={adjustmentDelta}
                onChange={(e) => setAdjustmentDelta(parseInt(e.target.value, 10) || 0)}
                className="flex-1 px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono font-bold text-sm focus:outline-none focus:border-[#181818]"
              />
              <div className="flex items-center gap-1">
                {[-5, -1, 1, 5, 10, 25].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => setAdjustmentDelta(delta)}
                    className="px-2 py-1.5 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded font-mono text-[11px] cursor-pointer"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] font-semibold">
              Reason for Adjustment *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] focus:outline-none focus:border-[#181818]"
            >
              {COMMON_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="Custom">Other Custom Reason...</option>
            </select>

            {selectedReason === "Custom" && (
              <input
                type="text"
                placeholder="Specify reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] mt-2"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(17,17,17,0.10)] bg-[#EAE8E1] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded-lg text-xs font-mono"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 bg-[#181818] hover:bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg shadow-md cursor-pointer"
          >
            Confirm &amp; Record Stock Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}
