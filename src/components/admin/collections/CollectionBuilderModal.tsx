"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AdminCollection, CollectionMode, CollectionRule } from "@/types/admin";
import { Product, CategoryId } from "@/types/catalogue";
import { useAdminData } from "@/context/AdminDataContext";

interface CollectionBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection?: AdminCollection | null;
}

export function CollectionBuilderModal({ isOpen, onClose, collection }: CollectionBuilderModalProps) {
  const { products, categories, addCollection, updateCollection } = useAdminData();

  const [formData, setFormData] = useState<Partial<AdminCollection>>({
    name: "",
    slug: "",
    description: "",
    image: "/images/hero-desktop.jpg",
    banner: "/images/hero-desktop.jpg",
    status: "active",
    gender: "all",
    mode: "manual",
    productIds: [],
    rules: [
      { id: "r-1", field: "category", operator: "equals", value: "denim" },
    ],
    startDate: "",
    endDate: "",
    seoTitle: "",
    seoDescription: "",
  });

  const [productSearch, setProductSearch] = useState("");
  const [selectedGenderFilter, setSelectedGenderFilter] = useState("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (collection) {
        setFormData({
          ...collection,
          productIds: collection.productIds || [],
          rules: collection.rules || [
            { id: `r-${Date.now()}`, field: "category", operator: "equals", value: "denim" },
          ],
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          description: "",
          image: "/images/hero-desktop.jpg",
          banner: "/images/hero-desktop.jpg",
          status: "active",
          gender: "all",
          mode: "manual",
          productIds: [],
          rules: [
            { id: `r-${Date.now()}`, field: "category", operator: "equals", value: "denim" },
          ],
          startDate: "",
          endDate: "",
          seoTitle: "",
          seoDescription: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, collection]);

  const handleNameChange = (name: string) => {
    setFormData((prev) => {
      const slug = prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      return { ...prev, name, slug };
    });
    if (errors.name) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.name;
        return next;
      });
    }
  };

  // Matching products for Rule-Based collections
  const matchingRuleProducts = useMemo(() => {
    if (formData.mode !== "rule_based") return [];
    const rules = formData.rules || [];
    if (rules.length === 0) return products;

    return products.filter((p) => {
      return rules.every((rule) => {
        if (rule.field === "category") {
          return p.category === rule.value;
        }
        if (rule.field === "gender") {
          return p.gender === rule.value;
        }
        if (rule.field === "minPrice") {
          return p.price >= Number(rule.value);
        }
        if (rule.field === "maxPrice") {
          return p.price <= Number(rule.value);
        }
        if (rule.field === "isSale") {
          return !!p.isSale === (rule.value === true || rule.value === "true");
        }
        if (rule.field === "isNewArrival") {
          return !!p.isNewArrival === (rule.value === true || rule.value === "true");
        }
        if (rule.field === "isBestSeller") {
          return !!p.isBestSeller === (rule.value === true || rule.value === "true");
        }
        if (rule.field === "isFeatured") {
          return ((p.popularityScore || 0) >= 80) === (rule.value === true || rule.value === "true");
        }
        if (rule.field === "tag") {
          return p.tags?.some((t) => t.toLowerCase().includes(String(rule.value).toLowerCase()));
        }
        return true;
      });
    });
  }, [products, formData.mode, formData.rules]);

  // Selected products for Manual Mode
  const selectedManualProducts = useMemo(() => {
    const ids = formData.productIds || [];
    const map = new Map(products.map((p) => [p.id, p]));
    return ids.map((id) => map.get(id)).filter(Boolean) as Product[];
  }, [products, formData.productIds]);

  // Available products to pick from in Manual Mode
  const availableToPick = useMemo(() => {
    const currentIds = new Set(formData.productIds || []);
    return products.filter((p) => {
      if (currentIds.has(p.id)) return false;
      if (selectedGenderFilter !== "all" && p.gender !== selectedGenderFilter) return false;
      if (selectedCategoryFilter !== "all" && p.category !== selectedCategoryFilter) return false;
      if (productSearch) {
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, formData.productIds, selectedGenderFilter, selectedCategoryFilter, productSearch]);

  // Manual Product Reordering
  const handleMoveProduct = (index: number, direction: "up" | "down") => {
    const ids = [...(formData.productIds || [])];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= ids.length) return;
    const temp = ids[index];
    ids[index] = ids[targetIdx];
    ids[targetIdx] = temp;
    setFormData((prev) => ({ ...prev, productIds: ids }));
  };

  const handleAddProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: [...(prev.productIds || []), productId],
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: (prev.productIds || []).filter((id) => id !== productId),
    }));
  };

  // Rule Builders
  const handleAddRule = () => {
    const newRule: CollectionRule = {
      id: `r-${Date.now()}`,
      field: "category",
      operator: "equals",
      value: "knitwear",
    };
    setFormData((prev) => ({
      ...prev,
      rules: [...(prev.rules || []), newRule],
    }));
  };

  const handleUpdateRule = (index: number, updates: Partial<CollectionRule>) => {
    const nextRules = (formData.rules || []).map((r, i) => (i === index ? { ...r, ...updates } : r));
    setFormData((prev) => ({ ...prev, rules: nextRules }));
  };

  const handleRemoveRule = (index: number) => {
    const nextRules = (formData.rules || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, rules: nextRules }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name?.trim()) errs.name = "Collection name is required.";
    if (!formData.slug?.trim()) errs.slug = "Collection slug is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const finalCollection: AdminCollection = {
      id: collection?.id || `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: formData.name!.trim(),
      slug: formData.slug!.trim(),
      description: formData.description || "",
      image: formData.image || "/images/hero-desktop.jpg",
      banner: formData.banner || "/images/hero-desktop.jpg",
      status: formData.status as "draft" | "active" | "archived" | "scheduled",
      gender: formData.gender as "all" | "men" | "women" | "kids",
      mode: formData.mode as CollectionMode,
      productIds: formData.mode === "manual" ? formData.productIds || [] : matchingRuleProducts.map((p) => p.id),
      rules: formData.mode === "rule_based" ? formData.rules : undefined,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      seoTitle: formData.seoTitle || `${formData.name} | PABLO Atelier`,
      seoDescription: formData.seoDescription || formData.description || "",
      updatedAt: new Date().toISOString(),
    };

    if (collection) {
      updateCollection(finalCollection);
    } else {
      addCollection(finalCollection);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-[rgba(17,17,17,0.10)] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(17,17,17,0.10)] bg-[#EAE8E1] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#111111] font-bold">
              CURATED CAMPAIGN & EDITORIAL BUILDER
            </span>
            <h2 className="text-lg font-semibold text-[#111111] tracking-tight mt-0.5">
              {collection ? `Edit: ${collection.name}` : "Create New Collection"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[rgba(17,17,17,0.55)] hover:text-[#111111] rounded-lg hover:bg-[#EAE8E1] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs" style={{ color: "#111111" }}>
          {/* Metadata Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                Collection Name *
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Autumn / Winter 2026 or The Raw Denim Atelier"
                className={`w-full px-3 py-2 bg-[#EAE8E1] border rounded-lg text-[#111111] focus:outline-none focus:border-[#181818] ${
                  errors.name ? "border-rose-500" : "border-[rgba(17,17,17,0.15)]"
                }`}
              />
              {errors.name && <p className="text-[#b91c1c] text-[10px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                URL Slug *
              </label>
              <input
                type="text"
                value={formData.slug || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="aw26"
                className={`w-full px-3 py-2 bg-[#EAE8E1] border rounded-lg text-[#111111] font-mono text-[11px] focus:outline-none focus:border-[#181818] ${
                  errors.slug ? "border-rose-500" : "border-[rgba(17,17,17,0.15)]"
                }`}
              />
              {errors.slug && <p className="text-[#b91c1c] text-[10px] mt-1">{errors.slug}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
              Editorial Description
            </label>
            <textarea
              rows={2}
              value={formData.description || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Architectural proportion, unstructured tailoring, and double-faced zibeline cashmere..."
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] focus:outline-none focus:border-[#181818]"
            />
          </div>

          {/* Banner & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                Hero Banner URL
              </label>
              <input
                type="text"
                value={formData.banner || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, banner: e.target.value, image: e.target.value }))}
                placeholder="/images/hero-desktop.jpg"
                className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                Target Department
              </label>
              <select
                value={formData.gender || "all"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: e.target.value as "all" | "men" | "women" | "kids",
                  }))
                }
                className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] capitalize focus:outline-none focus:border-[#181818]"
              >
                <option value="all">All / Unisex</option>
                <option value="men">Men Only</option>
                <option value="women">Women Only</option>
                <option value="kids">Kids Only</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                Status
              </label>
              <select
                value={formData.status || "active"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as "draft" | "active" | "archived" | "scheduled",
                  }))
                }
                className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] focus:outline-none focus:border-[#181818]"
              >
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="p-4 bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] rounded-xl space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#111111] font-bold block">
              Curatorial Inclusion Mode
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, mode: "manual" }))}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                  formData.mode === "manual"
                    ? "bg-[#EAE8E1] border-[#181818] text-[#111111]"
                    : "bg-[#F5F4F0] border-[rgba(17,17,17,0.10)] text-[rgba(17,17,17,0.55)]"
                }`}
              >
                <div className="font-bold uppercase text-xs">Manual Curation</div>
                <div className="text-[10px] text-[rgba(17,17,17,0.45)] mt-0.5">
                  Hand-pick specific items and freely drag / order them for exact storefront sequence.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, mode: "rule_based" }))}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                  formData.mode === "rule_based"
                    ? "bg-[#EAE8E1] border-[#181818] text-[#111111]"
                    : "bg-[#F5F4F0] border-[rgba(17,17,17,0.10)] text-[rgba(17,17,17,0.55)]"
                }`}
              >
                <div className="font-bold uppercase text-xs">Automated Rule-Based</div>
                <div className="text-[10px] text-[rgba(17,17,17,0.45)] mt-0.5">
                  Dynamic rules (e.g. Category = Denim, Price &gt; ₹3000) that auto-populate products.
                </div>
              </button>
            </div>
          </div>

          {/* MODE 1: MANUAL CURATION */}
          {formData.mode === "manual" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: "rgba(17,17,17,0.50)" }}>
                    Curated Products in Order ({formData.productIds?.length || 0})
                  </h3>
                  <p className="text-[10px] text-[rgba(17,17,17,0.45)]">
                    Storefront displays these products in this exact order. Use ▲ / ▼ to reorder.
                  </p>
                </div>
              </div>

              {/* Selected Ordered Products List */}
              <div className="border border-[rgba(17,17,17,0.10)] rounded-xl overflow-hidden bg-[#F5F4F0] max-h-64 overflow-y-auto">
                {selectedManualProducts.length === 0 ? (
                  <div className="p-8 text-center text-[rgba(17,17,17,0.45)] text-xs">
                    No products added yet. Select products from the catalog below.
                  </div>
                ) : (
                  <div className="divide-y divide-[rgba(17,17,17,0.08)]">
                    {selectedManualProducts.map((p, idx) => (
                      <div
                        key={p.id}
                        className="p-2.5 flex items-center justify-between gap-3 hover:bg-[#EAE8E1]/40"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[rgba(17,17,17,0.45)] w-6">
                            #{idx + 1}
                          </span>
                          <div className="w-8 h-10 rounded bg-[#EAE8E1] overflow-hidden flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.primaryImage || p.images?.[0]?.url || "/images/categories/knitwear.webp"}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-[#111111] line-clamp-1">{p.name}</div>
                            <div className="text-[10px] text-[rgba(17,17,17,0.45)] font-mono">
                              {p.sku} · ₹{p.price.toLocaleString("en-IN")} · {p.category}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveProduct(idx, "up")}
                            className="p-1.5 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded text-xs disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === selectedManualProducts.length - 1}
                            onClick={() => handleMoveProduct(idx, "down")}
                            className="p-1.5 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded text-xs disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(p.id)}
                            className="px-2 py-1 bg-[rgba(185,28,28,0.06)] text-[#991b1b] hover:bg-[rgba(185,28,28,0.08)] rounded text-[11px] ml-2 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Product from Catalog Picker */}
              <div className="p-4 bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] rounded-xl space-y-3">
                <span className="text-[11px] font-mono uppercase text-[#111111] font-bold block">
                  Add Items from Product Catalog
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Filter catalog by title or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="px-3 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-[#111111] text-xs"
                  />
                  <select
                    value={selectedGenderFilter}
                    onChange={(e) => setSelectedGenderFilter(e.target.value)}
                    className="px-3 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-[#111111] text-xs capitalize"
                  >
                    <option value="all">All Genders</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-[#111111] text-xs capitalize"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="max-h-48 overflow-y-auto divide-y divide-[rgba(17,17,17,0.08)] border border-[rgba(17,17,17,0.10)] rounded-lg bg-[#F5F4F0]">
                  {availableToPick.slice(0, 15).map((p) => (
                    <div key={p.id} className="p-2 flex items-center justify-between text-xs hover:bg-[#EAE8E1]/30">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-[#111111]">{p.name}</div>
                        <span className="text-[10px] font-mono text-[#111111]">{p.sku}</span>
                        <span className="text-[10px] text-[rgba(17,17,17,0.45)]">({p.category})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddProduct(p.id)}
                        className="px-2.5 py-1 bg-[#181818] hover:bg-[#111111] text-white font-bold uppercase text-[10px] rounded cursor-pointer"
                      >
                        + Add to Collection
                      </button>
                    </div>
                  ))}
                  {availableToPick.length === 0 && (
                    <div className="p-4 text-center text-[rgba(17,17,17,0.45)] text-xs">
                      All matching products already added.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: RULE-BASED CURATION */}
          {formData.mode === "rule_based" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: "rgba(17,17,17,0.50)" }}>
                    Automated Inclusion Rules ({formData.rules?.length || 0})
                  </h3>
                  <p className="text-[10px] text-[rgba(17,17,17,0.45)]">
                    Products matching ALL active criteria below are automatically included.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="px-3 py-1 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded text-xs font-mono cursor-pointer"
                >
                  + Add Rule Condition
                </button>
              </div>

              {/* Rules List */}
              <div className="space-y-2">
                {(formData.rules || []).map((rule, idx) => (
                  <div
                    key={rule.id || idx}
                    className="p-3 bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] rounded-xl flex items-center gap-3 flex-wrap"
                  >
                    <span className="font-mono text-[10px] text-[rgba(17,17,17,0.45)] font-bold">
                      CONDITION #{idx + 1}
                    </span>

                    {/* Field */}
                    <select
                      value={rule.field}
                      onChange={(e) =>
                        handleUpdateRule(idx, { field: e.target.value as CollectionRule["field"] })
                      }
                      className="px-3 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-[#111111] text-xs"
                    >
                      <option value="category">Category</option>
                      <option value="gender">Gender</option>
                      <option value="minPrice">Minimum Price (₹)</option>
                      <option value="maxPrice">Maximum Price (₹)</option>
                      <option value="isSale">Is on Sale</option>
                      <option value="isNewArrival">Is New Arrival</option>
                      <option value="isBestSeller">Is Bestseller</option>
                      <option value="isFeatured">Is Featured</option>
                      <option value="tag">Contains Tag</option>
                    </select>

                    <span className="text-[rgba(17,17,17,0.45)] font-mono text-xs">equals / is</span>

                    {/* Value */}
                    {rule.field === "category" ? (
                      <select
                        value={String(rule.value)}
                        onChange={(e) => handleUpdateRule(idx, { value: e.target.value })}
                        className="px-3 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-[#111111] text-xs capitalize"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : rule.field === "gender" ? (
                      <select
                        value={String(rule.value)}
                        onChange={(e) => handleUpdateRule(idx, { value: e.target.value })}
                        className="px-3 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-[#111111] text-xs capitalize"
                      >
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kids">Kids</option>
                      </select>
                    ) : rule.field === "isSale" || rule.field === "isNewArrival" || rule.field === "isBestSeller" || rule.field === "isFeatured" ? (
                      <select
                        value={String(rule.value)}
                        onChange={(e) => handleUpdateRule(idx, { value: e.target.value === "true" })}
                        className="px-3 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-[#111111] text-xs"
                      >
                        <option value="true">True / Yes</option>
                        <option value="false">False / No</option>
                      </select>
                    ) : (
                      <input
                        type={rule.field.includes("Price") ? "number" : "text"}
                        value={String(rule.value)}
                        onChange={(e) => handleUpdateRule(idx, { value: e.target.value })}
                        className="px-3 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-[#111111] text-xs font-mono w-36"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      className="text-[#b91c1c] hover:text-[#991b1b] ml-auto text-xs"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              {/* Dynamic Matches Preview */}
              <div className="p-4 bg-[#F5F4F0] border border-[rgba(17,17,17,0.10)] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-[#111111] font-bold">
                    Dynamically Matching Items: {matchingRuleProducts.length} SKUs Found
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {matchingRuleProducts.map((p) => (
                    <div key={p.id} className="p-2 rounded bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] flex items-center gap-2">
                      <div className="w-8 h-10 rounded bg-[#F5F4F0] overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.primaryImage || p.images?.[0]?.url || "/images/categories/knitwear.webp"}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate text-[10px]">
                        <div className="font-semibold text-[#111111] truncate">{p.name}</div>
                        <div className="text-[rgba(17,17,17,0.45)] font-mono">₹{p.price.toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
            onClick={handleSave}
            className="px-5 py-2 bg-[#181818] hover:bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg shadow-md cursor-pointer"
          >
            {collection ? "Save Collection Changes" : "Create Collection"}
          </button>
        </div>
      </div>
    </div>
  );
}
