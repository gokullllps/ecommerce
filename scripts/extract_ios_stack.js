const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const videoPath = 'd:/ecommerce/IOS-Stack-4-5.mp4';
const outDir = 'd:/ecommerce/scratch/ios_stack_frames';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800 });

  const b64 = fs.readFileSync(videoPath).toString('base64');
  const dataUrl = `data:video/mp4;base64,${b64}`;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000; overflow:hidden;">
        <video id="vid" src="${dataUrl}" style="width:100vw; height:100vh; object-fit:contain;"></video>
      </body>
    </html>
  `);

  const duration = await page.evaluate(async () => {
    const vid = document.getElementById('vid');
    return new Promise(resolve => {
      if (vid.readyState >= 1) return resolve(vid.duration);
      vid.onloadedmetadata = () => resolve(vid.duration);
    });
  });

  console.log('Video duration:', duration);

  const steps = 12;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * duration;
    await page.evaluate(async (time) => {
      const vid = document.getElementById('vid');
      vid.currentTime = time;
      return new Promise(r => { vid.onseeked = r; });
    }, t);
    await new Promise(r => setTimeout(r, 200));
    const outPath = path.join(outDir, `frame_${i}_t${t.toFixed(2)}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved frame ${i} at ${t.toFixed(2)}s`);
  }

  await browser.close();
  console.log('Done extracting ios stack frames!');
}

run().catch(console.error);
