const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const routesToTest = [
  { path: '/men', expectedActiveTab: 'ALL', expectedMinProducts: 10 },
  { path: '/men/shirts', expectedActiveTab: 'CLOTHING', expectedMinProducts: 4 },
  { path: '/men/trousers', expectedActiveTab: 'CLOTHING', expectedMinProducts: 2 },
  { path: '/men/footwear', expectedActiveTab: 'FOOTWEAR', expectedMinProducts: 6 },
  { path: '/men/accessories', expectedActiveTab: 'ACCESSORIES', expectedMinProducts: 7 },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  for (const item of routesToTest) {
    const url = 'http://localhost:3000' + item.path;
    console.log(`\n================ Testing ${item.path} ================`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    const check = await page.evaluate((expectedTab) => {
      const heroHeadline = document.querySelector('h1')?.innerText?.trim() || '';
      const heroArtwork = document.querySelector('img[alt*="Editorial Campaign Artwork"]') ? true : false;
      const navbar = document.querySelector('header') || document.querySelector('nav');
      
      // Tabs
      const tabs = Array.from(document.querySelectorAll('a')).filter(a => 
        ['ALL', 'CLOTHING', 'FOOTWEAR', 'ACCESSORIES'].includes(a.innerText?.trim())
      );
      const tabTexts = tabs.map(t => t.innerText?.trim());
      const activeTabEl = tabs.find(t => t.className.includes('bg-[#181818]'));
      const activeTab = activeTabEl ? activeTabEl.innerText?.trim() : 'NONE';

      // Category Cards
      const cardHeadings = Array.from(document.querySelectorAll('a[href*="/men/"] span')).map(s => s.innerText?.trim());
      const hasShirtsCard = cardHeadings.includes('SHIRTS');
      const hasTrousersCard = cardHeadings.includes('TROUSERS');
      const hasFootwearCard = cardHeadings.includes('FOOTWEAR');
      const hasAccessoriesCard = cardHeadings.includes('ACCESSORIES');

      // Product count text
      const countEl = document.querySelector('#catalogue-controls span');
      const countText = countEl ? countEl.innerText?.trim() : '';

      // Product items
      const productCards = document.querySelectorAll('article, [data-testid="product-card"], a[href^="/product/"]');

      return {
        heroHeadline,
        heroArtwork,
        hasNavbar: !!navbar,
        tabTexts,
        activeTab,
        hasShirtsCard,
        hasTrousersCard,
        hasFootwearCard,
        hasAccessoriesCard,
        countText,
        productCardCount: productCards.length,
      };
    }, item.expectedActiveTab);

    console.log(`Route: ${item.path}`);
    console.log(`Hero Headline: ${check.heroHeadline.replace(/\n/g, ' ')}`);
    console.log(`Hero Artwork: ${check.heroArtwork ? 'YES' : 'NO'}`);
    console.log(`Navbar Visible: ${check.hasNavbar ? 'YES' : 'NO'}`);
    console.log(`Active Tab: ${check.activeTab} (Expected: ${item.expectedActiveTab})`);
    console.log(`Cards: SHIRTS=${check.hasShirtsCard}, TROUSERS=${check.hasTrousersCard}, FOOTWEAR=${check.hasFootwearCard}, ACCESSORIES=${check.hasAccessoriesCard}`);
    console.log(`Product Count Text: ${check.countText}`);
    console.log(`Product Elements Count: ${check.productCardCount}`);

    // Take screenshot of hero + top catalogue
    if (item.path === '/men/shirts') {
      await page.screenshot({ path: path.resolve(__dirname, '../men_shirts_hero_page.png') });
      console.log('Saved men_shirts_hero_page.png');
    }
    if (item.path === '/men/trousers') {
      await page.screenshot({ path: path.resolve(__dirname, '../men_trousers_hero_page.png') });
      console.log('Saved men_trousers_hero_page.png');
    }
  }

  await browser.close();
})();
