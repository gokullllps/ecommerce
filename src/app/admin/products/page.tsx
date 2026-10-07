"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { Product, GenderId, CategoryId, CollectionId } from "@/types/catalogue";
import { ProductEditorModal } from "@/components/admin/products/ProductEditorModal";

export default function AdminProductsPage() {
  const {
    products,
    categories,
    collections,
    deleteProduct,
    duplicateProduct,
    archiveProduct,
    restoreProduct,
    bulkUpdateProducts,
    bulkDeleteProducts,
  } = useAdminData();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [collectionFilter, setCollectionFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [saleFilter, setSaleFilter] = useState<string>("all");
  const [newInFilter, setNewInFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Confirm Dialog State
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

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      const search = searchTerm.toLowerCase().trim();
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search);

      // Gender
      const matchGender = genderFilter === "all" || p.gender === genderFilter;

      // Category
      const matchCategory =
        categoryFilter === "all" ||
        p.category === categoryFilter ||
        p.subCategory?.toLowerCase() === categoryFilter.toLowerCase();

      // Collection
      const matchCollection =
        collectionFilter === "all" || (p.collections && p.collections.includes(collectionFilter as CollectionId));

      // Stock
      const stock = p.stock ?? 10;
      const threshold = p.lowStockThreshold ?? 5;
      let matchStock = true;
      if (stockFilter === "in_stock") matchStock = stock > threshold;
      else if (stockFilter === "low_stock") matchStock = stock > 0 && stock <= threshold;
      else if (stockFilter === "out_of_stock") matchStock = stock === 0;

      // Status
      const status = p.status || (p.isAvailable ? "active" : "archived");
      const matchStatus = statusFilter === "all" || status === statusFilter;

      // Sale
      let matchSale = true;
      if (saleFilter === "sale_only") matchSale = !!p.isSale || (p.salePrice ? p.salePrice < p.price : false);
      else if (saleFilter === "regular_only") matchSale = !p.isSale && (!p.salePrice || p.salePrice >= p.price);

      // New In
      const matchNewIn = newInFilter === "all" || (newInFilter === "yes" && p.isNewArrival);

      // Featured
      const matchFeatured = featuredFilter === "all" || (featuredFilter === "yes" && (p.popularityScore || 0) >= 80);

      return (
        matchSearch &&
        matchGender &&
        matchCategory &&
        matchCollection &&
        matchStock &&
        matchStatus &&
        matchSale &&
        matchNewIn &&
        matchFeatured
      );
    });
  }, [
    products,
    searchTerm,
    genderFilter,
    categoryFilter,
    collectionFilter,
    stockFilter,
    statusFilter,
    saleFilter,
    newInFilter,
    featuredFilter,
  ]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case "newest":
        return list.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
      case "oldest":
        return list.sort((a, b) => new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime());
      case "name_asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "price_asc":
        return list.sort((a, b) => a.price - b.price);
      case "price_desc":
        return list.sort((a, b) => b.price - a.price);
      case "stock_asc":
        return list.sort((a, b) => (a.stock ?? 10) - (b.stock ?? 10));
      case "stock_desc":
        return list.sort((a, b) => (b.stock ?? 10) - (a.stock ?? 10));
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  // Paginated products
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, currentPage, pageSize]);

  // Checkbox helpers
  const isAllPageSelected =
    paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllPageSelected) {
      const pageIds = paginatedProducts.map((p) => p.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedProducts.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleDuplicate = (id: string) => {
    duplicateProduct(id);
  };

  const handleArchive = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Archive Product",
      message: `Are you sure you want to archive "${name}"? It will be hidden from customer storefronts.`,
      action: () => {
        archiveProduct(id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRestore = (id: string) => {
    restoreProduct(id);
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Product Permanently",
      message: `Are you sure you want to PERMANENTLY remove "${name}" from the database? This cannot be undone.`,
      action: () => {
        deleteProduct(id);
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Bulk Actions
  const handleBulkArchive = () => {
    bulkUpdateProducts(selectedIds, { status: "archived", isAvailable: false });
    setSelectedIds([]);
  };

  const handleBulkRestore = () => {
    bulkUpdateProducts(selectedIds, { status: "active", isAvailable: true });
    setSelectedIds([]);
  };

  const handleBulkMarkFeatured = () => {
    bulkUpdateProducts(selectedIds, { popularityScore: 95 });
    setSelectedIds([]);
  };

  const handleBulkMarkNewIn = () => {
    bulkUpdateProducts(selectedIds, { isNewArrival: true });
    setSelectedIds([]);
  };

  const handleBulkMarkBestseller = () => {
    bulkUpdateProducts(selectedIds, { isBestSeller: true });
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${selectedIds.length} Products`,
      message: `Are you sure you want to delete ${selectedIds.length} selected items? This action cannot be reversed.`,
      action: () => {
        bulkDeleteProducts(selectedIds);
        setSelectedIds([]);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Products</span>
          </div>
          <h1 className="a-page-title">
            PRODUCT MANAGEMENT
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Centralized inventory catalog across Men, Women, and Kids storefronts ({products.length} total SKUs)
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
          Add New Product
        </button>
      </div>

      {/* Multi-Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] space-y-3">
        {/* Search & Main Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, SKU, or fabric..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] placeholder-[rgba(17,17,17,0.40)] focus:outline-none focus:border-[#181818]"
            />
            <svg
              className="w-4 h-4 text-[rgba(17,17,17,0.45)] absolute left-2.5 top-2.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Gender */}
          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] capitalize focus:outline-none focus:border-[#181818]"
          >
            <option value="all">All Departments</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] capitalize focus:outline-none focus:border-[#181818]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Collection */}
          <select
            value={collectionFilter}
            onChange={(e) => {
              setCollectionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] capitalize focus:outline-none focus:border-[#181818]"
          >
            <option value="all">All Collections</option>
            {collections.map((col) => (
              <option key={col.id} value={col.slug}>
                {col.name}
              </option>
            ))}
          </select>
        </div>

        {/* Secondary Detailed Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-[rgba(17,17,17,0.10)]/60 text-xs">
          {/* Stock */}
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-xs text-[rgba(17,17,17,0.65)] focus:outline-none"
          >
            <option value="all">All Inventory</option>
            <option value="in_stock">In Stock (&gt; Low)</option>
            <option value="low_stock">Low Stock (≤ Threshold)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-xs text-[rgba(17,17,17,0.65)] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="draft">Draft Only</option>
            <option value="archived">Archived Only</option>
          </select>

          {/* Sale */}
          <select
            value={saleFilter}
            onChange={(e) => {
              setSaleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-xs text-[rgba(17,17,17,0.65)] focus:outline-none"
          >
            <option value="all">All Pricing</option>
            <option value="sale_only">On Sale Only</option>
            <option value="regular_only">Regular Price Only</option>
          </select>

          {/* New In */}
          <select
            value={newInFilter}
            onChange={(e) => {
              setNewInFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-xs text-[rgba(17,17,17,0.65)] focus:outline-none"
          >
            <option value="all">New In: All</option>
            <option value="yes">New In Only</option>
          </select>

          {/* Featured */}
          <select
            value={featuredFilter}
            onChange={(e) => {
              setFeaturedFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-xs text-[rgba(17,17,17,0.65)] focus:outline-none"
          >
            <option value="all">Featured: All</option>
            <option value="yes">Featured Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 bg-[#EAE8E1] border border-[#181818]/40 rounded text-xs text-[#111111] font-medium focus:outline-none"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="stock_asc">Stock: Low to High</option>
            <option value="stock_desc">Stock: High to Low</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-[#EAE8E1] border border-[#181818]/40 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#181818] text-white font-mono font-bold">
              {selectedIds.length}
            </span>
            <span className="text-[#111111] font-medium">products selected</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleBulkArchive}
              className="px-2.5 py-1 bg-white hover:bg-[#EAE8E1] text-[rgba(17,17,17,0.55)] border border-[rgba(17,17,17,0.12)] rounded font-medium transition-colors cursor-pointer"
            >
              Archive Selected
            </button>
            <button
              type="button"
              onClick={handleBulkRestore}
              className="px-2.5 py-1 bg-white hover:bg-[#EAE8E1] text-[rgba(17,17,17,0.65)] border border-[rgba(17,17,17,0.12)] rounded font-medium transition-colors cursor-pointer"
            >
              Restore Active
            </button>
            <button
              type="button"
              onClick={handleBulkMarkFeatured}
              className="px-2.5 py-1 bg-white hover:bg-[#EAE8E1] text-[#111111] border border-[rgba(17,17,17,0.15)] rounded font-medium transition-colors cursor-pointer"
            >
              Mark Featured
            </button>
            <button
              type="button"
              onClick={handleBulkMarkNewIn}
              className="px-2.5 py-1 bg-white hover:bg-[#EAE8E1] text-[#111111] border border-[rgba(17,17,17,0.15)] rounded font-medium transition-colors cursor-pointer"
            >
              Mark New In
            </button>
            <button
              type="button"
              onClick={handleBulkMarkBestseller}
              className="px-2.5 py-1 bg-white hover:bg-[#EAE8E1] text-[#111111] border border-[rgba(17,17,17,0.15)] rounded font-medium transition-colors cursor-pointer"
            >
              Mark Bestseller
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-2.5 py-1 bg-[rgba(185,28,28,0.08)] hover:bg-rose-500/30 text-[#991b1b] border border-[rgba(185,28,28,0.20)] rounded font-medium transition-colors cursor-pointer"
            >
              Delete Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-[rgba(17,17,17,0.55)] hover:text-[#111111] px-2 py-1 text-[11px]"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Main Products Table & Mobile Card List */}
      <div className="rounded-xl bg-white border border-[rgba(17,17,17,0.10)] overflow-hidden shadow-xl">
        {/* Mobile Product Card List View (md:hidden) */}
        <div className="block md:hidden divide-y divide-[rgba(17,17,17,0.08)]">
          {paginatedProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-[rgba(17,17,17,0.55)]">
              No products match your filters.
            </div>
          ) : (
            paginatedProducts.map((p) => {
              const status = p.status || (p.isAvailable ? "active" : "archived");
              const stock = p.stock ?? 10;
              const threshold = p.lowStockThreshold ?? 5;
              const isLow = stock > 0 && stock <= threshold;
              const isOut = stock === 0;
              const thumbnail =
                p.primaryImage ||
                p.images?.[0]?.url ||
                "/images/categories/knitwear.webp";

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setEditingProduct(p);
                    setIsEditorOpen(true);
                  }}
                  className="p-3.5 active:bg-black/5 transition-colors cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-16 rounded overflow-hidden bg-[#EAE8E1] shrink-0 border border-[rgba(17,17,17,0.10)] relative">
                      <img
                        src={thumbnail}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/categories/knitwear.webp";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[10px] text-[rgba(17,17,17,0.45)] uppercase">{p.sku}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          status === "active" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                        }`}>
                          {status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#111111] truncate mt-0.5">{p.name}</div>
                      <div className="text-[10px] text-[rgba(17,17,17,0.55)] capitalize mt-0.5">
                        {p.gender} · {p.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[rgba(17,17,17,0.06)] text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#111111]">₹{p.price.toLocaleString("en-IN")}</span>
                      {p.salePrice && p.salePrice < p.price && (
                        <span className="ml-1.5 font-mono text-[10px] line-through text-[rgba(17,17,17,0.40)]">
                          ₹{p.salePrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isOut ? "bg-rose-50 text-rose-700" : isLow ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {stock} in stock
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProduct(p);
                          setIsEditorOpen(true);
                        }}
                        className="px-2.5 py-0.5 bg-[#181818] text-white rounded text-[10.5px] font-sans font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table View (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#EAE8E1] border-b border-[rgba(17,17,17,0.10)] text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)] font-mono tracking-wider">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-[rgba(17,17,17,0.15)] text-[#111111]"
                  />
                </th>
                <th className="py-3 px-3">Item</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Badges</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,17,17,0.08)]">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[rgba(17,17,17,0.55)]">
                    <div className="font-semibold text-[#111111] text-sm mb-1">No products match your filters</div>
                    <div className="text-xs">Adjust your search query or reset filters to view all products.</div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isChecked = selectedIds.includes(p.id);
                  const status = p.status || (p.isAvailable ? "active" : "archived");
                  const stock = p.stock ?? 10;
                  const threshold = p.lowStockThreshold ?? 5;
                  const isLow = stock > 0 && stock <= threshold;
                  const isOut = stock === 0;
                  const thumbnail =
                    p.primaryImage ||
                    p.images?.[0]?.url ||
                    "/images/categories/knitwear.webp";

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[#EAE8E1]/40 transition-colors ${
                        isChecked ? "bg-[#EAE8E1]/60" : ""
                      }`}
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(p.id)}
                          className="rounded border-[rgba(17,17,17,0.15)] text-[#111111]"
                        />
                      </td>

                      {/* Product Thumbnail + Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded bg-[#F5F4F0] overflow-hidden flex-shrink-0 border border-[rgba(17,17,17,0.10)]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={thumbnail}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-[#111111] tracking-tight line-clamp-1">{p.name}</div>
                            <div className="text-[10px] text-[rgba(17,17,17,0.45)] line-clamp-1">
                              {p.material || p.shortDescription || p.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 font-mono text-[11px] text-[#111111] whitespace-nowrap">
                        {p.sku}
                      </td>

                      {/* Gender */}
                      <td className="py-3 px-3 capitalize text-[rgba(17,17,17,0.65)] whitespace-nowrap">
                        {p.gender || "unisex"}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 capitalize text-[rgba(17,17,17,0.55)] whitespace-nowrap">
                        {p.category}
                      </td>

                      {/* Price / Sale */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {p.salePrice && p.salePrice < p.price ? (
                          <div className="font-mono">
                            <span className="font-bold text-[#111111]">
                              ₹{p.salePrice.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] text-[rgba(17,17,17,0.45)] line-through ml-1.5">
                              ₹{p.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                        ) : (
                          <div className="font-mono font-semibold" style={{ color: "#111111" }}>
                            ₹{p.price.toLocaleString("en-IN")}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold ${
                              isOut
                                ? "text-[#b91c1c]"
                                : isLow
                                ? "text-[rgba(17,17,17,0.65)]"
                                : "text-[#111111]"
                            }`}
                          >
                            {stock}
                          </span>
                          {isLow && (
                            <span className="px-1.5 py-0.2 rounded text-[8px] font-mono uppercase bg-[rgba(17,17,17,0.06)] text-[rgba(17,17,17,0.55)] border border-[rgba(17,17,17,0.12)]">
                              Low
                            </span>
                          )}
                          {isOut && (
                            <span className="px-1.5 py-0.2 rounded text-[8px] font-mono uppercase bg-[rgba(185,28,28,0.08)] text-[#991b1b] border border-[rgba(185,28,28,0.20)]">
                              Out
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${
                            status === "active"
                              ? "bg-[rgba(17,17,17,0.06)] text-[#111111] border-[rgba(17,17,17,0.12)]"
                              : status === "draft"
                              ? "bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.65)] border-[rgba(17,17,17,0.12)]"
                              : "bg-[rgba(185,28,28,0.06)] text-[#b91c1c] border-[rgba(185,28,28,0.20)]"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Merchandising Badges */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 flex-wrap max-w-[140px]">
                          {p.isNewArrival && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 text-[8px] font-mono font-bold uppercase">
                              New In
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="px-1.5 py-0.5 rounded bg-[rgba(17,17,17,0.06)] text-[rgba(17,17,17,0.60)] text-[8px] font-mono font-bold uppercase">
                              Bestseller
                            </span>
                          )}
                          {(p.popularityScore || 0) >= 85 && (
                            <span className="px-1.5 py-0.5 rounded bg-[rgba(17,17,17,0.06)] text-[rgba(17,17,17,0.55)] text-[8px] font-mono font-bold uppercase">
                              Featured
                            </span>
                          )}
                          {p.isLimitedEdition && (
                            <span className="px-1.5 py-0.5 rounded bg-[rgba(17,17,17,0.07)] text-[rgba(17,17,17,0.65)] text-[8px] font-mono font-bold uppercase">
                              Limited
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Row Actions */}
                      <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 rounded bg-[#EAE8E1] hover:bg-[#EAE8E1] text-[rgba(17,17,17,0.55)] hover:text-[#111111] text-[11px] font-mono"
                          title="View on storefront"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="px-2 py-1 rounded bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p.id)}
                          className="px-2 py-1 rounded bg-[#EAE8E1] hover:bg-[#111111] text-[rgba(17,17,17,0.65)] text-[11px] font-medium transition-colors cursor-pointer"
                          title="Duplicate item"
                        >
                          Duplicate
                        </button>
                        {status === "active" ? (
                          <button
                            type="button"
                            onClick={() => handleArchive(p.id, p.name)}
                            className="px-2 py-1 rounded bg-[rgba(17,17,17,0.05)] hover:bg-[rgba(17,17,17,0.06)] text-[rgba(17,17,17,0.55)] border border-[rgba(17,17,17,0.12)] text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Archive
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestore(p.id)}
                            className="px-2 py-1 rounded bg-[rgba(17,17,17,0.06)] hover:bg-[rgba(17,17,17,0.10)] text-[rgba(17,17,17,0.65)] border border-[rgba(17,17,17,0.12)] text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Restore
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="px-2 py-1 rounded bg-[rgba(185,28,28,0.06)] hover:bg-[rgba(185,28,28,0.08)] text-[#991b1b] border border-[rgba(185,28,28,0.20)] text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-[rgba(17,17,17,0.10)] bg-[#EAE8E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[rgba(17,17,17,0.55)]">
            <span>
              Showing {sortedProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, sortedProducts.length)} of {sortedProducts.length} entries
            </span>
            <span className="text-[rgba(17,17,17,0.45)]">·</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-[rgba(17,17,17,0.15)] text-[#111111] px-2 py-1 rounded text-xs"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-1 font-mono">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>

            <span className="px-3 py-1 text-white font-bold">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Product Editor Modal */}
      <ProductEditorModal
        isOpen={isEditorOpen}
        product={editingProduct}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingProduct(null);
        }}
      />

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="pablo-admin-modal fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[rgba(17,17,17,0.10)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(185,28,28,0.08)] text-[#b91c1c] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111111]">{confirmDialog.title}</h3>
                <p className="text-xs text-[rgba(17,17,17,0.55)] mt-1">{confirmDialog.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(17,17,17,0.10)]">
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-lg bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.action}
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-[#b91c1c] text-white text-xs font-mono font-bold cursor-pointer shadow-lg"
              >
                Confirm Destructive Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
