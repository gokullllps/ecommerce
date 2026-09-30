import "./admin.css";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export const metadata = {
  title: "PABLO — Atelier CMS",
  description: "PABLO unified commerce engine and editorial CMS.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutShell>
        {children}
      </AdminLayoutShell>
    </AdminAuthProvider>
  );
}
