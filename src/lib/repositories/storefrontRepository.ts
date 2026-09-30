import { StorefrontHeroSlide, StorefrontSectionConfig, StoreSettings } from "@/types/admin";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";

const FILENAME = "storefront.json";

export interface StorefrontData {
  settings: StoreSettings;
  heroSlides: StorefrontHeroSlide[];
  sections: StorefrontSectionConfig[];
}

const DEFAULT_STOREFRONT: StorefrontData = {
  settings: {
    storeName: "PABLO Luxury Fashion",
    supportEmail: "concierge@pablo-luxury.com",
    currency: "INR",
    currencySymbol: "₹",
    country: "India",
    taxRate: 12,
    freeShippingThreshold: 50000,
    standardShippingFee: 1500,
    maintenanceMode: false,
    defaultThemeId: "theme-default",
    seoTitle: "PABLO — Distinctive Luxury Fashion",
    seoDescription: "PABLO luxury fashion editorial e-commerce.",
  },
  heroSlides: [],
  sections: [],
};

export const storefrontRepository = {
  async getStorefrontData(): Promise<StorefrontData> {
    return readJsonFile<StorefrontData>(FILENAME, DEFAULT_STOREFRONT);
  },

  getStorefrontDataSync(): StorefrontData {
    return readJsonFileSync<StorefrontData>(FILENAME, DEFAULT_STOREFRONT);
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const data = await this.getStorefrontData();
    const updatedSettings = { ...data.settings, ...settings };
    const updatedData = { ...data, settings: updatedSettings };
    await writeJsonFile(FILENAME, updatedData);
    return updatedSettings;
  },

  async updateHeroSlides(slides: StorefrontHeroSlide[]): Promise<StorefrontHeroSlide[]> {
    const data = await this.getStorefrontData();
    const updatedData = { ...data, heroSlides: slides };
    await writeJsonFile(FILENAME, updatedData);
    return slides;
  },

  async updateSections(sections: StorefrontSectionConfig[]): Promise<StorefrontSectionConfig[]> {
    const data = await this.getStorefrontData();
    const updatedData = { ...data, sections };
    await writeJsonFile(FILENAME, updatedData);
    return sections;
  },
};
