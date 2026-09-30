"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const TOTAL_STARS = 5;
const STAR_LIFETIME_MS = 2800;
const SPAWN_INTERVAL_MS = 900;

interface Star {
  id: number;
  x: number;
  y: number;
  born: number;
}

let nextStarId = 1;

/**
 * Mini Game #1: Catch the Stars
 * Playful game card in the Kids Play Time section.
 * Stars float inside the arena and can be caught with a tap or click.
 */
export function CatchTheStars() {
  const [playing, setPlaying] = useState(true);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState<Star[]>([
    { id: 101, x: 25, y: 35, born: Date.now() },
    { id: 102, x: 75, y: 55, born: Date.now() + 200 },
  ]);
  const [won, setWon] = useState(false);
  const [lastCaughtPos, setLastCaughtPos] = useState<{ x: number; y: number } | null>(null);

  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cleanRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopGame = useCallback(() => {
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (cleanRef.current) clearInterval(cleanRef.current);
    spawnRef.current = null;
    cleanRef.current = null;
  }, []);

  const startGame = useCallback(() => {
    stopGame();
    setScore(0);
    setWon(false);
    setPlaying(true);
    setLastCaughtPos(null);

    // Initial 2 stars
    setStars([
      { id: nextStarId++, x: 30 + Math.random() * 40, y: 30 + Math.random() * 40, born: Date.now() },
      { id: nextStarId++, x: 15 + Math.random() * 30, y: 20 + Math.random() * 40, born: Date.now() + 100 },
    ]);

    spawnRef.current = setInterval(() => {
      setStars((prev) => {
        if (prev.length >= 3) return prev; // max 3 active
        const newStar: Star = {
          id: nextStarId++,
          x: 12 + Math.random() * 76,
          y: 15 + Math.random() * 65,
          born: Date.now(),
        };
        return [...prev, newStar];
      });
    }, SPAWN_INTERVAL_MS);

    cleanRef.current = setInterval(() => {
      setStars((prev) => prev.filter((s) => Date.now() - s.born < STAR_LIFETIME_MS));
    }, 250);
  }, [stopGame]);

  const catchStar = useCallback(
    (star: Star) => {
      setStars((prev) => prev.filter((s) => s.id !== star.id));
      setLastCaughtPos({ x: star.x, y: star.y });
      setTimeout(() => setLastCaughtPos(null), 500);

      setScore((prev) => {
        const next = prev + 1;
        if (next >= TOTAL_STARS) {
          stopGame();
          setWon(true);
          setPlaying(false);
        }
        return next;
      });
    },
    [stopGame]
  );

  useEffect(() => {
    startGame();
    return () => stopGame();
  }, [startGame, stopGame]);

  return (
    <div className="w-full h-full flex flex-col bg-white border-2 border-[#181818] rounded-2xl shadow-[4px_4px_0px_#181818] overflow-hidden select-none">
      {/* Header */}
      <div className="bg-[#FEF08A] border-b-2 border-[#181818] px-4 sm:px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-white border border-[#181818] flex items-center justify-center shadow-[1px_1px_0px_#181818]">
            <svg className="w-3.5 h-3.5 fill-[#181818]" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </span>
          <div>
            <h3 className="font-sans font-black text-xs uppercase tracking-wider text-[#181818]">
              CATCH THE STARS
            </h3>
            <p className="text-[10px] font-sans text-[#666] font-medium">Catch 5 stars!</p>
          </div>
        </div>

        {/* Score indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-[#181818] shadow-[1px_1px_0px_#181818]">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#181818]">
            SCORE
          </span>
          <span className="font-sans font-black text-xs text-[#181818]">
            {score} / {TOTAL_STARS}
          </span>
        </div>
      </div>

      {/* Game arena */}
      <div className="relative flex-1 bg-[#EBF4FA] min-h-[220px] sm:min-h-[240px] overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "radial-gradient(#181818 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

        {/* Won State Celebration */}
        {won ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center kids-reveal-scale bg-[#EBF4FA]/95 z-20">
            <div className="w-14 h-14 rounded-full bg-[#FEF08A] border-2 border-[#181818] shadow-[3px_3px_0px_#181818] flex items-center justify-center mb-3 animate-kids-twinkle">
              <svg className="w-7 h-7 fill-[#181818]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h4 className="font-sans font-black text-sm uppercase tracking-widest text-[#181818]">
              STAR COLLECTOR!
            </h4>
            <p className="text-xs text-[#666] font-medium mt-1 mb-4">
              Super quick reflexes! All 5 stars captured.
            </p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2.5 rounded-full bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] border-2 border-[#181818] font-sans font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#181818] hover:shadow-[1px_1px_0px_#181818] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all cursor-pointer"
            >
              PLAY AGAIN
            </button>
          </div>
        ) : (
          <>
            {/* Active Floating Stars */}
            {stars.map((star) => (
              <button
                key={star.id}
                type="button"
                onClick={() => catchStar(star)}
                aria-label="Catch floating star"
                className="absolute w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-2 border-[#181818] bg-[#FEF08A] hover:bg-[#FDE047] shadow-[2px_2px_0px_#181818] cursor-pointer kids-star-pop kids-star-float active:scale-90 transition-transform z-10"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <svg className="w-5 h-5 fill-[#181818]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}

            {/* Sparkle pop feedback where star was clicked */}
            {lastCaughtPos && (
              <div
                className="absolute pointer-events-none kids-score-pop z-30"
                style={{
                  left: `${lastCaughtPos.x}%`,
                  top: `${lastCaughtPos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="px-2 py-0.5 rounded-full bg-[#181818] text-[#FEF08A] text-[10px] font-black tracking-wider uppercase border border-[#FEF08A] shadow-[1px_1px_0px_#181818]">
                  +1 STAR!
                </span>
              </div>
            )}
          </>
        )}

        {/* Bottom progress bar with 5 star indicator dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 pointer-events-none z-10">
          {Array.from({ length: TOTAL_STARS }).map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full border-2 border-[#181818] transition-all duration-300 flex items-center justify-center ${
                i < score ? "bg-[#FEF08A] kids-score-pop" : "bg-white/80"
              }`}
            >
              {i < score && (
                <svg className="w-2 h-2 fill-[#181818]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CatchTheStars;
