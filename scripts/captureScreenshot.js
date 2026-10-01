
/*787const puppeteer = require('puppeteer-core');23
const path = require('path');

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  
  await page.goto('http://localhost:3000/men', { waitUntil: 'networkidle2', timeout: 30000 });
  // Wait 1.5s for phase animations
  await new Promise(r => setTimeout(r, 1500));

  const measurements = await page.evaluate(() => {
    const hero = document.querySelector('section[aria-label*="Men"]');
    const heroRect = hero ? hero.getBoundingClientRect() : null;
    const cta = document.querySelector('a[href="#catalogue"]');
    const ctaRect = cta ? cta.getBoundingClientRect() : null;
    const catalogue = document.getElementById('catalogue');
    const catalogueRect = catalogue ? catalogue.getBoundingClientRect() : null;
    const model = document.querySelector('img[alt*="Editorial"]');
    const modelRect = model ? model.getBoundingClientRect() : null;
    
    return {
      hero: heroRect ? { top: heroRect.top, bottom: heroRect.bottom, height: heroRect.height } : null,
      cta: ctaRect ? { top: ctaRect.top, bottom: ctaRect.bottom, height: ctaRect.height } : null,
      catalogue: catalogueRect ? { top: catalogueRect.top, bottom: catalogueRect.bottom, height: catalogueRect.height } : null,
      model: modelRect ? { top: modelRect.top, bottom: modelRect.bottom, height: modelRect.height, width: modelRect.width } : null,
      gapCtaToHeroBottom: (heroRect && ctaRect) ? (heroRect.bottom - ctaRect.bottom) : null,
      gapCtaToCatalogue: (ctaRect && catalogueRect) ? (catalogueRect.top - ctaRect.bottom) : null,
    };
  });

  console.log('Measurements:', JSON.stringify(measurements, null, 2));

  const outputPath = path.resolve(__dirname, '../men_mobile_preview.png');
  await page.screenshot({ path: outputPath });
  console.log('Saved screenshot to:', outputPath);

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
