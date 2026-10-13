const fs = require('fs');
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const svgA = fs.readFileSync('scripts/letter_A.svg', 'utf8');
const svgR = fs.readFileSync('scripts/letter_R.svg', 'utf8');
const svgM = fs.readFileSync('scripts/letter_M.svg', 'utf8');
const svgU = fs.readFileSync('scripts/letter_U.svg', 'utf8');

const pathA = svgA.match(/d="([^"]+)"/)[1];
const pathR = svgR.match(/d="([^"]+)"/)[1];
const pathM = svgM.match(/d="([^"]+)"/)[1];
const pathU = svgU.match(/d="([^"]+)"/)[1];

function buildCategoriesSvg() {
  return `
<svg viewBox="0 0 1080 170" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: block; width: auto; height: 100%; overflow: visible;">
  <!-- C -->
  <g transform="translate(0, 0)">
    <path d="M 80 48 C 72 36, 60 30, 46 30 C 22 30, 6 48, 6 92 C 6 136, 22 154, 46 154 C 60 154, 72 148, 80 136 L 76 132 C 68 142, 58 148, 46 148 C 28 148, 14 130, 14 92 C 14 54, 28 36, 46 36 C 58 36, 68 42, 76 52 Z" stroke="none" />
    <circle cx="80" cy="46" r="3.2" stroke="none" />
    <circle cx="80" cy="138" r="3.2" stroke="none" />
  </g>
  <!-- A (Signature AMURA) -->
  <g transform="translate(70, 0)">
    <path d="${pathA}" stroke="none" fill="currentColor" fill-rule="evenodd" />
  </g>
  <!-- T -->
  <g transform="translate(230, 0)">
    <rect x="36" y="32" width="13.5" height="121" stroke="none" />
    <rect x="26" y="151" width="33.5" height="2" stroke="none" />
    <line x1="4" y1="33" x2="82" y2="33" stroke-width="1.8" />
    <polygon points="4,33 4,45 6.5,45 6.5,33" stroke="none" />
    <polygon points="79.5,33 79.5,45 82,45 82,33" stroke="none" />
  </g>
  <!-- E -->
  <g transform="translate(320, 0)">
    <rect x="18" y="32" width="13.5" height="121" stroke="none" />
    <rect x="8" y="32" width="28" height="2" stroke="none" />
    <rect x="8" y="151" width="28" height="2" stroke="none" />
    <line x1="31.5" y1="33" x2="80" y2="33" stroke-width="1.8" />
    <polygon points="77,33 80,33 80,46 77.5,46" stroke="none" />
    <line x1="31.5" y1="92" x2="68" y2="92" stroke-width="1.8" />
    <line x1="31.5" y1="152" x2="82" y2="152" stroke-width="1.8" />
    <polygon points="79,152 82,152 82,139 79.5,139" stroke="none" />
  </g>
  <!-- G -->
  <g transform="translate(416, 0)">
    <path d="M 82 48 C 74 36, 62 30, 48 30 C 22 30, 6 48, 6 92 C 6 136, 22 154, 48 154 C 64 154, 76 146, 82 134 L 82 96 L 46 96 L 46 98 L 76 98 L 76 132 C 70 142, 60 148, 48 148 C 28 148, 14 130, 14 92 C 14 54, 28 36, 48 36 C 60 36, 70 42, 78 52 Z" stroke="none" />
    <circle cx="82" cy="46" r="3.2" stroke="none" />
  </g>
  <!-- O -->
  <g transform="translate(516, 0)">
    <path d="M 48 30 C 22 30, 6 48, 6 92 C 6 136, 22 154, 48 154 C 74 154, 90 136, 90 92 C 90 48, 74 30, 48 30 Z M 48 36 C 64 36, 80 52, 80 92 C 80 132, 64 148, 48 148 C 32 148, 16 132, 16 92 C 16 52, 32 36, 48 36 Z" stroke="none" />
  </g>
  <!-- R (Signature AMURA Wave Ribbon Leg) -->
  <g transform="translate(620, 0)">
    <path d="${pathR}" stroke="none" fill="currentColor" fill-rule="evenodd" />
  </g>
  <!-- I -->
  <g transform="translate(745, 0)">
    <rect x="16" y="32" width="13.5" height="121" stroke="none" />
    <rect x="6" y="32" width="33.5" height="2" stroke="none" />
    <rect x="6" y="151" width="33.5" height="2" stroke="none" />
  </g>
  <!-- E -->
  <g transform="translate(795, 0)">
    <rect x="18" y="32" width="13.5" height="121" stroke="none" />
    <rect x="8" y="32" width="28" height="2" stroke="none" />
    <rect x="8" y="151" width="28" height="2" stroke="none" />
    <line x1="31.5" y1="33" x2="80" y2="33" stroke-width="1.8" />
    <polygon points="77,33 80,33 80,46 77.5,46" stroke="none" />
    <line x1="31.5" y1="92" x2="68" y2="92" stroke-width="1.8" />
    <line x1="31.5" y1="152" x2="82" y2="152" stroke-width="1.8" />
    <polygon points="79,152 82,152 82,139 79.5,139" stroke="none" />
  </g>
  <!-- S -->
  <g transform="translate(890, 0)">
    <path d="M 58 48 C 52 38, 42 32, 32 32 C 18 32, 8 40, 8 54 C 8 68, 20 76, 34 82 C 52 88, 62 96, 62 112 C 62 128, 48 138, 30 138 C 16 138, 6 128, 2 116 L 6 112 C 10 123, 19 133, 31 133 C 44 133, 54 125, 54 112 C 54 98, 42 91, 24 85 C 10 79, 2 69, 2 54 C 2 38, 15 27, 32 27 C 46 27, 56 35, 60 45 Z" stroke="none" />
    <circle cx="59" cy="47" r="3" stroke="none" />
    <circle cx="4" cy="114" r="3" stroke="none" />
  </g>
</svg>
  `;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 800 });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="background: #EAE8E1; color: #111; padding: 60px; font-family: sans-serif;">
        <h3 style="color: #666; margin-bottom: 20px;">CATEGORIES in Image 2 Visual Language:</h3>
        <div style="height: 48px; width: auto; color: #111;">
          ${buildCategoriesSvg()}
        </div>
      </body>
    </html>
  `);

  const outPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\test_categories_render.png';
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);
  await browser.close();
}

main().catch(console.error);
