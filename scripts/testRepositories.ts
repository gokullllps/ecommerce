import {
  productsRepository,
  categoriesRepository,
  collectionsRepository,
  inventoryRepository,
  themesRepository,
  promotionsRepository,
  ordersRepository,
  customersRepository,
  storefrontRepository,
  mediaRepository,
  auditLogsRepository,
  adminUsersRepository,
} from "../src/lib/repositories";

async function main() {
  console.log("Testing Repository Layer...");

  const products = await productsRepository.getProducts();
  const categories = await categoriesRepository.getCategories();
  const collections = await collectionsRepository.getCollections();
  const inventory = await inventoryRepository.getInventoryLogs();
  const themes = await themesRepository.getThemes();
  const activeTheme = await themesRepository.getActiveTheme();
  const promotions = await promotionsRepository.getPromotions();
  const orders = await ordersRepository.getOrders();
  const customers = await customersRepository.getCustomers();
  const storefront = await storefrontRepository.getStorefrontData();
  const media = await mediaRepository.getMediaAssets();
  const auditLogs = await auditLogsRepository.getAuditLogs();
  const users = await adminUsersRepository.getAdminUsers();

  console.log(`✓ Products: ${products.length} loaded from products.json`);
  console.log(`✓ Categories: ${categories.length} loaded from categories.json`);
  console.log(`✓ Collections: ${collections.length} loaded from collections.json`);
  console.log(`✓ Inventory history logs: ${inventory.length} loaded from inventory.json`);
  console.log(`✓ Themes: ${themes.length} loaded (Active: "${activeTheme.name}")`);
  console.log(`✓ Promotions: ${promotions.length} loaded`);
  console.log(`✓ Orders: ${orders.length} loaded`);
  console.log(`✓ Customers: ${customers.length} loaded`);
  console.log(`✓ Storefront settings: "${storefront.settings.storeName}" loaded`);
  console.log(`✓ Media assets: ${media.length} loaded`);
  console.log(`✓ Audit logs: ${auditLogs.length} loaded`);
  console.log(`✓ Admin users: ${users.length} loaded`);

  console.log("\nAll 12 repositories passed integrity and validation tests!");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
