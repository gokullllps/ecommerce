const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Exact coordinate system:
// Cap Height = 100 (Y = 30 to Y = 130). Baseline = 130.
// Stem width = 14.
// Hairline stroke-width = 1.6.

const letterA = (x) => `
  <!-- ================= A (Signature AMURA) ================= -->
  <g transform="translate(${x}, 0)">
    <!-- Apex horizontal serif -->
    <rect x="26" y="30" width="28" height="1.8" stroke="none" />

    <!-- Right thick diagonal stem -->
    <polygon points="44,30 58,30 92,130 78,130" stroke="none" />
    <!-- Bilateral base serif -->
    <rect x="62" y="128.2" width="44" height="1.8" stroke="none" />

    <!-- Left hairline from apex to crossbar -->
    <line x1="44" y1="30" x2="28" y2="84" stroke-width="1.6" />

    <!-- Horizontal hairline crossbar -->
    <line x1="16" y1="84" x2="72" y2="84" stroke-width="1.6" />

    <!-- Signature AMURA Swan-Neck Swash Flourish -->
    <!-- Starts from (28, 84), curves left to (12, 84), loops down to baseline at (40, 130), -->
    <!-- then sweeps gracefully UP and to the left, swelling to thickness ~9px and tapering to sharp tip at (-22, 94) -->
    <path d="
      M 28 84
      C 18 84, 10 88, 6 96
      C 1 106, 4 118, 14 126
      C 22 131, 34 131, 42 126
      C 44 124, 46 122, 47 120
      C 47 122, 43 126, 38 128.5
      C 28 131, 16 129, 9 122
      C 2 115, -2 104, 1 93
      C 3 83, 10 75, 18 69
      C 12 70, 4 75, -5 83
      C -15 92, -22 96, -26 95
      C -22 98, -14 105, -5 106
      C 6 107, 14 100, 20 91
      C 24 85, 27 84, 28 84 Z
    " stroke="none" />
  </g>
`;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  const cropBuf = fs.readFileSync('C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\crop_amura.png');
  const cropBase64 = `data:image/png;base64,${cropBuf.toString('base64')}`;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { background: #EAE8E1; padding: 40px; font-family: sans-serif; }
          .card { background: #fff; padding: 30px; margin-bottom: 25px; border: 1px solid #D9D8D3; }
          img { max-width: 100%; display: block; }
        </style>
      </head>
      <body>
        <div class="card">
          <h3 style="margin-bottom: 10px; color: #888;">Original AMURA Reference Crop:</h3>
          <img src="${cropBase64}" style="height: 120px; object-fit: contain;" />
        </div>

        </div>
        <div class="card">
          <h3 style="margin-bottom: 10px; color: #888;">Test Vector Render of AMURA:</h3>
          <svg viewBox="0 0 700 160" width="700" height="160" fill="#802015" stroke="#802015" style="overflow: visible;">
            <!-- Let's render test A -->
            ${letterA(60)}
          </svg>
        </div>
      </body>
    </html>
  `);

  const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928';
  const outPath = path.join(artifactDir, 'test_compare_reference.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);
  await browser.close();
}

main().catch(console.error);
