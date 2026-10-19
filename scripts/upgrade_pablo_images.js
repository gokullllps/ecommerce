const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

// 1. Curated unique Unsplash photo IDs for products that need upgrade
const PRODUCT_PHOTO_MAP = {
  // --- MEN ---
  'pab-test-persistence-001': 'photo-1544441893-675973e31985', // Architectural Cashmere Trench
  'pab-m-004': 'photo-1624378439575-d8705ad7ae80', // Pleated Flannel Straight Trousers
  'pab-m-006': 'photo-1541099649105-f69ad21f3246', // Sculptural Wide-Leg Washed Jeans
  'pab-m-008': 'photo-1521572267360-ee0c2909d518', // Raw-Edge Boxy Heavy Cotton Tee
  'pab-m-010': 'photo-1602810318383-e386cc2a3ccf', // Heavy Silk Twill Overshirt
  'pab-m-014': 'photo-1591195853828-11db59a44f6b', // Tailored Relaxed Linen Shorts
  'pab-m-016': 'photo-1608256246200-53e635b5b65f', // Monolithic Leather Chelsea Boots
  'pab-m-018': 'photo-1548036328-c9fa89d128fa', // Minimalist Grain Leather Day Tote
  'pab-m-019': 'photo-1624222247344-550fb60583dc', // Architectural Palladium Buckle Belt
  'pab-m-020': 'photo-1605100804763-247f67b3557e', // Sterling Silver Atelier Signet Ring
  'pab-m-030': 'photo-1560769629-975ec94e6a86', // Minimalist Calfskin Low-Top Sneakers
  'pab-m-031': 'photo-1603808033192-082d6919d3e1', // Architectural Suede Atelier Slides
  'pab-m-032': 'photo-1595950653106-6c9ebd614d3a', // Strapped Leather Atelier Sandals
  'pab-m-033': 'photo-1588850561407-ed78c282e89b', // Heavy Wool Gabardine Atelier Cap
  'pab-m-034': 'photo-1511499767150-a48a237f0083', // Matte Titanium Sculptural Sunglasses
  'pab-m-035': 'photo-1586350977771-b3b0abd50c82', // Mercerized Egyptian Cotton Ribbed Socks
  'pab-m-041': 'photo-1508427953056-b00b8d78ebf5', // Double-Layer Storm Flap Trench Coat
  'pab-m-042': 'photo-1517445312882-bc9910d016b7', // Concealed Pocket Tactical Cargo Trousers
  'pab-m-043': 'photo-1620799140408-edc6dcb6d633', // Heavy Waffle Wool Cardigan
  'pab-m-051': 'photo-1596755094514-f87e34085b2c', // Band-Collar Raw Linen Shirt
  'pab-m-053': 'photo-1614252235316-8c857d38b5f4', // Cordovan Leather Chunky Derby Shoes
  'pab-m-055': 'photo-1542295669297-4d352b042bca', // Cashmere-Lined Deerskin Dress Gloves
  'pab-m-057': 'photo-1618354691373-d851c5c3a990', // Silk-Cotton Striped Open Collar Polo
  'pab-m-061': 'photo-1627123424574-724758594e93', // Bifold Calfskin Atelier Card Wallet
  'pab-m-063': 'photo-1598033129183-c4f50c736f10', // Camp-Collar Printed Silk Resort Shirt

  // --- WOMEN ---
  'pab-w-021': 'photo-1566174053879-31528523f8ae', // Sculptural Column Silk Maxi Dress
  'pab-w-022': 'photo-1539008835657-9e8e9680c956', // Asymmetric Bias-Cut Slip Dress
  'pab-w-023': 'photo-1539109136881-3be0616acf4b', // Belted Cocoon Double-Face Coat
  'pab-w-024': 'photo-1509631179647-0177331693ae', // High-Waisted Palazzo Wool Trousers
  'pab-w-025': 'photo-1502716119720-b23a93e5fe1b', // Draped Asymmetric Silk Georgette Top
  'pab-w-026': 'photo-1576871337632-b9aef4c17ab9', // Oversized Ribbed Cashmere Turtleneck
  'pab-w-027': 'photo-1584370848010-d7fe6bc767ec', // High-Rise Selvedge Wide-Leg Jeans
  'pab-w-028': 'photo-1543163521-1bf539c55dd2', // Architectural Leather Pointed Mule
  'pab-w-029': 'photo-1584917865442-de89df76afd3', // Structured Calfskin Crossbody Minaudière
  'pab-w-030': 'photo-1535632066927-ab7c9ab60908', // Sculptural Palladium Ear Cuff & Hoop
  'pab-w-044': 'photo-1591047139829-d91aecb6caea', // Hourglass Architectural Wool Blazer
  'pab-w-045': 'photo-1496747611176-843222e1e57c', // Sunburst Accordion Pleated Midi Dress
  'pab-w-046': 'photo-1590874103328-eac38a683ce7', // Architectural Oversized Leather Tote
  'pab-w-047': 'photo-1535043934128-cf0b28d52f95', // Square-Toe Patent Slingback Pumps
  'pab-w-048': 'photo-1601924994987-69e26d50dc26', // Hand-Rolled 90cm Silk Twill Carre
  'pab-w-052': 'photo-1485230895905-ec40ba36b9bc', // Ribbed Mulberry Silk Tank Top
  'pab-w-054': 'photo-1434389677669-e08b4cac3105', // Fine-Gauge Cashmere Knit Cardigan
  'pab-w-056': 'photo-1490481651871-ab68de25d43d', // Architectural Virgin Wool Wrap Midi Dress
  'pab-w-058': 'photo-1566150905458-1bf1fc113f0d', // Sculpted Curved Hobo Bag
  'pab-w-060': 'photo-1508296695146-257a814070b4', // Architectural Bold Acetate Sunglasses
  'pab-w-062': 'photo-1518895949257-7621c3c786d7', // Architectural Cutout Back Crepe Gown
  'pab-w-064': 'photo-1551803091-e20673f15770', // Wide-Leg Fluid Silk Crepe Trousers

  // --- KIDS ---
  'prod_1790766108500_cfe9': 'photo-1503919545889-aef636e10ad4', // joker (Kids luxury merino knit sweater)
  'pab-k-005': 'photo-1519238263530-99bdd11df2ea', // Little Explorer Tailored Trench Coat
  'pab-k-006': 'photo-1519457431-44ccd64a579b', // Petit Japanese Selvedge Denim Jeans
  'pab-k-007': 'photo-1503454537195-1dcabb73ffb9', // Petit Supima Heavyweight Tee
  'pab-k-008': 'photo-1508214751196-bcfd4ca60f91', // Junior Wool-Blend Utility Cargo Trousers
  'pab-k-009': 'photo-1514989940723-e8e51635b782', // Miniature Calfskin Penny Loafers
  'pab-k-010': 'photo-1485546246426-74dc88dec4d9', // Petit Piqué Cotton Tennis Polo
  'pab-k-011': 'photo-1522771930-78848d9293e8', // Junior Reversible Silk-Lined Bomber
  'pab-k-012': 'photo-1502086223501-7ea6ecd79368'  // Petit Architectural Relaxed Chinos
};

// 2. Curated unique Unsplash photo IDs for banners and category cards
const BANNER_PHOTO_MAP = {
  // Editorial Campaign Banners
  'featured_cashmere_suite': { id: 'photo-1445205170230-053b83016050', out: 'public/images/banners/featured-cashmere-suite.webp', w: 2400, h: 1350 },
  'editorial_atelier_reduction': { id: 'photo-1469334031218-e382a71b716b', out: 'public/images/banners/editorial-atelier-reduction.webp', w: 1600, h: 1200 },
  
  // Collections Banners
  'collection_aw26': { id: 'photo-1483985988355-763728e1935b', out: 'public/images/banners/collection-aw26.webp', w: 2400, h: 1350 },
  'collection_menswear': { id: 'photo-1617137984095-74e4e5e3613f', out: 'public/images/banners/collection-menswear.webp', w: 2400, h: 1350 },
  'collection_womenswear': { id: 'photo-1487222477894-8943e31ef7b2', out: 'public/images/banners/collection-womenswear.webp', w: 2400, h: 1350 },
  'collection_new_in': { id: 'photo-1492707892479-7bc8d5a4ee93', out: 'public/images/banners/collection-new-in.webp', w: 2400, h: 1350 },
  'collection_bestsellers': { id: 'photo-1441986300917-64674bd600d8', out: 'public/images/banners/collection-bestsellers.webp', w: 2400, h: 1350 },
  'collection_denim': { id: 'photo-1582552938357-32b906df40cb', out: 'public/images/banners/collection-denim.webp', w: 2400, h: 1350 },
  'collection_festive': { id: 'photo-1512436991641-6745cdb1723f', out: 'public/images/banners/collection-festive.webp', w: 2400, h: 1350 },
  
  // Department Banners
  'department_footwear': { id: 'photo-1515347619252-60a4bf4fff4f', out: 'public/images/banners/department-footwear.webp', w: 2400, h: 1350 },
  'department_accessories': { id: 'photo-1512496015851-a90fb38ba796', out: 'public/images/banners/department-accessories.webp', w: 2400, h: 1350 },

  // Men's Category Carousel Cards (0.78:1 ratio -> 1000x1282)
  'cat_tshirts': { id: 'photo-1503342217505-b0a15ec3261c', out: 'public/images/categories/card-tshirts.webp', w: 1000, h: 1282 },
  'cat_shirts': { id: 'photo-1603252109303-2751441dd157', out: 'public/images/categories/card-shirts.webp', w: 1000, h: 1282 },
  'cat_polos': { id: 'photo-1586363104862-3a5e2ab60d99', out: 'public/images/categories/card-polos.webp', w: 1000, h: 1282 },
  'cat_trousers': { id: 'photo-1594633312681-425c7b97ccd1', out: 'public/images/categories/card-trousers.webp', w: 1000, h: 1282 },
  'cat_denim': { id: 'photo-1576995853123-5a10305d93c0', out: 'public/images/categories/card-denim.webp', w: 1000, h: 1282 },
  'cat_outerwear': { id: 'photo-1551028719-00167b16eac5', out: 'public/images/categories/card-outerwear.webp', w: 1000, h: 1282 },
  'cat_knitwear': { id: 'photo-1583743814966-8936f5b7be1a', out: 'public/images/categories/card-knitwear.webp', w: 1000, h: 1282 },
  'cat_sweatshirts': { id: 'photo-1556905055-8f358a7a47b2', out: 'public/images/categories/card-sweatshirts.webp', w: 1000, h: 1282 },
  'cat_shorts': { id: 'photo-1562157873-818bc0726f68', out: 'public/images/categories/card-shorts.webp', w: 1000, h: 1282 },
  'cat_footwear': { id: 'photo-1549298916-b41d501d3772', out: 'public/images/categories/card-footwear.webp', w: 1000, h: 1282 },
  'cat_bags': { id: 'photo-1553062407-98eeb64c6a62', out: 'public/images/categories/card-bags.webp', w: 1000, h: 1282 },
  'cat_accessories': { id: 'photo-1611085583191-a3b181a88401', out: 'public/images/categories/card-accessories.webp', w: 1000, h: 1282 },

  // Women's Category Cards
  'wcat_tops': { id: 'photo-1534528741775-53994a69daeb', out: 'public/images/categories/women-cat-tops.webp', w: 1000, h: 1282 },
  'wcat_bottoms': { id: 'photo-1515886657613-9f3515b0c78f', out: 'public/images/categories/women-cat-bottoms.webp', w: 1000, h: 1282 },
  'wcat_outerwear': { id: 'photo-1520975954732-35dd22299614', out: 'public/images/categories/women-cat-outerwear-editorial.webp', w: 1000, h: 1282 },
  'wcat_footwear': { id: 'photo-1560343090-f0409e92791a', out: 'public/images/categories/women-cat-footwear.webp', w: 1000, h: 1282 },
  'wcat_accessories': { id: 'photo-1526170375885-4d8ecf77b99f', out: 'public/images/categories/women-cat-accessories.webp', w: 1000, h: 1282 },

  // Kids Category Cards
  'kcat_boys': { id: 'photo-1514090458221-65bb69cf63e6', out: 'public/images/kids/category-boys.webp', w: 1000, h: 1000 },
  'kcat_girls': { id: 'photo-1516627145497-ae6968895b74', out: 'public/images/kids/category-girls.webp', w: 1000, h: 1000 },
  'kcat_baby': { id: 'photo-1519689680058-324335c77eba', out: 'public/images/kids/category-baby.webp', w: 1000, h: 1000 },
  'kcat_accessories': { id: 'photo-1515488042361-ee00e0ddd4e4', out: 'public/images/kids/category-accessories.webp', w: 1000, h: 1000 }
};

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url} - Status ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function processProductGallery(productId, photoId, productSlug, productName) {
  const url = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=2400&q=90`;
  const buffer = await fetchBuffer(url);
  const metadata = await sharp(buffer).metadata();
  const w = metadata.width;
  const h = metadata.height;

  const baseDir = path.join('public', 'images', 'products');
  ensureDir(baseDir);

  const frontPath = path.join(baseDir, `${productSlug}-front.webp`);
  const detailPath = path.join(baseDir, `${productSlug}-detail.webp`);
  const stylingPath = path.join(baseDir, `${productSlug}-styling.webp`);
  const sidePath = path.join(baseDir, `${productSlug}-side.webp`);

  // 1. Front: 1200x1600 (3:4 ratio) top/upper-body balanced crop
  await sharp(buffer)
    .resize(1200, 1600, { fit: 'cover', position: 'top' })
    .webp({ quality: 88 })
    .toFile(frontPath);

  // 2. Detail: 1200x1600 macro zoom crop of fabric/stitching/texture
  // Resize to 2160x2880 (1.8x) with cover, then extract a centered 1200x1600 window
  await sharp(buffer)
    .resize(2160, 2880, { fit: 'cover', position: 'center' })
    .extract({ left: 480, top: 400, width: 1200, height: 1600 })
    .webp({ quality: 88 })
    .toFile(detailPath);

  // 3. Styling: 1200x1600 center balanced editorial styling crop
  await sharp(buffer)
    .resize(1200, 1600, { fit: 'cover', position: 'center' })
    .webp({ quality: 88 })
    .toFile(stylingPath);

  // 4. Side: 1200x1600 bottom/silhouette architectural crop
  await sharp(buffer)
    .resize(1200, 1600, { fit: 'cover', position: 'bottom' })
    .webp({ quality: 88 })
    .toFile(sidePath);

  return {
    front: `/images/products/${productSlug}-front.webp`,
    detail: `/images/products/${productSlug}-detail.webp`,
    styling: `/images/products/${productSlug}-styling.webp`,
    side: `/images/products/${productSlug}-side.webp`
  };
}

async function processBanner(bannerKey, config) {
  const url = `https://images.unsplash.com/${config.id}?auto=format&fit=crop&w=2400&q=90`;
  const buffer = await fetchBuffer(url);
  ensureDir(path.dirname(config.out));

  await sharp(buffer)
    .resize(config.w, config.h, { fit: 'cover', position: 'center' })
    .webp({ quality: 88 })
    .toFile(config.out);

  console.log(`✓ Processed banner: ${bannerKey} -> ${config.out}`);
}

async function main() {
  console.log('=== PABLO COMPREHENSIVE IMAGE UPGRADE & ASSET SYNCHRONIZATION ===');
  
  ensureDir('public/images/products');
  ensureDir('public/images/banners');
  ensureDir('public/images/categories');
  ensureDir('public/images/kids');

  // Load existing products
  const productsPath = 'data/products.json';
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  console.log(`Loaded ${products.length} products from ${productsPath}`);

  // Step 1: Process Product Galleries
  console.log('\n--- Step 1: Downloading & Generating Unique Product Galleries ---');
  let prodCount = 0;
  for (const product of products) {
    const photoId = PRODUCT_PHOTO_MAP[product.id];
    if (photoId) {
      prodCount++;
      const slug = product.slug || product.id;
      console.log(`[${prodCount}/${Object.keys(PRODUCT_PHOTO_MAP).length}] Processing ${product.id} (${product.name})...`);
      try {
        const gallery = await processProductGallery(product.id, photoId, slug, product.name);
        
        // Update product images
        product.primaryImage = gallery.front;
        product.hoverImage = gallery.styling;
        product.images = [
          {
            url: gallery.front,
            alt: `${product.name} — Full Front View`,
            viewType: 'front',
            isPrimary: true
          },
          {
            url: gallery.detail,
            alt: `${product.name} — Tailoring & Fabric Detail`,
            viewType: 'detail'
          },
          {
            url: gallery.styling,
            alt: `${product.name} — Editorial Silhouette`,
            viewType: 'styling'
          },
          {
            url: gallery.side,
            alt: `${product.name} — Architectural Profile`,
            viewType: 'side'
          }
        ];

        // Update colorVariants
        if (Array.isArray(product.colorVariants) && product.colorVariants.length > 0) {
          product.colorVariants.forEach((cv, cvIdx) => {
            cv.images = [
              {
                url: gallery.front,
                alt: `${product.name} in ${cv.name} — Front View`,
                viewType: 'front',
                isPrimary: true
              },
              {
                url: gallery.detail,
                alt: `${product.name} in ${cv.name} — Tailoring Detail`,
                viewType: 'detail'
              },
              {
                url: gallery.styling,
                alt: `${product.name} in ${cv.name} — Styling View`,
                viewType: 'styling'
              },
              {
                url: gallery.side,
                alt: `${product.name} in ${cv.name} — Profile View`,
                viewType: 'side'
              }
            ];
          });
        }
      } catch (err) {
        console.error(`ERROR processing product ${product.id}:`, err);
      }
    }
  }

  // Save updated products to both data/products.json and src/data/products.json
  fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2), 'utf8');
  fs.writeFileSync('src/data/products.json', JSON.stringify(products, null, 2), 'utf8');
  console.log('✓ Successfully wrote updated products to data/products.json and src/data/products.json');

  // Step 2: Process Banners and Category Cards
  console.log('\n--- Step 2: Downloading & Generating Unique Banners & Category Cards ---');
  for (const [key, config] of Object.entries(BANNER_PHOTO_MAP)) {
    try {
      await processBanner(key, config);
    } catch (err) {
      console.error(`ERROR processing banner ${key}:`, err);
    }
  }

  // Step 3: Update Collections JSON
  console.log('\n--- Step 3: Updating Collections Data ---');
  const collectionsPath = 'data/collections.json';
  if (fs.existsSync(collectionsPath)) {
    const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf8'));
    collections.forEach(col => {
      if (col.id === 'col_aw26') {
        col.image = '/images/banners/collection-aw26.webp';
        col.banner = '/images/banners/collection-aw26.webp';
      } else if (col.id === 'col_menswear') {
        col.image = '/images/banners/collection-menswear.webp';
        col.banner = '/images/banners/collection-menswear.webp';
      } else if (col.id === 'col_womenswear') {
        col.image = '/images/banners/collection-womenswear.webp';
        col.banner = '/images/banners/collection-womenswear.webp';
      } else if (col.id === 'col_new_in') {
        col.image = '/images/banners/collection-new-in.webp';
        col.banner = '/images/banners/collection-new-in.webp';
      } else if (col.id === 'col_bestsellers') {
        col.image = '/images/banners/collection-bestsellers.webp';
        col.banner = '/images/banners/collection-bestsellers.webp';
      } else if (col.id === 'col_denim') {
        col.image = '/images/banners/collection-denim.webp';
        col.banner = '/images/banners/collection-denim.webp';
      } else if (col.id === 'col_festive') {
        col.image = '/images/banners/collection-festive.webp';
        col.banner = '/images/banners/collection-festive.webp';
      }
    });
    fs.writeFileSync('data/collections.json', JSON.stringify(collections, null, 2), 'utf8');
    fs.writeFileSync('src/data/collections.json', JSON.stringify(collections, null, 2), 'utf8');
    console.log('✓ Updated data/collections.json and src/data/collections.json');
  }

  // Step 4: Update Categories JSON
  console.log('\n--- Step 4: Updating Categories Data ---');
  const categoriesPath = 'data/categories.json';
  if (fs.existsSync(categoriesPath)) {
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    const catImageMap = {
      't-shirts': '/images/categories/card-tshirts.webp',
      'shirts': '/images/categories/card-shirts.webp',
      'polos': '/images/categories/card-polos.webp',
      'trousers': '/images/categories/card-trousers.webp',
      'denim': '/images/categories/card-denim.webp',
      'outerwear': '/images/categories/card-outerwear.webp',
      'knitwear': '/images/categories/card-knitwear.webp',
      'sweatshirts': '/images/categories/card-sweatshirts.webp',
      'shorts': '/images/categories/card-shorts.webp',
      'footwear': '/images/categories/card-footwear.webp',
      'bags': '/images/categories/card-bags.webp',
      'accessories': '/images/categories/card-accessories.webp',
      'caps': '/images/categories/card-accessories.webp'
    };
    categories.forEach(cat => {
      if (catImageMap[cat.slug]) {
        cat.image = catImageMap[cat.slug];
      }
    });
    fs.writeFileSync('data/categories.json', JSON.stringify(categories, null, 2), 'utf8');
    fs.writeFileSync('src/data/categories.json', JSON.stringify(categories, null, 2), 'utf8');
    console.log('✓ Updated data/categories.json and src/data/categories.json');
  }

  console.log('\n=== IMAGE UPGRADE PIPELINE COMPLETE ===');
}

main().catch(console.error);
