"use client";

import React, { useState, useEffect } from "react";
import { AdminCategory } from "@/types/admin";
import { useAdminData } from "@/context/AdminDataContext";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: AdminCategory | null;
}

export function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const { categories, addCategory, updateCategory } = useAdminData();
  const [formData, setFormData] = useState<Partial<AdminCategory>>({
    name: "",
    slug: "",
    parentId: null,
    gender: "men",
    description: "",
    image: "",
    displayOrder: 1,
    status: "active",
    seoTitle: "",
    seoDescription: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({ ...category });
      } else {
        setFormData({
          name: "",
          slug: "",
          parentId: null,
          gender: "men",
          description: "",
          image: "/images/categories/knitwear.webp",
          displayOrder: categories.length + 1,
          status: "active",
          seoTitle: "",
          seoDescription: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, category, categories.length]);

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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Category name is required.";
    if (!formData.slug?.trim()) newErrors.slug = "URL slug is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const finalCategory: AdminCategory = {
      id: category?.id || `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: formData.name!.trim(),
      slug: formData.slug!.trim(),
      parentId: formData.parentId || null,
      gender: formData.gender as "men" | "women" | "kids" | "all",
      description: formData.description || "",
      image: formData.image || "",
      displayOrder: Number(formData.displayOrder || 1),
      status: formData.status as "active" | "inactive",
      seoTitle: formData.seoTitle || `${formData.name} | PABLO Atelier`,
      seoDescription: formData.seoDescription || formData.description || "",
    };

    if (category) {
      updateCategory(finalCategory);
    } else {
      addCategory(finalCategory);
    }

    onClose();
  };

  if (!isOpen) return null;

  // Potential parents (exclude self and self's descendants to prevent loops)
  const potentialParents = categories.filter((c) => !category || c.id !== category.id);

  return (
    <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[rgba(17,17,17,0.10)] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-[rgba(17,17,17,0.10)] bg-[#EAE8E1] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#111111] font-bold">
              TAXONOMY HIERARCHY BUILDER
            </span>
            <h2 className="text-lg font-semibold text-[#111111] tracking-tight mt-0.5">
              {category ? `Edit: ${category.name}` : "Create New Category"}
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

        <div className="p-6 space-y-4 text-xs text-[rgba(17,17,17,0.65)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. T-Shirts or Handbags"
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
                placeholder="t-shirts"
                className={`w-full px-3 py-2 bg-[#EAE8E1] border rounded-lg text-[#111111] font-mono text-[11px] focus:outline-none focus:border-[#181818] ${
                  errors.slug ? "border-rose-500" : "border-[rgba(17,17,17,0.15)]"
                }`}
              />
              {errors.slug && <p className="text-[#b91c1c] text-[10px] mt-1">{errors.slug}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                Parent Category (Hierarchy)
              </label>
              <select
                value={formData.parentId || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value || null }))}
                className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] capitalize focus:outline-none focus:border-[#181818]"
              >
                <option value="">None (Top-Level Department)</option>
                {potentialParents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.gender}) {p.parentId ? "— Subcategory" : "— Parent"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                Department / Gender *
              </label>
              <select
                value={formData.gender || "men"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: e.target.value as "men" | "women" | "kids" | "all",
                  }))
                }
                className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] capitalize focus:outline-none focus:border-[#181818]"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
                <option value="all">Unisex / All</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Editorial description of the materials and craftsmanship in this taxonomy..."
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] focus:outline-none focus:border-[#181818]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                Cover Image URL
              </label>
              <input
                type="text"
                value={formData.image || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="/images/categories/t-shirts.webp"
                className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                Publication Status
              </label>
              <select
                value={formData.status || "active"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as "active" | "inactive",
                  }))
                }
                className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] focus:outline-none focus:border-[#181818]"
              >
                <option value="active">Active / Published</option>
                <option value="inactive">Inactive / Hidden</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[rgba(17,17,17,0.10)]">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seoTitle || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="Men's Luxury T-Shirts | PABLO"
                className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                SEO Description
              </label>
              <input
                type="text"
                value={formData.seoDescription || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="Fine Supima cotton luxury t-shirts..."
                className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
              />
            </div>
          </div>
        </div>

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
            {category ? "Save Category Changes" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
