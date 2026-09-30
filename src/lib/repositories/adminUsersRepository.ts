import { AdminUser } from "@/types/admin";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";

const FILENAME = "admin-users.json";

function validateAdminUsers(users: AdminUser[]): void {
  const seenIds = new Set<string>();
  const seenEmails = new Set<string>();
  users.forEach((u, idx) => {
    if (!u.id) {
      throw new Error(`[Validation Error] Admin user at index ${idx} is missing mandatory ID.`);
    }
    if (seenIds.has(u.id)) {
      console.warn(`[Validation Warning] Duplicate Admin User ID: ${u.id}`);
    }
    seenIds.add(u.id);

    if (u.email) {
      const emailLower = u.email.toLowerCase();
      if (seenEmails.has(emailLower)) {
        console.warn(`[Validation Warning] Duplicate Admin User email: ${u.email}`);
      }
      seenEmails.add(emailLower);
    }
  });
}

export const adminUsersRepository = {
  async getAdminUsers(): Promise<AdminUser[]> {
    const list = await readJsonFile<AdminUser[]>(FILENAME, []);
    validateAdminUsers(list);
    return list;
  },

  getAdminUsersSync(): AdminUser[] {
    const list = readJsonFileSync<AdminUser[]>(FILENAME, []);
    return list;
  },

  async getAdminUserById(id: string): Promise<AdminUser | undefined> {
    const list = await this.getAdminUsers();
    return list.find((u) => u.id === id);
  },

  async createAdminUser(newUser: AdminUser): Promise<AdminUser> {
    const list = await this.getAdminUsers();
    const updated = [...list, newUser];
    validateAdminUsers(updated);
    await writeJsonFile(FILENAME, updated);
    return newUser;
  },

  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    const list = await this.getAdminUsers();
    const index = list.findIndex((u) => u.id === id);
    if (index === -1) throw new Error(`Admin user ${id} not found.`);

    const updated = { ...list[index], ...updates, id };
    list[index] = updated;
    validateAdminUsers(list);
    await writeJsonFile(FILENAME, list);
    return updated;
  },

  async deleteAdminUser(id: string): Promise<boolean> {
    const list = await this.getAdminUsers();
    // Do not allow deleting usr_01 (Super Admin)
    if (id === "usr_01") {
      throw new Error(`Cannot delete root Super Admin account.`);
    }
    const filtered = list.filter((u) => u.id !== id);
    if (filtered.length === list.length) return false;
    await writeJsonFile(FILENAME, filtered);
    return true;
  },
};
