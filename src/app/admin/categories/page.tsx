"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { AdminCategory } from "@/types/admin";
import { CategoryModal } from "@/components/admin/categories/CategoryModal";

export default function AdminCategoriesPage() {
  const { categories, products, deleteCategory, reorderCategories } = useAdminData();
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  // Confirmation dialog
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

  // Calculate product counts per category slug
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category as string;
      const sub = p.subCategory?.toLowerCase() || "";
      map[cat] = (map[cat] || 0) + 1;
      if (sub && sub !== cat) {
        map[sub] = (map[sub] || 0) + 1;
      }
    });
    return map;
  }, [products]);

  // Group categories into a hierarchy tree
  const hierarchy = useMemo(() => {
    // Top-level roots (parentId is null)
    const roots = categories
      .filter((c) => !c.parentId)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    // Filter by gender if selected
    const filteredRoots = roots.filter(
      (r) => selectedGender === "all" || r.gender === selectedGender || r.gender === "all"
    );

    return filteredRoots.map((root) => {
      // Find direct children
      const children = categories
        .filter((c) => c.parentId === root.id)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((parentCat) => {
          // Find grandchildren (leaf categories)
          const leaves = categories
            .filter((c) => c.parentId === parentCat.id)
            .sort((a, b) => a.displayOrder - b.displayOrder);
          return {
            ...parentCat,
            leaves,
          };
        });

      return {
        ...root,
        children,
      };
    });
  }, [categories, selectedGender]);

  // Handlers
  const handleOpenAdd = (parentCategory?: AdminCategory) => {
    setEditingCategory(
      parentCategory
        ? ({
            id: "",
            name: "",
            slug: "",
            parentId: parentCategory.id,
            gender: parentCategory.gender,
            description: "",
            displayOrder: categories.length + 1,
            status: "active",
          } as AdminCategory)
        : null
    );
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: AdminCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category: AdminCategory) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete Category "${category.name}"`,
      message: `Are you sure you want to delete "${category.name}"? Any subcategories under it will also be deleted.`,
      action: () => {
        deleteCategory(category.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Reordering within sibling level
  const handleMoveSibling = (categoryId: string, direction: "up" | "down") => {
    const target = categories.find((c) => c.id === categoryId);
    if (!target) return;

    // Get all siblings with the same parentId
    const siblings = categories
      .filter((c) => c.parentId === target.parentId)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const currentIndex = siblings.findIndex((c) => c.id === categoryId);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    const swapped = [...siblings];
    const temp = swapped[currentIndex];
    swapped[currentIndex] = swapped[targetIndex];
    swapped[targetIndex] = temp;

    // Reassign displayOrder
    const updatedSiblingMap = new Map(swapped.map((c, i) => [c.id, i + 1]));

    const newCategories = categories.map((c) => {
      if (updatedSiblingMap.has(c.id)) {
        return { ...c, displayOrder: updatedSiblingMap.get(c.id)! };
      }
      return c;
    });

    reorderCategories(newCategories);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Categories</span>
          </div>
          <h1 className="a-page-title">
            CATEGORY HIERARCHY & TAXONOMY
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Manage multi-tier department structures, parent groups, silhouettes, and display ordering ({categories.length} total categories)
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAdd()}
          className="px-4 py-2.5 bg-[#181818] hover:bg-[#111111] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg self-start sm:self-auto"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Category
        </button>
      </div>

      {/* Filter and Department Switcher */}
      <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {["all", "men", "women", "kids"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGender(g)}
              className={`px-3 py-1.5 rounded-lg font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                selectedGender === g
                  ? "bg-[#181818] text-white font-bold"
                  : "bg-[#EAE8E1] text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
              }`}
            >
              {g === "all" ? "All Departments" : g}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-mono text-[rgba(17,17,17,0.45)]">
          Use ▲ / ▼ buttons to adjust category navigation sequence
        </div>
      </div>

      {/* Hierarchical Category Tree */}
      <div className="space-y-6">
        {hierarchy.map((dept) => (
          <div key={dept.id} className="rounded-2xl bg-white border border-[rgba(17,17,17,0.10)] overflow-hidden shadow-xl">
            {/* Department Level Header */}
            <div className="px-6 py-4 bg-[#EAE8E1] border-b border-[rgba(17,17,17,0.10)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#181818]" />
                <h2 className="text-base font-semibold font-serif uppercase tracking-widest" style={{ color: "#111111" }}>
                  {dept.name} DEPARTMENT
                </h2>
                <span className="text-[10px] font-mono text-[#111111] bg-[#181818]/10 px-2 py-0.5 rounded border border-[#181818]/30">
                  {dept.children.length} Parent Groups
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAdd(dept)}
                  className="px-2.5 py-1 rounded bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                >
                  + Add Group
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(dept)}
                  className="p-1.5 text-[rgba(17,17,17,0.55)] hover:text-[#111111] rounded hover:bg-[#EAE8E1]"
                  title="Edit Department"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Parent Categories (e.g. Clothing, Footwear, Accessories) */}
            <div className="p-6 space-y-6">
              {dept.children.map((parentCat, pIdx) => (
                <div key={parentCat.id} className="p-5 rounded-xl bg-[#F5F4F0] border border-[rgba(17,17,17,0.10)]/80 space-y-4">
                  {/* Parent Category Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(17,17,17,0.10)]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[rgba(17,17,17,0.45)]">#{pIdx + 1}</span>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">
                        {parentCat.name}
                      </h3>
                      <span className="text-[10px] text-[rgba(17,17,17,0.45)] font-mono">/{parentCat.slug}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${
                          parentCat.status === "active"
                            ? "bg-[rgba(17,17,17,0.06)] text-[#111111] border-[rgba(17,17,17,0.12)]"
                            : "bg-[rgba(185,28,28,0.06)] text-[#b91c1c] border-[rgba(185,28,28,0.20)]"
                        }`}
                      >
                        {parentCat.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        disabled={pIdx === 0}
                        onClick={() => handleMoveSibling(parentCat.id, "up")}
                        className="px-2 py-1 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded text-[10px] font-mono disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={pIdx === dept.children.length - 1}
                        onClick={() => handleMoveSibling(parentCat.id, "down")}
                        className="px-2 py-1 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded text-[10px] font-mono disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenAdd(parentCat)}
                        className="px-2.5 py-1 bg-[#181818]/10 text-[#111111] hover:bg-[#181818]/20 border border-[#181818]/30 rounded text-[11px] font-mono cursor-pointer"
                      >
                        + Add Subcategory
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(parentCat)}
                        className="px-2 py-1 bg-[#EAE8E1] hover:bg-[#111111] text-[rgba(17,17,17,0.65)] rounded text-[11px] cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(parentCat)}
                        className="px-2 py-1 bg-[rgba(185,28,28,0.06)] hover:bg-[rgba(185,28,28,0.08)] text-[#991b1b] border border-[rgba(185,28,28,0.20)] rounded text-[11px] cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Leaf Subcategories Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {parentCat.leaves.map((leaf, lIdx) => {
                      const count = productCountMap[leaf.slug] || productCountMap[leaf.name.toLowerCase()] || 0;
                      return (
                        <div
                          key={leaf.id}
                          className="p-3.5 rounded-lg bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] flex flex-col justify-between group hover:border-[#181818]/40 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-[rgba(17,17,17,0.45)]">#{leaf.displayOrder}</span>
                                <h4 className="font-semibold text-xs tracking-tight" style={{ color: "#111111" }}>{leaf.name}</h4>
                              </div>
                              <div className="text-[10px] font-mono text-[rgba(17,17,17,0.45)] mt-0.5">/{leaf.slug}</div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-[#EAE8E1] font-mono font-bold text-[10px] text-[#111111]">
                              {count} SKUs
                            </span>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-[rgba(17,17,17,0.10)] flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={lIdx === 0}
                                onClick={() => handleMoveSibling(leaf.id, "up")}
                                className="px-1.5 py-0.5 bg-white hover:bg-[#EAE8E1] text-[#111111] rounded text-[9px] disabled:opacity-30 cursor-pointer"
                                title="Move Earlier"
                              >
                                ◄
                              </button>
                              <button
                                type="button"
                                disabled={lIdx === parentCat.leaves.length - 1}
                                onClick={() => handleMoveSibling(leaf.id, "down")}
                                className="px-1.5 py-0.5 bg-white hover:bg-[#EAE8E1] text-[#111111] rounded text-[9px] disabled:opacity-30 cursor-pointer"
                                title="Move Later"
                              >
                                ►
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(leaf)}
                                className="text-[#111111] hover:underline cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(leaf)}
                                className="text-[#b91c1c] hover:text-[#991b1b] cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {parentCat.leaves.length === 0 && (
                      <div className="col-span-full py-4 text-center text-xs text-[rgba(17,17,17,0.45)]">
                        No child categories defined yet. Click &ldquo;+ Add Subcategory&rdquo; to create one.
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {dept.children.length === 0 && (
                <div className="py-8 text-center text-xs text-[rgba(17,17,17,0.45)]">
                  No parent groups defined for this department.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Category Add/Edit Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        category={editingCategory}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
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
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
