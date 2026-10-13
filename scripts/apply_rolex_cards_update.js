const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'sections', 'HeroSection.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update cardStates calculation for pronounced Rolex vertical staggered scroll entrance
const oldCardStatesRegex = /const cardStates = EDITORIAL_CARDS\.map\(\(_, idx\) => \{[\s\S]*?return \{ translateY, opacity, scale \};\s*\}\);/;

const newCardStates = `const cardStates = EDITORIAL_CARDS.map((_, idx) => {
    if (prefersReducedMotion) {
      return { translateY: "0px", opacity: 1, scale: 1 };
    }
    // Stagger starts: Men: 0.04, Women: 0.11, Kids: 0.18
    // Settle targets: Men: 0.24, Women: 0.31, Kids: 0.38
    // All cards fully settled by p = 0.38 (a single scroll)
    const startP = 0.04 + idx * 0.07;
    const endP = startP + 0.20;
    const rawT = Math.min(1, Math.max(0, (progress - startP) / (endP - startP)));
    const e = easeOutCubic(rawT);
    // Distinct vertical translation matching the Rolex video entrance (220px stagger)
    const translateY = \`\${(1 - e) * 220}px\`;
    const opacity = Math.min(1, Math.max(0, e * 1.6));
    const scale = 0.96 + e * 0.04;
    return { translateY, opacity, scale };
  });`;

if (oldCardStatesRegex.test(content)) {
  content = content.replace(oldCardStatesRegex, newCardStates);
} else {
  console.error("Warning: oldCardStatesRegex did not match!");
}

// 2. Update reduced motion fallback section
const oldReducedMotionSec = `<section id="editorial-collections" className="w-full py-16 sm:py-24 bg-[#EAE8E1] text-[#111111]">
          <div className="page-container w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {EDITORIAL_CARDS.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group relative block w-full aspect-[3/4.2] rounded-[22px] overflow-hidden bg-[#181818] shadow-xl"
                >
                  <Image
                    src={card.image}
                    alt={\`PABLO \${card.category}\`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center w-full h-full"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 pb-8 px-4 text-center flex flex-col items-center">
                    <span className="text-[10.5px] uppercase tracking-[0.26em] text-white/80 block mb-1">
                      {card.subtitle}
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-normal text-white"
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

const newReducedMotionSec = `<section id="editorial-collections" className="w-full py-12 sm:py-16 bg-[#EAE8E1] text-[#111111]">
          <div className="page-container w-full max-w-[1420px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
              {EDITORIAL_CARDS.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group relative block w-full h-[78vh] sm:h-[82vh] md:h-[84vh] max-h-[820px] min-h-[560px] rounded-[22px] md:rounded-[26px] overflow-hidden bg-[#181818] shadow-2xl"
                >
                  <Image
                    src={card.image}
                    alt={\`PABLO \${card.category}\`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center w-full h-full"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 pb-10 sm:pb-12 px-6 text-center flex flex-col items-center">
                    <span className="text-[11px] uppercase tracking-[0.28em] text-white/80 block mb-1.5 font-medium">
                      {card.subtitle}
                    </span>
                    <h3
                      className="text-3xl sm:text-4xl md:text-5xl font-normal text-white"
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

if (content.includes(oldReducedMotionSec)) {
  content = content.replace(oldReducedMotionSec, newReducedMotionSec);
}

// 3. Update targetScroll in handleScrollToCards to 0.40
content = content.replace(
  '(outerHeight - window.innerHeight) * 0.45;',
  '(outerHeight - window.innerHeight) * 0.40;'
);

// 4. Update Layer 3: larger size (h-[82vh] md:h-[84vh] max-h-[820px]), wider max-w-[1420px], generous padding and text
const oldLayer3Regex = /\{\/\* ═+\s+LAYER 3: COLLECTION TRANSITION LAYER[\s\S]*?\{\/\* ═+\s+LAYER 4: PROMOTIONAL TICKER/;

const newLayer3 = `{\/* ══════════════════════════════════════════════════════════════════
            LAYER 3: COLLECTION TRANSITION LAYER (3 Tall Rolex-Style Cards)
            Z-INDEX: 20 — Physically overlays the blurred hero scene.
            Cards occupy ~84vh of viewport, tall and slender, matching Rolex layout.
        ═══════════════════════════════════════════════════════════════════ *\/}
        <div
          id="editorial-collections"
          aria-label="PABLO Featured Editorial Collections"
          className="absolute inset-0 z-20 flex items-center justify-center px-3 sm:px-6 md:px-8 lg:px-10"
          style={{
            pointerEvents: progress >= 0.18 ? "auto" : "none",
          }}
        >
          <div className="w-full max-w-[1420px] mx-auto flex items-center justify-center">
            {/* ── 3 ROLEX-STYLE CARDS (MEN, WOMEN, KIDS) RISING OVER BLURRED HERO ── */}
            <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 w-full justify-center items-center overflow-x-auto md:overflow-visible no-scrollbar pb-2">
              {EDITORIAL_CARDS.map((card, index) => (
                <div
                  key={card.id}
                  className="w-[84vw] shrink-0 md:w-full md:shrink"
                  style={{
                    transform: \`translate3d(0, \${cardStates[index].translateY}, 0) scale(\${cardStates[index].scale})\`,
                    opacity: cardStates[index].opacity,
                    willChange: "transform, opacity",
                  }}
                >
                  <Link
                    href={card.href}
                    aria-label={\`Explore \${card.category} Collection\`}
                    className="group relative block w-full h-[76vh] sm:h-[80vh] md:h-[83vh] max-h-[820px] min-h-[550px] rounded-[20px] sm:rounded-[24px] md:rounded-[26px] overflow-hidden bg-[#181818] shadow-2xl transition-all duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer select-none"
                    style={{
                      pointerEvents: cardStates[index].opacity > 0.4 ? "auto" : "none",
                    }}
                  >
                    {/* Background Editorial Image */}
                    <Image
                      src={card.image}
                      alt={\`PABLO \${card.category} Collection\`}
                      fill
                      sizes="(max-width: 768px) 85vw, 33vw"
                      priority={index === 0}
                      className="object-cover object-center w-full h-full select-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />

                    {/* Top Subtle Vignette */}
                    <div
                      className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Bottom Vignette for High Text Legibility */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-56 sm:h-64 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Centered Typography at Bottom (Rolex Style) */}
                    <div className="absolute inset-x-0 bottom-0 z-20 pb-9 sm:pb-11 md:pb-12 px-6 text-center flex flex-col items-center justify-end pointer-events-none">
                      <span className="text-[11px] sm:text-[12px] font-sans font-medium uppercase tracking-[0.28em] text-white/80 block mb-2 transition-colors duration-300 group-hover:text-white">
                        {card.subtitle}
                      </span>
                      <h3
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-normal text-white tracking-[0.02em] leading-tight transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
                        style={{
                          fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                        }}
                      >
                        {card.category}
                      </h3>
                    </div>

                    {/* Subtle Luxury Card Border */}
                    <div
                      className="absolute inset-0 rounded-[20px] sm:rounded-[24px] md:rounded-[26px] border border-white/15 group-hover:border-white/40 transition-colors duration-500 pointer-events-none z-20"
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

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated HeroSection.tsx with large Rolex cards and staggered entrance!');
