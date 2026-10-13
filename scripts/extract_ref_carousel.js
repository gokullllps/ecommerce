const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const videoPath = 'd:/ecommerce/b4aefb0e-a834-4312-9668-319807ca012c.mp4';
const outDir = 'd:/ecommerce/scratch/ref_carousel_frames';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  const fileUrl = 'file:///' + path.resolve(videoPath).replace(/\\/g, '/');
  await page.goto(fileUrl);

  const duration = await page.evaluate(async () => {
    const vid = document.querySelector('video');
    if (!vid) return 0;
    return new Promise(resolve => {
      if (vid.readyState >= 1) resolve(vid.duration);
      else vid.onloadedmetadata = () => resolve(vid.duration);
    });
  });

  console.log('Video duration:', duration);

  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const t = (duration * i) / steps;
    await page.evaluate(async (time) => {
      const vid = document.querySelector('video');
      if (vid) {
        vid.currentTime = time;
        await new Promise(r => { vid.onseeked = r; });
      }
    }, t);
    await new Promise(r => setTimeout(r, 200));
    const outPath = path.join(outDir, `frame_${i}_t${t.toFixed(2)}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved frame ${i} at ${t.toFixed(2)}s`);
  }

  await browser.close();
  console.log('Done extracting reference carousel frames!');
}

run().catch(console.error);
