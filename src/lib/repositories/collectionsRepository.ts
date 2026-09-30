import { AdminCollection } from "@/types/admin";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";

const FILENAME = "collections.json";

function validateCollections(collections: AdminCollection[]): void {
  const seenIds = new Set<string>();
  collections.forEach((c, idx) => {
    if (!c.id) {
      throw new Error(`[Validation Error] Collection at index ${idx} is missing mandatory ID.`);
    }
    if (seenIds.has(c.id)) {
      console.warn(`[Validation Warning] Duplicate Collection ID: ${c.id}`);
    }
    seenIds.add(c.id);
  });
}

export const collectionsRepository = {
  async getCollections(): Promise<AdminCollection[]> {
    const list = await readJsonFile<AdminCollection[]>(FILENAME, []);
    validateCollections(list);
    return list;
  },

  getCollectionsSync(): AdminCollection[] {
    const list = readJsonFileSync<AdminCollection[]>(FILENAME, []);
    return list;
  },

  async getCollectionById(id: string): Promise<AdminCollection | undefined> {
    const collections = await this.getCollections();
    return collections.find((c) => c.id === id);
  },

  async getCollectionBySlug(slug: string): Promise<AdminCollection | undefined> {
    const collections = await this.getCollections();
    return collections.find((c) => c.slug === slug);
  },

  async createCollection(newCollection: AdminCollection): Promise<AdminCollection> {
    const collections = await this.getCollections();
    const now = new Date().toISOString();
    const col: AdminCollection = {
      ...newCollection,
      updatedAt: now,
    };
    const updated = [...collections, col];
    validateCollections(updated);
    await writeJsonFile(FILENAME, updated);
    return col;
  },

  async updateCollection(id: string, updates: Partial<AdminCollection>): Promise<AdminCollection> {
    const collections = await this.getCollections();
    const index = collections.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Collection with ID "${id}" does not exist in repository.`);
    }

    const updatedCol: AdminCollection = {
      ...collections[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };

    collections[index] = updatedCol;
    validateCollections(collections);
    await writeJsonFile(FILENAME, collections);
    return updatedCol;
  },

  async deleteCollection(id: string): Promise<boolean> {
    const collections = await this.getCollections();
    const filtered = collections.filter((c) => c.id !== id);
    if (filtered.length === collections.length) return false;

    await writeJsonFile(FILENAME, filtered);
    return true;
  },

  async reorderCollectionProducts(id: string, productIds: string[]): Promise<AdminCollection> {
    return this.updateCollection(id, { productIds });
  },
};
