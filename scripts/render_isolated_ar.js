const puppeteer = require('puppeteer-core');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const a = fs.readFileSync('scripts/letter_A.svg', 'utf8');
  const r = fs.readFileSync('scripts/letter_R.svg', 'utf8');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,600']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 600 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="background: #EAE8E1; padding: 40px; font-family: sans-serif;">
        <h2 style="color: #666; margin-bottom: 20px;">Isolated Letters A and R:</h2>
        <div style="display: flex; gap: 40px; color: #111; height: 160px;">
          ${a.replace('fill="black"', 'fill="currentColor"')}
          ${r.replace('fill="black"', 'fill="currentColor"')}
        </div>
      </body>
    </html>
  `);
  const outPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\test_ar_isolated.png';
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved to', outPath);
  await browser.close();
}

main().catch(console.error);
