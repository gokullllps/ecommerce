const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'sections', 'HeroSection.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add EDITORIAL_CARDS definition
const editorialCardsDef = `interface EditorialCardItem {
  id: string;
  category: string;
  subtitle: string;
  image: string;
  href: string;
}

const EDITORIAL_CARDS: EditorialCardItem[] = [
  {
    id: "card-men",
    category: "Men",
    subtitle: "MENSWEAR",
    image: "/images/cards/card-men.jpg",
    href: "/men",
  },
  {
    id: "card-women",
    category: "Women",
    subtitle: "WOMENSWEAR",
    image: "/images/cards/card-women.jpg",
    href: "/women",
  },
  {
    id: "card-kids",
    category: "Kids",
    subtitle: "KIDSWEAR",
    image: "/images/cards/card-kids.jpg",
    href: "/kids",
  },
];
`;

if (!content.includes('EDITORIAL_CARDS')) {
  content = content.replace(
    'type ModelFadeState = "initial-settle" | "initial-exit" | "female" | "male";',
    `${editorialCardsDef}\ntype ModelFadeState = "initial-settle" | "initial-exit" | "female" | "male";`
  );
}

// 2. Update isCardsVisible trigger from 0.12 to 0.02
content = content.replace(
  'const isCardsVisible = progress >= 0.12 && progress < 0.95;',
  'const isCardsVisible = progress >= 0.02 && progress < 0.96;'
);

// 3. Update reduced motion collections section
const oldReducedMotionSec = `<section id="editorial-collections" className="w-full py-16 sm:py-24 bg-[#EAE8E1] text-[#111111]">
          <div className="page-container w-full">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 pb-4 border-b border-[#D9D8D3]">
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#666666] font-medium block mb-2">CAMPAIGN EDITIONS · AUTUMN / WINTER 2026</span>
                <h2 className="text-3xl sm:text-5xl font-normal uppercase tracking-[0.04em] text-[#111111]" style={{ fontFamily: "var(--font-editorial, 'Cormorant Garamond', serif)" }}>COLLECTIONS</h2>
              </div>
              <Link href="/men" className="mt-4 md:mt-0 text-xs uppercase tracking-[0.24em] font-medium text-[#111111]">VIEW ALL →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {editorialCollections.map((col, index) => (
                <CollectionCard key={col.id || col.slug || index} collection={col} index={index} forceVisible={true} />
              ))}
            </div>
          </div>
        </section>`;

const newReducedMotionSec = `<section id="editorial-collections" className="w-full py-16 sm:py-24 bg-[#EAE8E1] text-[#111111]">
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

if (content.includes(oldReducedMotionSec)) {
  content = content.replace(oldReducedMotionSec, newReducedMotionSec);
}

// 4. Update container height to 240vh
content = content.replace('style={{ height: "300vh" }}', 'style={{ height: "240vh" }}');

// 5. Update scroll interpolation math
const oldScrollMathRegex = /\/\/ ─── SCROLL INTERPOLATION VALUES ───[\s\S]*?const headerTranslateY = \(1 - easeInOut\(headerT\)\) \* -18;/;

const newScrollMath = `// ─── SCROLL INTERPOLATION VALUES ───────────────────────────────────────────
  // Stage 1 (p <= 0.02): Original hero, completely sharp (blur 0px)
  // Stage 2 (p: 0.02 -> 0.30): Hero scene gradually blurs from 0px to 14px
  // Stage 3 & 4 (p >= 0.30): Hero scene stays blurred at 14px behind cards
  const blurProgress = prefersReducedMotion
    ? 0
    : progress <= 0.02
    ? 0
    : Math.min(1, (progress - 0.02) / 0.28);
  const blurAmount = easeInOut(blurProgress) * 14;

  // Hero interactive controls (CTAs and overlines) fade out as blur starts
  const heroUiFade = prefersReducedMotion
    ? 1
    : progress <= 0.02
    ? 1
    : Math.max(0, 1 - (progress - 0.02) / 0.14);

  // Ticker slides down and fades out during stage 2
  const tickerProgress = prefersReducedMotion
    ? 0
    : progress <= 0.02
    ? 0
    : Math.min(1, (progress - 0.02) / 0.14);
  const tickerTranslateY = tickerProgress * 105;
  const tickerOpacity = 1 - tickerProgress;

  // Coordinated staggered entrance for the 3 Rolex-style cards
  // Smoothly enter one by one, all fully visible & settled by p = 0.42 (single scroll)
  const cardStates = EDITORIAL_CARDS.map((_, idx) => {
    if (prefersReducedMotion) {
      return { translateY: "0px", opacity: 1, scale: 1 };
    }
    const startP = 0.06 + idx * 0.08; // Men: 0.06, Women: 0.14, Kids: 0.22
    const endP = startP + 0.20;       // Men: 0.26, Women: 0.34, Kids: 0.42
    const rawT = Math.min(1, Math.max(0, (progress - startP) / (endP - startP)));
    const e = easeOutCubic(rawT);
    const translateY = \`\${(1 - e) * 75}px\`;
    const opacity = Math.min(1, e * 1.5);
    const scale = 0.94 + e * 0.06;
    return { translateY, opacity, scale };
  });`;

if (oldScrollMathRegex.test(content)) {
  content = content.replace(oldScrollMathRegex, newScrollMath);
}

// 6. Update handleScrollToCards targetScroll multiplier from 0.82 to 0.45
content = content.replace(
  '(outerHeight - window.innerHeight) * 0.82;',
  '(outerHeight - window.innerHeight) * 0.45;'
);

// 7. Replace Layer 3 (remove Collections header, render 3 Rolex-style cards)
const layer3Regex = /\{\/\* ═+\s+LAYER 3: COLLECTION TRANSITION LAYER[\s\S]*?\{\/\* ═+\s+LAYER 4: PROMOTIONAL TICKER/;

const newLayer3 = `{\/* ══════════════════════════════════════════════════════════════════
            LAYER 3: COLLECTION TRANSITION LAYER (3 Rolex-Style Editorial Cards)
            Z-INDEX: 20 — Physically overlays the blurred hero scene.
            Cards have 22-26px rounded edges, rising smoothly over the blurred hero.
        ═══════════════════════════════════════════════════════════════════ *\/}
        <div
          id="editorial-collections"
          aria-label="PABLO Featured Editorial Collections"
          className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6 md:px-10 lg:px-14"
          style={{
            pointerEvents: progress >= 0.20 ? "auto" : "none",
          }}
        >
          <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
            {/* ── 3 ROLEX-STYLE CARDS (MEN, WOMEN, KIDS) RISING OVER BLURRED HERO ── */}
            <div className="flex md:grid md:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8 w-full max-w-5xl justify-center items-center overflow-x-auto md:overflow-visible no-scrollbar pb-2">
              {EDITORIAL_CARDS.map((card, index) => (
                <div
                  key={card.id}
                  className="w-[82vw] shrink-0 md:w-full md:shrink"
                  style={{
                    transform: \`translate3d(0, \${cardStates[index].translateY}, 0) scale(\${cardStates[index].scale})\`,
                    opacity: cardStates[index].opacity,
                    willChange: "transform, opacity",
                  }}
                >
                  <Link
                    href={card.href}
                    aria-label={\`Explore \${card.category} Collection\`}
                    className="group relative block w-full aspect-[3/4.2] max-h-[580px] rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#181818] shadow-2xl transition-all duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer select-none"
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
                          "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Bottom Vignette for High Text Legibility */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-44 sm:h-52 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 60%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Centered Typography at Bottom (Rolex Style) */}
                    <div className="absolute inset-x-0 bottom-0 z-20 pb-8 sm:pb-10 px-5 text-center flex flex-col items-center justify-end pointer-events-none">
                      <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.28em] text-white/80 block mb-1.5 transition-colors duration-300 group-hover:text-white">
                        {card.subtitle}
                      </span>
                      <h3
                        className="text-2xl sm:text-3xl lg:text-[2.2rem] font-normal text-white tracking-[0.02em] leading-tight transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
                        style={{
                          fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                        }}
                      >
                        {card.category}
                      </h3>
                    </div>

                    {/* Subtle Luxury Card Border */}
                    <div
                      className="absolute inset-0 rounded-[22px] sm:rounded-[26px] border border-white/15 group-hover:border-white/40 transition-colors duration-500 pointer-events-none z-20"
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

if (layer3Regex.test(content)) {
  content = content.replace(layer3Regex, newLayer3);
} else {
  console.error("Warning: layer3Regex did not match!");
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated HeroSection.tsx');
