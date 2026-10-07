"use client";

import React from "react";
import { AdminCollection } from "@/types/admin";
import { Product } from "@/types/catalogue";
import { useAdminData } from "@/context/AdminDataContext";

interface CollectionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: AdminCollection | null;
}

export function CollectionPreviewModal({ isOpen, onClose, collection }: CollectionPreviewModalProps) {
  const { products } = useAdminData();

  if (!isOpen || !collection) return null;

  // Resolve collection products based on mode and ordering
  let resolvedProducts: Product[] = [];
  if (collection.mode === "manual") {
    const map = new Map(products.map((p) => [p.id, p]));
    resolvedProducts = (collection.productIds || []).map((id) => map.get(id)).filter(Boolean) as Product[];
  } else if (collection.mode === "rule_based" && collection.rules) {
    resolvedProducts = products.filter((p) => {
      return (collection.rules || []).every((rule) => {
        if (rule.field === "category") return p.category === rule.value;
        if (rule.field === "gender") return p.gender === rule.value;
        if (rule.field === "minPrice") return p.price >= Number(rule.value);
        if (rule.field === "maxPrice") return p.price <= Number(rule.value);
        if (rule.field === "isSale") return !!p.isSale === (rule.value === true || rule.value === "true");
        if (rule.field === "isNewArrival") return !!p.isNewArrival === (rule.value === true || rule.value === "true");
        if (rule.field === "isBestSeller") return !!p.isBestSeller === (rule.value === true || rule.value === "true");
        if (rule.field === "isFeatured") return ((p.popularityScore || 0) >= 80) === (rule.value === true || rule.value === "true");
        if (rule.field === "tag") return p.tags?.some((t) => t.toLowerCase().includes(String(rule.value).toLowerCase()));
        return true;
      });
    });
  }

  const heroImage = collection.banner || collection.image || "/images/hero-desktop.jpg";

  return (
    <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#F5F4F0] border border-[rgba(17,17,17,0.10)] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Top Header Bar */}
        <div className="px-6 py-3 border-b border-[rgba(17,17,17,0.10)] bg-[#EAE8E1] flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-[#181818] text-white font-mono font-bold uppercase text-[10px]">
              Storefront Preview
            </span>
            <span className="text-[rgba(17,17,17,0.55)] font-mono">/{collection.slug}</span>
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${
                collection.status === "active"
                  ? "bg-[rgba(17,17,17,0.06)] text-[#111111] border-[rgba(17,17,17,0.12)]"
                  : "bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.65)] border-[rgba(17,17,17,0.12)]"
              }`}
            >
              {collection.status}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[rgba(17,17,17,0.55)] hover:text-[#111111] rounded hover:bg-[#EAE8E1]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Preview Body formatted as luxury storefront editorial */}
        <div className="flex-1 overflow-y-auto bg-[#EAE8E1] text-[#111111]">
          {/* Collection Hero Section */}
          <div className="relative min-h-[380px] sm:min-h-[460px] flex items-end p-8 sm:p-14 overflow-hidden bg-[#181818]">
            {/* Background Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt={collection.name}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="relative z-10 max-w-2xl text-white space-y-3">
              <div className="text-xs font-mono tracking-widest uppercase text-[#D9D8D3]">
                PABLO ATELIER CAMPAIGN · {collection.gender.toUpperCase()}
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif tracking-tight uppercase">
                {collection.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#EAE8E1]/85 line-clamp-3 font-light leading-relaxed">
                {collection.description}
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#D9D8D3]">
                <span>{resolvedProducts.length} Curated Items</span>
                <span>·</span>
                <span>Mode: {collection.mode.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Product Grid Section */}
          <div className="p-6 sm:p-12 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D9D8D3]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#666666]">
                Catalog Grid View ({resolvedProducts.length} items)
              </span>
              <span className="text-xs font-mono text-[#666666]">
                Display Sequence: Strict Atelier Order
              </span>
            </div>

            {resolvedProducts.length === 0 ? (
              <div className="py-16 text-center text-[#666666]">
                <div className="font-serif text-lg mb-1">No products in this collection yet.</div>
                <div className="text-xs font-mono">Add products in the Collection Builder to populate this preview.</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {resolvedProducts.map((p, idx) => (
                  <div key={p.id} className="group flex flex-col space-y-2">
                    <div className="relative aspect-[3/4] bg-[#D9D8D3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.primaryImage || p.images?.[0]?.url || "/images/categories/knitwear.webp"}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white font-mono text-[9px] uppercase">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-[#666666] tracking-wider">
                        {p.category}
                      </div>
                      <h4 className="text-xs font-medium text-[#111111] line-clamp-1 group-hover:underline">
                        {p.name}
                      </h4>
                      <div className="font-mono text-xs font-semibold text-[#111111]">
                        ₹{p.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[rgba(17,17,17,0.10)] bg-[#EAE8E1] flex items-center justify-between text-xs">
          <span className="text-[rgba(17,17,17,0.55)]">
            This editorial preview renders using PABLO&apos;s immutable luxury typography &amp; layout standards.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded font-mono text-xs cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
