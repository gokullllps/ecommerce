"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminPromotion } from "@/types/admin";

export default function AdminPromotionsPage() {
  const {
    promotions,
    addPromotion,
    updatePromotion,
    togglePromotion,
    duplicatePromotion,
    deletePromotion,
    categories,
    collections,
  } = useAdminData();
  const { hasPermission } = useAdminAuth();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "percentage" | "fixed_amount">("all");

  // Modal State
  const [editingPromotion, setEditingPromotion] = useState<AdminPromotion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AdminPromotion>>({
    code: "",
    title: "",
    description: "",
    type: "percentage",
    value: 15,
    minOrderValue: 20000,
    maxDiscount: 15000,
    usageLimit: 250,
    usedCount: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    isActive: true,
    applicableTo: "all",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const canManagePromos = hasPermission("promotions.manage");

  // Filter Logic
  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      if (statusFilter === "active" && !p.isActive) return false;
      if (statusFilter === "inactive" && p.isActive) return false;
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          p.code.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [promotions, statusFilter, typeFilter, searchTerm]);

  const handleOpenCreateModal = () => {
    setEditingPromotion(null);
    setFormData({
      code: "",
      title: "",
      description: "",
      type: "percentage",
      value: 15,
      minOrderValue: 25000,
      maxDiscount: 15000,
      usageLimit: 100,
      usedCount: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      isActive: true,
      applicableTo: "all",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: AdminPromotion) => {
    setEditingPromotion(p);
    setFormData({
      ...p,
      startDate: p.startDate.split("T")[0],
      endDate: p.endDate.split("T")[0],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.code?.trim()) errors.code = "Coupon code is mandatory";
    if (!formData.title?.trim()) errors.title = "Promotion title is mandatory";
    if (formData.value === undefined || formData.value <= 0) {
      errors.value = "Discount value must be greater than 0";
    }
    if (formData.type === "percentage" && (formData.value ?? 0) > 100) {
      errors.value = "Percentage discount cannot exceed 100%";
    }
    if (!formData.startDate) errors.startDate = "Start date is mandatory";
    if (!formData.endDate) errors.endDate = "End date is mandatory";
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      errors.endDate = "End date cannot precede start date";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingPromotion) {
      const updated: AdminPromotion = {
        ...editingPromotion,
        ...formData,
        code: formData.code!.trim().toUpperCase(),
        title: formData.title!.trim(),
        value: Number(formData.value),
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : undefined,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        startDate: new Date(formData.startDate!).toISOString(),
        endDate: new Date(formData.endDate!).toISOString(),
      } as AdminPromotion;

      updatePromotion(updated);
    } else {
      const created: AdminPromotion = {
        id: `promo_${Date.now()}`,
        code: formData.code!.trim().toUpperCase(),
        title: formData.title!.trim(),
        description: formData.description?.trim() || "Exclusive atelier privilege code",
        type: formData.type || "percentage",
        value: Number(formData.value),
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : undefined,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        usedCount: 0,
        startDate: new Date(formData.startDate!).toISOString(),
        endDate: new Date(formData.endDate!).toISOString(),
        isActive: formData.isActive ?? true,
        applicableTo: formData.applicableTo || "all",
      };

      addPromotion(created);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    deletePromotion(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Promotions</span>
          </div>
          <h1 className="a-page-title">
            PROMOTIONS & PRIVILEGE CODES
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Configure coupons, minimum basket requirements, customer tiers, and seasonal customer privileges.
          </p>
        </div>

        {canManagePromos && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-[#181818] hover:bg-[#111111] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Promotion
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <input
              type="text"
              placeholder="Search code or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] placeholder-[rgba(17,17,17,0.40)] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              aria-label="Filter promotions by status"
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">Status: All</option>
              <option value="active">Status: Active</option>
              <option value="inactive">Status: Inactive</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "percentage" | "fixed_amount")}
              aria-label="Filter promotions by discount type"
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">Discount Type: All</option>
              <option value="percentage">Percentage Discount</option>
              <option value="fixed_amount">Fixed Amount (₹)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPromotions.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[rgba(17,17,17,0.55)] bg-white rounded-xl border border-[rgba(17,17,17,0.10)]">
            No promotions match the specified criteria.
          </div>
        ) : (
          filteredPromotions.map((p) => {
            const isExpired = new Date(p.endDate).getTime() < Date.now();
            const usagePercent = p.usageLimit ? Math.round((p.usedCount / p.usageLimit) * 100) : null;

            return (
              <div
                key={p.id}
                className="p-5 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] flex flex-col justify-between hover:border-[rgba(17,17,17,0.15)] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-sm font-medium text-[#111111] px-2.5 py-1 bg-[#EAE8E1] rounded border border-[rgba(17,17,17,0.15)] tracking-wider">
                      {p.code}
                    </span>
                    <button
                      type="button"
                      disabled={!canManagePromos}
                      onClick={() => togglePromotion(p.id)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                        p.isActive && !isExpired
                          ? "bg-[rgba(17,17,17,0.06)] text-[#111111] border-[rgba(17,17,17,0.12)]"
                          : "bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.55)] border-[rgba(17,17,17,0.10)]"
                      }`}
                    >
                      {isExpired ? "Expired" : p.isActive ? "Active" : "Disabled"}
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-[#111111] mb-1">{p.title}</h3>
                  <p className="text-xs text-[rgba(17,17,17,0.55)] mb-3 leading-relaxed">{p.description}</p>

                  {/* Benefit Specs */}
                  <div className="p-3 rounded-lg bg-[#EAE8E1]/50 border border-[rgba(17,17,17,0.10)] space-y-1.5 text-xs text-[rgba(17,17,17,0.65)] mb-3">
                    <div className="flex justify-between">
                      <span className="text-[rgba(17,17,17,0.45)]">Discount</span>
                      <span className="font-semibold text-[#111111]">
                        {p.type === "percentage" ? `${p.value}% OFF` : `₹${p.value.toLocaleString("en-IN")} OFF`}
                      </span>
                    </div>
                    {p.minOrderValue && (
                      <div className="flex justify-between">
                        <span className="text-[rgba(17,17,17,0.45)]">Min. Basket</span>
                        <span className="font-mono text-[#111111]">₹{p.minOrderValue.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {p.maxDiscount && (
                      <div className="flex justify-between">
                        <span className="text-[rgba(17,17,17,0.45)]">Max Cap</span>
                        <span className="font-mono text-[#111111]">₹{p.maxDiscount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[rgba(17,17,17,0.45)]">Scope</span>
                      <span className="capitalize text-[#111111]">{p.applicableTo}</span>
                    </div>
                  </div>

                  {/* Usage Progress */}
                  {p.usageLimit && (
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-[10px] text-[rgba(17,17,17,0.45)]">
                        <span>Redeemed: {p.usedCount} of {p.usageLimit}</span>
                        <span>{usagePercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EAE8E1] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#181818] rounded-full transition-all"
                          style={{ width: `${Math.min(100, usagePercent || 0)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-[rgba(17,17,17,0.45)]">
                    Valid: {new Date(p.startDate).toLocaleDateString()} &rarr; {new Date(p.endDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Card Action Buttons */}
                {canManagePromos && (
                  <div className="mt-4 pt-3 border-t border-[rgba(17,17,17,0.10)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => duplicatePromotion(p.id)}
                        className="text-[rgba(17,17,17,0.55)] hover:text-[#111111] transition-colors"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(p)}
                        className="text-[#111111] hover:text-[#111111] transition-colors font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="text-[#b91c1c] hover:text-[#991b1b] transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* CREATE / EDIT PROMOTION MODAL */}
      {isModalOpen && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-[rgba(17,17,17,0.15)] rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[rgba(17,17,17,0.10)] pb-3">
              <h3 className="text-base font-bold font-111111 font-serif tracking-tight">
                {editingPromotion ? "Edit Privilege Code" : "Create Exclusive Promotion"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[rgba(17,17,17,0.08)] text-[#111111] flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PRIVILEGE20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded-lg text-xs font-mono font-bold text-[#111111] uppercase"
                  />
                  {formErrors.code && <p className="text-[#b91c1c] text-[10px] mt-0.5">{formErrors.code}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as "percentage" | "fixed_amount" })
                    }
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                  Promotion Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn / Winter Atelier Invitation"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                />
                {formErrors.title && <p className="text-[#b91c1c] text-[10px] mt-0.5">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                  Client Facing Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed terms of privilege code..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Value ({formData.type === "percentage" ? "%" : "₹"}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                  {formErrors.value && <p className="text-[#b91c1c] text-[10px] mt-0.5">{formErrors.value}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Min Basket (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="25000"
                    value={formData.minOrderValue || ""}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Max Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="15000"
                    value={formData.maxDiscount || ""}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                  {formErrors.endDate && <p className="text-[#b91c1c] text-[10px] mt-0.5">{formErrors.endDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Usage Limit (Max Redeems)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.usageLimit || ""}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Applicable Scope
                  </label>
                  <select
                    value={formData.applicableTo}
                    onChange={(e) =>
                      setFormData({ ...formData, applicableTo: e.target.value as "all" | "categories" | "collections" | "products" })
                    }
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  >
                    <option value="all">Entire Catalogue</option>
                    <option value="categories">Specific Categories</option>
                    <option value="collections">Specific Collections</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="promoIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded bg-[#EAE8E1] border-[rgba(17,17,17,0.15)] text-[#111111]"
                />
                <label htmlFor="promoIsActive" className="text-[#111111] font-medium">
                  Active immediately upon saving
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[rgba(17,17,17,0.10)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#181818] hover:bg-[#111111] text-white rounded-lg font-semibold shadow-md"
                >
                  {editingPromotion ? "Update Promotion" : "Create Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border border-[rgba(185,28,28,0.20)] rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-[#b91c1c]">Delete Privilege Code</h3>
            <p className="text-xs text-[rgba(17,17,17,0.65)]">
              Are you sure you want to permanently delete this promotion code? Existing orders using this discount will retain their records.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(17,17,17,0.10)]">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-lg bg-[#EAE8E1] text-xs text-[#111111]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-xs font-semibold text-white shadow-md"
              >
                Delete Promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
