const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Let's create an editorial luxury vector typography component for NEW ARRIVALS
// Anatomy inspired directly by Image 2 (AMURA by ravine.brand):
// - Thick vertical stems (width ~ 14px in a 100px height grid)
// - Hairlines (~ 1px)
// - Distinctive swan-neck curved flourish on 'A' (sweeping down and left below baseline, curling up)
// - Flowing ribbon wave leg on 'R' (high compact bowl + organic sweeping tail)
// - Architectural vertical N, E, W, I, V, L
// - Sculptural high-contrast S

const svgNewArrivals = `
<svg viewBox="0 0 880 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="editorial-title-svg" style="overflow: visible; height: 100%; width: auto; max-width: 100%;">
  <defs>
    <!-- Optional subtle gradient if needed, but fill='currentColor' ensures pure brand matching -->
  </defs>

  <!-- ==================== "NEW" ==================== -->
  <g class="word-new" transform="translate(0, 0)">
    <!-- N: Thick left vertical stem, hairline top serif, hairline diagonal, thick right vertical stem -->
    <!-- Left vertical stem -->
    <path d="M 12 18 L 30 18 L 30 92 L 12 92 Z" />
    <!-- Left top serif -->
    <path d="M 6 18 L 36 18 L 36 21 L 6 21 Z" />
    <!-- Left bottom serif -->
    <path d="M 6 89 L 36 89 L 36 92 L 6 92 Z" />
    <!-- Diagonal stroke: starts thick at top-left, tapers to hairline at bottom-right -->
    <path d="M 30 18 L 84 92 L 74 92 L 30 28 Z" />
    <!-- Right vertical stem -->
    <path d="M 76 18 L 94 18 L 94 92 L 76 92 Z" />
    <!-- Right top serif -->
    <path d="M 70 18 L 100 18 L 100 21 L 70 21 Z" />
    <!-- Right bottom serif -->
    <path d="M 70 89 L 100 89 L 100 92 L 70 92 Z" />

    <!-- E: Thick vertical stem, razor-thin horizontal bars with sculpted terminals -->
    <!-- Vertical stem -->
    <path d="M 124 18 L 142 18 L 142 92 L 124 92 Z" />
    <!-- Top serif / bar -->
    <path d="M 118 18 L 186 18 L 186 28 L 183 28 C 182 22 176 21 142 21 L 118 21 Z" />
    <!-- Middle bar: thin with delicate terminal -->
    <path d="M 142 53 L 172 53 C 176 53 178 54 178 57 L 178 58 L 142 55 Z" />
    <line x1="142" y1="54" x2="174" y2="54" stroke="currentColor" stroke-width="1.8" />
    <!-- Bottom serif / bar -->
    <path d="M 118 89 L 142 89 L 178 89 C 182 89 184 90 186 92 L 118 92 Z" />
    <path d="M 142 90 L 188 90 L 188 80 L 185 80 C 184 86 178 89 142 89 Z" />

    <!-- W: Intersecting sculptural diagonals -->
    <!-- First downstroke (thick) -->
    <path d="M 212 18 L 228 18 L 244 92 L 232 92 Z" />
    <path d="M 206 18 L 232 18 L 232 20.5 L 206 20.5 Z" />
    <!-- First upstroke (hairline) -->
    <line x1="240" y1="92" x2="260" y2="30" stroke="currentColor" stroke-width="1.8" />
    <!-- Second downstroke (thick) -->
    <path d="M 256 30 L 268 30 L 282 92 L 270 92 Z" />
    <!-- Second upstroke (hairline) -->
    <line x1="278" y1="92" x2="300" y2="18" stroke="currentColor" stroke-width="1.8" />
    <path d="M 294 18 L 306 18 L 306 20.5 L 294 20.5 Z" />
  </g>

  <!-- ==================== "ARRIVALS" ==================== -->
  <g class="word-arrivals" transform="translate(350, 0)">
    <!-- A: SIGNATURE FLOURISH (Directly from Image 2 AMURA) -->
    <!-- Left sweeping swan-neck flourish -->
    <!-- Curves gracefully out to the left below baseline, curls up with an elegant finial -->
    <path d="
      M 48 54
      C 40 40, 24 34, 14 44
      C 4 54, 2 72, 10 86
      C 16 98, 28 104, 38 102
      C 48 100, 52 90, 50 82
      C 48 76, 42 74, 38 78
      C 34 82, 34 88, 38 90
      C 32 90, 24 84, 20 74
      C 16 64, 18 52, 26 44
      C 32 38, 42 42, 48 54 Z
    " />
    <path d="
      M 48 54
      C 34 50, 16 54, 8 68
      C 0 82, 4 98, 16 106
      C 26 112, 42 110, 50 96
      C 54 88, 52 76, 44 74
      C 38 72, 32 78, 36 84
      C 38 88, 44 88, 46 84
      C 46 82, 44 80, 42 80
      C 40 80, 38 82, 38 84
      C 36 84, 34 80, 36 76
      C 40 68, 48 68, 52 76
      C 56 86, 48 102, 36 104
      C 22 106, 8 96, 4 80
      C 2 64, 12 48, 28 42
      C 38 38, 48 44, 52 54 Z
    " />
    <!-- Hairline crossbar of A -->
    <line x1="28" y1="65" x2="62" y2="65" stroke="currentColor" stroke-width="1.6" />
    <!-- Thick right stem of A -->
    <path d="M 52 18 L 68 18 L 84 92 L 68 92 Z" />
    <!-- Top & bottom serifs of A -->
    <path d="M 46 18 L 72 18 L 72 21 L 46 21 Z" />
    <path d="M 64 89 L 90 89 L 90 92 L 64 92 Z" />

    <!-- R1: SIGNATURE CURVED RIBBON LEG (Directly from Image 2 AMURA) -->
    <!-- Left vertical stem -->
    <path d="M 104 18 L 120 18 L 120 92 L 104 92 Z" />
    <path d="M 98 18 L 126 18 L 126 21 L 98 21 Z" />
    <path d="M 98 89 L 126 89 L 126 92 L 98 92 Z" />
    <!-- High compact upper bowl -->
    <path d="
      M 120 18
      L 144 18
      C 156 18, 164 24, 164 36
      C 164 48, 154 54, 140 54
      L 120 54 Z
    " />
    <!-- Inner cutout of bowl -->
    <path d="
      M 122 21
      L 142 21
      C 150 21, 155 25, 155 36
      C 155 47, 148 51, 140 51
      L 122 51 Z
    " fill="#EAE8E1" />
    <!-- Dramatic flowing curved wave tail of R swooping to the right -->
    <path d="
      M 134 52
      C 142 52, 150 56, 152 64
      C 156 74, 162 88, 178 92
      C 186 94, 194 92, 198 88
      C 192 90, 184 88, 178 84
      C 170 78, 164 66, 158 58
      C 152 50, 142 48, 134 52 Z
    " />

    <!-- R2: Intertwining second R -->
    <g transform="translate(68, 0)">
      <path d="M 104 18 L 120 18 L 120 92 L 104 92 Z" />
      <path d="M 98 18 L 126 18 L 126 21 L 98 21 Z" />
      <path d="M 98 89 L 126 89 L 126 92 L 98 92 Z" />
      <path d="
        M 120 18
        L 144 18
        C 156 18, 164 24, 164 36
        C 164 48, 154 54, 140 54
        L 120 54 Z
      " />
      <path d="
        M 122 21
        L 142 21
        C 150 21, 155 25, 155 36
        C 155 47, 148 51, 140 51
        L 122 51 Z
      " fill="#EAE8E1" />
      <path d="
        M 134 52
        C 142 52, 150 56, 152 64
        C 156 74, 162 88, 178 92
        C 186 94, 194 92, 198 88
        C 192 90, 184 88, 178 84
        C 170 78, 164 66, 158 58
        C 152 50, 142 48, 134 52 Z
      " />
    </g>

    <!-- I: Architectural vertical column -->
    <g transform="translate(142, 0)">
      <path d="M 112 18 L 126 18 L 126 92 L 112 92 Z" />
      <path d="M 104 18 L 134 18 L 134 21 L 104 21 Z" />
      <path d="M 104 89 L 134 89 L 134 92 L 104 92 Z" />
    </g>

    <!-- V: Thick downstroke, hairline upstroke -->
    <g transform="translate(182, 0)">
      <path d="M 108 18 L 124 18 L 138 92 L 126 92 Z" />
      <path d="M 102 18 L 128 18 L 128 20.5 L 102 20.5 Z" />
      <line x1="134" y1="92" x2="162" y2="18" stroke="currentColor" stroke-width="1.8" />
      <path d="M 156 18 L 168 18 L 168 20.5 L 156 20.5 Z" />
    </g>

    <!-- A2: Elegant echo of the signature A -->
    <g transform="translate(254, 0)">
      <path d="
        M 48 54
        C 40 40, 24 34, 14 44
        C 4 54, 2 72, 10 86
        C 16 98, 28 104, 38 102
        C 48 100, 52 90, 50 82
        C 48 76, 42 74, 38 78
        C 34 82, 34 88, 38 90
        C 32 90, 24 84, 20 74
        C 16 64, 18 52, 26 44
        C 32 38, 42 42, 48 54 Z
      " />
      <line x1="28" y1="65" x2="62" y2="65" stroke="currentColor" stroke-width="1.6" />
      <path d="M 52 18 L 68 18 L 84 92 L 68 92 Z" />
      <path d="M 46 18 L 72 18 L 72 21 L 46 21 Z" />
      <path d="M 64 89 L 90 89 L 90 92 L 64 92 Z" />
    </g>

    <!-- L: Tall vertical with razor-thin baseline serif -->
    <g transform="translate(340, 0)">
      <path d="M 18 18 L 34 18 L 34 92 L 18 92 Z" />
      <path d="M 12 18 L 40 18 L 40 21 L 12 21 Z" />
      <path d="M 18 89 L 64 89 L 64 82 L 67 82 C 67 88 65 92 60 92 L 12 92 L 12 89 Z" />
    </g>

    <!-- S: SCULPTURAL HIGH-FASHION S -->
    <g transform="translate(400, 0)">
      <!-- S with dramatic central thick diagonal curve and razor hairlines with teardrop finials -->
      <path d="
        M 56 30
        C 52 24, 44 19, 32 19
        C 18 19, 8 26, 8 38
        C 8 50, 20 56, 34 60
        C 48 64, 58 70, 58 80
        C 58 90, 46 95, 32 95
        C 18 95, 8 88, 4 80
        L 8 76
        C 12 84, 22 92, 34 92
        C 44 92, 52 87, 52 79
        C 52 69, 40 64, 26 59
        C 14 55, 4 48, 4 37
        C 4 24, 16 16, 32 16
        C 46 16, 56 22, 60 28 Z
      " />
      <!-- Teardrop terminals -->
      <circle cx="58" cy="30" r="3" />
      <circle cx="6" cy="78" r="3" />
    </g>
  </g>
</svg>
`;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { background: #EAE8E1; color: #111111; padding: 60px; font-family: sans-serif; }
          .container { max-width: 1000px; margin: 0 auto; background: #fff; padding: 50px; border: 1px solid #D9D8D3; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.28em; color: #666; margin-bottom: 12px; }
          .svg-wrap { height: 75px; width: auto; color: #111111; margin-bottom: 40px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="label">Sculptural Editorial Display (Inspired by Image 2 AMURA):</div>
          <div class="svg-wrap">
            ${svgNewArrivals}
          </div>
        </div>
      </body>
    </html>
  `);

  const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928';
  const outPath = path.join(artifactDir, 'test_svg_new_arrivals.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
