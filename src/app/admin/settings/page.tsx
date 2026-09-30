"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { StoreSettings } from "@/types/admin";

export default function AdminSettingsPage() {
  const { settings, themes, updateStoreSettings, resetToDefaults } = useAdminData();
  const { hasPermission } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<"general" | "commerce" | "platform" | "seo">("general");

  // Form State
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const canManageSettings = hasPermission("settings.manage");

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field: keyof StoreSettings, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setIsResetting(true);
    resetToDefaults();
    setTimeout(() => setIsResetting(false), 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Settings</span>
          </div>
          <h1 className="a-page-title">
            COMMERCE & PLATFORM SETTINGS
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Configure global store parameters, currency, tax rates, white-glove shipping tiers, and maintenance mode.
          </p>
        </div>

        {isSaved && (
          <div className="px-3.5 py-1.5 rounded-lg bg-[rgba(17,17,17,0.06)] border border-[rgba(17,17,17,0.12)] text-[#111111] text-xs font-semibold flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Saved to storefront.json
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[rgba(17,17,17,0.10)] pb-1 text-xs">
        {[
          { id: "general", label: "General & Brand Identity" },
          { id: "commerce", label: "Fiscal, Taxes & Shipping" },
          { id: "platform", label: "Platform & Maintenance" },
          { id: "seo", label: "Global SEO & Meta" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-[#181818] text-[#111111]"
                : "border-transparent text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: GENERAL */}
        {activeTab === "general" && (
          <div className="p-6 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">Store Identity & Concierge</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => handleChange("storeName", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Concierge Email *</label>
                <input
                  type="email"
                  required
                  value={formData.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Settlement Currency</label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={(e) => handleChange("currencySymbol", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Primary Jurisdiction / Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMMERCE & TAXES */}
        {activeTab === "commerce" && (
          <div className="p-6 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">Fiscal & Shipping Rules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Goods & Services Tax (%)</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={formData.taxRate}
                  onChange={(e) => handleChange("taxRate", Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                  Complimentary Shipping Threshold (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.freeShippingThreshold}
                  onChange={(e) => handleChange("freeShippingThreshold", Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                  Standard White Glove Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.standardShippingFee}
                  onChange={(e) => handleChange("standardShippingFee", Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLATFORM & MAINTENANCE */}
        {activeTab === "platform" && (
          <div className="p-6 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">Storefront Operational State</h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                  Default Fallback Theme
                </label>
                <select
                  value={formData.defaultThemeId}
                  onChange={(e) => handleChange("defaultThemeId", e.target.value)}
                  className="w-full max-w-md px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                >
                  {themes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#111111]">Private Maintenance Salon Mode</div>
                  <div className="text-[rgba(17,17,17,0.55)] text-[11px] mt-0.5">
                    When active, customer storefront exhibits a curated invitation-only landing veil while admin CMS stays fully operational.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                  className="w-5 h-5 rounded bg-white border-[rgba(17,17,17,0.15)] text-[#111111]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SEO */}
        {activeTab === "seo" && (
          <div className="p-6 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">Search Engine Architecture</h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                  Default Platform Page Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => handleChange("seoTitle", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                  Default Global Meta Description
                </label>
                <textarea
                  rows={3}
                  value={formData.seoDescription}
                  onChange={(e) => handleChange("seoDescription", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-[#111111]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(17,17,17,0.10)]">
          <button
            type="button"
            onClick={handleReset}
            disabled={isResetting}
            className="px-4 py-2 bg-[#EAE8E1] hover:bg-[#111111] text-[rgba(17,17,17,0.55)] hover:text-[#111111] rounded-lg text-xs font-semibold transition-colors"
          >
            {isResetting ? "Reloading..." : "Reload from Canonical JSON"}
          </button>

          {canManageSettings && (
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#181818] hover:bg-[#111111] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
            >
              Persist Settings
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
