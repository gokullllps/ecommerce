import { AuditLogEntry } from "@/types/admin";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";

const FILENAME = "audit-logs.json";

export const auditLogsRepository = {
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    const list = await readJsonFile<AuditLogEntry[]>(FILENAME, []);
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getAuditLogsSync(): AuditLogEntry[] {
    const list = readJsonFileSync<AuditLogEntry[]>(FILENAME, []);
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async logAction(
    action: string,
    resource: string,
    details: string,
    adminName: string = "Admin",
    adminEmail: string = "admin@pablo-luxury.com"
  ): Promise<AuditLogEntry> {
    const entry: AuditLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      adminName,
      adminEmail,
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
    };

    const logs = await this.getAuditLogs();
    const updated = [entry, ...logs.slice(0, 199)];
    await writeJsonFile(FILENAME, updated);
    return entry;
  },
};
