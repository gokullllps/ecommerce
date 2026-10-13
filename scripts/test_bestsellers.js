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

// Let's test BESTSELLERS and CATEGORIES
function buildBestsellersSvg() {
  return `
<svg viewBox="0 0 1150 170" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: block; width: auto; height: 100%; overflow: visible;">
  <!-- B -->
  <g transform="translate(0, 0)">
    <rect x="18" y="32" width="13.5" height="121" stroke="none" />
    <rect x="8" y="32" width="28" height="2" stroke="none" />
    <rect x="8" y="151" width="28" height="2" stroke="none" />
    <line x1="31.5" y1="33" x2="62" y2="33" stroke-width="1.8" />
    <path d="M 62 33 C 78 33, 86 42, 86 56 C 86 68, 76 77, 60 77 L 31.5 77 L 31.5 75 L 60 75 C 74 75, 83 67, 83 56 C 83 44, 76 35, 62 35 Z" stroke="none" />
    <line x1="31.5" y1="77" x2="64" y2="77" stroke-width="1.8" />
    <path d="M 64 77 C 82 77, 92 88, 92 106 C 92 126, 80 152, 60 152 L 31.5 152 L 31.5 150 L 60 150 C 78 150, 89 125, 89 106 C 89 90, 80 79, 64 79 Z" stroke="none" />
    <line x1="31.5" y1="152" x2="60" y2="152" stroke-width="1.8" />
  </g>
  <!-- E -->
  <g transform="translate(108, 0)">
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
  <g transform="translate(204, 0)">
    <path d="M 58 48 C 52 38, 42 32, 32 32 C 18 32, 8 40, 8 54 C 8 68, 20 76, 34 82 C 52 88, 62 96, 62 112 C 62 128, 48 138, 30 138 C 16 138, 6 128, 2 116 L 6 112 C 10 123, 19 133, 31 133 C 44 133, 54 125, 54 112 C 54 98, 42 91, 24 85 C 10 79, 2 69, 2 54 C 2 38, 15 27, 32 27 C 46 27, 56 35, 60 45 Z" stroke="none" />
    <circle cx="59" cy="47" r="3" stroke="none" />
    <circle cx="4" cy="114" r="3" stroke="none" />
  </g>
  <!-- T -->
  <g transform="translate(278, 0)">
    <rect x="36" y="32" width="13.5" height="121" stroke="none" />
    <rect x="26" y="151" width="33.5" height="2" stroke="none" />
    <line x1="4" y1="33" x2="82" y2="33" stroke-width="1.8" />
    <polygon points="4,33 4,45 6.5,45 6.5,33" stroke="none" />
    <polygon points="79.5,33 79.5,45 82,45 82,33" stroke="none" />
  </g>
  <!-- S -->
  <g transform="translate(372, 0)">
    <path d="M 58 48 C 52 38, 42 32, 32 32 C 18 32, 8 40, 8 54 C 8 68, 20 76, 34 82 C 52 88, 62 96, 62 112 C 62 128, 48 138, 30 138 C 16 138, 6 128, 2 116 L 6 112 C 10 123, 19 133, 31 133 C 44 133, 54 125, 54 112 C 54 98, 42 91, 24 85 C 10 79, 2 69, 2 54 C 2 38, 15 27, 32 27 C 46 27, 56 35, 60 45 Z" stroke="none" />
    <circle cx="59" cy="47" r="3" stroke="none" />
    <circle cx="4" cy="114" r="3" stroke="none" />
  </g>
  <!-- E -->
  <g transform="translate(444, 0)">
    <rect x="18" y="32" width="13.5" height="121" stroke="none" />
    <rect x="8" y="32" width="28" height="2" stroke="none" />
    <rect x="8" y="151" width="28" height="2" stroke="none" />
    <line x1="31.5" y1="33" x2="80" y2="33" stroke-width="1.8" />
    <polygon points="77,33 80,33 80,46 77.5,46" stroke="none" />
    <line x1="31.5" y1="92" x2="68" y2="92" stroke-width="1.8" />
    <line x1="31.5" y1="152" x2="82" y2="152" stroke-width="1.8" />
    <polygon points="79,152 82,152 82,139 79.5,139" stroke="none" />
  </g>
  <!-- L -->
  <g transform="translate(540, 0)">
    <rect x="18" y="32" width="13.5" height="121" stroke="none" />
    <rect x="8" y="32" width="28" height="2" stroke="none" />
    <line x1="31.5" y1="152" x2="70" y2="152" stroke-width="1.8" />
    <polygon points="67,152 70,152 70,139 67.5,139" stroke="none" />
  </g>
  <!-- L -->
  <g transform="translate(615, 0)">
    <rect x="18" y="32" width="13.5" height="121" stroke="none" />
    <rect x="8" y="32" width="28" height="2" stroke="none" />
    <line x1="31.5" y1="152" x2="70" y2="152" stroke-width="1.8" />
    <polygon points="67,152 70,152 70,139 67.5,139" stroke="none" />
  </g>
  <!-- E -->
  <g transform="translate(690, 0)">
    <rect x="18" y="32" width="13.5" height="121" stroke="none" />
    <rect x="8" y="32" width="28" height="2" stroke="none" />
    <rect x="8" y="151" width="28" height="2" stroke="none" />
    <line x1="31.5" y1="33" x2="80" y2="33" stroke-width="1.8" />
    <polygon points="77,33 80,33 80,46 77.5,46" stroke="none" />
    <line x1="31.5" y1="92" x2="68" y2="92" stroke-width="1.8" />
    <line x1="31.5" y1="152" x2="82" y2="152" stroke-width="1.8" />
    <polygon points="79,152 82,152 82,139 79.5,139" stroke="none" />
  </g>
  <!-- R (Signature AMURA Organic Wave Ribbon Leg) -->
  <g transform="translate(775, 0)">
    <path d="${pathR}" stroke="none" fill="currentColor" fill-rule="evenodd" />
  </g>
  <!-- S -->
  <g transform="translate(900, 0)">
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
        <h3 style="color: #666; margin-bottom: 20px;">BESTSELLERS in Image 2 Visual Language:</h3>
        <div style="height: 48px; width: auto; color: #111;">
          ${buildBestsellersSvg()}
        </div>
      </body>
    </html>
  `);

  const outPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\test_bestsellers_render.png';
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);
  await browser.close();
}

main().catch(console.error);
