"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminThemeConfig } from "@/types/admin";

export default function AdminThemesPage() {
  const {
    themes,
    activeTheme,
    activateTheme,
    deactivateTheme,
    createTheme,
    updateTheme,
    duplicateTheme,
    deleteTheme,
  } = useAdminData();
  const { hasPermission } = useAdminAuth();

  // Filter State
  const [filterType, setFilterType] = useState<string>("all");
  const [filterScope, setFilterScope] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<AdminThemeConfig | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [themeForm, setThemeForm] = useState<Partial<AdminThemeConfig>>({
    name: "",
    description: "",
    type: "seasonal",
    scope: "all",
    priority: 10,
    status: "draft",
    timezone: "Asia/Kolkata",
    tokens: {
      primaryBg: "#EAE8E1",
      primaryText: "#111111",
      darkSurface: "#181818",
      accent: "#D4AF37",
      borderColor: "#D9D8D3",
    },
    ticker: {
      enabled: false,
      text: "COMPLIMENTARY WHITE-GLOVE ATELIER DELIVERY ACROSS INDIA",
      speed: 30,
    },
    decorations: {
      style: "none",
      density: "low",
    },
  });

  const canManageThemes = hasPermission("themes.manage");

  // Filtered Themes
  const filteredThemes = useMemo(() => {
    return themes.filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterScope !== "all" && t.scope !== filterScope) return false;
      return true;
    });
  }, [themes, filterType, filterScope]);

  const handleOpenCreateModal = () => {
    setEditingTheme(null);
    setThemeForm({
      id: `theme_${Date.now()}`,
      name: "",
      description: "",
      type: "seasonal",
      scope: "all",
      priority: 10,
      status: "draft",
      timezone: "Asia/Kolkata",
      tokens: {
        primaryBg: "#EAE8E1",
        primaryText: "#111111",
        darkSurface: "#181818",
        accent: "#D4AF37",
        borderColor: "#D9D8D3",
      },
      navbar: {
        bannerMessage: "",
        bannerBg: "#111111",
        bannerTextColor: "#FFFFFF",
      },
      hero: {
        headline: "",
        tagline: "",
      },
      ticker: {
        enabled: false,
        text: "PABLO ATELIER PRIVATE CURATION",
        speed: 30,
      },
      decorations: {
        style: "none",
        density: "low",
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: AdminThemeConfig) => {
    setEditingTheme(t);
    setThemeForm({
      ...t,
      tokens: { ...t.tokens },
      navbar: { ...(t.navbar || {}) },
      hero: { ...(t.hero || {}) },
      ticker: { ...(t.ticker || { enabled: false, text: "", speed: 30 }) },
      decorations: { ...(t.decorations || { style: "none", density: "low" }) },
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeForm.name?.trim()) return;

    if (editingTheme) {
      const updated: AdminThemeConfig = {
        ...editingTheme,
        ...themeForm,
        name: themeForm.name.trim(),
        description: themeForm.description?.trim() || "",
        priority: Number(themeForm.priority || 10),
        tokens: themeForm.tokens!,
        updatedAt: new Date().toISOString(),
      } as AdminThemeConfig;

      updateTheme(updated);
    } else {
      const now = new Date().toISOString();
      const created: AdminThemeConfig = {
        id: `theme_${Date.now()}`,
        name: themeForm.name.trim(),
        description: themeForm.description?.trim() || "",
        type: themeForm.type || "custom",
        scope: themeForm.scope || "all",
        priority: Number(themeForm.priority || 10),
        status: themeForm.status || "draft",
        timezone: "Asia/Kolkata",
        startAt: themeForm.startAt || undefined,
        endAt: themeForm.endAt || undefined,
        tokens: themeForm.tokens!,
        navbar: themeForm.navbar,
        hero: themeForm.hero,
        ticker: themeForm.ticker,
        decorations: themeForm.decorations,
        createdAt: now,
        updatedAt: now,
      };

      createTheme(created);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    deleteTheme(deleteConfirmId);
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
            <span className="text-[#111111]">Themes</span>
          </div>
          <h1 className="a-page-title">
            THEME & VISUAL IDENTITY MANAGEMENT
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Configure seasonal, festival, and campaign themes. All customer storefronts consume this centralized resolver.
          </p>
        </div>

        {canManageThemes && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-[#181818] hover:bg-[#111111] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create New Theme
          </button>
        )}
      </div>

      {/* Active Theme Spotlight Banner */}
      <div className="p-6 rounded-xl bg-white border-2 border-[rgba(17,17,17,0.25)] relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#181818] text-white border border-[#181818] text-[10px] font-bold tracking-wider uppercase">
                Currently Live on Storefront
              </span>
              <span className="text-xs text-[rgba(17,17,17,0.55)] font-mono">
                Scope: {activeTheme.scope.toUpperCase()} · Priority: {activeTheme.priority}
              </span>
            </div>
            <h2 className="text-2xl font-semibold font-serif text-[#111111] tracking-tight">{activeTheme.name}</h2>
            <p className="text-xs text-[rgba(17,17,17,0.65)] max-w-xl leading-relaxed">{activeTheme.description}</p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            {/* Color token swatches */}
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)]">
              <span
                className="w-5 h-5 rounded-full border border-white/20"
                style={{ backgroundColor: activeTheme.tokens.primaryBg }}
                title="Primary Background"
              />
              <span
                className="w-5 h-5 rounded-full border border-white/20"
                style={{ backgroundColor: activeTheme.tokens.darkSurface }}
                title="Dark Surface"
              />
              <span
                className="w-5 h-5 rounded-full border border-white/20"
                style={{ backgroundColor: activeTheme.tokens.accent }}
                title="Accent Accent"
              />
            </div>

            {canManageThemes && (
              <button
                type="button"
                onClick={() => handleOpenEditModal(activeTheme)}
                className="px-4 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded-lg text-xs font-semibold"
              >
                Configure Theme
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filter by theme type"
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
            >
              <option value="all">Theme Type: All</option>
              <option value="festival">Festival Themes</option>
              <option value="seasonal">Seasonal Themes</option>
              <option value="campaign">Campaign Themes</option>
              <option value="sale">Sale Themes</option>
              <option value="custom">Custom Themes</option>
            </select>
          </div>

          <div>
            <select
              value={filterScope}
              onChange={(e) => setFilterScope(e.target.value)}
              aria-label="Filter by theme scope"
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
            >
              <option value="all">Scope: Entire Store & All</option>
              <option value="men">Men Only</option>
              <option value="women">Women Only</option>
              <option value="kids">Kids Only</option>
              <option value="footwear">Footwear Only</option>
              <option value="accessories">Accessories Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Themes Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredThemes.map((theme) => {
          const isLive = theme.id === activeTheme.id;

          return (
            <div
              key={theme.id}
              className={`p-5 rounded-xl bg-white border flex flex-col justify-between transition-all ${
                isLive
                  ? "border-[rgba(17,17,17,0.25)] shadow-md shadow-none"
                  : "border-[rgba(17,17,17,0.10)] hover:border-[rgba(17,17,17,0.15)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] text-[#111111] uppercase font-bold">
                    {theme.type} · {theme.scope}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isLive
                        ? "bg-[rgba(17,17,17,0.06)] text-[#111111] border border-[rgba(17,17,17,0.12)]"
                        : theme.status === "scheduled"
                        ? "bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.65)] border border-[rgba(17,17,17,0.12)]"
                        : "bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.55)] border border-[rgba(17,17,17,0.10)]"
                    }`}
                  >
                    {isLive ? "Live" : theme.status}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#111111] mb-1">{theme.name}</h3>
                <p className="text-xs text-[rgba(17,17,17,0.55)] mb-3 leading-relaxed">{theme.description}</p>

                {/* Color Palette Preview */}
                <div className="p-3 rounded-lg bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)] mb-3 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)]">Visual Tokens</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-white/20"
                      style={{ backgroundColor: theme.tokens.primaryBg }}
                      title={`Primary BG: ${theme.tokens.primaryBg}`}
                    />
                    <div
                      className="w-6 h-6 rounded border border-white/20"
                      style={{ backgroundColor: theme.tokens.darkSurface }}
                      title={`Dark Surface: ${theme.tokens.darkSurface}`}
                    />
                    <div
                      className="w-6 h-6 rounded border border-white/20"
                      style={{ backgroundColor: theme.tokens.accent }}
                      title={`Accent: ${theme.tokens.accent}`}
                    />
                    <div
                      className="w-6 h-6 rounded border border-white/20"
                      style={{ backgroundColor: theme.tokens.borderColor }}
                      title={`Border: ${theme.tokens.borderColor}`}
                    />
                  </div>
                </div>

                {theme.startAt && theme.endAt && (
                  <div className="text-[10px] font-mono text-[rgba(17,17,17,0.45)] mb-2">
                    Schedule: {new Date(theme.startAt).toLocaleDateString()} &rarr; {new Date(theme.endAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {canManageThemes && (
                <div className="mt-4 pt-3 border-t border-[rgba(17,17,17,0.10)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {!isLive && (
                      <button
                        type="button"
                        onClick={() => activateTheme(theme.id)}
                        className="px-3 py-1 bg-[#181818] text-white border border-[#181818] rounded font-semibold"
                      >
                        Set Live
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(theme)}
                      className="text-[#111111] hover:text-[#111111]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateTheme(theme.id)}
                      className="text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
                    >
                      Duplicate
                    </button>
                  </div>

                  {theme.id !== "theme-default" && (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(theme.id)}
                      className="text-[#b91c1c] hover:text-[#991b1b]"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT THEME MODAL */}
      {isModalOpen && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white border border-[rgba(17,17,17,0.15)] rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[rgba(17,17,17,0.10)] pb-3">
              <h3 className="text-base font-bold font-111111 font-serif tracking-tight">
                {editingTheme ? "Configure Theme Identity" : "Create New Luxury Theme"}
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
                    Theme Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Winter Solstice Atelier"
                    value={themeForm.name}
                    onChange={(e) => setThemeForm({ ...themeForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Theme Type *
                  </label>
                  <select
                    value={themeForm.type}
                    onChange={(e) =>
                      setThemeForm({
                        ...themeForm,
                        type: e.target.value as "festival" | "seasonal" | "campaign" | "sale" | "custom",
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  >
                    <option value="seasonal">Seasonal</option>
                    <option value="festival">Festival</option>
                    <option value="campaign">Campaign</option>
                    <option value="sale">Sale Event</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Creative concept and art direction rationale..."
                  value={themeForm.description}
                  onChange={(e) => setThemeForm({ ...themeForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Storefront Scope
                  </label>
                  <select
                    value={themeForm.scope}
                    onChange={(e) =>
                      setThemeForm({
                        ...themeForm,
                        scope: e.target.value as "all" | "men" | "women" | "kids" | "footwear" | "accessories",
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  >
                    <option value="all">Entire Store (All Pages)</option>
                    <option value="men">Men Department</option>
                    <option value="women">Women Department</option>
                    <option value="kids">Kids Department</option>
                    <option value="footwear">Footwear Department</option>
                    <option value="accessories">Accessories Department</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Priority Rating
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={themeForm.priority}
                    onChange={(e) => setThemeForm({ ...themeForm, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>
              </div>

              {/* Color Tokens */}
              <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)] space-y-3">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(17,17,17,0.55)]">Color Palette Tokens</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-[rgba(17,17,17,0.55)] mb-1">Primary BG</label>
                    <input
                      type="text"
                      value={themeForm.tokens?.primaryBg}
                      onChange={(e) =>
                        setThemeForm({
                          ...themeForm,
                          tokens: { ...themeForm.tokens!, primaryBg: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 bg-white border border-[rgba(17,17,17,0.15)] rounded text-xs text-[#111111] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[rgba(17,17,17,0.55)] mb-1">Dark Surface</label>
                    <input
                      type="text"
                      value={themeForm.tokens?.darkSurface}
                      onChange={(e) =>
                        setThemeForm({
                          ...themeForm,
                          tokens: { ...themeForm.tokens!, darkSurface: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 bg-white border border-[rgba(17,17,17,0.15)] rounded text-xs text-[#111111] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[rgba(17,17,17,0.55)] mb-1">Accent Accent</label>
                    <input
                      type="text"
                      value={themeForm.tokens?.accent}
                      onChange={(e) =>
                        setThemeForm({
                          ...themeForm,
                          tokens: { ...themeForm.tokens!, accent: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 bg-white border border-[rgba(17,17,17,0.15)] rounded text-xs text-[#111111] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Decorations & Ticker */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Ambient Micro-Effects
                  </label>
                  <select
                    value={themeForm.decorations?.style}
                    onChange={(e) =>
                      setThemeForm({
                        ...themeForm,
                        decorations: {
                          ...themeForm.decorations!,
                          style: e.target.value as "none" | "snow" | "sparkles" | "confetti" | "lanterns",
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  >
                    <option value="none">None (Strict Minimal)</option>
                    <option value="sparkles">Atelier Sparkles</option>
                    <option value="snow">Winter Snow Flurry</option>
                    <option value="lanterns">Festival Lanterns</option>
                    <option value="confetti">Celebration Confetti</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Status
                  </label>
                  <select
                    value={themeForm.status}
                    onChange={(e) =>
                      setThemeForm({
                        ...themeForm,
                        status: e.target.value as "active" | "scheduled" | "draft" | "archived",
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled by Date</option>
                    <option value="active">Active Immediately</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
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
                  {editingTheme ? "Update Theme" : "Save Theme"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border border-[rgba(185,28,28,0.20)] rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-[#b91c1c]">Delete Theme</h3>
            <p className="text-xs text-[rgba(17,17,17,0.65)]">
              Are you sure you want to permanently delete this theme? The default signature theme cannot be removed.
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
                Delete Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
