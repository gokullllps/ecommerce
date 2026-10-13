const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const videoPath = 'd:/ecommerce/Recording 2026-10-13 114025.mp4';
const outDir = 'd:/ecommerce/scratch/video_frames';

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
  await page.setViewport({ width: 1920, height: 1080 });

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000; overflow:hidden;">
        <video id="vid" src="file:///${videoPath.replace(/\\/g, '/')}" style="width:100vw; height:100vh; object-fit:contain;"></video>
      </body>
    </html>
  `;
  await page.setContent(html);

  const duration = await page.evaluate(async () => {
    const vid = document.getElementById('vid');
    return new Promise(resolve => {
      vid.onloadedmetadata = () => resolve(vid.duration);
    });
  });

  console.log('Video duration:', duration);

  const timestamps = [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.5, 3.0].filter(t => t <= duration);

  for (let i = 0; i < timestamps.length; i++) {
    const t = timestamps[i];
    await page.evaluate(async (time) => {
      const vid = document.getElementById('vid');
      vid.currentTime = time;
      return new Promise(r => { vid.onseeked = r; });
    }, t);
    await new Promise(r => setTimeout(r, 200));
    const outPath = path.join(outDir, `frame_${i}_t${t.toFixed(1)}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved frame ${i} at ${t.toFixed(1)}s`);
  }

  await browser.close();
  console.log('Done extracting video frames!');
}

run().catch(console.error);
