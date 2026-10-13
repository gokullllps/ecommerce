const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1200']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Elsie+Swash+Caps:wght@400;900&family=Cinzel+Decorative:wght@400;700&family=Prata&display=swap" rel="stylesheet">
        <style>
          body { background: #EAE8E1; color: #111111; padding: 40px; font-family: sans-serif; }
          .sample { background: #fff; padding: 30px; margin-bottom: 30px; border: 1px solid #ccc; }
          .title { font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 10px; }
          .elsie { font-family: 'Elsie Swash Caps', serif; font-size: 56px; line-height: 1.1; }
          .cinzel { font-family: 'Cinzel Decorative', serif; font-size: 56px; line-height: 1.1; }
          .prata { font-family: 'Prata', serif; font-size: 56px; line-height: 1.1; }
        </style>
      </head>
      <body>
        <div class="sample">
          <div class="title">1. Elsie Swash Caps (Regular 400)</div>
          <div class="elsie">NEW ARRIVALS</div>
          <div class="elsie" style="margin-top: 10px;">AMURA &bull; Beverly</div>
        </div>

        <div class="sample">
          <div class="title">2. Cinzel Decorative (Regular 400)</div>
          <div class="cinzel">NEW ARRIVALS</div>
          <div class="cinzel" style="margin-top: 10px;">AMURA &bull; BEVERLY</div>
        </div>

        <div class="sample">
          <div class="title">3. Prata (Regular 400)</div>
          <div class="prata">NEW ARRIVALS</div>
          <div class="prata" style="margin-top: 10px;">AMURA &bull; Beverly</div>
        </div>
      </body>
    </html>
  `, { waitUntil: 'networkidle2' });

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928';
  const outPath = path.join(artifactDir, 'test_swash_fonts.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
