"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { AdminCollection } from "@/types/admin";
import { CollectionBuilderModal } from "@/components/admin/collections/CollectionBuilderModal";
import { CollectionPreviewModal } from "@/components/admin/collections/CollectionPreviewModal";

export default function AdminCollectionsPage() {
  const { collections, products, deleteCollection } = useAdminData();

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<AdminCollection | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewCollection, setPreviewCollection] = useState<AdminCollection | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<string>("all");

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    action: () => {},
  });

  const filteredCollections = collections.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (modeFilter !== "all" && c.mode !== modeFilter) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingCollection(null);
    setIsBuilderOpen(true);
  };

  const handleOpenEdit = (col: AdminCollection) => {
    setEditingCollection(col);
    setIsBuilderOpen(true);
  };

  const handleOpenPreview = (col: AdminCollection) => {
    setPreviewCollection(col);
    setIsPreviewOpen(true);
  };

  const handleDelete = (col: AdminCollection) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete Collection "${col.name}"`,
      message: `Are you sure you want to delete "${col.name}"? This collection reference will be detached from products.`,
      action: () => {
        deleteCollection(col.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Helper to calculate product count for a collection
  const getProductCount = (col: AdminCollection) => {
    if (col.mode === "manual") {
      return (col.productIds || []).length;
    }
    if (col.mode === "rule_based" && col.rules) {
      return products.filter((p) => {
        return (col.rules || []).every((rule) => {
          if (rule.field === "category") return p.category === rule.value;
          if (rule.field === "gender") return p.gender === rule.value;
          if (rule.field === "minPrice") return p.price >= Number(rule.value);
          if (rule.field === "maxPrice") return p.price <= Number(rule.value);
          if (rule.field === "isSale") return !!p.isSale === (rule.value === true || rule.value === "true");
          if (rule.field === "isNewArrival") return !!p.isNewArrival === (rule.value === true || rule.value === "true");
          if (rule.field === "tag") return p.tags?.some((t) => t.toLowerCase().includes(String(rule.value).toLowerCase()));
          return true;
        });
      }).length;
    }
    return 0;
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Collections</span>
          </div>
          <h1 className="a-page-title">
            CURATED COLLECTIONS
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Rule-based and manual campaign collections consumed by both digital storefronts ({collections.length} active sets)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#181818] hover:bg-[#111111] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg self-start sm:self-auto"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Collection
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[rgba(17,17,17,0.45)] font-mono text-[11px]">Filter by Status:</span>
          {["all", "active", "scheduled", "draft", "archived"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded font-mono uppercase text-[10px] transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-[#181818] text-white font-bold"
                  : "bg-[#EAE8E1] text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[rgba(17,17,17,0.45)] font-mono text-[11px]">Mode:</span>
          {["all", "manual", "rule_based"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModeFilter(m)}
              className={`px-2.5 py-1 rounded font-mono uppercase text-[10px] transition-colors cursor-pointer ${
                modeFilter === m
                  ? "bg-[#181818] text-white font-bold"
                  : "bg-[#EAE8E1] text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
              }`}
            >
              {m === "all" ? "All Modes" : m.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Collection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((col) => {
          const count = getProductCount(col);
          const bannerUrl = col.banner || col.image || null;

          return (
            <div
              key={col.id}
              className="rounded-2xl bg-white border border-[rgba(17,17,17,0.10)] overflow-hidden flex flex-col justify-between shadow-xl hover:border-[#181818]/40 transition-colors group"
            >
              <div>
                {/* Hero Banner — with onError fallback */}
                <div className="relative h-36 overflow-hidden" style={{ backgroundColor: "#EAE8E1" }}>
                  {bannerUrl ? (
                    <img
                      src={bannerUrl}
                      alt=""
                      role="presentation"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const el = e.currentTarget;
                        el.style.display = "none";
                        const fallback = el.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  {/* Fallback shown when image fails or is absent */}
                  <div
                    className="w-full h-full items-center justify-center font-serif tracking-[0.25em] text-sm"
                    style={{
                      display: bannerUrl ? "none" : "flex",
                      color: "rgba(17,17,17,0.25)",
                      backgroundColor: "#EAE8E1",
                    }}
                    aria-hidden="true"
                  >
                    PABLO
                  </div>

                  {/* Dark overlay — only meaningful when image renders */}
                  {bannerUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  )}

                  {/* Badges — positioned over the image area */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: "rgba(17,17,17,0.60)", color: "#FFFFFF" }}>
                      {col.mode === "manual" ? "Manual" : "Rule-Based"}
                    </span>
                    {col.gender && col.gender !== "all" && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
                        style={{ backgroundColor: "rgba(17,17,17,0.60)", color: "#FFFFFF" }}>
                        {col.gender}
                      </span>
                    )}
                  </div>

                  <span
                    className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
                    style={
                      col.status === "active"
                        ? { backgroundColor: "rgba(17,17,17,0.60)", color: "#FFFFFF" }
                        : { backgroundColor: "rgba(17,17,17,0.08)", color: "rgba(17,17,17,0.60)" }
                    }
                  >
                    {col.status}
                  </span>
                </div>

                {/* Collection Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#111111] tracking-tight">{col.name}</h3>
                    <div className="text-[11px] font-mono text-[rgba(17,17,17,0.45)] mt-0.5">/collections/{col.slug}</div>
                  </div>

                  <p className="text-xs text-[rgba(17,17,17,0.55)] line-clamp-2 leading-relaxed">
                    {col.description || "Curated seasonal collection for high-fashion digital storefront."}
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#EAE8E1] text-[#111111] font-bold">
                      {count} Products Linked
                    </span>
                    {col.startDate && (
                      <span className="text-[rgba(17,17,17,0.45)] text-[10px]">
                        From {col.startDate.slice(0, 10)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3 border-t border-[rgba(17,17,17,0.10)] bg-[#EAE8E1] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleOpenPreview(col)}
                  className="px-2.5 py-1 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Preview
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(col)}
                    className="text-[#111111] hover:underline font-semibold cursor-pointer"
                  >
                    Edit Rules &amp; Products →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(col)}
                    className="text-[#b91c1c] hover:text-[#991b1b] ml-1 cursor-pointer"
                    title="Delete collection"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCollections.length === 0 && (
        <div className="py-16 text-center text-[rgba(17,17,17,0.45)] bg-white border border-[rgba(17,17,17,0.10)] rounded-2xl">
          <div className="font-semibold text-[#111111] text-base mb-1">No collections found</div>
          <div className="text-xs">Try selecting a different status or create a new collection.</div>
        </div>
      )}

      {/* Collection Builder Modal */}
      <CollectionBuilderModal
        isOpen={isBuilderOpen}
        collection={editingCollection}
        onClose={() => {
          setIsBuilderOpen(false);
          setEditingCollection(null);
        }}
      />

      {/* Collection Preview Modal */}
      <CollectionPreviewModal
        isOpen={isPreviewOpen}
        collection={previewCollection}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewCollection(null);
        }}
      />

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="pablo-admin-modal fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[rgba(17,17,17,0.10)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-semibold text-[#111111]">{confirmDialog.title}</h3>
            <p className="text-xs text-[rgba(17,17,17,0.55)]">{confirmDialog.message}</p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(17,17,17,0.10)]">
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-lg bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.action}
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-[#b91c1c] text-white text-xs font-mono font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
