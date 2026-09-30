/**
 * PABLO Unified Test Runner for CI/CD & Final Verification
 */
import { execSync } from "child_process";

const suites = [
  { name: "Canonical Data Integrity Audit", cmd: "npx tsx scripts/validateDataIntegrity.ts" },
  { name: "Phase 4 CMS & Repository Tests", cmd: "npx tsx scripts/testPhase4.ts" },
  { name: "End-to-End Demo Commerce Flow", cmd: "npx tsx scripts/testEndToEndDemo.ts" },
  { name: "Admin CMS 19-Mutation Operations", cmd: "npx tsx scripts/testAdminCMS.ts" },
  { name: "Storefront & Admin Route Health Checks", cmd: "npx tsx scripts/verifyRoutes.ts" },
  { name: "Product Image Persistence Pipeline", cmd: "npx tsx scripts/verifyImagePersistence.ts" },
];

console.log("==================================================");
console.log("PABLO COMPLETE DEMO & INTEGRATION TEST RUNNER");
console.log("==================================================\n");

let passed = 0;
let failed = 0;

for (const suite of suites) {
  console.log(`\n>>> EXECUTING: ${suite.name}...`);
  try {
    execSync(suite.cmd, { stdio: "inherit" });
    passed++;
  } catch {
    console.error(`FAILED: ${suite.name}`);
    failed++;
  }
}

console.log("\n==================================================");
console.log(`FINAL RESULT: ${passed} SUITES PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
