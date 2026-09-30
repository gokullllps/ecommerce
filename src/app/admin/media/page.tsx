"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { MediaAsset } from "@/types/admin";

export default function AdminMediaPage() {
  const { mediaAssets, addMediaAsset, updateMediaAsset, deleteMediaAsset } = useAdminData();
  const { hasPermission } = useAdminAuth();

  // Search & Filter State
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Selected Asset for Details Drawer
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Edit Metadata State
  const [editTagsInput, setEditTagsInput] = useState("");

  // Upload/Register Asset Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    filename: "",
    url: "",
    folder: "products" as MediaAsset["folder"],
    tags: "lookbook, editorial",
    width: 2400,
    height: 3200,
    mimeType: "image/jpeg",
    sizeBytes: 1240000,
  });

  // Delete Dialog State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const canManageMedia = hasPermission("media.manage");

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return mediaAssets.filter((m) => {
      if (folderFilter !== "all" && m.folder !== folderFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = m.filename.toLowerCase().includes(q);
        const matchTags = m.tags.some((t) => t.toLowerCase().includes(q));
        return matchName || matchTags;
      }
      return true;
    });
  }, [mediaAssets, folderFilter, searchTerm]);

  const handleOpenDrawer = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setEditTagsInput(asset.tags.join(", "));
  };

  const handleCopyUrl = (url: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleSaveTags = () => {
    if (!selectedAsset) return;
    const splitTags = editTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updated: MediaAsset = {
      ...selectedAsset,
      tags: splitTags,
    };
    updateMediaAsset(updated);
    setSelectedAsset(updated);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.filename.trim() || !uploadForm.url.trim()) return;

    const newAsset: MediaAsset = {
      id: `med_${Date.now()}`,
      filename: uploadForm.filename.trim(),
      url: uploadForm.url.trim(),
      folder: uploadForm.folder,
      mimeType: uploadForm.mimeType,
      sizeBytes: uploadForm.sizeBytes,
      tags: uploadForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      dimensions: {
        width: uploadForm.width,
        height: uploadForm.height,
      },
      uploadedAt: new Date().toISOString(),
    };

    addMediaAsset(newAsset);
    setIsUploadModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    deleteMediaAsset(deleteConfirmId);
    if (selectedAsset && selectedAsset.id === deleteConfirmId) {
      setSelectedAsset(null);
    }
    setDeleteConfirmId(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(1) + " MB";
    }
    return Math.round(bytes / 1024) + " KB";
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Media Library</span>
          </div>
          <h1 className="a-page-title">
            ATELIER DIGITAL ASSET REPOSITORY
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Centralized digital asset management for product photography, lookbooks, campaign assets, and theme decorations.
          </p>
        </div>

        {canManageMedia && (
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-[#181818] hover:bg-[#111111] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Register Asset
          </button>
        )}
      </div>

      {/* Search & Folder Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Search assets by filename or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] placeholder-[rgba(17,17,17,0.40)] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div>
            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              aria-label="Filter assets by atelier folder"
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
            >
              <option value="all">Folder: All Assets ({mediaAssets.length})</option>
              <option value="products">Folder: Products</option>
              <option value="heroes">Folder: Heroes & Banners</option>
              <option value="campaigns">Folder: Campaigns</option>
              <option value="themes">Folder: Themes</option>
              <option value="general">Folder: General Brand</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full py-16 text-center text-[rgba(17,17,17,0.55)] bg-white rounded-xl border border-[rgba(17,17,17,0.10)]">
            No media assets found in this folder or search query.
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => handleOpenDrawer(asset)}
              className="group p-3 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] hover:border-[#3B82F6] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="w-full aspect-square bg-[#EAE8E1] rounded-lg relative overflow-hidden mb-2.5 border border-[rgba(17,17,17,0.15)]/60">
                {asset.url.endsWith(".mp4") ? (
                  <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#111111]">
                    VIDEO MP4
                  </div>
                ) : (
                  <Image
                    src={asset.url}
                    alt={asset.filename}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-mono text-white uppercase">
                  {asset.folder}
                </span>
              </div>

              <div>
                <div className="font-semibold text-[#111111] text-xs truncate" title={asset.filename}>
                  {asset.filename}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[rgba(17,17,17,0.45)] font-mono mt-1">
                  <span>{formatFileSize(asset.sizeBytes)}</span>
                  {asset.dimensions && (
                    <span>{asset.dimensions.width}&times;{asset.dimensions.height}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ASSET DETAIL DRAWER */}
      {selectedAsset && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white border border-[rgba(17,17,17,0.15)] rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[rgba(17,17,17,0.10)] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#111111] uppercase">
                  Asset Details · {selectedAsset.id}
                </span>
                <h3 className="text-base font-semibold text-[#111111] truncate max-w-sm">
                  {selectedAsset.filename}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="w-7 h-7 rounded-full bg-[rgba(17,17,17,0.08)] text-[#111111] flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            {/* Asset Preview */}
            <div className="w-full h-64 bg-[#EAE8E1] rounded-xl relative overflow-hidden border border-[rgba(17,17,17,0.15)] flex items-center justify-center">
              <Image
                src={selectedAsset.url}
                alt={selectedAsset.filename}
                fill
                className="object-contain"
              />
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)]">
                <span className="text-[rgba(17,17,17,0.45)] block text-[10px]">Folder Classification</span>
                <span className="font-mono uppercase" style={{ color: "#111111" }}>{selectedAsset.folder}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)]">
                <span className="text-[rgba(17,17,17,0.45)] block text-[10px]">Dimensions</span>
                <span className="font-mono" style={{ color: "#111111" }}>
                  {selectedAsset.dimensions
                    ? `${selectedAsset.dimensions.width} × ${selectedAsset.dimensions.height} px`
                    : "Variable"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)]">
                <span className="text-[rgba(17,17,17,0.45)] block text-[10px]">File Size & Format</span>
                <span className="font-mono" style={{ color: "#111111" }}>
                  {formatFileSize(selectedAsset.sizeBytes)} ({selectedAsset.mimeType})
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)]">
                <span className="text-[rgba(17,17,17,0.45)] block text-[10px]">Registered On</span>
                <span className="font-mono" style={{ color: "#111111" }}>
                  {new Date(selectedAsset.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Reference URL */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)]">Asset Path Reference</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedAsset.url}
                  className="w-full px-3 py-2 bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] font-mono select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopyUrl(selectedAsset.url)}
                  className="px-3.5 py-2 bg-[#EAE8E1] hover:bg-[#181818] hover:text-white text-[#111111] rounded-lg text-xs font-semibold shrink-0"
                >
                  {copiedUrl ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Tags Edit */}
            {canManageMedia && (
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)]">Metadata Tags</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTagsInput}
                    onChange={(e) => setEditTagsInput(e.target.value)}
                    placeholder="comma, separated, tags"
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveTags}
                    className="px-4 py-2 bg-[#181818] hover:bg-[#111111] text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-[rgba(17,17,17,0.10)] flex items-center justify-between">
              {canManageMedia && (
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(selectedAsset.id)}
                  className="px-3 py-1.5 text-[#b91c1c] hover:text-[#991b1b] text-xs font-medium"
                >
                  Delete Asset
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded-lg text-xs font-semibold ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER ASSET MODAL */}
      {isUploadModalOpen && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[rgba(17,17,17,0.15)] rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-[#111111]">Register Atelier Media Asset</h3>
            <p className="text-xs text-[rgba(17,17,17,0.55)]">
              Registers digital photography metadata in <code>media.json</code>. Storage adapters can connect to Cloudflare R2 / AWS S3 in production.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Filename *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. aw26-cashmere-overcoat-noir.jpg"
                  value={uploadForm.filename}
                  onChange={(e) => setUploadForm({ ...uploadForm, filename: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Public URI *</label>
                <input
                  type="text"
                  required
                  placeholder="/images/categories/outerwear.png"
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Folder</label>
                  <select
                    value={uploadForm.folder}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        folder: e.target.value as MediaAsset["folder"],
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  >
                    <option value="products">Products</option>
                    <option value="heroes">Heroes</option>
                    <option value="campaigns">Campaigns</option>
                    <option value="themes">Themes</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">MIME Type</label>
                  <input
                    type="text"
                    value={uploadForm.mimeType}
                    onChange={(e) => setUploadForm({ ...uploadForm, mimeType: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={uploadForm.width}
                    onChange={(e) => setUploadForm({ ...uploadForm, width: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={uploadForm.height}
                    onChange={(e) => setUploadForm({ ...uploadForm, height: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="outerwear, wool, lookbook"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(17,17,17,0.10)]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#EAE8E1] text-xs text-[#111111]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#181818] hover:bg-[#111111] text-xs font-semibold text-white shadow-md"
                >
                  Register Asset
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
            <h3 className="text-base font-semibold text-[#b91c1c]">Delete Media Asset</h3>
            <p className="text-xs text-[rgba(17,17,17,0.65)]">
              Are you sure you want to remove this media asset metadata? Products referencing this URL will continue to display it unless re-assigned.
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
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
