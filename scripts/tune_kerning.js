const fs = require('fs');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const svgA = fs.readFileSync('scripts/letter_A.svg', 'utf8');
const svgR = fs.readFileSync('scripts/letter_R.svg', 'utf8');

const pathA = svgA.match(/d="([^"]+)"/)[1];
const pathR = svgR.match(/d="([^"]+)"/)[1];

function buildNewArrivals(tracking = 0) {
  return `
<svg viewBox="0 0 1320 170" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 100%; height: 100%; overflow: visible;">
  <!-- ==================== "NEW" ==================== -->
  <g class="word-new" transform="translate(0, 0)">
    <!-- N -->
    <g transform="translate(0, 0)">
      <rect x="18" y="32" width="13.5" height="121" stroke="none" />
      <rect x="8" y="32" width="28" height="2" stroke="none" />
      <rect x="8" y="151" width="28" height="2" stroke="none" />
      <line x1="31.5" y1="32" x2="88" y2="153" stroke-width="1.8" />
      <rect x="88" y="32" width="13.5" height="121" stroke="none" />
      <rect x="78" y="32" width="28" height="2" stroke="none" />
      <rect x="78" y="151" width="28" height="2" stroke="none" />
    </g>

    <!-- E -->
    <g transform="translate(122, 0)">
      <rect x="18" y="32" width="13.5" height="121" stroke="none" />
      <rect x="8" y="32" width="28" height="2" stroke="none" />
      <rect x="8" y="151" width="28" height="2" stroke="none" />
      <line x1="31.5" y1="33" x2="82" y2="33" stroke-width="1.8" />
      <polygon points="79,33 82,33 82,46 79.5,46" stroke="none" />
      <line x1="31.5" y1="92" x2="70" y2="92" stroke-width="1.8" />
      <line x1="31.5" y1="152" x2="84" y2="152" stroke-width="1.8" />
      <polygon points="81,152 84,152 84,139 81.5,139" stroke="none" />
    </g>

    <!-- W -->
    <g transform="translate(224, 0)">
      <polygon points="12,32 26,32 50,153 36,153" stroke="none" />
      <rect x="6" y="32" width="26" height="2" stroke="none" />
      <line x1="48" y1="153" x2="72" y2="32" stroke-width="1.8" />
      <polygon points="68,32 82,32 106,153 92,153" stroke="none" />
      <line x1="104" y1="153" x2="128" y2="32" stroke-width="1.8" />
      <rect x="120" y="32" width="22" height="2" stroke="none" />
    </g>
  </g>

  <!-- ==================== "ARRIVALS" ==================== -->
  <g class="word-arrivals" transform="translate(425, 0)">
    <!-- A1 -->
    <g transform="translate(0, 0)">
      <path d="${pathA}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- R1 -->
    <g transform="translate(170, 0)">
      <path d="${pathR}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- R2 -->
    <g transform="translate(285, 0)">
      <path d="${pathR}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- I -->
    <g transform="translate(405, 0)">
      <rect x="16" y="32" width="13.5" height="121" stroke="none" />
      <rect x="6" y="32" width="33.5" height="2" stroke="none" />
      <rect x="6" y="151" width="33.5" height="2" stroke="none" />
    </g>

    <!-- V -->
    <g transform="translate(458, 0)">
      <polygon points="12,32 26,32 50,153 36,153" stroke="none" />
      <rect x="6" y="32" width="26" height="2" stroke="none" />
      <line x1="48" y1="153" x2="76" y2="32" stroke-width="1.8" />
      <rect x="68" y="32" width="22" height="2" stroke="none" />
    </g>

    <!-- A2 -->
    <g transform="translate(545, 0)">
      <path d="${pathA}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- L -->
    <g transform="translate(715, 0)">
      <rect x="18" y="32" width="13.5" height="121" stroke="none" />
      <rect x="8" y="32" width="28" height="2" stroke="none" />
      <line x1="31.5" y1="152" x2="70" y2="152" stroke-width="1.8" />
      <polygon points="67,152 70,152 70,139 67.5,139" stroke="none" />
    </g>

    <!-- S -->
    <g transform="translate(795, 0)">
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
      <circle cx="63" cy="47" r="3.2" stroke="none" />
      <circle cx="4" cy="114" r="3.2" stroke="none" />
    </g>
  </g>
</svg>
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
            height: 44px;
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
              ${buildNewArrivals()}
            </div>
          </div>
          <div>
            <a href="#" class="view-all">VIEW ALL NEW ARRIVALS &rarr;</a>
          </div>
        </div>
      </body>
    </html>
  `);

  const outPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\test_tuned_kerning.png';
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);
  await browser.close();
}

main().catch(console.error);
