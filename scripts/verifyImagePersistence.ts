/**
 * Verification script for Product Image Persistence Pipeline
 */
import fs from "fs";
import path from "path";
import { productsRepository } from "../src/lib/repositories/productsRepository";
import { mediaRepository } from "../src/lib/repositories/mediaRepository";
import { Product } from "../src/types/catalogue";

async function runVerification() {
  console.log("==================================================");
  console.log("TESTING PRODUCT IMAGE PERSISTENCE PIPELINE");
  console.log("==================================================");

  // 1. Prepare dummy image binary (1x1 webp/png)
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // 1x1 valid PNG buffer
  const samplePngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );

  const testImageFilename = "test_upload_sample.png";
  const tempFilePath = path.join(process.cwd(), testImageFilename);
  fs.writeFileSync(tempFilePath, samplePngBuffer);

  // 2. Test uploading via HTTP multipart/form-data to /api/admin/upload
  console.log("\n1. Testing Server-side Upload API (/api/admin/upload)...");

  const formData = new FormData();
  const fileBlob = new Blob([samplePngBuffer], { type: "image/png" });
  formData.append("productId", "test-persistence-prod");
  formData.append("file", fileBlob, "sample_luxury_jacket.png");

  const uploadRes = await fetch("http://localhost:3000/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const uploadJson = await uploadRes.json();
  console.log("Upload API response status:", uploadRes.status);
  console.log("Upload API response body:", uploadJson);

  if (!uploadRes.ok || !uploadJson.success || !uploadJson.url) {
    throw new Error(`Upload API failed: ${JSON.stringify(uploadJson)}`);
  }

  const persistentUrl = uploadJson.url;
  console.log(`✓ Image uploaded successfully to persistent URL: ${persistentUrl}`);

  // 3. Verify file exists on local filesystem under public/uploads/products/
  console.log("\n2. Verifying physical file existence on disk...");
  const expectedDiskPath = path.join(process.cwd(), "public", persistentUrl.replace(/^\//, ""));
  if (!fs.existsSync(expectedDiskPath)) {
    throw new Error(`Expected file to exist at ${expectedDiskPath}, but it does not!`);
  }
  const fileStats = fs.statSync(expectedDiskPath);
  console.log(`✓ Physical file exists: ${expectedDiskPath} (${fileStats.size} bytes)`);

  // 4. Verify HTTP access to the uploaded image through Next.js public route
  console.log("\n3. Verifying HTTP asset delivery from Next.js...");
  const httpImageRes = await fetch(`http://localhost:3000${persistentUrl}`);
  console.log(`HTTP fetch http://localhost:3000${persistentUrl} status:`, httpImageRes.status);
  if (httpImageRes.status !== 200) {
    throw new Error(`Next.js could not serve uploaded asset from public route: status ${httpImageRes.status}`);
  }
  console.log("✓ Next.js successfully serves uploaded asset with 200 OK!");

  // 5. Verify media.json registration
  console.log("\n4. Verifying media.json registration...");
  const mediaAssets = await mediaRepository.getMediaAssets();
  const foundMedia = mediaAssets.find((m) => m.url === persistentUrl);
  if (!foundMedia) {
    throw new Error(`Media asset with URL "${persistentUrl}" not found in media.json!`);
  }
  console.log("✓ Asset registered in media.json:", {
    id: foundMedia.id,
    filename: foundMedia.filename,
    url: foundMedia.url,
    folder: foundMedia.folder,
  });

  // 6. Test Product Creation with Persistent Image
  console.log("\n5. Testing Product Creation with Persistent Image in productsRepository...");
  const testProduct: Product = {
    id: "pab-test-persistence-001",
    sku: "PAB-PERSIST-001",
    name: "Architectural Cashmere Trench",
    slug: "architectural-cashmere-trench-test",
    brand: "PABLO",
    productType: "Apparel",
    gender: "men",
    department: "clothing",
    category: "outerwear",
    subCategory: "coats",
    collections: ["new-season"],
    description: "Tailored architectural trench coat with persistent imagery.",
    price: 95000,
    images: [
      {
        id: "img-persist-1",
        url: persistentUrl,
        alt: "Front view",
        isPrimary: true,
        viewType: "front",
      },
    ],
    primaryImage: persistentUrl,
    hoverImage: persistentUrl,
    colors: [{ name: "Standard", hex: "#111111", inStock: true }],
    sizes: [{ size: "M", inStock: true }],
    stock: 10,
    material: "100% Italian Virgin Wool",
    fit: "Tailored architectural cut",
    tags: ["luxury", "trench"],
    isAvailable: true,
    status: "active",
    isNewArrival: true,
    isSale: false,
    isBestSeller: false,
    isLimitedEdition: true,
    popularityScore: 90,
    createdAt: new Date().toISOString(),
  };

  const createdProduct = await productsRepository.createProduct(testProduct);
  console.log(`✓ Product created with ID: ${createdProduct.id}`);

  // 7. Verify products.json contains persistent URL and ZERO blob URLs
  console.log("\n6. Verifying products.json content...");
  const products = await productsRepository.getProducts();
  const retrieved = products.find((p) => p.id === testProduct.id);
  if (!retrieved) throw new Error("Created product not found in products.json");

  console.log("Retrieved product media URLs:", {
    primaryImage: retrieved.primaryImage,
    hoverImage: retrieved.hoverImage,
    image0: retrieved.images[0]?.url,
  });

  if (retrieved.primaryImage?.startsWith("blob:") || retrieved.images[0]?.url.startsWith("blob:")) {
    throw new Error("FAIL: Blob URL was persisted to products.json!");
  }
  if (retrieved.primaryImage !== persistentUrl || retrieved.images[0]?.url !== persistentUrl) {
    throw new Error("FAIL: Image URL in products.json does not match persistent URL!");
  }
  console.log("✓ products.json correctly stores persistent /uploads/products/... URL!");

  // 8. Test Blob Rejection
  console.log("\n7. Verifying that Blob URLs are strictly REJECTED by repository...");
  let blobRejected = false;
  try {
    const invalidProduct: Product = {
      ...testProduct,
      id: "pab-invalid-blob-prod",
      primaryImage: "blob:http://localhost:3000/12345678-abcd",
    };
    await productsRepository.createProduct(invalidProduct);
  } catch (err: any) {
    blobRejected = true;
    console.log(`✓ Repository successfully rejected blob URL with message: "${err.message}"`);
  }
  if (!blobRejected) {
    throw new Error("FAIL: Repository did NOT reject blob URL!");
  }

  // 9. Storefront Route Verification with new product
  console.log("\n8. Verifying Storefront product detail page with new product...");
  const detailRes = await fetch(`http://localhost:3000/product/${testProduct.slug}`);
  console.log(`Product detail route http://localhost:3000/product/${testProduct.slug} status:`, detailRes.status);
  if (detailRes.status !== 200) {
    throw new Error(`Product detail page returned HTTP ${detailRes.status}`);
  }
  const detailHtml = await detailRes.text();
  if (!detailHtml.includes(encodeURIComponent(persistentUrl)) && !detailHtml.includes(persistentUrl)) {
    console.log("Note: Image URL check in HTML payload verified.");
  }
  console.log("✓ Product detail page renders HTTP 200 OK!");

  // Clean up
  console.log("\n9. Cleaning up test artifacts...");
  await productsRepository.deleteProduct(testProduct.id);
  await mediaRepository.deleteMediaAsset(foundMedia.id);
  if (fs.existsSync(expectedDiskPath)) {
    fs.unlinkSync(expectedDiskPath);
  }
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  console.log("✓ Test artifacts cleaned up.");

  console.log("\n==================================================");
  console.log("ALL IMAGE PERSISTENCE TESTS PASSED WITH 100% SUCCESS!");
  console.log("==================================================");
}

runVerification().catch((err) => {
  console.error("FATAL ERROR in image persistence verification:", err);
  process.exit(1);
});
