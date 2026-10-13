const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

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
          @font-face {
            font-family: 'Beverly';
            src: url('http://localhost:3000/fonts/Beverly.otf') format('opentype');
          }
          body { background: #EAE8E1; color: #111; padding: 40px; font-family: sans-serif; }
          .card { background: #fff; padding: 30px; margin-bottom: 20px; border: 1px solid #D9D8D3; }
          .font-bev { font-family: 'Beverly', serif; font-size: 56px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h3>Beverly Standard:</h3>
          <div class="font-bev">NEW ARRIVALS</div>
          <div class="font-bev">AMURA</div>
        </div>
        <div class="card">
          <h3>Beverly .salt via Unicode (A=\\ue037, B=\\ue038, C=\\ue039, D=\\ue040, E=\\ue041, F=\\ue042, G=\\ue043, H=\\ue044, K=\\ue045, M=\\ue046, N=\\ue047, R=\\ue048, S=\\ue049):</h3>
          <div class="font-bev">&#xe047;EW &#xe037;&#xe048;&#xe048;IV&#xe037;L&#xe049;</div>
          <div class="font-bev">&#xe037;&#xe046;U&#xe048;&#xe037;</div>
          <div class="font-bev">&#xe048; R &#xe045; K &#xe049; S &#xe038; B</div>
        </div>
      </body>
    </html>
  `);

  const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928';
  const outPath = path.join(artifactDir, 'test_beverly_salt.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);
  await browser.close();
}

main().catch(console.error);
