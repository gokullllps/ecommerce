"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminUser, AdminRole, AdminPermission } from "@/types/admin";
import { ROLE_PERMISSIONS } from "@/lib/permissions";

const ALL_PERMISSIONS: AdminPermission[] = [
  "dashboard.view",
  "products.view",
  "products.edit",
  "categories.manage",
  "collections.manage",
  "orders.view",
  "orders.edit",
  "customers.view",
  "customers.edit",
  "inventory.manage",
  "promotions.manage",
  "storefront.manage",
  "themes.manage",
  "media.manage",
  "users.manage",
  "settings.manage",
];

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin (Full Sovereign)",
  admin: "Administrator (Broad Operations)",
  product_manager: "Product & Merchandising Manager",
  inventory_manager: "Inventory & Warehouse Specialist",
  order_manager: "Order Fulfillment & Logistics",
  content_manager: "Storefront & Lookbook Editor",
  marketing_manager: "Marketing & Campaigns Director",
};

export default function AdminUsersPage() {
  const { adminUsers, createAdminUser, updateAdminUser, deleteAdminUser } = useAdminData();
  const { currentUser, switchRole, hasPermission } = useAdminAuth();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<AdminRole>("product_manager");
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [formPermissions, setFormPermissions] = useState<AdminPermission[]>(
    ROLE_PERMISSIONS.product_manager
  );

  const canManageUsers = hasPermission("users.manage");

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormRole("product_manager");
    setFormStatus("active");
    setFormPermissions(ROLE_PERMISSIONS.product_manager);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormStatus(user.status);
    setFormPermissions(user.permissions);
    setIsModalOpen(true);
  };

  const handleRoleChangeInForm = (newRole: AdminRole) => {
    setFormRole(newRole);
    setFormPermissions(ROLE_PERMISSIONS[newRole] || []);
  };

  const handleTogglePermission = (perm: AdminPermission) => {
    setFormPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    if (editingUser) {
      const updated: AdminUser = {
        ...editingUser,
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        status: formStatus,
        permissions: formPermissions,
      };
      updateAdminUser(updated);
    } else {
      const created: AdminUser = {
        id: `usr_${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        status: formStatus,
        permissions: formPermissions,
        lastLogin: new Date().toISOString(),
      };
      createAdminUser(created);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    deleteAdminUser(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Admin Users</span>
          </div>
          <h1 className="a-page-title">
            ROLE-BASED ACCESS & USERS
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Configure permissions for Super Admins, Product Managers, Content Managers, and Order Specialists.
          </p>
        </div>

        {canManageUsers && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#181818] hover:bg-[#111111] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            Add Admin User
          </button>
        )}
      </div>

      {/* Current Active User Session Spotlight */}
      <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#181818] text-white font-bold flex items-center justify-center text-sm shadow">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <div className="text-xs text-[rgba(17,17,17,0.55)]">Logged in as</div>
            <div className="text-sm font-medium text-[#111111] flex items-center gap-2">
              {currentUser?.name}
              <span className="px-2 py-0.5 rounded bg-[#EAE8E1] text-[#111111] border border-[rgba(17,17,17,0.15)] text-[10px] font-mono">
                {currentUser?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[rgba(17,17,17,0.55)]">Developer Sandbox Switcher:</span>
          <select
            value={currentUser?.role || "super_admin"}
            onChange={(e) => switchRole(e.target.value as AdminRole)}
            aria-label="Switch active role for developer sandbox preview"
            className="px-3 py-1.5 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs font-semibold text-[#111111] focus:outline-none"
          >
            <option value="super_admin">Super Admin (All Privileges)</option>
            <option value="admin">Administrator</option>
            <option value="product_manager">Product Manager</option>
            <option value="inventory_manager">Inventory Manager</option>
            <option value="order_manager">Order Manager</option>
            <option value="content_manager">Content Manager</option>
            <option value="marketing_manager">Marketing Manager</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl bg-white border border-[rgba(17,17,17,0.10)] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#EAE8E1]/70 border-b border-[rgba(17,17,17,0.10)] text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)]">
                <th className="py-3 px-4">Admin Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role Assigned</th>
                <th className="py-3 px-4">Permissions Active</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,17,17,0.08)]">
              {adminUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#EAE8E1]/40 transition-colors">
                  <td className="py-4 px-4 font-semibold text-[#111111]">
                    {u.name}
                    {u.id === currentUser?.id && (
                      <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-[#111111]">
                        YOU
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-[rgba(17,17,17,0.65)] font-mono">{u.email}</td>

                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#EAE8E1] text-[#111111] border border-[rgba(17,17,17,0.15)]">
                      {u.role.replace("_", " ")}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-[#111111]">
                    {u.role === "super_admin" ? "All Sovereign" : `${u.permissions?.length || 0} permissions`}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        u.status === "active"
                          ? "bg-[rgba(17,17,17,0.06)] text-[#111111] border-[rgba(17,17,17,0.12)]"
                          : "bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.55)] border-[rgba(17,17,17,0.10)]"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-[rgba(17,17,17,0.55)] font-mono text-[11px]">
                    {new Date(u.lastLogin).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => switchRole(u.role)}
                        className="px-2.5 py-1 rounded bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white text-[11px] font-medium"
                      >
                        Preview Role
                      </button>

                      {canManageUsers && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            className="px-2.5 py-1 rounded bg-[#EAE8E1] hover:bg-[#111111] text-[#111111] text-[11px] font-medium"
                          >
                            Edit
                          </button>
                          {u.id !== "usr_01" && (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(u.id)}
                              className="px-2.5 py-1 text-[#b91c1c] hover:text-[#991b1b] text-[11px]"
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-[rgba(17,17,17,0.15)] rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[rgba(17,17,17,0.10)] pb-3">
              <h3 className="text-base font-bold font-111111 font-serif tracking-tight">
                {editingUser ? "Edit Administrative User" : "Create New Administrative Account"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[rgba(17,17,17,0.08)] text-[#111111] flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@pablo-luxury.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Administrative Role
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => handleRoleChangeInForm(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  >
                    {Object.entries(ROLE_LABELS).map(([rKey, rLabel]) => (
                      <option key={rKey} value={rKey}>
                        {rLabel}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Account Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "active" | "inactive")}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive / Suspended</option>
                  </select>
                </div>
              </div>

              {/* Granular Permission Checklist */}
              <div className="space-y-2 pt-2 border-t border-[rgba(17,17,17,0.10)]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(17,17,17,0.55)]">
                    Granular Access Permissions ({formPermissions.length})
                  </label>
                  <span className="text-[10px] text-[rgba(17,17,17,0.55)]">
                    {formRole === "super_admin" ? "Super Admin bypasses all checks" : "Tailor privileges"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-[#EAE8E1]/40 rounded-xl border border-[rgba(17,17,17,0.10)]">
                  {ALL_PERMISSIONS.map((perm) => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer text-[11px]">
                      <input
                        type="checkbox"
                        checked={formRole === "super_admin" || formPermissions.includes(perm)}
                        disabled={formRole === "super_admin"}
                        onChange={() => handleTogglePermission(perm)}
                        className="rounded bg-white border-[rgba(17,17,17,0.15)] text-[#111111]"
                      />
                      <span className="font-mono text-[rgba(17,17,17,0.65)]">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[rgba(17,17,17,0.10)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#181818] hover:bg-[#111111] text-white rounded-lg font-semibold shadow-md"
                >
                  {editingUser ? "Save User" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border border-[rgba(185,28,28,0.20)] rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-[#b91c1c]">Revoke Administrative Access</h3>
            <p className="text-xs text-[rgba(17,17,17,0.65)]">
              Are you sure you want to delete this administrative account? Historical audit actions logged by this user will remain preserved in the immutable log.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(17,17,17,0.10)]">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-lg bg-[#EAE8E1] text-xs text-[#111111]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-xs font-semibold text-white shadow-md"
              >
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
