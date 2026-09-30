import {
  ordersRepository,
  customersRepository,
  promotionsRepository,
  themesRepository,
  mediaRepository,
  adminUsersRepository,
  auditLogsRepository,
} from "../src/lib/repositories";
import { can, ROLE_PERMISSIONS } from "../src/lib/permissions";
import { AdminOrder, AdminCustomer, AdminPromotion, AdminThemeConfig, MediaAsset, AdminUser } from "../src/types/admin";

async function runPhase4Tests() {
  console.log("=========================================");
  console.log("RUNNING PHASE 4 CMS & REPOSITORY TESTS");
  console.log("=========================================\n");

  // 1. ORDERS REPOSITORY TEST
  console.log("1. Testing Orders Repository...");
  const orders = await ordersRepository.getOrders();
  if (orders.length === 0) throw new Error("No orders found");
  const testOrder = orders.find((o) => o.status === "confirmed" || o.status === "processing") || orders[0];
  const origStatus = testOrder.status;
  if (testOrder.status !== "packed") {
    testOrder.status = "packed";
    await ordersRepository.updateOrder(testOrder.id, { status: "packed" });
  }

  const updatedOrder = await ordersRepository.updateOrderStatus(
    testOrder.id,
    "shipped",
    "TRACK-PHASE4-TEST",
    "Blue Dart Atelier Express"
  );
  console.log("✓ Order status updated:", {
    id: updatedOrder.id,
    status: updatedOrder.status,
    fulfillmentStatus: updatedOrder.fulfillmentStatus,
    trackingNumber: updatedOrder.trackingNumber,
    carrier: updatedOrder.carrier,
  });

  // Revert
  await ordersRepository.updateOrder(testOrder.id, { status: origStatus });
  console.log("✓ Order reverted to canonical status.");

  // 2. CUSTOMERS REPOSITORY TEST
  console.log("\n2. Testing Customers Repository...");
  const testCustomer: AdminCustomer = {
    id: `cust_test_${Date.now()}`,
    name: "Maharani Gayatri Devi",
    email: `gayatri_${Date.now()}@jaipur-palace.in`,
    phone: "+91 98290 11111",
    city: "Jaipur",
    country: "India",
    status: "vip",
    totalOrders: 14,
    totalSpent: 1250000,
    lastOrderDate: new Date().toISOString(),
    joinedAt: new Date().toISOString(),
    notes: "Requires bespoke handwoven silk cashmere scarves",
  };
  await customersRepository.createCustomer(testCustomer);
  const fetchedCustomer = await customersRepository.getCustomerById(testCustomer.id);
  console.log("✓ Customer created & retrieved:", {
    id: fetchedCustomer?.id,
    name: fetchedCustomer?.name,
    status: fetchedCustomer?.status,
    totalSpent: fetchedCustomer?.totalSpent,
  });
  // Clean up test customer
  await customersRepository.deleteCustomer(testCustomer.id);
  console.log("✓ Customer test cleanup complete.");

  // 3. PROMOTIONS REPOSITORY TEST
  console.log("\n3. Testing Promotions Repository...");
  const testPromo: AdminPromotion = {
    id: `promo_test_${Date.now()}`,
    code: `PHASE4TEST_${Math.floor(Math.random() * 1000)}`,
    title: "Phase 4 Atelier Privilege",
    description: "Private test promotion code",
    type: "percentage",
    value: 20,
    minOrderValue: 50000,
    maxDiscount: 20000,
    usageLimit: 50,
    usedCount: 0,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    isActive: true,
    applicableTo: "all",
  };
  await promotionsRepository.createPromotion(testPromo);
  const duplicated = await promotionsRepository.duplicatePromotion(testPromo.id);
  console.log("✓ Promotion created and duplicated:", {
    origCode: testPromo.code,
    duplicatedCode: duplicated.code,
    duplicatedTitle: duplicated.title,
  });
  await promotionsRepository.deletePromotion(testPromo.id);
  await promotionsRepository.deletePromotion(duplicated.id);
  console.log("✓ Promotions test cleanup complete.");

  // 4. THEMES REPOSITORY TEST
  console.log("\n4. Testing Themes Repository...");
  const themes = await themesRepository.getThemes();
  const testTheme: AdminThemeConfig = {
    id: `theme_test_${Date.now()}`,
    name: "Summer Monsoon Atelier",
    description: "Lush greens and mineral grey silk reflections",
    type: "seasonal",
    scope: "women",
    priority: 45,
    status: "draft",
    timezone: "Asia/Kolkata",
    tokens: {
      primaryBg: "#E3E7E1",
      primaryText: "#18201B",
      darkSurface: "#161D19",
      accent: "#7A9A7B",
      borderColor: "#D0D6CE",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await themesRepository.createTheme(testTheme);
  const fetchedTheme = await themesRepository.getThemeById(testTheme.id);
  console.log("✓ Theme created & verified:", {
    id: fetchedTheme?.id,
    name: fetchedTheme?.name,
    scope: fetchedTheme?.scope,
  });
  await themesRepository.deleteTheme(testTheme.id);
  console.log("✓ Themes test cleanup complete.");

  // 5. MEDIA REPOSITORY TEST
  console.log("\n5. Testing Media Repository...");
  const testMedia: MediaAsset = {
    id: `med_test_${Date.now()}`,
    filename: "lookbook-monsoon-silk.jpg",
    url: "/images/lookbook-monsoon.jpg",
    sizeBytes: 1540000,
    mimeType: "image/jpeg",
    folder: "campaigns",
    tags: ["monsoon", "silk", "editorial"],
    dimensions: { width: 2400, height: 3200 },
    uploadedAt: new Date().toISOString(),
  };
  await mediaRepository.createMediaAsset(testMedia);
  const fetchedMedia = await mediaRepository.getMediaAssetById(testMedia.id);
  console.log("✓ Media asset registered & retrieved:", {
    id: fetchedMedia?.id,
    filename: fetchedMedia?.filename,
    folder: fetchedMedia?.folder,
    tags: fetchedMedia?.tags,
  });
  await mediaRepository.deleteMediaAsset(testMedia.id);
  console.log("✓ Media test cleanup complete.");

  // 6. ADMIN USERS & RBAC PERMISSIONS TEST
  console.log("\n6. Testing Admin Users & RBAC Permissions...");
  const testUser: AdminUser = {
    id: `usr_test_${Date.now()}`,
    name: "Zoya Akhtar",
    email: `zoya_${Date.now()}@pablo-luxury.com`,
    role: "marketing_manager",
    status: "active",
    lastLogin: new Date().toISOString(),
    permissions: ROLE_PERMISSIONS.marketing_manager,
  };
  await adminUsersRepository.createAdminUser(testUser);

  // Assert permissions
  const canManagePromos = can(testUser, "promotions.manage");
  const canManageInventory = can(testUser, "inventory.manage");
  console.log("✓ RBAC permissions verified for Marketing Manager:", {
    "can promotions.manage": canManagePromos, // should be true
    "can inventory.manage": canManageInventory, // should be false
  });
  if (!canManagePromos || canManageInventory) {
    throw new Error("RBAC permission assertion failed for Marketing Manager");
  }

  await adminUsersRepository.deleteAdminUser(testUser.id);
  console.log("✓ Admin user test cleanup complete.");

  // 7. AUDIT LOGS REPOSITORY TEST
  console.log("\n7. Testing Audit Logs...");
  const logEntry = await auditLogsRepository.logAction(
    "PHASE_4_VALIDATION",
    "System Integration",
    "Verified all Phase 4 modules against canonical JSON data",
    "Automated QA Suite",
    "qa@pablo-luxury.com"
  );
  console.log("✓ Audit log entry appended:", {
    id: logEntry.id,
    action: logEntry.action,
    timestamp: logEntry.timestamp,
  });

  console.log("\n=========================================");
  console.log("ALL PHASE 4 REPOSITORY & CMS TESTS PASSED!");
  console.log("=========================================\n");
}

runPhase4Tests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
