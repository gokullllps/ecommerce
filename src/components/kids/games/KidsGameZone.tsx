"use client";
import React, { useState } from "react";
import { CatchTheStars } from "./CatchTheStars";
import { BuildTheLook } from "./BuildTheLook";
import { useKidsReveal } from "../animations/useKidsReveal";

const GAMES = [
  {
    id: "stars",
    label: "Catch Stars",
    icon: (
      <svg className="w-3 h-3 fill-current inline-block" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    component: <CatchTheStars />,
  },
  {
    id: "look",
    label: "Build Look",
    icon: (
      <svg className="w-3 h-3 stroke-current fill-none inline-block" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2.1L2 14v2h20v-2l-7.8-6.9c.5-.6.8-1.3.8-2.1a3 3 0 0 0-3-3z"/>
      </svg>
    ),
    component: <BuildTheLook />,
  },
];

/**
 * Game Zone — a small collapsible section in the Kids catalogue page.
 * Hosts the two inline mini games with a tab switcher.
 * Hidden Star game is embedded elsewhere as an easter egg.
 */
export function KidsGameZone() {
  const [open, setOpen] = useState(false);
  const [activeGame, setActiveGame] = useState("stars");
  const { ref, revealed } = useKidsReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`w-full transition-all duration-300 ${revealed ? "kids-reveal-up" : "opacity-0"}`}
    >
      {/* Toggle button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setOpen(o => !o)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FEF08A] border-2 border-[#181818] rounded-full text-[10.5px] font-black tracking-wider uppercase shadow-[3px_3px_0px_#181818] hover:shadow-[1px_1px_0px_#181818] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer select-none"
          aria-expanded={open}
          aria-label={open ? "Close game zone" : "Open game zone"}
        >
          <svg className="w-4 h-4 stroke-[#181818] fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="6" width="20" height="12" rx="6" />
            <path d="M6 12h4m-2-2v4m7-2h.01m3 0h.01" />
          </svg>
          <span>{open ? "Hide Games" : "Play Games"}</span>
          <span className="text-[8px] bg-[#181818] text-[#FEF08A] px-1.5 py-0.5 rounded-full">NEW</span>
        </button>
      </div>

      {/* Collapsible game panel */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? 420 : 0, opacity: open ? 1 : 0 }}
        aria-hidden={!open}
      >
        {open && (
          <div className="pb-8">
            {/* Game tab switcher */}
            <div className="flex justify-center gap-2 mb-4">
              {GAMES.map(g => (
                <button
                  key={g.id}
                  onClick={() => setActiveGame(g.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border-2 border-[#181818] transition-all cursor-pointer kids-tab-pill ${
                    activeGame === g.id
                      ? "bg-[#181818] text-[#FEF08A] shadow-[2px_2px_0px_#FEF08A]"
                      : "bg-white text-[#181818] shadow-[2px_2px_0px_#181818] hover:bg-[#FEF08A]"
                  }`}
                >
                  {g.icon}
                  <span>{g.label}</span>
                </button>
              ))}
            </div>

            {/* Active game */}
            <div key={activeGame} className="kids-reveal-scale px-4">
              {GAMES.find(g => g.id === activeGame)?.component}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
