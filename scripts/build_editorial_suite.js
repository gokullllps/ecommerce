const fs = require('fs');
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Read the pure SVG paths of A and R
const svgA = fs.readFileSync('scripts/letter_A.svg', 'utf8');
const svgR = fs.readFileSync('scripts/letter_R.svg', 'utf8');

const pathA = svgA.match(/d="([^"]+)"/)[1];
const pathR = svgR.match(/d="([^"]+)"/)[1];

// letter_A.svg has viewBox "0 0 183 158"
// In letter_A: apex is at y ~31, baseline is at y ~153. Height of letter ~122.
// Width of A from left swash tip to right stem is ~180.

// letter_R.svg has viewBox "0 0 131 158"
// In letter_R: top is at y ~31, baseline is at y ~153. Height ~122.
// Width of R from left stem to ribbon tail is ~130.

// Let's create an art-directed SVG composition for "NEW ARRIVALS"
// All letters rendered at the exact same scale and baseline (Y=153)!

const newArrivalsSvg = `
<svg viewBox="0 0 1060 170" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="editorial-wordmark-svg" style="display: block; width: 100%; height: auto; max-height: 100%; overflow: visible;">
  
  <!-- ==================== "NEW" ==================== -->
  <g class="word-new" transform="translate(0, 0)">
    <!-- N -->
    <g transform="translate(0, 0)">
      <!-- Left thick stem -->
      <rect x="18" y="32" width="13.5" height="121" stroke="none" />
      <rect x="8" y="32" width="28" height="2" stroke="none" />
      <rect x="8" y="151" width="28" height="2" stroke="none" />
      <!-- Diagonal hairline -->
      <line x1="31.5" y1="32" x2="88" y2="153" stroke-width="1.8" />
      <!-- Right thick stem -->
      <rect x="88" y="32" width="13.5" height="121" stroke="none" />
      <rect x="78" y="32" width="28" height="2" stroke="none" />
      <rect x="78" y="151" width="28" height="2" stroke="none" />
    </g>

    <!-- E -->
    <g transform="translate(130, 0)">
      <!-- Vertical thick stem -->
      <rect x="18" y="32" width="13.5" height="121" stroke="none" />
      <rect x="8" y="32" width="28" height="2" stroke="none" />
      <rect x="8" y="151" width="28" height="2" stroke="none" />
      <!-- Top arm -->
      <line x1="31.5" y1="33" x2="84" y2="33" stroke-width="1.8" />
      <polygon points="81,33 84,33 84,46 81.5,46" stroke="none" />
      <!-- Mid arm -->
      <line x1="31.5" y1="92" x2="72" y2="92" stroke-width="1.8" />
      <!-- Bottom arm -->
      <line x1="31.5" y1="152" x2="86" y2="152" stroke-width="1.8" />
      <polygon points="83,152 86,152 86,139 83.5,139" stroke="none" />
    </g>

    <!-- W -->
    <g transform="translate(238, 0)">
      <!-- Downstroke 1 (thick) -->
      <polygon points="12,32 26,32 50,153 36,153" stroke="none" />
      <rect x="6" y="32" width="26" height="2" stroke="none" />
      <!-- Upstroke 1 (hairline) -->
      <line x1="48" y1="153" x2="72" y2="32" stroke-width="1.8" />
      <!-- Downstroke 2 (thick) -->
      <polygon points="68,32 82,32 106,153 92,153" stroke="none" />
      <!-- Upstroke 2 (hairline) -->
      <line x1="104" y1="153" x2="128" y2="32" stroke-width="1.8" />
      <rect x="120" y="32" width="22" height="2" stroke="none" />
    </g>
  </g>

  <!-- ==================== "ARRIVALS" ==================== -->
  <!-- Luxurious editorial space between NEW and ARRIVALS -->
  <g class="word-arrivals" transform="translate(420, 0)">
    <!-- A1 (Signature AMURA Swan-Neck Swash) -->
    <g transform="translate(0, 0)">
      <path d="${pathA}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- R1 (Signature AMURA Organic Wave Ribbon Leg) -->
    <g transform="translate(138, 0)">
      <path d="${pathR}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- R2 (Signature AMURA Organic Wave Ribbon Leg) -->
    <g transform="translate(244, 0)">
      <path d="${pathR}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- I -->
    <g transform="translate(366, 0)">
      <rect x="16" y="32" width="13.5" height="121" stroke="none" />
      <rect x="6" y="32" width="33.5" height="2" stroke="none" />
      <rect x="6" y="151" width="33.5" height="2" stroke="none" />
    </g>

    <!-- V -->
    <g transform="translate(422, 0)">
      <!-- Left downstroke (thick) -->
      <polygon points="12,32 26,32 50,153 36,153" stroke="none" />
      <rect x="6" y="32" width="26" height="2" stroke="none" />
      <!-- Right upstroke (hairline) -->
      <line x1="48" y1="153" x2="76" y2="32" stroke-width="1.8" />
      <rect x="68" y="32" width="22" height="2" stroke="none" />
    </g>

    <!-- A2 (Signature AMURA Swan-Neck Swash) -->
    <g transform="translate(510, 0)">
      <path d="${pathA}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- L -->
    <g transform="translate(648, 0)">
      <rect x="18" y="32" width="13.5" height="121" stroke="none" />
      <rect x="8" y="32" width="28" height="2" stroke="none" />
      <line x1="31.5" y1="152" x2="70" y2="152" stroke-width="1.8" />
      <polygon points="67,152 70,152 70,139 67.5,139" stroke="none" />
    </g>

    <!-- S (Sculptural High-Contrast Serif S) -->
    <g transform="translate(732, 0)">
      <path d="
        M 62 48
        C 56 38, 45 32, 34 32
        C 20 32, 8 40, 8 54
        C 8 68, 20 76, 36 82
        C 54 88, 66 96, 66 112
        C 66 128, 50 138, 32 138
        C 18 138, 6 128, 2 116
        L 6 112
        C 10 123, 20 133, 33 133
        C 46 133, 58 125, 58 112
        C 58 98, 44 91, 26 85
        C 12 79, 2 69, 2 54
        C 2 38, 16 27, 34 27
        C 48 27, 60 35, 64 45 Z
      " stroke="none" />
      <!-- Delicate finials -->
      <circle cx="63" cy="47" r="3.2" stroke="none" />
      <circle cx="4" cy="114" r="3.2" stroke="none" />
    </g>
  </g>
</svg>
`;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1100']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #EAE8E1; color: #111111; font-family: 'Inter', sans-serif; padding: 60px 48px; }
          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-bottom: 24px;
            border-bottom: 1px solid #D9D8D3;
            max-width: 1360px;
            margin: 0 auto;
          }
          .eyebrow {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.28em;
            color: #666666;
            font-weight: 500;
            margin-bottom: 14px;
          }
          .title-wrap {
            height: 48px;
            width: auto;
            color: #111111;
          }
          .view-all {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.22em;
            color: #111111;
            text-decoration: none;
            padding-bottom: 3px;
            border-bottom: 1px solid #111111;
          }
        </style>
      </head>
      <body>
        <div class="section-header">
          <div>
            <div class="eyebrow">THE LATEST FROM PABLO</div>
            <div class="title-wrap">
              ${newArrivalsSvg}
            </div>
          </div>
          <div>
            <a href="#" class="view-all">VIEW ALL NEW ARRIVALS &rarr;</a>
          </div>
        </div>
      </body>
    </html>
  `);

  const outPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\test_assembled_new_arrivals.png';
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);
  await browser.close();
}

main().catch(console.error);
