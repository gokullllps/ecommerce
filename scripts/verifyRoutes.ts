/**
 * Automated Route Verification Script for PABLO Storefront & Admin
 */

const ROUTES_TO_TEST = [
  // Customer Storefront Routes
  "/",
  "/men",
  "/women",
  "/kids",
  "/footwear",
  "/accessories",
  "/sale",
  "/new-in",

  // Admin CMS Routes
  "/admin",
  "/admin/products",
  "/admin/categories",
  "/admin/collections",
  "/admin/orders",
  "/admin/customers",
  "/admin/inventory",
  "/admin/promotions",
  "/admin/storefront",
  "/admin/themes",
  "/admin/media",
  "/admin/users",
  "/admin/settings",
  "/admin/audit-logs",
];

async function verifyAllRoutes() {
  console.log("=========================================");
  console.log("VERIFYING PABLO STOREFRONT & ADMIN ROUTES");
  console.log("=========================================\n");

  let allPassed = true;

  for (const route of ROUTES_TO_TEST) {
    const url = `http://localhost:3000${route}`;
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        console.log(`[PASS 200 OK] ${route}`);
      } else {
        console.error(`[FAIL HTTP ${res.status}] ${route}`);
        allPassed = false;
      }
    } catch (err: any) {
      console.error(`[ERROR] ${route} - ${err.message}`);
      allPassed = false;
    }
  }

  console.log("\n=========================================");
  if (allPassed) {
    console.log("ALL ROUTES RETURNED HTTP 200 OK!");
  } else {
    console.log("SOME ROUTES FAILED!");
    process.exit(1);
  }
}

verifyAllRoutes();
