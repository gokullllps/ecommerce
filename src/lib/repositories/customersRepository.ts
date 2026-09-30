import { AdminCustomer } from "@/types/admin";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";

const FILENAME = "customers.json";

function validateCustomers(customers: AdminCustomer[]): void {
  const seenIds = new Set<string>();
  const seenEmails = new Set<string>();
  customers.forEach((c, idx) => {
    if (!c.id) {
      throw new Error(`[Validation Error] Customer at index ${idx} is missing mandatory ID.`);
    }
    if (seenIds.has(c.id)) {
      console.warn(`[Validation Warning] Duplicate Customer ID: ${c.id}`);
    }
    seenIds.add(c.id);

    if (c.email) {
      const emailLower = c.email.toLowerCase();
      if (seenEmails.has(emailLower)) {
        console.warn(`[Validation Warning] Duplicate Customer email: ${c.email}`);
      }
      seenEmails.add(emailLower);
    }
  });
}

export const customersRepository = {
  async getCustomers(): Promise<AdminCustomer[]> {
    const list = await readJsonFile<AdminCustomer[]>(FILENAME, []);
    validateCustomers(list);
    return list.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
  },

  getCustomersSync(): AdminCustomer[] {
    const list = readJsonFileSync<AdminCustomer[]>(FILENAME, []);
    return list.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
  },

  async getCustomerById(id: string): Promise<AdminCustomer | undefined> {
    const list = await this.getCustomers();
    return list.find((c) => c.id === id);
  },

  async getCustomerByEmail(email: string): Promise<AdminCustomer | undefined> {
    const list = await this.getCustomers();
    return list.find((c) => c.email.toLowerCase() === email.toLowerCase());
  },

  async createCustomer(newCustomer: AdminCustomer): Promise<AdminCustomer> {
    const list = await this.getCustomers();
    const updated = [newCustomer, ...list];
    validateCustomers(updated);
    await writeJsonFile(FILENAME, updated);
    return newCustomer;
  },

  async updateCustomer(id: string, updates: Partial<AdminCustomer>): Promise<AdminCustomer> {
    const list = await this.getCustomers();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Customer ${id} not found.`);

    const updated: AdminCustomer = {
      ...list[index],
      ...updates,
      id,
    };
    list[index] = updated;
    validateCustomers(list);
    await writeJsonFile(FILENAME, list);
    return updated;
  },

  async deleteCustomer(id: string): Promise<boolean> {
    const list = await this.getCustomers();
    const filtered = list.filter((c) => c.id !== id);
    if (filtered.length === list.length) return false;
    await writeJsonFile(FILENAME, filtered);
    return true;
  },
};
