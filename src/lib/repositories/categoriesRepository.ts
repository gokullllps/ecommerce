import { AdminCategory } from "@/types/admin";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";

const FILENAME = "categories.json";

function validateCategories(categories: AdminCategory[]): void {
  const seenIds = new Set<string>();
  categories.forEach((c, idx) => {
    if (!c.id) {
      throw new Error(`[Validation Error] Category at index ${idx} is missing mandatory ID.`);
    }
    if (seenIds.has(c.id)) {
      console.warn(`[Validation Warning] Duplicate Category ID: ${c.id}`);
    }
    seenIds.add(c.id);
  });
}

export const categoriesRepository = {
  async getCategories(): Promise<AdminCategory[]> {
    const list = await readJsonFile<AdminCategory[]>(FILENAME, []);
    validateCategories(list);
    return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  getCategoriesSync(): AdminCategory[] {
    const list = readJsonFileSync<AdminCategory[]>(FILENAME, []);
    return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  async getCategoryById(id: string): Promise<AdminCategory | undefined> {
    const categories = await this.getCategories();
    return categories.find((c) => c.id === id);
  },

  async getCategoryBySlug(slug: string): Promise<AdminCategory | undefined> {
    const categories = await this.getCategories();
    return categories.find((c) => c.slug === slug);
  },

  async createCategory(newCategory: AdminCategory): Promise<AdminCategory> {
    const categories = await this.getCategories();
    const updated = [...categories, newCategory];
    validateCategories(updated);
    await writeJsonFile(FILENAME, updated);
    return newCategory;
  },

  async updateCategory(id: string, updates: Partial<AdminCategory>): Promise<AdminCategory> {
    const categories = await this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Category with ID "${id}" does not exist in repository.`);
    }

    const updatedCat: AdminCategory = {
      ...categories[index],
      ...updates,
      id,
    };

    categories[index] = updatedCat;
    validateCategories(categories);
    await writeJsonFile(FILENAME, categories);
    return updatedCat;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    // Also remove children referencing this category as parent
    const filtered = categories.filter((c) => c.id !== id && c.parentId !== id);
    if (filtered.length === categories.length) return false;

    await writeJsonFile(FILENAME, filtered);
    return true;
  },

  async reorderCategories(newOrder: AdminCategory[]): Promise<AdminCategory[]> {
    const normalized = newOrder.map((c, idx) => ({ ...c, displayOrder: idx + 1 }));
    validateCategories(normalized);
    await writeJsonFile(FILENAME, normalized);
    return normalized;
  },

  async getCategoryTree(): Promise<Array<AdminCategory & { children: AdminCategory[] }>> {
    const categories = await this.getCategories();
    const map = new Map<string, AdminCategory & { children: AdminCategory[] }>();
    categories.forEach(c => map.set(c.id, { ...c, children: [] }));

    const roots: Array<AdminCategory & { children: AdminCategory[] }> = [];
    map.forEach(cat => {
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children.push(cat);
      } else {
        roots.push(cat);
      }
    });

    return roots;
  },
};
