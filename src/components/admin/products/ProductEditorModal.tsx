"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product, ProductImage, ProductVariant, GenderId, CategoryId, CollectionId } from "@/types/catalogue";
import { useAdminData } from "@/context/AdminDataContext";

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // null means "Add Product"
}

type TabType =
  | "basic"
  | "category"
  | "pricing"
  | "inventory"
  | "media"
  | "variants"
  | "merchandising"
  | "seo";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "46", "48", "50", "52", "54", "One Size"];
const PRESET_COLORS = [
  { name: "Black Noir", hex: "#111111" },
  { name: "Ecru Ivory", hex: "#F3EFE6" },
  { name: "Charcoal Grey", hex: "#3A3D40" },
  { name: "Espresso Brown", hex: "#2E241E" },
  { name: "Navy Midnight", hex: "#1B2432" },
  { name: "Olive Bronze", hex: "#4A4D3E" },
];

export function ProductEditorModal({ isOpen, onClose, product }: ProductEditorModalProps) {
  const { addProduct, updateProduct, categories, collections, mediaAssets } = useAdminData();
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "",
    slug: "",
    brand: "PABLO",
    productType: "Apparel",
    gender: "men",
    department: "clothing",
    category: "t-shirts",
    subCategory: "T-Shirts",
    collections: ["aw26" as CollectionId],
    description: "",
    shortDescription: "",
    price: 45000,
    originalPrice: 45000,
    salePrice: undefined,
    stock: 20,
    lowStockThreshold: 5,
    reservedStock: 0,
    status: "active",
    isAvailable: true,
    isNewArrival: true,
    isSale: false,
    isBestSeller: false,
    isLimitedEdition: false,
    material: "100% Cashmere",
    fit: "Relaxed tailored cut",
    tags: ["luxury", "editorial"],
    popularityScore: 85,
    images: [
      {
        id: "img-1",
        url: "/images/categories/knitwear.jpg",
        alt: "Front look",
        isPrimary: true,
        viewType: "front",
      },
    ],
    primaryImage: "/images/categories/knitwear.jpg",
    hoverImage: "",
    videoUrl: "",
    variants: [],
    seoTitle: "",
    seoDescription: "",
  });

  // Variant generator state
  const [selectedGeneratorColors, setSelectedGeneratorColors] = useState<string[]>(["Black Noir"]);
  const [selectedGeneratorSizes, setSelectedGeneratorSizes] = useState<string[]>(["S", "M", "L"]);
  const [newColorInput, setNewColorInput] = useState("");
  const [newColorHex, setNewColorHex] = useState("#111111");

  // Media state
  const [isDragOver, setIsDragOver] = useState(false);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [editingAltIdx, setEditingAltIdx] = useState<number | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const pendingFilesRef = React.useRef<Map<string, File>>(new Map());
  const blobUrlsRef = React.useRef<string[]>([]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      });
      blobUrlsRef.current = [];
      pendingFilesRef.current.clear();
    };
  }, []);


  // Reset or Populate form on open
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          ...product,
          brand: product.brand || "PABLO",
          status: product.status || (product.isAvailable ? "active" : "archived"),
          lowStockThreshold: product.lowStockThreshold ?? 5,
          reservedStock: product.reservedStock ?? 0,
          shortDescription: product.shortDescription || "",
          productType: product.productType || "Apparel",
          images: product.images && product.images.length > 0 ? product.images : [
            { id: "img-0", url: product.primaryImage || "/images/categories/knitwear.jpg", alt: product.name, isPrimary: true }
          ],
          primaryImage: product.primaryImage || (product.images?.[0]?.url || ""),
          hoverImage: product.hoverImage || "",
          variants: product.variants || [],
        });
      } else {
        const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
        setFormData({
          name: "",
          sku: `PAB-NEW-${timestamp}`,
          slug: "",
          brand: "PABLO",
          productType: "Apparel",
          gender: "men",
          department: "clothing",
          category: "knitwear",
          subCategory: "Knitwear",
          collections: ["aw26" as CollectionId],
          description: "",
          shortDescription: "",
          price: 24000,
          originalPrice: 24000,
          salePrice: undefined,
          stock: 25,
          lowStockThreshold: 5,
          reservedStock: 0,
          status: "active",
          isAvailable: true,
          isNewArrival: true,
          isSale: false,
          isBestSeller: false,
          isLimitedEdition: false,
          material: "Grade-A Mongolian Cashmere",
          fit: "Regular fit",
          tags: ["luxury", "knitwear"],
          popularityScore: 75,
          images: [
            {
              id: "img-init",
              url: "/images/categories/knitwear.jpg",
              alt: "Product view",
              isPrimary: true,
              viewType: "front",
            },
          ],
          primaryImage: "/images/categories/knitwear.jpg",
          hoverImage: "",
          videoUrl: "",
          variants: [
            {
              id: "v-1",
              sku: `PAB-NEW-${timestamp}-BLK-M`,
              colorName: "Black Noir",
              sizeName: "M",
              material: "Cashmere",
              stock: 15,
              priceOverride: 24000,
              isAvailable: true,
            },
            {
              id: "v-2",
              sku: `PAB-NEW-${timestamp}-BLK-L`,
              colorName: "Black Noir",
              sizeName: "L",
              material: "Cashmere",
              stock: 10,
              priceOverride: 24000,
              isAvailable: true,
            },
          ],
          seoTitle: "",
          seoDescription: "",
        });
      }
      setIsDirty(false);
      setErrors({});
      setActiveTab("basic");
      setShowUnsavedPrompt(false);
    }
  }, [isOpen, product]);

  const updateField = <K extends keyof Product>(key: K, value: Product[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Product name is required.";
    }
    if (!formData.sku?.trim()) {
      newErrors.sku = "SKU identifier is required.";
    }
    if (formData.price === undefined || formData.price < 0 || isNaN(formData.price)) {
      newErrors.price = "Price must be a non-negative number.";
    }
    if (formData.salePrice !== undefined && formData.salePrice !== null && !isNaN(formData.salePrice)) {
      if (formData.salePrice < 0) {
        newErrors.salePrice = "Sale price cannot be negative.";
      } else if (formData.price !== undefined && formData.salePrice > formData.price) {
        newErrors.salePrice = "Sale price cannot exceed the original price.";
      }
    }
    if (formData.stock === undefined || formData.stock < 0 || isNaN(formData.stock)) {
      newErrors.stock = "Stock quantity cannot be negative.";
    }
    if (!formData.slug?.trim()) {
      newErrors.slug = "Valid URL slug is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auto-generate slug when name changes (if slug empty or matches old slug)
  const handleNameChange = (name: string) => {
    updateField("name", name);
    if (!product || !formData.slug || formData.slug.length === 0) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, name, slug: generatedSlug }));
    }
  };

  // Save handler
  const handleSave = async () => {
    if (!validateForm()) {
      // Find which tab has errors and switch to it
      if (errors.name || errors.sku || errors.slug) setActiveTab("basic");
      else if (errors.price || errors.salePrice) setActiveTab("pricing");
      else if (errors.stock) setActiveTab("inventory");
      return;
    }

    setIsSaving(true);
    setMediaError(null);

    try {
      const resolvedProductId =
        product?.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      let currentImages = [...(formData.images || [])];
      let currentPrimary = formData.primaryImage || currentImages[0]?.url || "/images/categories/knitwear.jpg";
      let currentHover = formData.hoverImage || "";

      // 1. Upload any pending File objects to server
      const pendingEntries = Array.from(pendingFilesRef.current.entries());
      if (pendingEntries.length > 0) {
        const urlMapping = new Map<string, string>(); // oldBlobUrl -> newPersistentUrl

        for (const [imgId, file] of pendingEntries) {
          const uploadFormData = new FormData();
          uploadFormData.append("productId", resolvedProductId);
          uploadFormData.append("file", file);

          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: uploadFormData,
          });

          const data = await res.json();
          if (!res.ok || !data.success || !data.url) {
            throw new Error(data.error || `Failed to upload image "${file.name}".`);
          }

          const targetIdx = currentImages.findIndex((img) => img.id === imgId);
          if (targetIdx !== -1) {
            const oldUrl = currentImages[targetIdx].url;
            const persistentUrl = data.url;
            urlMapping.set(oldUrl, persistentUrl);
            currentImages[targetIdx] = {
              ...currentImages[targetIdx],
              url: persistentUrl,
            };
          }
        }

        // Map primary and hover images if they referenced blob URLs
        if (urlMapping.has(currentPrimary)) {
          currentPrimary = urlMapping.get(currentPrimary)!;
        }
        if (currentHover && urlMapping.has(currentHover)) {
          currentHover = urlMapping.get(currentHover)!;
        }

        // Revoke temporary blob previews
        blobUrlsRef.current.forEach((blobUrl) => {
          try {
            URL.revokeObjectURL(blobUrl);
          } catch {}
        });
        blobUrlsRef.current = [];
        pendingFilesRef.current.clear();
      }

      // Ensure primaryImage aligns with an active primary image if available
      const primaryItem = currentImages.find((img) => img.isPrimary) || currentImages[0];
      if (primaryItem) {
        currentPrimary = primaryItem.url;
      }
      const hoverItem = currentImages.find((img) => img.isHover);
      if (hoverItem) {
        currentHover = hoverItem.url;
      }

      // 2. Strict check: Ensure absolutely NO blob URLs remain before saving
      const hasBlob = (url?: string) => typeof url === "string" && url.trim().toLowerCase().startsWith("blob:");
      if (hasBlob(currentPrimary) || hasBlob(currentHover) || currentImages.some((img) => hasBlob(img.url))) {
        throw new Error("Product image has not been persisted yet. Blob URLs cannot be saved.");
      }

      const finalProduct: Product = {
        id: resolvedProductId,
        sku: formData.sku!.trim(),
        name: formData.name!.trim(),
        slug: formData.slug!.trim(),
        brand: formData.brand || "PABLO",
        productType: formData.productType || "Apparel",
        gender: formData.gender as GenderId,
        department: (formData.department as "clothing" | "footwear" | "accessories") || "clothing",
        category: (formData.category as CategoryId) || "t-shirts",
        subCategory: formData.subCategory || "",
        collections: (formData.collections as CollectionId[]) || [],
        description: formData.description || "",
        shortDescription: formData.shortDescription || "",
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        images: currentImages,
        primaryImage: currentPrimary,
        hoverImage: currentHover,
        videoUrl: formData.videoUrl || "",
        colors: formData.colors || [{ name: "Standard", hex: "#111111", inStock: true }],
        sizes: formData.sizes || [{ size: "M", inStock: true }],
        variants: formData.variants || [],
        stock: Number(formData.stock),
        reservedStock: Number(formData.reservedStock || 0),
        lowStockThreshold: Number(formData.lowStockThreshold || 5),
        material: formData.material || "Fine Tailored Fabric",
        fit: formData.fit || "Regular",
        tags: formData.tags || [],
        isAvailable: formData.status === "active",
        status: formData.status || "active",
        isNewArrival: !!formData.isNewArrival,
        isSale: !!formData.isSale || (formData.salePrice ? formData.salePrice < Number(formData.price) : false),
        isBestSeller: !!formData.isBestSeller,
        isLimitedEdition: !!formData.isLimitedEdition,
        popularityScore: Number(formData.popularityScore || 80),
        seoTitle: formData.seoTitle || `${formData.name} | PABLO Atelier`,
        seoDescription: formData.seoDescription || formData.shortDescription || formData.description?.slice(0, 150) || "",
        createdAt: product?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (product) {
        updateProduct(finalProduct);
      } else {
        addProduct(finalProduct);
      }

      setIsDirty(false);
      onClose();
    } catch (err: unknown) {
      console.error("[ProductEditor] Failed to save product:", err);
      const msg = (err as Error)?.message || "Failed to save product with uploaded images.";
      setMediaError(msg);
      setActiveTab("media");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAttemptClose = () => {
    if (isDirty) {
      setShowUnsavedPrompt(true);
    } else {
      onClose();
    }
  };

  // File Upload Handler — creates blob URL for immediate in-session preview
  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

  const handleFileUpload = (files: FileList | File[]) => {
    setMediaError(null);
    const fileArr = Array.from(files);
    const validFiles: File[] = [];

    for (const file of fileArr) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setMediaError(`"${file.name}" is not a supported format. Use JPG, PNG, or WEBP.`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setMediaError(`"${file.name}" exceeds 10 MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const currentImages = formData.images || [];
    const newImages: ProductImage[] = validFiles.map((file, i) => {
      const imgId = `img-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
      const previewUrl = URL.createObjectURL(file);
      pendingFilesRef.current.set(imgId, file);
      blobUrlsRef.current.push(previewUrl);
      return {
        id: imgId,
        url: previewUrl,
        alt: "",
        isPrimary: currentImages.length === 0 && i === 0,
        viewType: "front",
      };
    });

    const nextImages = [...currentImages, ...newImages];
    updateField("images", nextImages);
    if (!formData.primaryImage && newImages[0]) {
      updateField("primaryImage", newImages[0].url);
    }
  };

  // Pick from existing Media Library assets
  const handlePickFromLibrary = (asset: import("@/types/admin").MediaAsset) => {
    const currentImages = formData.images || [];
    const alreadyAdded = currentImages.some((img) => img.url === asset.url);
    if (alreadyAdded) {
      setMediaLibraryOpen(false);
      return;
    }
    const newImg: ProductImage = {
      id: `img-lib-${asset.id}`,
      url: asset.url,
      alt: asset.filename.replace(/\.[^.]+$/, "").replace(/-/g, " "),
      isPrimary: currentImages.length === 0,
      viewType: "front",
    };
    const nextImages = [...currentImages, newImg];
    updateField("images", nextImages);
    if (!formData.primaryImage) updateField("primaryImage", newImg.url);
    setMediaLibraryOpen(false);
  };

  const handleRemoveImage = (index: number) => {
    const target = (formData.images || [])[index];
    if (target?.id && pendingFilesRef.current.has(target.id)) {
      pendingFilesRef.current.delete(target.id);
    }
    if (target?.url && target.url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(target.url);
      } catch {}
    }
    const next = (formData.images || []).filter((_, i) => i !== index);
    updateField("images", next);
    if (next.length > 0 && !next.some((img) => img.isPrimary)) {
      next[0].isPrimary = true;
      updateField("primaryImage", next[0].url);
    }
  };

  const handleSetPrimary = (index: number) => {
    const next = (formData.images || []).map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    updateField("images", next);
    updateField("primaryImage", next[index].url);
  };

  const handleSetHover = (index: number) => {
    const next = (formData.images || []).map((img, i) => ({
      ...img,
      isHover: i === index,
    }));
    updateField("images", next);
    const target = (formData.images || [])[index];
    if (target) {
      updateField("hoverImage", target.url);
    }
  };

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const list = [...(formData.images || [])];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    updateField("images", list);
  };

  // Variant Builder Matrix
  const handleBulkGenerateVariants = () => {
    if (selectedGeneratorColors.length === 0 || selectedGeneratorSizes.length === 0) {
      alert("Please select at least one Color and one Size to generate variants.");
      return;
    }

    const baseSku = formData.sku || "PAB-SKU";
    const generated: ProductVariant[] = [];

    selectedGeneratorColors.forEach((color) => {
      selectedGeneratorSizes.forEach((size) => {
        const colorCode = color.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "C");
        const sizeCode = size.toUpperCase().replace(/[^A-Z0-9]/g, "S");
        const variantSku = `${baseSku}-${colorCode}-${sizeCode}`;

        // Don't duplicate if SKU already exists
        const exists = (formData.variants || []).some((v) => v.colorName === color && v.sizeName === size);
        if (!exists) {
          generated.push({
            id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            sku: variantSku,
            colorName: color,
            sizeName: size,
            stock: 10,
            priceOverride: formData.price,
            isAvailable: true,
          });
        }
      });
    });

    const nextVariants = [...(formData.variants || []), ...generated];
    updateField("variants", nextVariants);
    // Recalculate total stock from variants
    const totalStock = nextVariants.reduce((sum, v) => sum + v.stock, 0);
    updateField("stock", totalStock);
  };

  const handleAddSingleVariant = () => {
    const baseSku = formData.sku || "PAB-SKU";
    const id = `var-${Date.now()}`;
    const newVariant: ProductVariant = {
      id,
      sku: `${baseSku}-VAR-${(formData.variants || []).length + 1}`,
      colorName: "Black Noir",
      sizeName: "M",
      stock: 5,
      priceOverride: formData.price,
      isAvailable: true,
    };
    const next = [...(formData.variants || []), newVariant];
    updateField("variants", next);
  };

  const handleUpdateVariant = (index: number, updates: Partial<ProductVariant>) => {
    const next = (formData.variants || []).map((v, i) => (i === index ? { ...v, ...updates } : v));
    updateField("variants", next);
    const totalStock = next.reduce((sum, v) => sum + v.stock, 0);
    updateField("stock", totalStock);
  };

  const handleDeleteVariant = (index: number) => {
    const next = (formData.variants || []).filter((_, i) => i !== index);
    updateField("variants", next);
    const totalStock = next.reduce((sum, v) => sum + v.stock, 0);
    updateField("stock", totalStock);
  };

  const handleDuplicateVariant = (index: number) => {
    const target = formData.variants?.[index];
    if (!target) return;
    const duplicated: ProductVariant = {
      ...target,
      id: `var-${Date.now()}`,
      sku: `${target.sku}-CP`,
    };
    const next = [...(formData.variants || []), duplicated];
    updateField("variants", next);
  };

  if (!isOpen) return null;

  return (
    <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white border-0 sm:border border-[rgba(17,17,17,0.10)] rounded-none sm:rounded-2xl w-full max-w-5xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden sm:my-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[rgba(17,17,17,0.10)] flex items-center justify-between bg-[#EAE8E1] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#111111] font-bold">
                {product ? "PRODUCT ATELIER EDITOR" : "CREATE NEW COMMERCE ITEM"}
              </span>
              {isDirty && (
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-[rgba(17,17,17,0.06)] text-[rgba(17,17,17,0.55)] border border-[rgba(17,17,17,0.12)]">
                  Unsaved Changes
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-[#111111] tracking-tight mt-0.5">
              {product ? `Editing: ${formData.name || product.name}` : "Add New Luxury Item to Catalog"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAttemptClose}
              className="p-2 text-[rgba(17,17,17,0.55)] hover:text-[#111111] rounded-lg hover:bg-[#EAE8E1] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-3 sm:px-6 border-b border-[rgba(17,17,17,0.10)] bg-[#F5F4F0] flex items-center gap-1 overflow-x-auto text-[11px] sm:text-xs font-mono uppercase tracking-wider no-scrollbar shrink-0">
          {[
            { id: "basic", label: "Basic Info" },
            { id: "category", label: "Category & Taxo" },
            { id: "pricing", label: "Pricing & Tax" },
            { id: "inventory", label: "Inventory" },
            { id: "media", label: `Media (${formData.images?.length || 0})` },
            { id: "variants", label: `Variants (${formData.variants?.length || 0})` },
            { id: "merchandising", label: "Merchandising" },
            { id: "seo", label: "SEO & URL" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#181818] text-[#111111] bg-[#EAE8E1]/40"
                  : "border-transparent text-[rgba(17,17,17,0.55)] hover:text-[#111111] hover:border-[rgba(17,17,17,0.15)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 text-xs" style={{ color: "#111111" }}>
          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === "basic" && (
            <div className="space-y-4 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Double-Faced Cashmere Overcoat"
                    className={`w-full px-3.5 py-2.5 bg-[#EAE8E1] border rounded-lg text-[#111111] focus:outline-none focus:border-[#181818] ${
                      errors.name ? "border-rose-500" : "border-[rgba(17,17,17,0.15)]"
                    }`}
                  />
                  {errors.name && <p className="text-[#b91c1c] text-[10px] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Master SKU *
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ""}
                    onChange={(e) => updateField("sku", e.target.value.toUpperCase())}
                    placeholder="e.g. PAB-COAT-01"
                    className={`w-full px-3.5 py-2.5 bg-[#EAE8E1] border rounded-lg text-[#111111] font-mono focus:outline-none focus:border-[#181818] ${
                      errors.sku ? "border-rose-500" : "border-[rgba(17,17,17,0.15)]"
                    }`}
                  />
                  {errors.sku && <p className="text-[#b91c1c] text-[10px] mt-1">{errors.sku}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Brand / Atelier
                  </label>
                  <input
                    type="text"
                    value={formData.brand || "PABLO"}
                    onChange={(e) => updateField("brand", e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Department / Gender *
                  </label>
                  <select
                    value={formData.gender || "men"}
                    onChange={(e) => updateField("gender", e.target.value as GenderId)}
                    className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] capitalize"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Product Classification
                  </label>
                  <input
                    type="text"
                    value={formData.productType || "Apparel"}
                    onChange={(e) => updateField("productType", e.target.value)}
                    placeholder="e.g. Outerwear, Knitwear"
                    className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                  URL Slug *
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-[#EAE8E1] border border-r-0 border-[rgba(17,17,17,0.15)] rounded-l-lg text-[rgba(17,17,17,0.45)] font-mono text-[11px]">
                    /product/
                  </span>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className={`w-full px-3 py-2 bg-[#EAE8E1] border rounded-r-lg text-[#111111] font-mono text-[11px] focus:outline-none focus:border-[#181818] ${
                      errors.slug ? "border-rose-500" : "border-[rgba(17,17,17,0.15)]"
                    }`}
                  />
                </div>
                {errors.slug && <p className="text-[#b91c1c] text-[10px] mt-1">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                  Short Summary (Editorial Excerpt)
                </label>
                <input
                  type="text"
                  value={formData.shortDescription || ""}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                  placeholder="A sculpted double-breasted overcoat tailored from bespoke 2-ply zibeline cashmere."
                  className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                  Comprehensive Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Detail the fabric provenance, manufacturing atelier, tactile drape, and styling notes..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] focus:outline-none focus:border-[#181818]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORY & TAXONOMY */}
          {activeTab === "category" && (
            <div className="space-y-4 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Primary Category *
                  </label>
                  <select
                    value={formData.category || "knitwear"}
                    onChange={(e) => updateField("category", e.target.value as CategoryId)}
                    className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name} ({c.gender})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Subcategory / Specific Silhouette
                  </label>
                  <input
                    type="text"
                    value={formData.subCategory || ""}
                    onChange={(e) => updateField("subCategory", e.target.value)}
                    placeholder="e.g. Crewnecks, Trench Coats, Loafers"
                    className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                  Curated Collections (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] rounded-lg">
                  {collections.map((col) => {
                    const isChecked = (formData.collections || []).includes(col.slug as CollectionId);
                    return (
                      <label key={col.id} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-[#EAE8E1] rounded">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = (formData.collections || []) as CollectionId[];
                            const updated = e.target.checked
                              ? [...current, col.slug as CollectionId]
                              : current.filter((c) => c !== col.slug);
                            updateField("collections", updated);
                          }}
                          className="rounded border-[rgba(17,17,17,0.15)] text-[#111111]"
                        />
                        <span className="text-[#111111] text-xs">{col.name}</span>
                        <span className="text-[10px] font-mono text-[rgba(17,17,17,0.45)]">({col.mode})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                  Search & Filter Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={(formData.tags || []).join(", ")}
                  onChange={(e) =>
                    updateField(
                      "tags",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="cashmere, tailored, minimalist, atelier"
                  className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Fabric & Material Composition
                  </label>
                  <input
                    type="text"
                    value={formData.material || ""}
                    onChange={(e) => updateField("material", e.target.value)}
                    placeholder="e.g. 100% Grade-A Mongolian Cashmere"
                    className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Fit & Silhouette Specification
                  </label>
                  <input
                    type="text"
                    value={formData.fit || ""}
                    onChange={(e) => updateField("fit", e.target.value)}
                    placeholder="e.g. Sculptural architectural fit"
                    className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRICING & TAX */}
          {activeTab === "pricing" && (
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Retail Price (INR ₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-[rgba(17,17,17,0.45)] font-mono font-bold">₹</span>
                    <input
                      type="number"
                      value={formData.price ?? ""}
                      onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
                      className={`w-full pl-8 pr-3.5 py-2.5 bg-[#EAE8E1] border rounded-lg text-[#111111] font-mono font-bold text-base focus:outline-none focus:border-[#181818] ${
                        errors.price ? "border-rose-500" : "border-[rgba(17,17,17,0.15)]"
                      }`}
                    />
                  </div>
                  {errors.price && <p className="text-[#b91c1c] text-[10px] mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Promotional / Sale Price (INR ₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-[rgba(17,17,17,0.45)] font-mono font-bold">₹</span>
                    <input
                      type="number"
                      value={formData.salePrice ?? ""}
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : undefined;
                        updateField("salePrice", val);
                        updateField("isSale", !!val && val < (formData.price || 0));
                      }}
                      placeholder="Leave blank for regular price"
                      className={`w-full pl-8 pr-3.5 py-2.5 bg-[#EAE8E1] border rounded-lg text-[#111111] font-mono font-bold text-base focus:outline-none focus:border-[#181818] ${
                        errors.salePrice ? "border-rose-500" : "border-[rgba(17,17,17,0.15)]"
                      }`}
                    />
                  </div>
                  {errors.salePrice && <p className="text-[#b91c1c] text-[10px] mt-1">{errors.salePrice}</p>}
                </div>
              </div>

              <div className="p-4 bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#111111]">GST / Tax Inclusive Configuration</div>
                  <div className="text-[11px] text-[rgba(17,17,17,0.55)]">
                    In luxury ecommerce, displayed consumer prices include luxury luxury GST (12%).
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-[#111111] border border-[rgba(17,17,17,0.12)] rounded text-[10px] font-mono font-bold uppercase">
                  GST 12% Included
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY */}
          {activeTab === "inventory" && (
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Current Total Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock ?? ""}
                    onChange={(e) => updateField("stock", parseInt(e.target.value, 10) || 0)}
                    className={`w-full px-3.5 py-2 bg-[#EAE8E1] border rounded-lg text-[#111111] font-mono font-bold text-base ${
                      errors.stock ? "border-rose-500" : "border-[rgba(17,17,17,0.15)]"
                    }`}
                  />
                  {errors.stock && <p className="text-[#b91c1c] text-[10px] mt-1">{errors.stock}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold ?? 5}
                    onChange={(e) => updateField("lowStockThreshold", parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono"
                  />
                  <p className="text-[10px] text-[rgba(17,17,17,0.45)] mt-1">Triggers alert when stock ≤ this number</p>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                    Reserved Stock
                  </label>
                  <input
                    type="number"
                    value={formData.reservedStock ?? 0}
                    onChange={(e) => updateField("reservedStock", parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono"
                  />
                  <p className="text-[10px] text-[rgba(17,17,17,0.45)] mt-1">Held for pending customer orders</p>
                </div>
              </div>

              <div className="p-4 bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#111111]">Item Availability Status</div>
                  <div className="text-[11px] text-[rgba(17,17,17,0.55)]">
                    Control whether this item is publicly buyable on the storefront.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("isAvailable", !formData.isAvailable)}
                  className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition-colors cursor-pointer ${
                    formData.isAvailable
                      ? "bg-[#181818] text-white border border-[#181818]"
                      : "bg-[rgba(185,28,28,0.08)] text-[#b91c1c] border border-[rgba(185,28,28,0.20)]"
                  }`}
                >
                  {formData.isAvailable ? "Available" : "Unavailable"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA */}
          {activeTab === "media" && (
            <div className="space-y-5">

              {/* Hidden native file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                aria-label="Upload product images"
                onChange={(e) => {
                  if (e.target.files) handleFileUpload(e.target.files);
                  e.target.value = "";
                }}
              />

              {/* ── Upload Zone ── */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload product images — click or drag and drop"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
                }}
                className="rounded-xl cursor-pointer transition-all select-none"
                style={{
                  backgroundColor: isDragOver ? "#FFFFFF" : "#EAE8E1",
                  border: `1.5px dashed ${isDragOver ? "#181818" : "rgba(17,17,17,0.20)"}`,
                  padding: "36px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* Upload icon */}
                <div style={{
                  width: 44, height: 44,
                  borderRadius: "50%",
                  backgroundColor: "rgba(17,17,17,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "#111111" }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#111111", lineHeight: 1.4 }}>
                    {isDragOver ? "Drop images to upload" : "Upload product images"}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(17,17,17,0.50)", marginTop: 4 }}>
                    {isDragOver ? "Release to add" : "Drag & drop or click to browse"}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(17,17,17,0.38)", marginTop: 6, fontFamily: "monospace", letterSpacing: "0.05em" }}>
                    JPG · PNG · WEBP · Max 10 MB per image
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#181818] text-white rounded-md text-xs font-mono font-medium hover:bg-black active:scale-95 transition-all shadow-sm"
                  >
                    <span>+ Upload Images</span>
                  </button>
                </div>
              </div>

              {/* Validation error */}
              {mediaError && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: "rgba(185,28,28,0.06)", border: "1px solid rgba(185,28,28,0.15)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span style={{ fontSize: 11, color: "#b91c1c" }}>{mediaError}</span>
                  <button type="button" onClick={() => setMediaError(null)} className="ml-auto"
                    style={{ color: "rgba(185,28,28,0.60)", fontSize: 14, lineHeight: 1, cursor: "pointer" }}>✕</button>
                </div>
              )}

              {/* Choose from Media Library */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ backgroundColor: "rgba(17,17,17,0.08)" }} />
                <button
                  type="button"
                  onClick={() => setMediaLibraryOpen((v) => !v)}
                  className="flex items-center gap-1.5 transition-colors cursor-pointer"
                  style={{ fontSize: 11, color: mediaLibraryOpen ? "#111111" : "rgba(17,17,17,0.50)", fontWeight: 500 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Choose from Media Library
                </button>
                <div className="flex-1 h-px" style={{ backgroundColor: "rgba(17,17,17,0.08)" }} />
              </div>

              {/* ── Inline Media Library Picker ── */}
              {mediaLibraryOpen && (
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(17,17,17,0.12)", backgroundColor: "#FFFFFF" }}>
                  <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(17,17,17,0.08)", backgroundColor: "#EAE8E1" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#111111", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace" }}>
                      Media Library
                    </span>
                    <button type="button" onClick={() => setMediaLibraryOpen(false)} style={{ color: "rgba(17,17,17,0.45)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>✕</button>
                  </div>
                  <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-2" style={{ maxHeight: 240, overflowY: "auto" }}>
                    {mediaAssets.length === 0 ? (
                      <div className="col-span-6 text-center py-6" style={{ color: "rgba(17,17,17,0.40)", fontSize: 12 }}>
                        No media assets found. Upload images to your Media Library first.
                      </div>
                    ) : (
                      mediaAssets.map((asset) => {
                        const isSelected = (formData.images || []).some((img) => img.url === asset.url);
                        return (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => handlePickFromLibrary(asset)}
                            disabled={isSelected}
                            className="relative rounded-lg overflow-hidden cursor-pointer transition-all"
                            style={{
                              aspectRatio: "1/1",
                              border: isSelected ? "2px solid #181818" : "1px solid rgba(17,17,17,0.10)",
                              opacity: isSelected ? 0.5 : 1,
                            }}
                            title={isSelected ? "Already added" : asset.filename}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={asset.url}
                              alt=""
                              role="presentation"
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* ── Media Gallery ── */}
              {(formData.images || []).length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(17,17,17,0.50)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace" }}>
                      Product Gallery ({(formData.images || []).length})
                    </span>
                    <span style={{ fontSize: 10, color: "rgba(17,17,17,0.38)" }}>
                      First image is shown in the catalogue
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(formData.images || []).map((img, idx) => {
                      const isHover = formData.hoverImage === img.url;
                      const isEditingAlt = editingAltIdx === idx;
                      return (
                        <div
                          key={img.id || idx}
                          className="flex flex-col rounded-xl overflow-hidden"
                          style={{ backgroundColor: "#FFFFFF", border: `1px solid ${img.isPrimary ? "rgba(17,17,17,0.25)" : "rgba(17,17,17,0.10)"}` }}
                        >
                          {/* Image area */}
                          <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", backgroundColor: "#EAE8E1" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt=""
                              role="presentation"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
                                if (fb) fb.style.display = "flex";
                              }}
                            />
                            {/* Fallback */}
                            <div
                              className="absolute inset-0 items-center justify-center flex-col gap-1"
                              style={{ display: "none", backgroundColor: "#EAE8E1" }}
                              aria-hidden="true"
                            >
                              <span style={{ fontSize: 10, fontFamily: "serif", letterSpacing: "0.2em", color: "rgba(17,17,17,0.25)" }}>PABLO</span>
                              <span style={{ fontSize: 9, color: "rgba(17,17,17,0.30)" }}>Unavailable</span>
                            </div>

                            {/* Overlay badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {img.isPrimary && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase"
                                  style={{ backgroundColor: "#181818", color: "#FFFFFF" }}>
                                  Primary
                                </span>
                              )}
                              {isHover && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase"
                                  style={{ backgroundColor: "rgba(17,17,17,0.55)", color: "#FFFFFF" }}>
                                  Hover
                                </span>
                              )}
                            </div>

                            {/* Order indicator */}
                            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono"
                              style={{ backgroundColor: "rgba(0,0,0,0.45)", color: "#FFFFFF" }}>
                              #{idx + 1}
                            </span>
                          </div>

                          {/* Card body */}
                          <div className="p-2 space-y-2 flex-1">
                            {/* Alt text */}
                            {isEditingAlt ? (
                              <input
                                autoFocus
                                type="text"
                                value={img.alt}
                                placeholder="Alt text (optional)"
                                onChange={(e) => {
                                  const next = (formData.images || []).map((m, i) =>
                                    i === idx ? { ...m, alt: e.target.value } : m
                                  );
                                  updateField("images", next);
                                }}
                                onBlur={() => setEditingAltIdx(null)}
                                onKeyDown={(e) => { if (e.key === "Enter") setEditingAltIdx(null); }}
                                className="w-full text-[10px] px-2 py-1 rounded"
                                style={{
                                  border: "1px solid rgba(17,17,17,0.15)",
                                  backgroundColor: "#FFFFFF",
                                  color: "#111111",
                                  fontSize: 10,
                                  outline: "none",
                                }}
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => setEditingAltIdx(idx)}
                                className="w-full text-left truncate rounded px-1.5 py-1 transition-colors cursor-pointer"
                                style={{
                                  fontSize: 10,
                                  color: img.alt ? "#111111" : "rgba(17,17,17,0.35)",
                                  backgroundColor: "transparent",
                                }}
                                title="Click to edit alt text"
                              >
                                {img.alt || "Add alt text…"}
                              </button>
                            )}

                            {/* Action row */}
                            <div style={{ borderTop: "1px solid rgba(17,17,17,0.08)", paddingTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                              {!img.isPrimary && (
                                <button type="button" onClick={() => handleSetPrimary(idx)}
                                  className="transition-colors cursor-pointer hover:text-[#111111]"
                                  style={{ fontSize: 9, color: "rgba(17,17,17,0.55)", fontFamily: "monospace" }}>
                                  Set Primary
                                </button>
                              )}
                              {!isHover && (
                                <button type="button" onClick={() => handleSetHover(idx)}
                                  className="transition-colors cursor-pointer hover:text-[#111111]"
                                  style={{ fontSize: 9, color: "rgba(17,17,17,0.55)", fontFamily: "monospace" }}>
                                  Set Hover
                                </button>
                              )}
                              <button type="button" onClick={() => handleRemoveImage(idx)}
                                className="cursor-pointer transition-colors"
                                style={{ fontSize: 9, color: "#b91c1c", marginLeft: "auto", fontFamily: "monospace" }}>
                                Remove
                              </button>
                            </div>

                            {/* Reorder */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveImage(idx, "up")}
                                className="cursor-pointer disabled:opacity-20"
                                style={{ fontSize: 11, color: "rgba(17,17,17,0.45)", lineHeight: 1 }}
                                title="Move left"
                              >
                                ◀
                              </button>
                              <button
                                type="button"
                                disabled={idx === (formData.images || []).length - 1}
                                onClick={() => handleMoveImage(idx, "down")}
                                className="cursor-pointer disabled:opacity-20"
                                style={{ fontSize: 11, color: "rgba(17,17,17,0.45)", lineHeight: 1 }}
                                title="Move right"
                              >
                                ▶
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {(formData.images || []).length === 0 && !mediaLibraryOpen && (
                <div className="text-center py-6" style={{ color: "rgba(17,17,17,0.35)", fontSize: 12 }}>
                  No images added yet. Upload from your device or choose from the Media Library.
                </div>
              )}
            </div>
          )}


          {/* TAB 6: VARIANTS BUILDER */}
          {activeTab === "variants" && (
            <div className="space-y-6">
              {/* Matrix Generator */}
              <div className="p-4 bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-[#111111] font-bold">
                    Variant Combinations Matrix Builder
                  </span>
                  <button
                    type="button"
                    onClick={handleBulkGenerateVariants}
                    className="px-4 py-1.5 bg-[#181818] hover:bg-[#111111] text-white text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    Generate Matrix Combinations
                  </button>
                </div>

                {/* Color Selection */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-[rgba(17,17,17,0.55)] block mb-2 font-semibold">
                    1. Select Palette Colors
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {PRESET_COLORS.map((c) => {
                      const selected = selectedGeneratorColors.includes(c.name);
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            setSelectedGeneratorColors((prev) =>
                              prev.includes(c.name) ? prev.filter((n) => n !== c.name) : [...prev, c.name]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                            selected
                              ? "bg-[#EAE8E1] border-[#181818] text-[#111111]"
                              : "bg-[#F5F4F0] border-[rgba(17,17,17,0.10)] text-[rgba(17,17,17,0.55)]"
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-[rgba(17,17,17,0.55)] block mb-2 font-semibold">
                    2. Select Tailoring Sizes
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {AVAILABLE_SIZES.map((sz) => {
                      const selected = selectedGeneratorSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            setSelectedGeneratorSizes((prev) =>
                              prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
                            );
                          }}
                          className={`px-3 py-1 rounded font-mono text-xs cursor-pointer ${
                            selected
                              ? "bg-[#181818] text-white font-bold"
                              : "bg-[#EAE8E1] text-[rgba(17,17,17,0.65)] hover:text-[#111111]"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Variants Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] font-semibold">
                    Active Product Variants ({formData.variants?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSingleVariant}
                    className="px-3 py-1 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded text-xs font-mono cursor-pointer"
                  >
                    + Add Single Variant
                  </button>
                </div>

                <div className="border border-[rgba(17,17,17,0.10)] rounded-xl overflow-hidden bg-[#F5F4F0]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#EAE8E1] border-b border-[rgba(17,17,17,0.10)] text-[10px] font-mono uppercase text-[rgba(17,17,17,0.45)]">
                        <th className="py-2.5 px-3">Variant SKU</th>
                        <th className="py-2.5 px-3">Color</th>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Stock</th>
                        <th className="py-2.5 px-3">Price (₹)</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(17,17,17,0.08)]">
                      {(formData.variants || []).map((v, idx) => (
                        <tr key={v.id || idx} className="hover:bg-[#EAE8E1]/40">
                          <td className="py-2 px-3 font-mono text-[#111111]">{v.sku}</td>
                          <td className="py-2 px-3 text-[#111111] font-medium">{v.colorName}</td>
                          <td className="py-2 px-3 font-mono text-[rgba(17,17,17,0.65)]">{v.sizeName}</td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={v.stock}
                              onChange={(e) => handleUpdateVariant(idx, { stock: parseInt(e.target.value, 10) || 0 })}
                              className="w-16 px-2 py-1 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-[#111111] font-mono text-xs"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={v.priceOverride ?? formData.price ?? 0}
                              onChange={(e) => handleUpdateVariant(idx, { priceOverride: parseFloat(e.target.value) || 0 })}
                              className="w-24 px-2 py-1 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded text-[#111111] font-mono text-xs"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <button
                              type="button"
                              onClick={() => handleUpdateVariant(idx, { isAvailable: !v.isAvailable })}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                                v.isAvailable ? "bg-emerald-500/20 text-[rgba(17,17,17,0.65)]" : "bg-[rgba(185,28,28,0.08)] text-[#991b1b]"
                              }`}
                            >
                              {v.isAvailable ? "Active" : "Hidden"}
                            </button>
                          </td>
                          <td className="py-2 px-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleDuplicateVariant(idx)}
                              className="p-1 text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
                              title="Duplicate variant"
                            >
                              Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVariant(idx)}
                              className="p-1 text-[#b91c1c] hover:text-[#991b1b]"
                              title="Delete variant"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MERCHANDISING */}
          {activeTab === "merchandising" && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                  Publishing Lifecycle Status *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "active", label: "Active", desc: "Live on customer storefront" },
                    { id: "draft", label: "Draft", desc: "Hidden from customer storefront" },
                    { id: "archived", label: "Archived", desc: "Stored in atelier archive" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        updateField("status", s.id as "active" | "draft" | "archived");
                        updateField("isAvailable", s.id === "active");
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                        formData.status === s.id
                          ? "bg-[#EAE8E1] border-[#181818]"
                          : "bg-[#F5F4F0] border-[rgba(17,17,17,0.10)] text-[rgba(17,17,17,0.55)]"
                      }`}
                    >
                      <div className="font-semibold uppercase text-xs" style={{ color: "#111111" }}>{s.label}</div>
                      <div className="text-[10px] text-[rgba(17,17,17,0.45)] mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] rounded-xl space-y-3">
                <span className="text-[11px] font-mono uppercase text-[#111111] font-bold">
                  Merchandising Flags & Badges
                </span>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2 rounded hover:bg-[#EAE8E1] cursor-pointer">
                    <div>
                      <div className="text-[#111111] font-medium">New Arrival Badge</div>
                      <div className="text-[10px] text-[rgba(17,17,17,0.45)]">Displays in the &ldquo;New In&rdquo; curated capsules</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!formData.isNewArrival}
                      onChange={(e) => updateField("isNewArrival", e.target.checked)}
                      className="rounded border-[rgba(17,17,17,0.15)] text-[#111111]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded hover:bg-[#EAE8E1] cursor-pointer">
                    <div>
                      <div className="text-[#111111] font-medium">Bestseller Recognition</div>
                      <div className="text-[10px] text-[rgba(17,17,17,0.45)]">Prioritized in recommendation engines and best seller grids</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!formData.isBestSeller}
                      onChange={(e) => updateField("isBestSeller", e.target.checked)}
                      className="rounded border-[rgba(17,17,17,0.15)] text-[#111111]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded hover:bg-[#EAE8E1] cursor-pointer">
                    <div>
                      <div className="text-[#111111] font-medium">Limited Edition Run</div>
                      <div className="text-[10px] text-[rgba(17,17,17,0.45)]">Displays exclusivity badge on product detail pages</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!formData.isLimitedEdition}
                      onChange={(e) => updateField("isLimitedEdition", e.target.checked)}
                      className="rounded border-[rgba(17,17,17,0.15)] text-[#111111]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded hover:bg-[#EAE8E1] cursor-pointer">
                    <div>
                      <div className="text-[#111111] font-medium">Sale Campaign Active</div>
                      <div className="text-[10px] text-[rgba(17,17,17,0.45)]">Shows discount percentage and strikethrough price</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!formData.isSale}
                      onChange={(e) => updateField("isSale", e.target.checked)}
                      className="rounded border-[rgba(17,17,17,0.15)] text-[#111111]"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SEO & URL */}
          {activeTab === "seo" && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                  Meta Page Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle || ""}
                  onChange={(e) => updateField("seoTitle", e.target.value)}
                  placeholder={`${formData.name || "Product"} | PABLO Atelier`}
                  className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                />
                <p className="text-[10px] text-[rgba(17,17,17,0.45)] mt-1">Recommended length: 50-60 characters</p>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[rgba(17,17,17,0.55)] mb-1 font-semibold">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={formData.seoDescription || ""}
                  onChange={(e) => updateField("seoDescription", e.target.value)}
                  placeholder="Luxury cashmere overcoat crafted with bespoke Italian tailoring. Order online with white-glove delivery."
                  className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                />
                <p className="text-[10px] text-[rgba(17,17,17,0.45)] mt-1">Recommended length: 140-160 characters</p>
              </div>

              <div className="p-4 bg-[#EAE8E1] border border-[rgba(17,17,17,0.10)] rounded-xl">
                <span className="text-[10px] font-mono uppercase text-[#111111] block mb-2 font-bold">
                  Google Search Snippet Preview
                </span>
                <div className="text-[rgba(17,17,17,0.65)] text-sm font-medium hover:underline cursor-pointer truncate">
                  {formData.seoTitle || `${formData.name || "Product Name"} | PABLO Atelier`}
                </div>
                <div className="text-[#111111] text-[11px] font-mono">
                  https://pablo-luxury.com/product/{formData.slug || "product-slug"}
                </div>
                <div className="text-[rgba(17,17,17,0.55)] text-xs mt-1 line-clamp-2">
                  {formData.seoDescription || formData.description || "Distinctive luxury fashion from PABLO."}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[rgba(17,17,17,0.10)] bg-[#EAE8E1] flex items-center justify-between">
          <button
            type="button"
            onClick={handleAttemptClose}
            className="px-4 py-2 bg-[#EAE8E1] hover:bg-[#111111] text-[rgba(17,17,17,0.65)] hover:text-[#111111] rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-[#181818] hover:bg-[#111111] disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs rounded-lg shadow-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              {isSaving && (
                <svg className="w-3.5 h-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              )}
              <span>{isSaving ? "Persisting Media & Saving..." : (product ? "Save & Publish Changes" : "Create Product")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      {showUnsavedPrompt && (
        <div className="pablo-admin-modal fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[rgba(17,17,17,0.10)] rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-semibold text-[#111111]">You have unsaved changes</h3>
            <p className="text-xs text-[rgba(17,17,17,0.55)]">
              Leaving now will discard any unsaved adjustments made to this product. Are you sure?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUnsavedPrompt(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white text-xs font-mono cursor-pointer"
              >
                Continue Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUnsavedPrompt(false);
                  setIsDirty(false);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-[#b91c1c] text-white text-xs font-mono font-bold cursor-pointer"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
