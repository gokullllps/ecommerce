const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Let's create high-precision SVG paths for NEW ARRIVALS
// Cap height: 74px (Y from 18 to 92). Baseline at Y=92.
// Stem thickness: 13px. Hairlines: 1.5px. Serifs: 2px height.

function getNewArrivalsSvg(color = '#111111') {
  return `
<svg viewBox="0 0 780 115" fill="${color}" stroke="${color}" xmlns="http://www.w3.org/2000/svg" class="editorial-heading-svg" style="display: block; width: auto; height: 100%; max-width: 100%; overflow: visible;">
  <!-- ================= N ================= -->
  <g transform="translate(0, 0)">
    <!-- Left vertical stem -->
    <rect x="8" y="18" width="13" height="74" stroke="none" />
    <!-- Left serifs -->
    <rect x="2" y="18" width="25" height="2" stroke="none" />
    <rect x="2" y="90" width="25" height="2" stroke="none" />
    <!-- Diagonal hairline -->
    <line x1="21" y1="18" x2="68" y2="92" stroke-width="1.6" />
    <!-- Right vertical stem -->
    <rect x="68" y="18" width="13" height="74" stroke="none" />
    <!-- Right serifs -->
    <rect x="62" y="18" width="25" height="2" stroke="none" />
    <rect x="62" y="90" width="25" height="2" stroke="none" />
  </g>

  <!-- ================= E ================= -->
  <g transform="translate(100, 0)">
    <!-- Vertical stem -->
    <rect x="8" y="18" width="13" height="74" stroke="none" />
    <rect x="2" y="18" width="25" height="2" stroke="none" />
    <rect x="2" y="90" width="25" height="2" stroke="none" />
    <!-- Top arm & terminal -->
    <line x1="21" y1="19" x2="60" y2="19" stroke-width="1.6" />
    <polygon points="57,19 60,19 60,28 58,28" stroke="none" />
    <!-- Middle arm -->
    <line x1="21" y1="55" x2="52" y2="55" stroke-width="1.6" />
    <!-- Bottom arm & terminal -->
    <line x1="21" y1="91" x2="62" y2="91" stroke-width="1.6" />
    <polygon points="59,91 62,91 62,82 60,82" stroke="none" />
  </g>

  <!-- ================= W ================= -->
  <g transform="translate(180, 0)">
    <!-- First downstroke (thick) -->
    <polygon points="4,18 17,18 35,92 23,92" stroke="none" />
    <rect x="0" y="18" width="21" height="2" stroke="none" />
    <!-- First upstroke (hairline) -->
    <line x1="33" y1="92" x2="52" y2="18" stroke-width="1.6" />
    <!-- Second downstroke (thick) -->
    <polygon points="49,18 61,18 78,92 67,92" stroke="none" />
    <!-- Second upstroke (hairline) -->
    <line x1="76" y1="92" x2="94" y2="18" stroke-width="1.6" />
    <rect x="87" y="18" width="16" height="2" stroke="none" />
  </g>

  <!-- ================= GAP BETWEEN NEW AND ARRIVALS ================= -->

  <!-- ================= A (SIGNATURE AMURA SWASH) ================= -->
  <g transform="translate(320, 0)">
    <!-- Apex top serif -->
    <rect x="24" y="18" width="26" height="2" stroke="none" />
    
    <!-- Signature Swan-Neck Left Swash (Direct reproduction of Image 2) -->
    <!-- From apex (35, 18), sweeps down to mid-height (24, 52), then swoops in a dramatic organic arc down below baseline to Y=106 and curls up to a sharp needle finial pointing left at (0, 72) -->
    <path d="
      M 34 19
      C 30 32, 24 45, 18 56
      C 10 70, 2 82, 4 96
      C 6 104, 14 109, 24 108
      C 34 106, 40 98, 42 88
      C 42 78, 35 72, 28 74
      C 22 76, 20 83, 24 88
      C 27 91, 31 90, 32 87
      C 32 85, 30 84, 28 85
      C 26 86, 25 84, 26 82
      C 29 76, 38 78, 38 88
      C 37 98, 29 104, 20 103
      C 10 102, 3 92, 2 82
      C 1 68, 12 52, 24 38
      C 28 32, 32 25, 34 19 Z
    " stroke="none" />

    <!-- Hairline Crossbar -->
    <line x1="16" y1="62" x2="52" y2="62" stroke-width="1.6" />

    <!-- Right Stem: Thick diagonal column slanting right -->
    <polygon points="34,18 47,18 72,92 59,92" stroke="none" />
    <!-- Bottom bilateral serif -->
    <rect x="52" y="90" width="28" height="2" stroke="none" />
  </g>

  <!-- ================= R1 (SIGNATURE AMURA RIBBON LEG) ================= -->
  <g transform="translate(406, 0)">
    <!-- Left vertical stem -->
    <rect x="8" y="18" width="13" height="74" stroke="none" />
    <rect x="2" y="18" width="25" height="2" stroke="none" />
    <rect x="2" y="90" width="25" height="2" stroke="none" />

    <!-- Compact upper bowl -->
    <!-- Top hairline arm -->
    <line x1="21" y1="19" x2="42" y2="19" stroke-width="1.6" />
    <!-- Outer bowl curve -->
    <path d="
      M 42 19
      C 54 19, 62 25, 62 36
      C 62 47, 54 53, 40 53
      L 21 53
    " fill="none" stroke-width="6" />
    <!-- Inner bowl clear / crisp hairline connection -->
    <line x1="21" y1="53" x2="42" y2="53" stroke-width="1.6" />

    <!-- Signature Organic Wave Ribbon Leg (Direct from Image 2) -->
    <!-- Starts at stem/bowl junction (34, 50), flows out into a sensual curve down to (74, 92) -->
    <path d="
      M 32 51
      C 42 51, 52 56, 54 66
      C 56 76, 62 88, 76 92
      C 82 93, 87 91, 88 88
      C 84 90, 78 88, 74 84
      C 68 78, 64 68, 58 60
      C 52 52, 42 49, 32 51 Z
    " stroke="none" />
  </g>

  <!-- ================= R2 (INTERTWINED SECOND R) ================= -->
  <g transform="translate(488, 0)">
    <rect x="8" y="18" width="13" height="74" stroke="none" />
    <rect x="2" y="18" width="25" height="2" stroke="none" />
    <rect x="2" y="90" width="25" height="2" stroke="none" />

    <line x1="21" y1="19" x2="42" y2="19" stroke-width="1.6" />
    <path d="
      M 42 19
      C 54 19, 62 25, 62 36
      C 62 47, 54 53, 40 53
      L 21 53
    " fill="none" stroke-width="6" />
    <line x1="21" y1="53" x2="42" y2="53" stroke-width="1.6" />

    <path d="
      M 32 51
      C 42 51, 52 56, 54 66
      C 56 76, 62 88, 76 92
      C 82 93, 87 91, 88 88
      C 84 90, 78 88, 74 84
      C 68 78, 64 68, 58 60
      C 52 52, 42 49, 32 51 Z
    " stroke="none" />
  </g>

  <!-- ================= I ================= -->
  <g transform="translate(574, 0)">
    <!-- Column -->
    <rect x="8" y="18" width="13" height="74" stroke="none" />
    <!-- Serifs -->
    <rect x="2" y="18" width="25" height="2" stroke="none" />
    <rect x="2" y="90" width="25" height="2" stroke="none" />
  </g>

  <!-- ================= V ================= -->
  <g transform="translate(612, 0)">
    <!-- Thick downstroke -->
    <polygon points="4,18 17,18 35,92 23,92" stroke="none" />
    <rect x="0" y="18" width="21" height="2" stroke="none" />
    <!-- Hairline upstroke -->
    <line x1="33" y1="92" x2="54" y2="18" stroke-width="1.6" />
    <rect x="47" y="18" width="15" height="2" stroke="none" />
  </g>

  <!-- ================= A2 (SIGNATURE AMURA SWASH) ================= -->
  <g transform="translate(674, 0)">
    <rect x="24" y="18" width="26" height="2" stroke="none" />
    <path d="
      M 34 19
      C 30 32, 24 45, 18 56
      C 10 70, 2 82, 4 96
      C 6 104, 14 109, 24 108
      C 34 106, 40 98, 42 88
      C 42 78, 35 72, 28 74
      C 22 76, 20 83, 24 88
      C 27 91, 31 90, 32 87
      C 32 85, 30 84, 28 85
      C 26 86, 25 84, 26 82
      C 29 76, 38 78, 38 88
      C 37 98, 29 104, 20 103
      C 10 102, 3 92, 2 82
      C 1 68, 12 52, 24 38
      C 28 32, 32 25, 34 19 Z
    " stroke="none" />
    <line x1="16" y1="62" x2="52" y2="62" stroke-width="1.6" />
    <polygon points="34,18 47,18 72,92 59,92" stroke="none" />
    <rect x="52" y="90" width="28" height="2" stroke="none" />
  </g>

  <!-- ================= L ================= -->
  <g transform="translate(754, 0)">
    <rect x="8" y="18" width="13" height="74" stroke="none" />
    <rect x="2" y="18" width="25" height="2" stroke="none" />
    <line x1="21" y1="91" x2="48" y2="91" stroke-width="1.6" />
    <polygon points="45,91 48,91 48,82 46,82" stroke="none" />
  </g>

  <!-- ================= S ================= -->
  <g transform="translate(812, 0)">
    <!-- Sculptural High-Fashion S with dramatic diagonal spine & razor hairlines -->
    <path d="
      M 46 29
      C 42 22, 34 18, 26 18
      C 15 18, 7 24, 7 34
      C 7 44, 16 49, 28 53
      C 42 57, 51 63, 51 74
      C 51 86, 39 93, 25 93
      C 14 93, 5 86, 2 77
      L 5 74
      C 8 82, 16 89, 26 89
      C 36 89, 44 83, 44 74
      C 44 65, 33 60, 20 56
      C 9 52, 2 45, 2 34
      C 2 22, 12 15, 26 15
      C 37 15, 45 20, 48 27 Z
    " stroke="none" />
    <!-- Delicate finial terminals -->
    <circle cx="47" cy="28" r="2.2" stroke="none" />
    <circle cx="4" cy="76" r="2.2" stroke="none" />
  </g>
</svg>
`;
}

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
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #EAE8E1; color: #111111; font-family: 'Inter', sans-serif; padding: 60px 40px; }
          .section-wrap { max-width: 1320px; margin: 0 auto; }
          .header-row { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 24px; border-bottom: 1px solid #D9D8D3; margin-bottom: 40px; }
          .eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.28em; color: #666666; font-weight: 500; margin-bottom: 16px; }
          .title-container { height: 52px; width: auto; color: #111111; }
          .link-right { font-size: 12px; text-transform: uppercase; letter-spacing: 0.22em; color: #111111; text-decoration: none; padding-bottom: 4px; border-bottom: 1px solid #111; }
        </style>
      </head>
      <body>
        <div class="section-wrap">
          <div class="header-row">
            <div>
              <div class="eyebrow">THE LATEST FROM PABLO</div>
              <div class="title-container">
                ${getNewArrivalsSvg('#111111')}
              </div>
            </div>
            <div>
              <a href="#" class="link-right">VIEW ALL NEW ARRIVALS &rarr;</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

  const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928';
  const outPath = path.join(artifactDir, 'test_refined_editorial_vector.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);
  await browser.close();
}

main().catch(console.error);
