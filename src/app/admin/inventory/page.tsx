"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { Product, ProductVariant } from "@/types/catalogue";
import { StockAdjustmentModal } from "@/components/admin/inventory/StockAdjustmentModal";
import { InventoryHistoryDrawer } from "@/components/admin/inventory/InventoryHistoryDrawer";

interface InventoryRowItem {
  id: string;
  productId: string;
  productName: string;
  thumbnail: string;
  department: string;
  category: string;
  isVariant: boolean;
  variantSku?: string;
  variantColor?: string;
  variantSize?: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  rawProduct: Product;
  rawVariant?: ProductVariant;
}

export default function AdminInventoryPage() {
  const { products, adjustStock, inventoryLogs } = useAdminData();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState<"all" | "in_stock" | "low" | "out">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // Modals state
  const [adjustmentTarget, setAdjustmentTarget] = useState<{
    product: Product | null;
    variant: ProductVariant | null;
  } | null>(null);

  const [historyTarget, setHistoryTarget] = useState<Product | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Flatten products and variants into discrete inventory items
  const inventoryRows = useMemo<InventoryRowItem[]>(() => {
    const rows: InventoryRowItem[] = [];

    products.forEach((p) => {
      const threshold = p.lowStockThreshold ?? 5;
      const reserved = p.reservedStock ?? 0;
      const thumbnail = p.primaryImage || p.images?.[0]?.url || "/images/categories/knitwear.jpg";

      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((v) => {
          const varReserved = Math.min(reserved, v.stock);
          rows.push({
            id: `${p.id}-${v.sku}`,
            productId: p.id,
            productName: p.name,
            thumbnail,
            department: p.gender || "men",
            category: p.category,
            isVariant: true,
            variantSku: v.sku,
            variantColor: v.colorName,
            variantSize: v.sizeName,
            sku: v.sku,
            currentStock: v.stock,
            reservedStock: varReserved,
            availableStock: Math.max(0, v.stock - varReserved),
            lowStockThreshold: threshold,
            rawProduct: p,
            rawVariant: v,
          });
        });
      } else {
        const stock = p.stock ?? 10;
        rows.push({
          id: p.id,
          productId: p.id,
          productName: p.name,
          thumbnail,
          department: p.gender || "men",
          category: p.category,
          isVariant: false,
          sku: p.sku,
          currentStock: stock,
          reservedStock: reserved,
          availableStock: Math.max(0, stock - reserved),
          lowStockThreshold: threshold,
          rawProduct: p,
        });
      }
    });

    return rows;
  }, [products]);

  // Filtering
  const filteredRows = useMemo(() => {
    return inventoryRows.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.productName.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.variantColor && item.variantColor.toLowerCase().includes(q)) ||
        (item.variantSize && item.variantSize.toLowerCase().includes(q));

      const matchDept = departmentFilter === "all" || item.department === departmentFilter;

      let matchStock = true;
      if (filterStock === "in_stock") {
        matchStock = item.currentStock > item.lowStockThreshold;
      } else if (filterStock === "low") {
        matchStock = item.currentStock > 0 && item.currentStock <= item.lowStockThreshold;
      } else if (filterStock === "out") {
        matchStock = item.currentStock === 0;
      }

      return matchSearch && matchDept && matchStock;
    });
  }, [inventoryRows, searchTerm, departmentFilter, filterStock]);

  // Quick delta handler
  const handleQuickAdjust = (item: InventoryRowItem, delta: number) => {
    const reason = delta > 0 ? "Quick restock (+)" : "Quick deduction (-)";
    adjustStock(item.productId, item.variantSku, delta, reason);
  };

  const handleOpenAdjustmentModal = (item: InventoryRowItem) => {
    setAdjustmentTarget({
      product: item.rawProduct,
      variant: item.rawVariant || null,
    });
  };

  const handleOpenHistoryModal = (item?: InventoryRowItem) => {
    setHistoryTarget(item ? item.rawProduct : null);
    setIsHistoryOpen(true);
  };

  // Metrics summary
  const summaryMetrics = useMemo(() => {
    const totalUnits = inventoryRows.reduce((sum, r) => sum + r.currentStock, 0);
    const lowStockCount = inventoryRows.filter((r) => r.currentStock > 0 && r.currentStock <= r.lowStockThreshold).length;
    const outOfStockCount = inventoryRows.filter((r) => r.currentStock === 0).length;
    return { totalUnits, lowStockCount, outOfStockCount };
  }, [inventoryRows]);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Inventory</span>
          </div>
          <h1 className="a-page-title">
            STOCK CONTROL &amp; INVENTORY LEDGER
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Real-time SKU quantities, dynamic threshold alerts, reserved allocations, and adjustment logs ({inventoryRows.length} discrete SKUs tracked)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenHistoryModal()}
            className="px-4 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded-lg text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <svg className="w-4 h-4 text-[#111111]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Audit History ({inventoryLogs.length})
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[rgba(17,17,17,0.55)]">Total Catalog Units</div>
            <div className="text-2xl font-serif font-bold text-[#111111] mt-0.5">{summaryMetrics.totalUnits.toLocaleString("en-IN")}</div>
          </div>
          <span className="px-2 py-1 rounded bg-[#EAE8E1] text-[#111111] font-mono text-xs font-bold">
            {inventoryRows.length} SKUs
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[rgba(17,17,17,0.65)]">Low Stock Warnings</div>
            <div className="text-2xl font-serif font-bold text-[rgba(17,17,17,0.65)] mt-0.5">{summaryMetrics.lowStockCount} SKUs</div>
          </div>
          <span className="px-2 py-1 rounded bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.60)] font-mono text-xs font-bold border border-[rgba(17,17,17,0.10)]">
            ≤ Threshold
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[rgba(185,28,28,0.20)] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#b91c1c]">Out of Stock Alerts</div>
            <div className="text-2xl font-serif font-bold text-[#b91c1c] mt-0.5">{summaryMetrics.outOfStockCount} SKUs</div>
          </div>
          <span className="px-2 py-1 rounded bg-[rgba(185,28,28,0.06)] text-[#991b1b] font-mono text-xs font-bold border border-[rgba(185,28,28,0.20)]">
            0 Units
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <input
            type="text"
            placeholder="Search by SKU code, product title, or variant specification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] placeholder-[rgba(17,17,17,0.40)] focus:outline-none focus:border-[#181818]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] capitalize focus:outline-none focus:border-[#181818]"
          >
            <option value="all">All Departments</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>

          {/* Stock Filter Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilterStock("all")}
              className={`px-3 py-1.5 rounded-lg font-mono uppercase text-[10px] transition-colors cursor-pointer ${
                filterStock === "all"
                  ? "bg-[#181818] text-white font-bold"
                  : "bg-[#EAE8E1] text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
              }`}
            >
              All ({inventoryRows.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStock("in_stock")}
              className={`px-3 py-1.5 rounded-lg font-mono uppercase text-[10px] transition-colors cursor-pointer ${
                filterStock === "in_stock"
                  ? "bg-[#181818] text-white font-bold"
                  : "bg-[#EAE8E1] text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
              }`}
            >
              In Stock
            </button>
            <button
              type="button"
              onClick={() => setFilterStock("low")}
              className={`px-3 py-1.5 rounded-lg font-mono uppercase text-[10px] transition-colors cursor-pointer ${
                filterStock === "low"
                  ? "bg-[rgba(17,17,17,0.10)] text-[#111111] font-bold"
                  : "bg-[#EAE8E1] text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
              }`}
            >
              Low Stock
            </button>
            <button
              type="button"
              onClick={() => setFilterStock("out")}
              className={`px-3 py-1.5 rounded-lg font-mono uppercase text-[10px] transition-colors cursor-pointer ${
                filterStock === "out"
                  ? "bg-rose-500 text-white font-bold"
                  : "bg-[#EAE8E1] text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      {/* Main Inventory Ledger Table */}
      <div className="rounded-xl bg-white border border-[rgba(17,17,17,0.10)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#EAE8E1] border-b border-[rgba(17,17,17,0.10)] text-[10px] font-mono uppercase font-bold text-[rgba(17,17,17,0.45)]">
                <th className="py-3 px-4">Product &amp; Thumbnail</th>
                <th className="py-3 px-4">Variant Specification</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Reserved</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Health Status</th>
                <th className="py-3 px-4 text-right">Adjustment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,17,17,0.08)]">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[rgba(17,17,17,0.55)]">
                    No inventory records matching your query.
                  </td>
                </tr>
              ) : (
                filteredRows.slice(0, 50).map((row) => {
                  const isOut = row.currentStock === 0;
                  const isLow = row.currentStock > 0 && row.currentStock <= row.lowStockThreshold;

                  return (
                    <tr key={row.id} className="hover:bg-[#EAE8E1]/40 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-11 rounded bg-[#F5F4F0] overflow-hidden flex-shrink-0 border border-[rgba(17,17,17,0.10)]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={row.thumbnail} alt={row.productName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#111111] tracking-tight line-clamp-1">
                              {row.productName}
                            </div>
                            <div className="text-[10px] text-[rgba(17,17,17,0.45)] capitalize">
                              {row.department} · {row.category}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Variant Specification */}
                      <td className="py-3 px-4 font-mono text-xs">
                        {row.isVariant ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#111111]">{row.variantColor}</span>
                            <span className="text-[rgba(17,17,17,0.45)]">/</span>
                            <span className="px-1.5 py-0.5 rounded bg-[#EAE8E1] text-[#111111] font-bold">
                              {row.variantSize}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[rgba(17,17,17,0.45)] italic">Master SKU</span>
                        )}
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono text-[11px] text-[#111111] whitespace-nowrap">
                        {row.sku}
                      </td>

                      {/* Current Stock */}
                      <td className="py-3 px-4 font-mono font-bold text-base text-[#111111]">
                        {row.currentStock}
                      </td>

                      {/* Reserved */}
                      <td className="py-3 px-4 font-mono text-[rgba(17,17,17,0.55)]">
                        {row.reservedStock}
                      </td>

                      {/* Available */}
                      <td className="py-3 px-4 font-mono font-bold text-[#111111]">
                        {row.availableStock}
                      </td>

                      {/* Low Stock Threshold */}
                      <td className="py-3 px-4 font-mono text-[rgba(17,17,17,0.45)]">
                        ≤ {row.lowStockThreshold}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                            isOut
                              ? "bg-[rgba(185,28,28,0.08)] text-[#991b1b] border-[rgba(185,28,28,0.20)]"
                              : isLow
                              ? "bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.65)] border-[rgba(17,17,17,0.12)]"
                              : "bg-[rgba(17,17,17,0.08)] text-[#111111] border-[rgba(17,17,17,0.15)]"
                          }`}
                        >
                          {isOut ? "OUT OF STOCK" : isLow ? "LOW STOCK" : "IN STOCK"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(row, -1)}
                          className="px-2 py-1 rounded bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white font-mono text-xs font-bold cursor-pointer"
                          title="Quick subtract 1 unit"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(row, +1)}
                          className="px-2 py-1 rounded bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white font-mono text-xs font-bold cursor-pointer"
                          title="Quick add 1 unit"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAdjustmentModal(row)}
                          className="px-2.5 py-1 rounded bg-[#181818] hover:bg-[#111111] text-white font-bold uppercase text-[10px] transition-colors cursor-pointer"
                        >
                          Adjust
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenHistoryModal(row)}
                          className="p-1 text-[rgba(17,17,17,0.55)] hover:text-[#111111] rounded hover:bg-[#EAE8E1]"
                          title="View history logs for this item"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={!!adjustmentTarget}
        product={adjustmentTarget?.product || null}
        variant={adjustmentTarget?.variant || null}
        onClose={() => setAdjustmentTarget(null)}
      />

      {/* Inventory History Drawer */}
      <InventoryHistoryDrawer
        isOpen={isHistoryOpen}
        filterProduct={historyTarget}
        onClose={() => {
          setIsHistoryOpen(false);
          setHistoryTarget(null);
        }}
      />
    </div>
  );
}
