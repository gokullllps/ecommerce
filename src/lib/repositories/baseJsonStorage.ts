import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SRC_DATA_DIR = path.join(process.cwd(), "src", "data");

/**
 * Atomic and safe JSON file reader and writer.
 * Handles concurrency, validation, and ensures files are never corrupted.
 */
export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      // Check fallback in src/data
      const srcPath = path.join(SRC_DATA_DIR, filename);
      if (fs.existsSync(srcPath)) {
        const content = await fs.promises.readFile(srcPath, "utf8");
        return JSON.parse(content) as T;
      }
      return fallback;
    }
    const content = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`[Repository Engine] Failed to read ${filename}:`, error);
    return fallback;
  }
}

/**
 * Synchronous read for SSR / static execution when async is not feasible.
 */
export function readJsonFileSync<T>(filename: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      const srcPath = path.join(SRC_DATA_DIR, filename);
      if (fs.existsSync(srcPath)) {
        const content = fs.readFileSync(srcPath, "utf8");
        return JSON.parse(content) as T;
      }
      return fallback;
    }
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`[Repository Engine] Sync read failed for ${filename}:`, error);
    return fallback;
  }
}

/**
 * Atomically writes data to JSON file with validation and temporary swap.
 */
export async function writeJsonFile<T>(filename: string, data: T): Promise<boolean> {
  if (data === undefined || data === null) {
    throw new Error(`[Repository Engine] Cannot write null/undefined data to ${filename}`);
  }

  // Ensure directories exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SRC_DATA_DIR)) {
    fs.mkdirSync(SRC_DATA_DIR, { recursive: true });
  }

  const filePath = path.join(DATA_DIR, filename);
  const srcFilePath = path.join(SRC_DATA_DIR, filename);
  const tempPath = path.join(DATA_DIR, `${filename}.${Date.now()}.tmp`);

  try {
    const serialized = JSON.stringify(data, null, 2);
    // Basic verification of serialized string
    if (!serialized || serialized.length < 2) {
      throw new Error(`[Repository Engine] Serialization resulted in empty payload for ${filename}`);
    }

    // Write to temp file first
    await fs.promises.writeFile(tempPath, serialized, "utf8");

    // Atomically rename temp file over target file, with fallback for Windows file locks
    try {
      await fs.promises.rename(tempPath, filePath);
    } catch (renameErr: unknown) {
      const err = renameErr as { code?: string };
      if (err.code === "EPERM" || err.code === "EBUSY" || err.code === "EACCES") {
        await fs.promises.copyFile(tempPath, filePath);
        await fs.promises.unlink(tempPath).catch(() => {});
      } else {
        throw renameErr;
      }
    }

    // Also sync to src/data for bundling compatibility
    try {
      await fs.promises.writeFile(srcFilePath, serialized, "utf8");
    } catch {
      // Non-fatal if src/data fails
    }

    return true;
  } catch (error) {
    console.error(`[Repository Engine] Atomic write failed for ${filename}:`, error);
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch {}
    }
    throw error;
  }
}
