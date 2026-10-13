const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Precision bezier paths modeled directly from crop_amura.png
// Cap Height = 100 (Y=20 to Y=120)
// Baseline = 120
// Stem width = 14
// Hairline stroke-width = 1.6

// Let's create reusable glyph generators:

function glyphA(withSwash = true) {
  // Directly calibrated against crop_amura.png:
  // Apex at (48, 20)
  // Left apex serif: (26, 20) to (50, 20)
  // Right thick stem: (42, 20) -> (56, 20) -> (88, 120) -> (74, 120)
  // Base serif: (60, 119.2) to (100, 119.2)
  // Crossbar: hairline from (24, 76) to (68, 76)
  // Left hairline: from (42, 20) to (24, 76)
  // Swash:
  // From (24, 76), curves out to the left:
  // Outer arc: curves left to (-2, 86), down to (4, 110), loops smoothly down to touch baseline at (28, 120)
  // In the first A with swan flourish:
  // Sweeps from (28, 120) down-left to (0, 120), swoops up-left in an elegant organic curve to (-42, 94),
  // with a sharp horizontal needle finial pointing left at (-54, 92)!
  
  if (!withSwash) {
    return `
      <g>
        <rect x="26" y="20" width="24" height="1.6" fill="currentColor" />
        <polygon points="42,20 56,20 88,120 74,120" fill="currentColor" />
        <rect x="60" y="118.4" width="40" height="1.6" fill="currentColor" />
        <line x1="42" y1="20" x2="20" y2="120" stroke="currentColor" stroke-width="1.6" />
        <rect x="10" y="118.4" width="22" height="1.6" fill="currentColor" />
        <line x1="24" y1="76" x2="68" y2="76" stroke="currentColor" stroke-width="1.6" />
      </g>
    `;
  }

  return `
    <g class="glyph-A">
      <!-- Apex horizontal hairline serif -->
      <rect x="24" y="20" width="26" height="1.6" fill="currentColor" />

      <!-- Right thick diagonal stem -->
      <polygon points="42,20 56,20 88,120 74,120" fill="currentColor" />
      <!-- Base bilateral serif -->
      <rect x="60" y="118.4" width="42" height="1.6" fill="currentColor" />

      <!-- Left hairline down to crossbar -->
      <line x1="42" y1="20" x2="25" y2="76" stroke="currentColor" stroke-width="1.6" />

      <!-- Hairline crossbar -->
      <line x1="18" y1="76" x2="68" y2="76" stroke="currentColor" stroke-width="1.6" />

      <!-- Signature AMURA Loop (Open circular arc on left of A) -->
      <!-- From (25, 76), curves smoothly out to the left and down to baseline at (48, 120) -->
      <path d="
        M 25 76
        C 14 76, 2 82, 0 94
        C -2 108, 12 120, 32 120
        C 40 120, 48 116, 52 110
        C 46 114, 38 118, 30 118
        C 14 118, 1.6 107, 2 95
        C 2.4 83, 14 77.6, 25 77.6 Z
      " fill="currentColor" />

      <!-- Signature AMURA Swan-Neck Flourish (Sweeping from baseline up-left to tapering finial) -->
      <path d="
        M 32 120
        C 12 120, -10 121, -26 112
        C -38 105, -46 96, -52 92
        C -48 94, -38 98, -26 98
        C -10 98, 8 106, 24 116
        C 28 118, 30 119, 32 120 Z
      " fill="currentColor" />
      <path d="
        M -52 92
        C -44 91, -32 94, -20 102
        C -8 110, 8 118, 28 119.5
        L 28 120
        C 10 120, -10 118, -24 110
        C -36 102, -46 95, -52 92 Z
      " fill="currentColor" />
    </g>
  `;
}

function glyphR() {
  // Modeled directly from crop_amura.png
  // Left thick stem: (10, 20) to (24, 120)
  // Serifs: top (4, 20)-(30, 20), bottom (4, 118.4)-(30, 118.4)
  // Upper compact bowl:
  // Top hairline: (24, 20) to (50, 20)
  // Outer bowl curve: swells to (74, 45) with thickness ~10px, connects back to stem at (24, 68) with hairline
  // Organic wave ribbon leg:
  // Starts from (24, 64), curves out to (58, 76), down to (78, 112), sweeps horizontally along baseline to (104, 120) with razor tip!
  return `
    <g class="glyph-R">
      <!-- Left thick stem -->
      <rect x="10" y="20" width="14" height="100" fill="currentColor" />
      <!-- Top & bottom flat serifs -->
      <rect x="4" y="20" width="26" height="1.6" fill="currentColor" />
      <rect x="4" y="118.4" width="26" height="1.6" fill="currentColor" />

      <!-- Upper Bowl -->
      <!-- Top hairline -->
      <line x1="24" y1="20.8" x2="52" y2="20.8" stroke="currentColor" stroke-width="1.6" />
      <!-- Outer curved bowl -->
      <path d="
        M 50 20
        C 66 20, 78 28, 78 44
        C 78 58, 66 66, 50 66
        L 24 66
        L 24 64.4
        L 50 64.4
        C 64 64.4, 74 57, 74 44
        C 74 30, 64 21.6, 50 21.6 Z
      " fill="currentColor" />
      <!-- Inner bowl bottom connection hairline -->
      <line x1="24" y1="65.2" x2="52" y2="65.2" stroke="currentColor" stroke-width="1.6" />

      <!-- Signature AMURA Organic S-Wave Ribbon Leg -->
      <!-- Flows from (24, 64) downwards and right, curving smoothly along baseline to (106, 120) -->
      <path d="
        M 38 64
        C 48 64, 58 70, 62 82
        C 66 94, 74 110, 92 118
        C 98 120, 106 120, 110 119.8
        L 110 120
        C 104 120, 96 120, 88 116
        C 72 108, 62 92, 58 80
        C 54 68, 46 64, 38 64 Z
      " fill="currentColor" />
      <path d="
        M 42 65
        C 52 66, 62 74, 68 86
        C 74 98, 84 114, 102 119
        C 94 118, 82 112, 74 100
        C 68 88, 58 78, 46 72 Z
      " fill="currentColor" />
    </g>
  `;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1100']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  const cropBuf = fs.readFileSync('C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\crop_amura.png');
  const cropBase64 = `data:image/png;base64,${cropBuf.toString('base64')}`;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { background: #EAE8E1; padding: 50px; font-family: sans-serif; }
          .card { background: #fff; padding: 35px; margin-bottom: 30px; border: 1px solid #D9D8D3; }
          h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 20px; }
          .ref-img { height: 130px; object-fit: contain; display: block; }
          .svg-container { height: 130px; width: auto; color: #802015; }
        </style>
      </head>
      <body>
        <div class="card">
          <h3>1. Source of Truth (Image 2 - AMURA by ravine.brand):</h3>
          <img src="${cropBase64}" class="ref-img" />
        </div>

        <div class="card">
          <h3>2. Reconstructed Glyphs A & R (Side-by-Side Test):</h3>
          <div class="svg-container">
            <svg viewBox="0 0 600 150" height="130" style="overflow: visible;">
              <g transform="translate(80, 0)">
                ${glyphA(true)}
              </g>
              <g transform="translate(240, 0)">
                ${glyphR()}
              </g>
            </svg>
          </div>
        </div>
      </body>
    </html>
  `);

  const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928';
  const outPath = path.join(artifactDir, 'test_glyph_precision.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);
  await browser.close();
}

main().catch(console.error);
