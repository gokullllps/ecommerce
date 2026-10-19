"use client";

import React, { useState } from "react";
import Image from "next/image";

interface OutfitPiece {
  id: string;
  name: string;
  tag: string;
  colorName: string;
  colorHex: string;
  imageUrl: string;
}

const TOPS: OutfitPiece[] = [
  {
    id: "top-1",
    name: "Breton Stripe Tee",
    tag: "100% Organic Supima",
    colorName: "Ivory / Marine",
    colorHex: "#F8FAFC",
    imageUrl: "/images/kids/hoodie-sky-front.webp",
  },
  {
    id: "top-2",
    name: "Cashmere Mini Hoodie",
    tag: "Double-Faced Cashmere",
    colorName: "Butter Yellow",
    colorHex: "#FEF08A",
    imageUrl: "/images/kids/cable-knit-ivory-front.webp",
  },
  {
    id: "top-3",
    name: "Tailored Overshirt",
    tag: "Virgin Wool Blend",
    colorName: "Chambray Sky",
    colorHex: "#BAE6FD",
    imageUrl: "/images/kids/poplin-shirt-white-front.webp",
  },
];

const BOTTOMS: OutfitPiece[] = [
  {
    id: "bot-1",
    name: "Pleated Chino Trousers",
    tag: "Italian Stretch Cotton",
    colorName: "Sand Stone",
    colorHex: "#E2E8F0",
    imageUrl: "/images/products/petit-architectural-relaxed-chinos-front.webp",
  },
  {
    id: "bot-2",
    name: "Selvedge Mini Joggers",
    tag: "Japanese Denim",
    colorName: "Indigo Light",
    colorHex: "#93C5FD",
    imageUrl: "/images/products/petit-japanese-selvedge-denim-jeans-front.webp",
  },
  {
    id: "bot-3",
    name: "Fine Corduroy Pants",
    tag: "Soft Ribbed Cotton",
    colorName: "Honey Khaki",
    colorHex: "#FDE68A",
    imageUrl: "/images/products/junior-wool-blend-utility-cargo-trousers-front.webp",
  },
];

const SHOES: OutfitPiece[] = [
  {
    id: "sh-1",
    name: "Leather Low Sneaker",
    tag: "Italian Calf Leather",
    colorName: "Chalk White",
    colorHex: "#FFFFFF",
    imageUrl: "/images/products/minimalist-calfskin-low-top-sneakers-front.webp",
  },
  {
    id: "sh-2",
    name: "Mini Suede Loafer",
    tag: "Velvet Calfskin",
    colorName: "Espresso Brown",
    colorHex: "#78350F",
    imageUrl: "/images/products/miniature-calfskin-penny-loafers-front.webp",
  },
  {
    id: "sh-3",
    name: "Chelsea Ankle Boot",
    tag: "Water-Resistant Nubuck",
    colorName: "Jet Black",
    colorHex: "#181818",
    imageUrl: "/images/products/monolithic-leather-chelsea-boots-front.webp",
  },
];

export function BuildTheLook() {
  const [topIdx, setTopIdx] = useState(0);
  const [bottomIdx, setBottomIdx] = useState(0);
  const [shoesIdx, setShoesIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const currentTop = TOPS[topIdx];
  const currentBottom = BOTTOMS[bottomIdx];
  const currentShoes = SHOES[shoesIdx];

  const cycle = (slot: "top" | "bottom" | "shoes", dir: 1 | -1) => {
    setRevealed(false);
    if (slot === "top") {
      setTopIdx((prev) => (prev + dir + TOPS.length) % TOPS.length);
    } else if (slot === "bottom") {
      setBottomIdx((prev) => (prev + dir + BOTTOMS.length) % BOTTOMS.length);
    } else {
      setShoesIdx((prev) => (prev + dir + SHOES.length) % SHOES.length);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-2 border-[#181818] rounded-2xl shadow-[4px_4px_0px_#181818] overflow-hidden select-none">
      {/* Header */}
      <div className="bg-[#DCFCE7] border-b-2 border-[#181818] px-4 sm:px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-white border border-[#181818] flex items-center justify-center shadow-[1px_1px_0px_#181818]">
            <svg className="w-3.5 h-3.5 stroke-[#181818] fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2.1L2 14v2h20v-2l-7.8-6.9c.5-.6.8-1.3.8-2.1a3 3 0 0 0-3-3z"/>
            </svg>
          </span>
          <div>
            <h3 className="font-sans font-black text-xs uppercase tracking-wider text-[#181818]">
              BUILD THE LOOK
            </h3>
            <p className="text-[10px] font-sans text-[#666] font-medium">Style a custom Kids outfit</p>
          </div>
        </div>

        <span className="text-[9px] font-sans font-bold uppercase tracking-wider bg-white border border-[#181818] px-2.5 py-1 rounded-full shadow-[1px_1px_0px_#181818]">
          FASHION LAB
        </span>
      </div>

      {/* Main interactive area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-[#F8FFFC] gap-3">
        {/* Visual Outfit Model Area */}
        <div className="bg-white border-2 border-[#181818] rounded-xl p-3 shadow-[2px_2px_0px_#181818] relative overflow-hidden">
          <div className="flex items-center justify-around gap-2 text-center">
            {/* Top Visual Card */}
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-[#181818] shadow-[2px_2px_0px_#181818] relative overflow-hidden transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: currentTop.colorHex }}
              >
                <Image src={currentTop.imageUrl} alt={currentTop.name} fill sizes="64px" className="object-cover opacity-85" />
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#181818] mt-1.5 truncate max-w-[85px]">
                {currentTop.name}
              </span>
            </div>

            {/* Plus separator */}
            <span className="text-xs font-black text-[#181818]/40">+</span>

            {/* Bottom Visual Card */}
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-[#181818] shadow-[2px_2px_0px_#181818] relative overflow-hidden transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: currentBottom.colorHex }}
              >
                <Image src={currentBottom.imageUrl} alt={currentBottom.name} fill sizes="64px" className="object-cover opacity-85" />
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#181818] mt-1.5 truncate max-w-[85px]">
                {currentBottom.name}
              </span>
            </div>

            {/* Plus separator */}
            <span className="text-xs font-black text-[#181818]/40">+</span>

            {/* Shoes Visual Card */}
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-[#181818] shadow-[2px_2px_0px_#181818] relative overflow-hidden transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: currentShoes.colorHex }}
              >
                <Image src={currentShoes.imageUrl} alt={currentShoes.name} fill sizes="64px" className="object-cover opacity-85" />
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#181818] mt-1.5 truncate max-w-[85px]">
                {currentShoes.name}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Selector controls */}
        <div className="space-y-2">
          {/* Top Selector */}
          <div className="flex items-center justify-between bg-white border border-[#181818] rounded-lg px-2.5 py-1.5 shadow-[1px_1px_0px_#181818]">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#666] w-14">TOP</span>
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              <button
                type="button"
                onClick={() => cycle("top", -1)}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-[#181818] text-xs hover:bg-[#FEF08A] active:scale-90 transition-all cursor-pointer"
                aria-label="Previous Top"
              >
                ←
              </button>
              <span className="text-[10.5px] font-sans font-bold text-[#181818] min-w-[120px] text-center truncate">
                {currentTop.name}
              </span>
              <button
                type="button"
                onClick={() => cycle("top", 1)}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-[#181818] text-xs hover:bg-[#FEF08A] active:scale-90 transition-all cursor-pointer"
                aria-label="Next Top"
              >
                →
              </button>
            </div>
          </div>

          {/* Bottom Selector */}
          <div className="flex items-center justify-between bg-white border border-[#181818] rounded-lg px-2.5 py-1.5 shadow-[1px_1px_0px_#181818]">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#666] w-14">BOTTOM</span>
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              <button
                type="button"
                onClick={() => cycle("bottom", -1)}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-[#181818] text-xs hover:bg-[#FEF08A] active:scale-90 transition-all cursor-pointer"
                aria-label="Previous Bottom"
              >
                ←
              </button>
              <span className="text-[10.5px] font-sans font-bold text-[#181818] min-w-[120px] text-center truncate">
                {currentBottom.name}
              </span>
              <button
                type="button"
                onClick={() => cycle("bottom", 1)}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-[#181818] text-xs hover:bg-[#FEF08A] active:scale-90 transition-all cursor-pointer"
                aria-label="Next Bottom"
              >
                →
              </button>
            </div>
          </div>

          {/* Shoes Selector */}
          <div className="flex items-center justify-between bg-white border border-[#181818] rounded-lg px-2.5 py-1.5 shadow-[1px_1px_0px_#181818]">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#666] w-14">SHOES</span>
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              <button
                type="button"
                onClick={() => cycle("shoes", -1)}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-[#181818] text-xs hover:bg-[#FEF08A] active:scale-90 transition-all cursor-pointer"
                aria-label="Previous Shoes"
              >
                ←
              </button>
              <span className="text-[10.5px] font-sans font-bold text-[#181818] min-w-[120px] text-center truncate">
                {currentShoes.name}
              </span>
              <button
                type="button"
                onClick={() => cycle("shoes", 1)}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-[#181818] text-xs hover:bg-[#FEF08A] active:scale-90 transition-all cursor-pointer"
                aria-label="Next Shoes"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="w-full py-2.5 bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] border-2 border-[#181818] rounded-full font-sans font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#181818] hover:shadow-[1px_1px_0px_#181818] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5 fill-[#181818]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l2.4 7.6 7.6 2.4-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/>
              </svg>
              <span>SHOW MY LOOK</span>
            </button>
          ) : (
            <div className="kids-reveal-scale bg-white border-2 border-[#181818] rounded-xl p-3 shadow-[2px_2px_0px_#181818] text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#181818] text-[#181818] font-sans font-black text-[10.5px] uppercase tracking-wider mb-1">
                <svg className="w-3.5 h-3.5 fill-[#16A34A]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>LOOK COMPLETE!</span>
              </div>
              <p className="text-[10px] text-[#555] font-medium leading-relaxed">
                {currentTop.name} &bull; {currentBottom.name} &bull; {currentShoes.name}
              </p>
              <button
                type="button"
                onClick={() => setRevealed(false)}
                className="mt-2 text-[10px] font-bold underline text-[#181818] hover:text-[#666] cursor-pointer"
              >
                Mix another look
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuildTheLook;
