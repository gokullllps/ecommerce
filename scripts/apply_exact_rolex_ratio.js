const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'sections', 'HeroSection.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Update Layer 3: aspect-[3/5], h-[76vh] sm:h-[80vh] md:h-[83vh] max-h-[780px], gap-2.5 sm:gap-3 md:gap-3.5
const oldLayer3Regex = /\{\/\* ═+\s+LAYER 3: COLLECTION TRANSITION LAYER[\s\S]*?\{\/\* ═+\s+LAYER 4: PROMOTIONAL TICKER/;

const newLayer3 = `{\/* ══════════════════════════════════════════════════════════════════
            LAYER 3: COLLECTION TRANSITION LAYER (Exact Rolex 3:5 Ratio Cards & 12px Gaps)
            Z-INDEX: 20 — Physically overlays the blurred hero scene.
            Cards have exact 3:5 (0.60) Rolex ratio with tight 12px luxury gaps.
        ═══════════════════════════════════════════════════════════════════ *\/}
        <div
          id="editorial-collections"
          aria-label="PABLO Featured Editorial Collections"
          className="absolute inset-0 z-20 flex items-center justify-center px-2 sm:px-4"
          style={{
            pointerEvents: progress >= 0.18 ? "auto" : "none",
          }}
        >
          <div className="w-full flex items-center justify-center">
            {/* ── 3 ROLEX-STYLE CARDS WITH EXACT 3:5 RATIO & 12px GAPS ── */}
            <div className="flex justify-center items-center gap-2.5 sm:gap-3 md:gap-3.5 max-w-full overflow-x-auto md:overflow-visible no-scrollbar pb-2">
              {EDITORIAL_CARDS.map((card, index) => (
                <div
                  key={card.id}
                  className="shrink-0"
                  style={{
                    transform: \`translate3d(0, \${cardStates[index].translateY}, 0) scale(\${cardStates[index].scale})\`,
                    opacity: cardStates[index].opacity,
                    willChange: "transform, opacity",
                  }}
                >
                  <Link
                    href={card.href}
                    aria-label={\`Explore \${card.category} Collection\`}
                    className="group relative block h-[76vh] sm:h-[80vh] md:h-[83vh] max-h-[780px] aspect-[3/5] max-w-[calc((100vw-48px)/3)] md:max-w-none rounded-[18px] sm:rounded-[22px] md:rounded-[24px] overflow-hidden bg-[#181818] shadow-2xl transition-all duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer select-none"
                    style={{
                      pointerEvents: cardStates[index].opacity > 0.4 ? "auto" : "none",
                    }}
                  >
                    {/* Background Editorial Image */}
                    <Image
                      src={card.image}
                      alt={\`PABLO \${card.category} Collection\`}
                      fill
                      sizes="(max-width: 768px) 80vw, 450px"
                      priority={index === 0}
                      className="object-cover object-center w-full h-full select-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />

                    {/* Top Subtle Vignette */}
                    <div
                      className="absolute inset-x-0 top-0 h-24 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Bottom Vignette for High Text Legibility */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-52 sm:h-60 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Centered Typography at Bottom (Rolex Style) */}
                    <div className="absolute inset-x-0 bottom-0 z-20 pb-8 sm:pb-9 md:pb-10 px-5 text-center flex flex-col items-center justify-end pointer-events-none">
                      <span className="text-[10.5px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.28em] text-white/80 block mb-1.5 transition-colors duration-300 group-hover:text-white">
                        {card.subtitle}
                      </span>
                      <h3
                        className="text-2xl sm:text-3xl md:text-[2.6rem] lg:text-[2.85rem] font-normal text-white tracking-[0.02em] leading-tight transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
                        style={{
                          fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                        }}
                      >
                        {card.category}
                      </h3>
                    </div>

                    {/* Subtle Luxury Card Border */}
                    <div
                      className="absolute inset-0 rounded-[18px] sm:rounded-[22px] md:rounded-[24px] border border-white/15 group-hover:border-white/40 transition-colors duration-500 pointer-events-none z-20"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            LAYER 4: PROMOTIONAL TICKER`;

if (oldLayer3Regex.test(content)) {
  content = content.replace(oldLayer3Regex, newLayer3);
} else {
  console.error("Warning: oldLayer3Regex did not match!");
}

// Update reduced motion fallback
const oldReducedMotionRegex = /<section id="editorial-collections" className="w-full py-12 sm:py-16 bg-\[#EAE8E1\] text-\[#111111\]">[\s\S]*?<\/section>/;

const newReducedMotion = `<section id="editorial-collections" className="w-full py-12 sm:py-16 bg-[#EAE8E1] text-[#111111]">
          <div className="w-full flex items-center justify-center px-2 sm:px-4">
            <div className="flex justify-center items-center gap-2.5 sm:gap-3 md:gap-3.5">
              {EDITORIAL_CARDS.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group relative block h-[76vh] sm:h-[80vh] md:h-[83vh] max-h-[780px] aspect-[3/5] rounded-[18px] sm:rounded-[22px] md:rounded-[24px] overflow-hidden bg-[#181818] shadow-2xl"
                >
                  <Image
                    src={card.image}
                    alt={\`PABLO \${card.category}\`}
                    fill
                    sizes="(max-width: 768px) 80vw, 450px"
                    className="object-cover object-center w-full h-full"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 pb-8 sm:pb-10 px-5 text-center flex flex-col items-center">
                    <span className="text-[10.5px] uppercase tracking-[0.28em] text-white/80 block mb-1.5 font-medium">
                      {card.subtitle}
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl font-normal text-white"
                      style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
                    >
                      {card.category}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>`;

if (oldReducedMotionRegex.test(content)) {
  content = content.replace(oldReducedMotionRegex, newReducedMotion);
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated HeroSection.tsx with exact 3:5 Rolex ratio and 12px gaps');
