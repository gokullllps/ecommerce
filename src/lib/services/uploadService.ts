import fs from "fs";
import path from "path";
import { mediaRepository } from "@/lib/repositories/mediaRepository";
import { MediaAsset } from "@/types/admin";
import { ValidationError } from "@/lib/errors";

const UPLOAD_DIR_NAME = "products";
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", UPLOAD_DIR_NAME);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "webp", // or jpg
  "image/png": "png",
  "image/webp": "webp",
};

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

export interface UploadResult {
  url: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
  mediaAssetId?: string;
}

/**
 * Ensures the uploads directory exists on disk.
 */
export function ensureUploadsDirExists(): string {
  if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
    fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
  }
  return PUBLIC_UPLOADS_DIR;
}

/**
 * Validates file type, size, and extension.
 */
export function validateImageFile(file: {
  name: string;
  size: number;
  type: string;
}): { ext: string } {
  if (!file) {
    throw new ValidationError("No file provided for upload.");
  }

  // 1. Size check
  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError(
      `File "${file.name}" exceeds the maximum allowed size of 10 MB (${Math.round(
        file.size / (1024 * 1024)
      )} MB).`
    );
  }

  // 2. MIME type check
  const mimeType = (file.type || "").toLowerCase().trim();
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new ValidationError(
      `Invalid MIME type "${mimeType}". Only JPG, PNG, and WEBP images are permitted.`
    );
  }

  // 3. Extension check
  const originalExt = path.extname(file.name || "").replace(".", "").toLowerCase().trim();
  const resolvedExt = originalExt || (mimeType === "image/jpeg" ? "jpg" : mimeType === "image/png" ? "png" : "webp");
  
  if (!ALLOWED_EXTENSIONS.has(resolvedExt)) {
    throw new ValidationError(
      `Invalid file extension ".${resolvedExt}". Only .jpg, .jpeg, .png, and .webp are permitted.`
    );
  }

  // Normalize jpeg to jpg
  const normalizedExt = resolvedExt === "jpeg" ? "jpg" : resolvedExt;

  return { ext: normalizedExt };
}

/**
 * Saves an uploaded image file buffer to public/uploads/products/
 * and registers it in media.json.
 */
export async function persistProductImageFile(
  file: File,
  productId?: string
): Promise<UploadResult> {
  const { ext } = validateImageFile(file);

  ensureUploadsDirExists();

  // Sanitize productId for filename safety
  const cleanProductId = (productId || "new")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 32);

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const safeFilename = `product_${cleanProductId}_${timestamp}_${randomSuffix}.${ext}`;
  const filePath = path.join(PUBLIC_UPLOADS_DIR, safeFilename);

  // Write file buffer to public/uploads/products/
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.promises.writeFile(filePath, buffer);

  const publicUrl = `/uploads/products/${safeFilename}`;

  // Register in media.json (existing media model)
  const mediaAssetId = `med_${timestamp}_${randomSuffix}`;
  const mediaAsset: MediaAsset = {
    id: mediaAssetId,
    filename: safeFilename,
    url: publicUrl,
    sizeBytes: file.size,
    mimeType: file.type || (ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg"),
    folder: "products",
    tags: ["product", cleanProductId, ext],
    uploadedAt: new Date().toISOString(),
  };

  try {
    await mediaRepository.createMediaAsset(mediaAsset);
  } catch (err) {
    console.warn(`[Upload Service] Failed to register media asset in media.json:`, err);
  }

  return {
    url: publicUrl,
    filename: safeFilename,
    sizeBytes: file.size,
    mimeType: mediaAsset.mimeType,
    mediaAssetId,
  };
}
