import { MediaAsset } from "@/types/admin";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";

const FILENAME = "media.json";

function validateMedia(assets: MediaAsset[]): void {
  const seenIds = new Set<string>();
  assets.forEach((m, idx) => {
    if (!m.id) {
      throw new Error(`[Validation Error] Media asset at index ${idx} is missing mandatory ID.`);
    }
    if (seenIds.has(m.id)) {
      console.warn(`[Validation Warning] Duplicate Media ID: ${m.id}`);
    }
    seenIds.add(m.id);

    if (typeof m.url === "string" && m.url.trim().toLowerCase().startsWith("blob:")) {
      throw new Error(`[Validation Error] Media asset "${m.id}" contains unpersisted blob URL: "${m.url}". Blob URLs cannot be saved to repository.`);
    }
  });
}

export const mediaRepository = {
  async getMediaAssets(): Promise<MediaAsset[]> {
    const list = await readJsonFile<MediaAsset[]>(FILENAME, []);
    validateMedia(list);
    return list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  },

  getMediaAssetsSync(): MediaAsset[] {
    const list = readJsonFileSync<MediaAsset[]>(FILENAME, []);
    return list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  },

  async getMediaAssetById(id: string): Promise<MediaAsset | undefined> {
    const list = await this.getMediaAssets();
    return list.find((m) => m.id === id);
  },

  async createMediaAsset(asset: MediaAsset): Promise<MediaAsset> {
    const list = await this.getMediaAssets();
    const updated = [asset, ...list];
    validateMedia(updated);
    await writeJsonFile(FILENAME, updated);
    return asset;
  },

  async updateMediaAsset(id: string, updates: Partial<MediaAsset>): Promise<MediaAsset> {
    const list = await this.getMediaAssets();
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Media asset ${id} not found.`);

    const updated: MediaAsset = {
      ...list[index],
      ...updates,
      id,
    };
    list[index] = updated;
    validateMedia(list);
    await writeJsonFile(FILENAME, list);
    return updated;
  },

  async deleteMediaAsset(id: string): Promise<boolean> {
    const list = await this.getMediaAssets();
    const filtered = list.filter((m) => m.id !== id);
    if (filtered.length === list.length) return false;
    await writeJsonFile(FILENAME, filtered);
    return true;
  },
};
