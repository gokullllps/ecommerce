"use client";

import React, { useState, useEffect } from "react";

interface PriceFilterProps {
  minBound: number;
  maxBound: number;
  currentMin?: number;
  currentMax?: number;
  onChange: (min?: number, max?: number) => void;
}

export function PriceFilter({
  minBound,
  maxBound,
  currentMin,
  currentMax,
  onChange,
}: PriceFilterProps) {
  const [minInput, setMinInput] = useState(currentMin !== undefined ? String(currentMin) : "");
  const [maxInput, setMaxInput] = useState(currentMax !== undefined ? String(currentMax) : "");

  useEffect(() => {
    setMinInput(currentMin !== undefined ? String(currentMin) : "");
    setMaxInput(currentMax !== undefined ? String(currentMax) : "");
  }, [currentMin, currentMax]);

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const minVal = minInput.trim() === "" ? undefined : Number(minInput);
    const maxVal = maxInput.trim() === "" ? undefined : Number(maxInput);
    onChange(minVal, maxVal);
  };

  const handlePreset = (min?: number, max?: number) => {
    setMinInput(min !== undefined ? String(min) : "");
    setMaxInput(max !== undefined ? String(max) : "");
    onChange(min, max);
  };

  return (
    <div className="space-y-4">
      {/* Quick Price Brackets */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => handlePreset(undefined, 500)}
          className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors cursor-pointer ${
            currentMin === undefined && currentMax === 500
              ? "bg-[#181818] text-[#EAE8E1] border-[#181818]"
              : "bg-white text-[#666666] border-[#D9D8D3] hover:border-[#111111]"
          }`}
        >
          Under $500
        </button>
        <button
          type="button"
          onClick={() => handlePreset(500, 1500)}
          className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors cursor-pointer ${
            currentMin === 500 && currentMax === 1500
              ? "bg-[#181818] text-[#EAE8E1] border-[#181818]"
              : "bg-white text-[#666666] border-[#D9D8D3] hover:border-[#111111]"
          }`}
        >
          $500 — $1,500
        </button>
        <button
          type="button"
          onClick={() => handlePreset(1500, undefined)}
          className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors cursor-pointer ${
            currentMin === 1500 && currentMax === undefined
              ? "bg-[#181818] text-[#EAE8E1] border-[#181818]"
              : "bg-white text-[#666666] border-[#D9D8D3] hover:border-[#111111]"
          }`}
        >
          Above $1,500
        </button>
      </div>

      {/* Manual Dual Inputs */}
      <form onSubmit={handleApply} className="flex items-center space-x-2 pt-1">
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#999999]">$</span>
          <input
            type="number"
            min={minBound}
            max={maxBound}
            placeholder={String(minBound)}
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-[#D9D8D3] focus:border-[#111111] outline-none text-[#111111]"
          />
        </div>
        <span className="text-xs text-[#999999]">—</span>
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#999999]">$</span>
          <input
            type="number"
            min={minBound}
            max={maxBound}
            placeholder={String(maxBound)}
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-[#D9D8D3] focus:border-[#111111] outline-none text-[#111111]"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 text-xs uppercase tracking-wider pablo-btn-dark cursor-pointer"
        >
          Apply
        </button>
      </form>
    </div>
  );
}
