const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const videoPath = 'd:/ecommerce/b4aefb0e-a834-4312-9668-319807ca012c.mp4';
const outDir = 'd:/ecommerce/scratch/user_video_frames';

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
  await page.setViewport({ width: 1440, height: 900 });

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000; overflow:hidden;">
        <video id="vid" src="file:///${videoPath}" style="width:100vw; height:100vh; object-fit:contain;"></video>
      </body>
    </html>
  `;
  await page.setContent(html);

  const duration = await page.evaluate(async () => {
    const vid = document.getElementById('vid');
    return new Promise(resolve => {
      if (vid.readyState >= 1) return resolve(vid.duration);
      vid.onloadedmetadata = () => resolve(vid.duration);
    });
  });

  console.log('Video duration:', duration);

  const step = duration / 6;
  for (let i = 0; i <= 6; i++) {
    const t = Math.min(duration, i * step);
    await page.evaluate(async (time) => {
      const vid = document.getElementById('vid');
      vid.currentTime = time;
      return new Promise(r => { vid.onseeked = r; });
    }, t);
    await new Promise(r => setTimeout(r, 200));
    const outPath = path.join(outDir, `frame_${i}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved frame ${i} at ${t.toFixed(1)}s`);
  }

  await browser.close();
}

run().catch(console.error);
