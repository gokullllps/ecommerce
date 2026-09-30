import { AdminThemeConfig } from "@/types/admin";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";

const FILENAME = "themes.json";

function validateThemes(themes: AdminThemeConfig[]): void {
  const seenIds = new Set<string>();
  themes.forEach((t, idx) => {
    if (!t.id) {
      throw new Error(`[Validation Error] Theme at index ${idx} is missing mandatory ID.`);
    }
    if (seenIds.has(t.id)) {
      console.warn(`[Validation Warning] Duplicate Theme ID: ${t.id}`);
    }
    seenIds.add(t.id);
  });
}

export const themesRepository = {
  async getThemes(): Promise<AdminThemeConfig[]> {
    const list = await readJsonFile<AdminThemeConfig[]>(FILENAME, []);
    validateThemes(list);
    return list;
  },

  getThemesSync(): AdminThemeConfig[] {
    const list = readJsonFileSync<AdminThemeConfig[]>(FILENAME, []);
    return list;
  },

  async getThemeById(id: string): Promise<AdminThemeConfig | undefined> {
    const themes = await this.getThemes();
    return themes.find((t) => t.id === id);
  },

  async getActiveTheme(scope: string = "all", date: Date = new Date()): Promise<AdminThemeConfig> {
    const themes = await this.getThemes();
    // 1. Check for scheduled themes that fall within active date range
    const activeScheduled = themes.find((t) => {
      if (t.status !== "scheduled" && t.status !== "active") return false;
      if (t.scope !== "all" && t.scope !== scope) return false;
      if (t.startAt && t.endAt) {
        const start = new Date(t.startAt).getTime();
        const end = new Date(t.endAt).getTime();
        const now = date.getTime();
        return now >= start && now <= end;
      }
      return false;
    });

    if (activeScheduled) return activeScheduled;

    // 2. Otherwise return theme with status === "active"
    const standardActive = themes.find((t) => t.status === "active");
    if (standardActive) return standardActive;

    // 3. Fallback to first theme
    return themes[0];
  },

  async createTheme(newTheme: AdminThemeConfig): Promise<AdminThemeConfig> {
    const themes = await this.getThemes();
    const now = new Date().toISOString();
    const theme: AdminThemeConfig = {
      ...newTheme,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...themes, theme];
    validateThemes(updated);
    await writeJsonFile(FILENAME, updated);
    return theme;
  },

  async updateTheme(id: string, updates: Partial<AdminThemeConfig>): Promise<AdminThemeConfig> {
    const themes = await this.getThemes();
    const index = themes.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Theme with ID "${id}" does not exist in repository.`);
    }

    const updatedTheme: AdminThemeConfig = {
      ...themes[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };

    themes[index] = updatedTheme;
    validateThemes(themes);
    await writeJsonFile(FILENAME, themes);
    return updatedTheme;
  },

  async activateTheme(id: string): Promise<AdminThemeConfig> {
    const themes = await this.getThemes();
    const target = themes.find((t) => t.id === id);
    if (!target) throw new Error(`Theme ${id} not found.`);

    // Deactivate previous active theme of same scope, activate target
    const updated = themes.map((t) => {
      if (t.id === id) {
        return { ...t, status: "active" as const, updatedAt: new Date().toISOString() };
      }
      if (t.scope === target.scope && t.status === "active") {
        return { ...t, status: "draft" as const, updatedAt: new Date().toISOString() };
      }
      return t;
    });

    validateThemes(updated);
    await writeJsonFile(FILENAME, updated);
    return updated.find((t) => t.id === id)!;
  },

  async deactivateTheme(id: string): Promise<AdminThemeConfig> {
    const themes = await this.getThemes();
    const target = themes.find((t) => t.id === id);
    if (!target) throw new Error(`Theme ${id} not found.`);

    const updatedTheme: AdminThemeConfig = {
      ...target,
      status: "draft",
      updatedAt: new Date().toISOString(),
    };

    const updated = themes.map((t) => (t.id === id ? updatedTheme : t));
    validateThemes(updated);
    await writeJsonFile(FILENAME, updated);
    return updatedTheme;
  },

  async duplicateTheme(id: string): Promise<AdminThemeConfig> {
    const themes = await this.getThemes();
    const original = themes.find((t) => t.id === id);
    if (!original) throw new Error(`Theme ${id} not found.`);

    const now = new Date().toISOString();
    const duplicated: AdminThemeConfig = {
      ...original,
      id: `theme_${Date.now()}`,
      name: `${original.name} (Copy)`,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...themes, duplicated];
    validateThemes(updated);
    await writeJsonFile(FILENAME, updated);
    return duplicated;
  },

  async deleteTheme(id: string): Promise<boolean> {
    const themes = await this.getThemes();
    if (id === "theme-default") {
      throw new Error(`Cannot delete the core default theme.`);
    }
    const filtered = themes.filter((t) => t.id !== id);
    if (filtered.length === themes.length) return false;
    await writeJsonFile(FILENAME, filtered);
    return true;
  },
};
