"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminCustomer } from "@/types/admin";

export default function AdminCustomersPage() {
  const { customers, orders, updateCustomer, createCustomer } = useAdminData();
  const { hasPermission } = useAdminAuth();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"totalSpent" | "totalOrders" | "lastOrderDate">("totalSpent");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Selected Customer for Profile Dossier Drawer
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  // Edit Patron State
  const [editNotes, setEditNotes] = useState("");
  const [editTier, setEditTier] = useState<"active" | "inactive" | "vip">("active");

  // Create Customer Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Mumbai",
    country: "India",
    status: "active" as "active" | "inactive" | "vip",
    notes: "",
  });

  const canEditCustomers = hasPermission("customers.edit");

  // Filter & Sort
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        if (tierFilter !== "all" && c.status !== tierFilter) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = c.name.toLowerCase().includes(q);
          const matchEmail = c.email.toLowerCase().includes(q);
          const matchCity = c.city.toLowerCase().includes(q);
          return matchName || matchEmail || matchCity;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "totalSpent") {
          return sortDirection === "desc" ? b.totalSpent - a.totalSpent : a.totalSpent - b.totalSpent;
        } else if (sortBy === "totalOrders") {
          return sortDirection === "desc" ? b.totalOrders - a.totalOrders : a.totalOrders - b.totalOrders;
        } else {
          const diff = new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
          return sortDirection === "desc" ? diff : -diff;
        }
      });
  }, [customers, tierFilter, searchTerm, sortBy, sortDirection]);

  // Real connected orders for the selected patron
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(
      (o) =>
        o.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase() ||
        o.customerName.toLowerCase() === selectedCustomer.name.toLowerCase()
    );
  }, [orders, selectedCustomer]);

  const handleOpenDossier = (c: AdminCustomer) => {
    setSelectedCustomer(c);
    setEditNotes(c.notes || "");
    setEditTier(c.status);
  };

  const handleSaveCustomerUpdates = () => {
    if (!selectedCustomer) return;
    const updated: AdminCustomer = {
      ...selectedCustomer,
      notes: editNotes,
      status: editTier,
    };
    updateCustomer(updated);
    setSelectedCustomer(updated);
  };

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerData.name || !newCustomerData.email) return;

    const created: AdminCustomer = {
      id: `cust_${Date.now()}`,
      name: newCustomerData.name.trim(),
      email: newCustomerData.email.trim(),
      phone: newCustomerData.phone.trim(),
      city: newCustomerData.city.trim(),
      country: newCustomerData.country.trim(),
      status: newCustomerData.status,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: new Date().toISOString(),
      joinedAt: new Date().toISOString(),
      notes: newCustomerData.notes.trim() || undefined,
    };

    createCustomer(created);
    setShowCreateModal(false);
    setNewCustomerData({
      name: "",
      email: "",
      phone: "",
      city: "Mumbai",
      country: "India",
      status: "active",
      notes: "",
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Customers</span>
          </div>
          <h1 className="a-page-title">
            PRIVATE PATRON DIRECTORY
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Client profiles, lifetime value (LTV), order frequency, and VIP tier records.
          </p>
        </div>

        {canEditCustomers && (
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#181818] hover:bg-[#111111] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            Register Patron
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search patron by name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] placeholder-[rgba(17,17,17,0.40)] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              aria-label="Filter patrons by tier"
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">Tier: All Patrons</option>
              <option value="vip">Tier: VIP Salon</option>
              <option value="active">Tier: Active</option>
              <option value="inactive">Tier: Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "totalSpent" | "totalOrders" | "lastOrderDate")}
              aria-label="Sort patrons by metric"
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="totalSpent">Sort: Highest Spend</option>
              <option value="totalOrders">Sort: Most Orders</option>
              <option value="lastOrderDate">Sort: Recent Activity</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}
              className="px-3 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs font-mono"
            >
              {sortDirection === "asc" ? "ASC" : "DESC"}
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-xl bg-white border border-[rgba(17,17,17,0.10)] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#EAE8E1]/70 border-b border-[rgba(17,17,17,0.10)] text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)]">
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Tier Status</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,17,17,0.08)]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[rgba(17,17,17,0.55)]">
                    No patrons match your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[#EAE8E1]/40 transition-colors cursor-pointer"
                    onClick={() => handleOpenDossier(c)}
                  >
                    <td className="py-4 px-4 font-semibold text-[#111111]">
                      {c.name}
                      <div className="text-[10px] text-[rgba(17,17,17,0.45)] font-mono font-normal">ID: {c.id}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-[#111111]">{c.email}</div>
                      <div className="text-[10px] text-[rgba(17,17,17,0.55)] font-mono">{c.phone}</div>
                    </td>

                    <td className="py-4 px-4 text-[rgba(17,17,17,0.65)]">
                      {c.city}, {c.country}
                    </td>

                    <td className="py-4 px-4 font-mono font-semibold" style={{ color: "#111111" }}>
                      {c.totalOrders}
                    </td>

                    <td className="py-4 px-4 font-mono font-semibold text-sm" style={{ color: "#111111" }}>
                      ₹{c.totalSpent.toLocaleString("en-IN")}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          c.status === "vip"
                            ? "bg-[rgba(17,17,17,0.06)] text-[rgba(17,17,17,0.55)] border-[rgba(17,17,17,0.10)]"
                            : c.status === "active"
                            ? "bg-[rgba(17,17,17,0.06)] text-[#111111] border-[rgba(17,17,17,0.12)]"
                            : "bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.55)] border-[rgba(17,17,17,0.10)]"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[rgba(17,17,17,0.55)] font-mono text-[11px]">
                      {new Date(c.lastOrderDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenDossier(c)}
                        className="px-3 py-1 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded text-[11px] font-medium"
                      >
                        View Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DOSSIER DRAWER */}
      {selectedCustomer && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white border border-[rgba(17,17,17,0.15)] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Dossier Header */}
            <div className="p-6 border-b border-[rgba(17,17,17,0.10)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#111111] uppercase tracking-wider">
                  Patron Dossier · {selectedCustomer.id}
                </span>
                <h2 className="text-xl font-semibold font-serif tracking-tight" style={{ color: "#111111" }}>
                  {selectedCustomer.name}
                </h2>
                <div className="text-xs text-[rgba(17,17,17,0.55)]">
                  Client since {new Date(selectedCustomer.joinedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white flex items-center justify-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Dossier Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs" style={{ color: "#111111" }}>
              {/* Snapshot Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)]">
                  <div className="text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)]">Lifetime Value</div>
                  <div className="text-lg font-semibold font-mono mt-1" style={{ color: "#111111" }}>
                    ₹{selectedCustomer.totalSpent.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)]">
                  <div className="text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)]">Total Orders</div>
                  <div className="text-lg font-semibold font-mono mt-1" style={{ color: "#111111" }}>
                    {selectedCustomer.totalOrders}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)]">
                  <div className="text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)]">Tier Status</div>
                  <div className="text-sm font-bold text-[rgba(17,17,17,0.65)] uppercase mt-1">
                    {selectedCustomer.status}
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)] space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(17,17,17,0.50)" }}>Contact & Residence</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[rgba(17,17,17,0.45)] block text-[10px]">Email Address</span>
                    <span className="text-[#111111] font-medium">{selectedCustomer.email}</span>
                  </div>
                  <div>
                    <span className="text-[rgba(17,17,17,0.45)] block text-[10px]">Telephone</span>
                    <span className="font-mono" style={{ color: "#111111" }}>{selectedCustomer.phone}</span>
                  </div>
                  <div>
                    <span className="text-[rgba(17,17,17,0.45)] block text-[10px]">City</span>
                    <span className="text-[#111111]">{selectedCustomer.city}</span>
                  </div>
                  <div>
                    <span className="text-[rgba(17,17,17,0.45)] block text-[10px]">Country</span>
                    <span className="text-[#111111]">{selectedCustomer.country}</span>
                  </div>
                </div>
              </div>

              {/* Tier & Concierge Notes Edit */}
              {canEditCustomers && (
                <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)] space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(17,17,17,0.50)" }}>VIP Salon & Concierge Notes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                        Patron Tier
                      </label>
                      <select
                        value={editTier}
                        onChange={(e) => setEditTier(e.target.value as "active" | "inactive" | "vip")}
                        className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                      >
                        <option value="vip">VIP Salon Member</option>
                        <option value="active">Active Client</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                      Private Styling & Sizing Preferences
                    </label>
                    <textarea
                      rows={3}
                      value={editNotes}
                      placeholder="e.g. Prefers tailored cashmere, size 48, requested preview of AW26 overcoats..."
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] placeholder-[rgba(17,17,17,0.40)]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveCustomerUpdates}
                      className="px-4 py-1.5 rounded-lg bg-[#181818] hover:bg-[#111111] text-xs font-semibold text-white"
                    >
                      Save Dossier Notes
                    </button>
                  </div>
                </div>
              )}

              {/* Connected Order History */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(17,17,17,0.50)" }}>
                  Connected Purchase History ({customerOrders.length})
                </h3>
                {customerOrders.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#EAE8E1]/20 border border-[rgba(17,17,17,0.10)] text-center text-[rgba(17,17,17,0.55)]">
                    No historical orders located under this patron&apos;s email address.
                  </div>
                ) : (
                  <div className="divide-y divide-[rgba(17,17,17,0.08)] border border-[rgba(17,17,17,0.10)] rounded-xl overflow-hidden">
                    {customerOrders.map((o) => (
                      <div key={o.id} className="p-3.5 flex items-center justify-between bg-[#0B1120]">
                        <div>
                          <div className="font-mono font-bold text-[#111111]">{o.orderNumber}</div>
                          <div className="text-[10px] text-[rgba(17,17,17,0.55)]">
                            {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} piece(s)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-semibold" style={{ color: "#111111" }}>
                            ₹{o.total.toLocaleString("en-IN")}
                          </div>
                          <span className="text-[10px] uppercase font-bold text-[#111111]">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dossier Footer */}
            <div className="p-4 border-t border-[rgba(17,17,17,0.10)] flex justify-end bg-[#0B1120]">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded-lg text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CUSTOMER MODAL */}
      {showCreateModal && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[rgba(17,17,17,0.15)] rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-[#111111]">Register New Luxury Patron</h3>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Merchant"
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="radhika@luxury.in"
                  value={newCustomerData.email}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98200 12345"
                    value={newCustomerData.phone}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Tier</label>
                  <select
                    value={newCustomerData.status}
                    onChange={(e) =>
                      setNewCustomerData({
                        ...newCustomerData,
                        status: e.target.value as "active" | "inactive" | "vip",
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  >
                    <option value="vip">VIP Salon</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">City</label>
                  <input
                    type="text"
                    value={newCustomerData.city}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Country</label>
                  <input
                    type="text"
                    value={newCustomerData.country}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, country: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">Styling Notes</label>
                <textarea
                  rows={2}
                  placeholder="Private styling notes or preferences..."
                  value={newCustomerData.notes}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(17,17,17,0.10)]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#EAE8E1] text-xs text-[#111111]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#181818] hover:bg-[#111111] text-xs font-semibold text-white shadow-md"
                >
                  Create Patron
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
