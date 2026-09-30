"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Garments & Sizing",
    q: "How do Maison PABLO garments fit?",
    a: "Our tailoring follows a refined architectural silhouette: shoulders are crisp and defined with a natural, relaxed drop through the torso and trouser leg. We advise selecting your standard size for the intended editorial drape, or one size down for a more conventional slim fit. Consult the detailed measurements on each product page.",
  },
  {
    category: "Garments & Sizing",
    q: "Where are Maison PABLO garments crafted?",
    a: "All collections are conceived and draped in our Paris studio, then produced in limited numbered editions across our partner family-owned ateliers in Biella, Como, and Tuscany, Italy.",
  },
  {
    category: "Orders & Delivery",
    q: "What is included with my delivery packaging?",
    a: "Every order arrives in our signature matte ivory presentation box with embossed wax seal, accompanied by bespoke wooden cedar hangers, breathable organic cotton garment carriers, and an archival certificate of authenticity.",
  },
  {
    category: "Orders & Delivery",
    q: "Can I modify or cancel an order after placing it?",
    a: "Because our atelier prepares orders swiftly, please contact the concierge within 60 minutes of placing your order at concierge@maisonpablo.com if you require an address correction or cancellation.",
  },
  {
    category: "Returns & Exchanges",
    q: "How do I book a complimentary return courier?",
    a: "Log into your Client Account and select Initiate Return on the appropriate order, or email our concierge. We will arrange for a private courier to collect the package directly from your home or office.",
  },
  {
    category: "Care & Longevity",
    q: "How should I care for my double-faced cashmere and virgin wool garments?",
    a: "We recommend airing garments between wears rather than frequent dry cleaning. When necessary, entrust pieces solely to specialist luxury cleaners. Always store tailoring on wide wooden hangers within breathable cotton garment covers.",
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Garments & Sizing", "Orders & Delivery", "Returns & Exchanges", "Care & Longevity"];

  const filteredFaqs = activeCategory === "All"
    ? FAQS
    : FAQS.filter((f) => f.category === activeCategory);

  return (
    <PageWrapper navbarProps={{ isStaticPage: true }}>
      <main className="flex-1 page-container-reading py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#666666]">
            CLIENT INTELLIGENCE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#666666]">
            Essential guidance regarding garment construction, atelier sizing, delivery, and care.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIdx(null);
              }}
              className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
                activeCategory === cat
                  ? "border-[#111111] bg-[#181818] text-[#EAE8E1]"
                  : "border-[#D9D8D3] bg-white/70 text-[#666666] hover:text-[#111111]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="divide-y divide-[#D9D8D3] border-y border-[#D9D8D3]">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center text-left text-sm sm:text-base font-serif text-[#111111] hover:text-[#666666] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span className="text-lg font-light">{isOpen ? "—" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="pt-3 text-xs sm:text-sm text-[#555555] leading-relaxed font-light pr-8">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </PageWrapper>
  );
}
