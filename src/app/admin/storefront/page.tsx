"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { StorefrontHeroSlide, StorefrontSectionConfig } from "@/types/admin";

export default function AdminStorefrontPage() {
  const { heroSlides, sections, updateHeroSlides, updateSections } = useAdminData();
  const { hasPermission } = useAdminAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"hero" | "sections">("hero");

  // Hero Slide Editor Modal
  const [editingSlide, setEditingSlide] = useState<StorefrontHeroSlide | null>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [slideForm, setSlideForm] = useState<Partial<StorefrontHeroSlide>>({
    title: "",
    subtitle: "",
    description: "",
    ctaText: "Discover Collection",
    ctaLink: "/collections/autumn-winter-2026",
    desktopImage: "/images/hero-desktop.jpg",
    alignment: "center",
    isActive: true,
  });

  // Section Sequence State
  const [localSections, setLocalSections] = useState<StorefrontSectionConfig[]>(sections);
  const [hasUnsavedSections, setHasUnsavedSections] = useState(false);

  const canManageStorefront = hasPermission("storefront.manage");

  // Hero Slide Actions
  const handleOpenNewSlideModal = () => {
    setEditingSlide(null);
    setSlideForm({
      id: `slide_${Date.now()}`,
      title: "AUTUMN / WINTER 2026",
      subtitle: "The Sculptural Silence of Melton Wool",
      description: "Architectural silhouettes tailored from heavyweight Italian virgin wool melton.",
      ctaText: "Explore Collection",
      ctaLink: "/collections/autumn-winter-2026",
      desktopImage: "/images/hero-desktop.jpg",
      alignment: "center",
      isActive: true,
      order: heroSlides.length + 1,
    });
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlideModal = (slide: StorefrontHeroSlide) => {
    setEditingSlide(slide);
    setSlideForm(slide);
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.title?.trim()) return;

    let updatedList: StorefrontHeroSlide[];
    if (editingSlide) {
      updatedList = heroSlides.map((s) => (s.id === editingSlide.id ? ({ ...s, ...slideForm } as StorefrontHeroSlide) : s));
    } else {
      const newSlide: StorefrontHeroSlide = {
        id: `slide_${Date.now()}`,
        title: slideForm.title!.trim(),
        subtitle: slideForm.subtitle?.trim() || "",
        description: slideForm.description?.trim() || "",
        ctaText: slideForm.ctaText?.trim() || "Discover",
        ctaLink: slideForm.ctaLink?.trim() || "/",
        desktopImage: slideForm.desktopImage?.trim() || "/images/hero-desktop.jpg",
        alignment: slideForm.alignment || "center",
        isActive: slideForm.isActive ?? true,
        order: heroSlides.length + 1,
      };
      updatedList = [...heroSlides, newSlide];
    }

    updateHeroSlides(updatedList);
    setIsSlideModalOpen(false);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (heroSlides.length <= 1) {
      alert("At least one hero slide must remain active in the storefront.");
      return;
    }
    const updated = heroSlides.filter((s) => s.id !== slideId);
    updateHeroSlides(updated);
  };

  const handleToggleSlideActive = (slideId: string) => {
    const updated = heroSlides.map((s) => (s.id === slideId ? { ...s, isActive: !s.isActive } : s));
    updateHeroSlides(updated);
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= heroSlides.length) return;

    const copy = [...heroSlides];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    const normalized = copy.map((s, idx) => ({ ...s, order: idx + 1 }));
    updateHeroSlides(normalized);
  };

  // Section Sequence Actions
  const handleToggleSectionEnabled = (id: string) => {
    const updated = localSections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    setLocalSections(updated);
    setHasUnsavedSections(true);
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= localSections.length) return;

    const copy = [...localSections];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    const normalized = copy.map((s, idx) => ({ ...s, order: idx + 1 }));
    setLocalSections(normalized);
    setHasUnsavedSections(true);
  };

  const handleSaveSections = () => {
    updateSections(localSections);
    setHasUnsavedSections(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Storefront CMS</span>
          </div>
          <h1 className="a-page-title">
            STOREFRONT CONTENT MANAGEMENT
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Configure homepage hero slides, editorial section sequences, tickers, and call-to-actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded-lg text-xs font-semibold flex items-center gap-2 border border-[rgba(17,17,17,0.15)]"
          >
            Live Storefront ↗
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[rgba(17,17,17,0.10)] pb-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
            activeTab === "hero"
              ? "border-[#181818] text-[#111111]"
              : "border-transparent text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
          }`}
        >
          Hero Slides ({heroSlides.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sections")}
          className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === "sections"
              ? "border-[#181818] text-[#111111]"
              : "border-transparent text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
          }`}
        >
          Homepage Section Sequence ({localSections.length})
          {hasUnsavedSections && (
            <span className="w-2 h-2 rounded-full bg-[rgba(17,17,17,0.30)]" title="Unsaved changes" />
          )}
        </button>
      </div>

      {/* TAB 1: HERO SLIDES */}
      {activeTab === "hero" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">Editorial Hero Slides</h2>
              <p className="text-xs text-[rgba(17,17,17,0.55)]">Controls full-bleed banner carousels on the luxury landing page.</p>
            </div>
            {canManageStorefront && (
              <button
                type="button"
                onClick={handleOpenNewSlideModal}
                className="px-3.5 py-1.5 bg-[#181818] hover:bg-[#111111] text-white rounded-lg text-xs font-semibold"
              >
                + Add Slide
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className="p-5 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] flex flex-col justify-between hover:border-[rgba(17,17,17,0.15)] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono text-[#111111] uppercase font-bold">
                      Slide #{slide.order}
                    </span>
                    <button
                      type="button"
                      disabled={!canManageStorefront}
                      onClick={() => handleToggleSlideActive(slide.id)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border cursor-pointer ${
                        slide.isActive
                          ? "bg-[rgba(17,17,17,0.06)] text-[#111111] border-[rgba(17,17,17,0.12)]"
                          : "bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.55)] border-[rgba(17,17,17,0.10)]"
                      }`}
                    >
                      {slide.isActive ? "Active" : "Hidden"}
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-[#111111] mb-1">{slide.title}</h3>
                  <div className="text-xs font-serif italic text-[rgba(17,17,17,0.65)] mb-2">{slide.subtitle}</div>
                  <p className="text-xs text-[rgba(17,17,17,0.55)] mb-3 leading-relaxed">{slide.description}</p>

                  <div className="p-3 rounded-lg bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)] text-[11px] font-mono text-[rgba(17,17,17,0.55)] space-y-1">
                    <div>CTA: &quot;{slide.ctaText}&quot; &rarr; {slide.ctaLink}</div>
                    <div>Asset: {slide.desktopImage}</div>
                    <div>Text Align: {slide.alignment}</div>
                  </div>
                </div>

                {canManageStorefront && (
                  <div className="mt-4 pt-3 border-t border-[rgba(17,17,17,0.10)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSlide(idx, "up")}
                        className="px-2 py-1 rounded bg-[#EAE8E1] disabled:opacity-30 text-[#111111]"
                        title="Move Up"
                      >
                        &uarr;
                      </button>
                      <button
                        type="button"
                        disabled={idx === heroSlides.length - 1}
                        onClick={() => handleMoveSlide(idx, "down")}
                        className="px-2 py-1 rounded bg-[#EAE8E1] disabled:opacity-30 text-[#111111]"
                        title="Move Down"
                      >
                        &darr;
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditSlideModal(slide)}
                        className="px-3 py-1 rounded bg-[#EAE8E1] hover:bg-[#111111] text-[#111111] font-semibold"
                      >
                        Edit Slide
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="px-2 py-1 text-[#b91c1c] hover:text-[#991b1b]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SECTION SEQUENCE */}
      {activeTab === "sections" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">Homepage Layout Architecture</h2>
              <p className="text-xs text-[rgba(17,17,17,0.55)]">
                Reorder or toggle modules to curate the customer visual journey.
              </p>
            </div>
            {canManageStorefront && hasUnsavedSections && (
              <button
                type="button"
                onClick={handleSaveSections}
                className="px-4 py-2 bg-[#181818] hover:bg-[#111111] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Save Layout Sequence
              </button>
            )}
          </div>

          <div className="rounded-xl bg-white border border-[rgba(17,17,17,0.10)] overflow-hidden divide-y divide-[rgba(17,17,17,0.08)]">
            {localSections.map((sec, idx) => (
              <div
                key={sec.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#EAE8E1]/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#EAE8E1] font-mono text-xs font-bold text-[#111111] flex items-center justify-center shrink-0 border border-[rgba(17,17,17,0.15)]">
                    #{sec.order}
                  </div>
                  <div>
                    <div className="font-semibold text-[#111111] text-sm flex items-center gap-2">
                      {sec.title}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAE8E1] text-[rgba(17,17,17,0.55)] border border-[rgba(17,17,17,0.15)]">
                        type: {sec.type}
                      </span>
                    </div>
                    {sec.subtitle && (
                      <div className="text-xs text-[rgba(17,17,17,0.55)]">{sec.subtitle}</div>
                    )}
                  </div>
                </div>

                {canManageStorefront && (
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleSectionEnabled(sec.id)}
                      className={`px-3 py-1 rounded text-xs font-semibold uppercase border ${
                        sec.enabled
                          ? "bg-[rgba(17,17,17,0.06)] text-[#111111] border-[rgba(17,17,17,0.12)]"
                          : "bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.55)] border-[rgba(17,17,17,0.10)]"
                      }`}
                    >
                      {sec.enabled ? "Visible" : "Hidden"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(idx, "up")}
                        className="px-2.5 py-1 rounded bg-[#EAE8E1] disabled:opacity-30 text-[#111111] text-xs hover:bg-[#111111]"
                        title="Move Section Earlier"
                      >
                        &uarr;
                      </button>
                      <button
                        type="button"
                        disabled={idx === localSections.length - 1}
                        onClick={() => handleMoveSection(idx, "down")}
                        className="px-2.5 py-1 rounded bg-[#EAE8E1] disabled:opacity-30 text-[#111111] text-xs hover:bg-[#111111]"
                        title="Move Section Later"
                      >
                        &darr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HERO SLIDE EDITOR MODAL */}
      {isSlideModalOpen && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-[rgba(17,17,17,0.15)] rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[rgba(17,17,17,0.10)] pb-3">
              <h3 className="text-base font-bold font-111111 font-serif tracking-tight">
                {editingSlide ? "Edit Hero Slide Content" : "Create New Hero Slide"}
              </h3>
              <button
                type="button"
                onClick={() => setIsSlideModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[rgba(17,17,17,0.08)] text-[#111111] flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                  Main Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AUTUMN / WINTER 2026"
                  value={slideForm.title}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                  Editorial Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Sculptural Silence of Melton Wool"
                  value={slideForm.subtitle}
                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                  Campaign Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Paragraph describing the collection..."
                  value={slideForm.description}
                  onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">CTA Label</label>
                  <input
                    type="text"
                    value={slideForm.ctaText}
                    onChange={(e) => setSlideForm({ ...slideForm, ctaText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">CTA Link Destination</label>
                  <input
                    type="text"
                    value={slideForm.ctaLink}
                    onChange={(e) => setSlideForm({ ...slideForm, ctaLink: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Desktop Image Path</label>
                  <input
                    type="text"
                    value={slideForm.desktopImage}
                    onChange={(e) => setSlideForm({ ...slideForm, desktopImage: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Text Alignment</label>
                  <select
                    value={slideForm.alignment}
                    onChange={(e) =>
                      setSlideForm({ ...slideForm, alignment: e.target.value as "left" | "center" | "right" })
                    }
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  >
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="slideActiveCheck"
                  checked={slideForm.isActive}
                  onChange={(e) => setSlideForm({ ...slideForm, isActive: e.target.checked })}
                  className="rounded bg-[#EAE8E1] border-[rgba(17,17,17,0.15)] text-[#111111]"
                />
                <label htmlFor="slideActiveCheck" className="text-[#111111] font-medium">
                  Active in Live Carousel
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[rgba(17,17,17,0.10)]">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#181818] hover:bg-[#111111] text-white rounded-lg font-semibold shadow-md"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
