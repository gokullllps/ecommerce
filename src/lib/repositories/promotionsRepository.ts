import { AdminPromotion } from "@/types/admin";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";

const FILENAME = "promotions.json";

function validatePromotions(promotions: AdminPromotion[]): void {
  const seenIds = new Set<string>();
  const seenCodes = new Set<string>();
  promotions.forEach((p, idx) => {
    if (!p.id) {
      throw new Error(`[Validation Error] Promotion at index ${idx} is missing mandatory ID.`);
    }
    if (seenIds.has(p.id)) {
      console.warn(`[Validation Warning] Duplicate Promotion ID: ${p.id}`);
    }
    seenIds.add(p.id);

    if (p.code) {
      const codeUpper = p.code.toUpperCase();
      if (seenCodes.has(codeUpper)) {
        console.warn(`[Validation Warning] Duplicate Promotion Code: ${p.code}`);
      }
      seenCodes.add(codeUpper);
    }
  });
}

export const promotionsRepository = {
  async getPromotions(): Promise<AdminPromotion[]> {
    const list = await readJsonFile<AdminPromotion[]>(FILENAME, []);
    validatePromotions(list);
    return list;
  },

  getPromotionsSync(): AdminPromotion[] {
    const list = readJsonFileSync<AdminPromotion[]>(FILENAME, []);
    return list;
  },

  async getPromotionById(id: string): Promise<AdminPromotion | undefined> {
    const list = await this.getPromotions();
    return list.find((p) => p.id === id);
  },

  async getPromotionByCode(code: string): Promise<AdminPromotion | undefined> {
    const list = await this.getPromotions();
    return list.find((p) => p.code.toUpperCase() === code.toUpperCase());
  },

  async createPromotion(newPromo: AdminPromotion): Promise<AdminPromotion> {
    const list = await this.getPromotions();
    const updated = [newPromo, ...list];
    validatePromotions(updated);
    await writeJsonFile(FILENAME, updated);
    return newPromo;
  },

  async updatePromotion(id: string, updates: Partial<AdminPromotion>): Promise<AdminPromotion> {
    const list = await this.getPromotions();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Promotion ${id} not found.`);

    const updated: AdminPromotion = {
      ...list[index],
      ...updates,
      id,
    };
    list[index] = updated;
    validatePromotions(list);
    await writeJsonFile(FILENAME, list);
    return updated;
  },

  async togglePromotion(id: string): Promise<AdminPromotion> {
    const list = await this.getPromotions();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Promotion ${id} not found.`);

    const updated: AdminPromotion = {
      ...list[index],
      isActive: !list[index].isActive,
    };
    list[index] = updated;
    validatePromotions(list);
    await writeJsonFile(FILENAME, list);
    return updated;
  },

  async duplicatePromotion(id: string): Promise<AdminPromotion> {
    const list = await this.getPromotions();
    const original = list.find((p) => p.id === id);
    if (!original) throw new Error(`Promotion ${id} not found.`);

    const duplicated: AdminPromotion = {
      ...original,
      id: `promo_${Date.now()}`,
      code: `${original.code}_COPY_${Math.floor(Math.random() * 1000)}`,
      title: `${original.title} (Copy)`,
      usedCount: 0,
      isActive: false,
    };
    const updated = [duplicated, ...list];
    validatePromotions(updated);
    await writeJsonFile(FILENAME, updated);
    return duplicated;
  },

  async deletePromotion(id: string): Promise<boolean> {
    const list = await this.getPromotions();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) return false;
    await writeJsonFile(FILENAME, filtered);
    return true;
  },
};
