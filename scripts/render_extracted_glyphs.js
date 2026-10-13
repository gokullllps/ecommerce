const fs = require('fs');
const opentype = require('opentype.js');
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const buf = fs.readFileSync('public/fonts/Beverly.otf');
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

const interestingNames = ['A', 'A.salt', 'R', 'R.salt', 'B', 'B.salt', 'C', 'C.salt', 'D', 'D.salt', 'E', 'E.salt', 'K', 'K.salt', 'M', 'M.salt', 'N', 'N.salt', 'S', 'S.salt'];

let cards = '';
for (let i = 0; i < font.glyphs.length; i++) {
  const g = font.glyphs.get(i);
  if (interestingNames.includes(g.name)) {
    // getPath(x, y, fontSize)
    // font units: 1000, ascender ~775, baseline at y=160
    const p = g.getPath(20, 160, 180);
    const pathData = p.toPathData();
    cards += `
      <div style="display:inline-block; margin: 10px; border: 1px solid #D9D8D3; padding: 10px; background: #fff; width: 200px;">
        <div style="font-size: 13px; font-weight: bold; color: #666; margin-bottom: 5px;">${g.name}</div>
        <svg width="180" height="200" viewBox="0 0 200 200">
          <path d="${pathData}" fill="#111" />
        </svg>
      </div>
    `;
  }
}

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
      <body style="background: #EAE8E1; padding: 30px; font-family: sans-serif;">
        <h2 style="margin-bottom: 20px;">Glyph Outlines from Beverly.otf:</h2>
        <div style="display: flex; flex-wrap: wrap;">
          ${cards}
        </div>
      </body>
    </html>
  `);

  const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928';
  const outPath = path.join(artifactDir, 'test_extracted_glyphs.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);
  await browser.close();
}

main().catch(console.error);
