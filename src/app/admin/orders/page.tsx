"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminOrder, OrderStatus } from "@/types/admin";

const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  pending:    { bg: "bg-[rgba(17,17,17,0.04)]", text: "text-[rgba(17,17,17,0.55)]", border: "border-[rgba(17,17,17,0.10)]" },
  confirmed:  { bg: "bg-[#181818]",             text: "text-[#111111]",                  border: "border-[#181818]" },
  processing: { bg: "bg-[rgba(17,17,17,0.07)]", text: "text-[rgba(17,17,17,0.70)]", border: "border-[rgba(17,17,17,0.12)]" },
  packed:     { bg: "bg-[rgba(17,17,17,0.10)]", text: "text-[#111111]",              border: "border-[rgba(17,17,17,0.15)]" },
  shipped:    { bg: "bg-[rgba(17,17,17,0.08)]", text: "text-[rgba(17,17,17,0.75)]", border: "border-[rgba(17,17,17,0.12)]" },
  delivered:  { bg: "bg-[rgba(17,17,17,0.06)]", text: "text-[#111111]",              border: "border-[rgba(17,17,17,0.12)]" },
  cancelled:  { bg: "bg-[rgba(185,28,28,0.07)]",text: "text-[#b91c1c]",              border: "border-[rgba(185,28,28,0.18)]" },
  returned:   { bg: "bg-[rgba(17,17,17,0.05)]", text: "text-[rgba(17,17,17,0.55)]", border: "border-[rgba(17,17,17,0.10)]" },
  refunded:   { bg: "bg-[rgba(17,17,17,0.04)]", text: "text-[rgba(17,17,17,0.50)]", border: "border-[rgba(17,17,17,0.08)]" },
};

const PAYMENT_STATUS_COLORS: Record<string, { bg: string }> = {
  paid: { bg: "bg-[rgba(17,17,17,0.06)] text-[#111111] border border-[rgba(17,17,17,0.12)]" },
  pending: { bg: "bg-[rgba(17,17,17,0.05)] text-[rgba(17,17,17,0.65)] border border-[rgba(17,17,17,0.12)]" },
  failed: { bg: "bg-[rgba(185,28,28,0.06)] text-[#b91c1c] border border-[rgba(185,28,28,0.20)]" },
  refunded: { bg: "bg-[rgba(17,17,17,0.04)] text-[rgba(17,17,17,0.50)] border border-[rgba(17,17,17,0.08)]" },
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, cancelOrder } = useAdminData();
  const { hasPermission } = useAdminAuth();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"createdAt" | "total">("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected Order for Detail Drawer
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Status Change Workflow Modal State
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    newStatus: OrderStatus;
    trackingNumber?: string;
    carrier?: string;
  } | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [carrierInput, setCarrierInput] = useState("Atelier White Glove");

  // Cancel Dialog
  const [cancelDialogOrder, setCancelDialogOrder] = useState<AdminOrder | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const canEditOrders = hasPermission("orders.edit");

  // Filter & Sort Logic
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (statusFilter !== "all" && o.status !== statusFilter) return false;
        if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchNum = o.orderNumber.toLowerCase().includes(q);
          const matchCustomer = o.customerName.toLowerCase().includes(q);
          const matchEmail = o.customerEmail.toLowerCase().includes(q);
          const matchCity = o.shippingAddress?.city?.toLowerCase().includes(q);
          return matchNum || matchCustomer || matchEmail || matchCity;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === "createdAt") {
          const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          return sortDirection === "desc" ? diff : -diff;
        } else {
          const diff = b.total - a.total;
          return sortDirection === "desc" ? diff : -diff;
        }
      });
  }, [orders, statusFilter, paymentFilter, searchTerm, sortField, sortDirection]);

  // Paginated View
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  const handleApplyStatusChange = () => {
    if (!pendingStatusChange) return;
    updateOrderStatus(
      pendingStatusChange.orderId,
      pendingStatusChange.newStatus,
      trackingInput.trim() || undefined,
      carrierInput.trim() || undefined
    );
    if (selectedOrder && selectedOrder.id === pendingStatusChange.orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: pendingStatusChange.newStatus,
        trackingNumber: trackingInput.trim() || selectedOrder.trackingNumber,
        carrier: carrierInput.trim() || selectedOrder.carrier,
      });
    }
    setPendingStatusChange(null);
    setTrackingInput("");
  };

  const handleConfirmCancel = () => {
    if (!cancelDialogOrder) return;
    cancelOrder(cancelDialogOrder.id, cancelReason.trim() || "Customer cancellation request");
    if (selectedOrder && selectedOrder.id === cancelDialogOrder.id) {
      setSelectedOrder({
        ...selectedOrder,
        status: "cancelled",
      });
    }
    setCancelDialogOrder(null);
    setCancelReason("");
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 a-page-header">
        <div>
          <div className="flex items-center gap-2 text-xs text-[rgba(17,17,17,0.55)] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#111111]">Admin</Link>
            <span>/</span>
            <span className="text-[#111111]">Orders</span>
          </div>
          <h1 className="a-page-title">
            ORDER FULFILLMENT & DISPATCH
          </h1>
          <p className="text-xs text-[rgba(17,17,17,0.55)] mt-0.5">
            Manage high-value luxury orders, client communications, white-glove courier status, and tracking numbers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] text-xs font-mono text-[rgba(17,17,17,0.65)]">
            Total Orders: <strong className="text-[#111111]">{orders.length}</strong>
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.10)] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by order #, customer name, email, or city..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] placeholder-[rgba(17,17,17,0.40)] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by payment status"
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">Payment: All</option>
              <option value="paid">Payment: Paid</option>
              <option value="pending">Payment: Pending</option>
              <option value="failed">Payment: Failed</option>
              <option value="refunded">Payment: Refunded</option>
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as "createdAt" | "total")}
              aria-label="Sort orders by field"
              className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="createdAt">Sort: Date</option>
              <option value="total">Sort: Amount</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}
              className="px-3 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs font-mono"
              title="Toggle sort direction"
            >
              {sortDirection === "asc" ? "ASC" : "DESC"}
            </button>
          </div>
        </div>

        {/* Order Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-[rgba(17,17,17,0.10)] pt-3">
          {[
            { id: "all", label: "All Orders" },
            { id: "pending", label: "Pending" },
            { id: "confirmed", label: "Confirmed" },
            { id: "processing", label: "Processing" },
            { id: "packed", label: "Packed" },
            { id: "shipped", label: "Shipped" },
            { id: "delivered", label: "Delivered" },
            { id: "cancelled", label: "Cancelled" },
            { id: "refunded", label: "Refunded" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? "bg-[#181818] text-white font-semibold shadow-sm"
                  : "bg-[#EAE8E1] border border-[rgba(17,17,17,0.15)] text-[rgba(17,17,17,0.55)] hover:text-[#111111]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table */}
      <div className="rounded-xl bg-white border border-[rgba(17,17,17,0.10)] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#EAE8E1]/70 border-b border-[rgba(17,17,17,0.10)] text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)]">
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Client / Patron</th>
                <th className="py-3 px-4">Line Items</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,17,17,0.08)]">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[rgba(17,17,17,0.55)]">
                    No orders match the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((o) => {
                  const statusStyle = ORDER_STATUS_COLORS[o.status] || ORDER_STATUS_COLORS.pending;
                  const payStyle = PAYMENT_STATUS_COLORS[o.paymentStatus] || PAYMENT_STATUS_COLORS.pending;

                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-[#EAE8E1]/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(o)}
                    >
                      <td className="py-4 px-4 font-mono font-bold text-[#111111]">
                        {o.orderNumber}
                        <div className="text-[10px] text-[rgba(17,17,17,0.45)] font-sans font-normal">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#111111]">{o.customerName}</div>
                        <div className="text-[10px] text-[rgba(17,17,17,0.55)]">{o.customerEmail}</div>
                        <div className="text-[10px] text-[rgba(17,17,17,0.45)]">
                          {o.shippingAddress?.city}, {o.shippingAddress?.country}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {/* Product thumbnail with onError fallback */}
                          <div
                            className="w-9 h-9 rounded shrink-0 overflow-hidden border"
                            style={{ backgroundColor: "#EAE8E1", borderColor: "rgba(17,17,17,0.10)" }}
                          >
                            {o.items[0]?.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={o.items[0].image}
                                alt=""
                                role="presentation"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-serif text-[8px] tracking-widest"
                                style={{ color: "rgba(17,17,17,0.25)" }} aria-hidden="true">
                                P
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-medium truncate max-w-[140px]" style={{ color: "#111111" }}>
                              {o.items[0]?.title}
                            </div>
                            <div className="text-[10px]" style={{ color: "rgba(17,17,17,0.50)" }}>
                              {o.items.length} {o.items.length === 1 ? "piece" : "pieces"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono font-semibold text-sm" style={{ color: "#111111" }}>
                        ₹{o.total.toLocaleString("en-IN")}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${payStyle.bg}`}
                        >
                          {o.paymentStatus}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#EAE8E1] text-[rgba(17,17,17,0.65)] border border-[rgba(17,17,17,0.15)] uppercase">
                          {o.fulfillmentStatus.replace("_", " ")}
                        </span>
                        {o.trackingNumber && (
                          <div className="text-[10px] font-mono text-[#111111] mt-1">
                            Ref: {o.trackingNumber}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          disabled={!canEditOrders || o.status === "cancelled" || o.status === "refunded"}
                          value={o.status}
                          aria-label={`Update order status for ${o.orderNumber}`}
                          onChange={(e) => {
                            const newStatus = e.target.value as OrderStatus;
                            setPendingStatusChange({
                              orderId: o.id,
                              newStatus,
                            });
                          }}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase border bg-white focus:outline-none ${statusStyle.border} ${statusStyle.text} cursor-pointer`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(o)}
                            className="px-2.5 py-1 rounded bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white text-[11px] font-medium transition-colors"
                          >
                            Details
                          </button>
                          {canEditOrders && o.status !== "cancelled" && o.status !== "refunded" && (
                            <button
                              type="button"
                              onClick={() => setCancelDialogOrder(o)}
                              className="px-2 py-1 rounded bg-[rgba(185,28,28,0.06)] hover:bg-[rgba(185,28,28,0.08)] text-[#b91c1c] border border-[rgba(185,28,28,0.20)] text-[11px] font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[rgba(17,17,17,0.10)] text-xs">
            <span className="text-[rgba(17,17,17,0.55)]">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-[#EAE8E1] disabled:opacity-50 text-[#111111]"
              >
                Previous
              </button>
              <span className="font-mono px-2" style={{ color: "#111111" }}>
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-[#EAE8E1] disabled:opacity-50 text-[#111111]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ORDER DETAIL DRAWER / MODAL */}
      {selectedOrder && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white border border-[rgba(17,17,17,0.15)] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[rgba(17,17,17,0.10)] flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-[#111111]">
                  Order {selectedOrder.orderNumber}
                </div>
                <h2 className="text-xl font-semibold font-serif tracking-tight" style={{ color: "#111111" }}>
                  PATRON ORDER DOSSIER
                </h2>
                <div className="text-xs text-[rgba(17,17,17,0.55)]">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white flex items-center justify-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs" style={{ color: "#111111" }}>
              {/* Order Status & Financial Snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)]">
                  <div className="text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)] mb-1">Status</div>
                  <div className="text-sm font-medium text-[#111111] capitalize">{selectedOrder.status}</div>
                  <div className="text-[10px] text-[rgba(17,17,17,0.55)] mt-1">
                    Fulfillment: {selectedOrder.fulfillmentStatus.replace("_", " ")}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)]">
                  <div className="text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)] mb-1">Payment</div>
                  <div className="text-sm font-bold text-[#111111] uppercase">
                    {selectedOrder.paymentStatus}
                  </div>
                  <div className="text-[10px] text-[rgba(17,17,17,0.55)] mt-1">Currency: {selectedOrder.currency}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)]">
                  <div className="text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)] mb-1">Grand Total</div>
                  <div className="text-lg font-semibold font-mono" style={{ color: "#111111" }}>
                    ₹{selectedOrder.total.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] text-[rgba(17,17,17,0.55)] mt-1">
                    {selectedOrder.items.length} line item(s)
                  </div>
                </div>
              </div>

              {/* Line Items Detail */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(17,17,17,0.50)" }}>Ordered Pieces</h3>
                <div className="border border-[rgba(17,17,17,0.10)] rounded-xl overflow-hidden divide-y divide-[rgba(17,17,17,0.08)]">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-[#0B1120]">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="w-12 h-14 rounded bg-[#EAE8E1] relative overflow-hidden border border-[rgba(17,17,17,0.15)] shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-[#111111]">{item.title}</div>
                          <div className="text-[10px] font-mono text-[rgba(17,17,17,0.55)]">SKU: {item.sku}</div>
                          {(item.color || item.size) && (
                            <div className="text-[10px] text-[rgba(17,17,17,0.45)]">
                              {item.color && `Color: ${item.color}`} {item.size && `· Size: ${item.size}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-semibold" style={{ color: "#111111" }}>₹{item.totalPrice.toLocaleString("en-IN")}</div>
                        <div className="text-[10px] text-[rgba(17,17,17,0.55)]">
                          Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <div className="p-4 rounded-xl bg-[#EAE8E1]/30 border border-[rgba(17,17,17,0.10)] space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#111111]">₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#111111]">
                    <span>Privilege Discount</span>
                    <span className="font-mono">-₹{selectedOrder.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Luxury Goods Tax (GST)</span>
                  <span className="font-mono text-[#111111]">₹{selectedOrder.tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Shipping</span>
                  <span className="font-mono text-[#111111]">
                    {selectedOrder.shipping === 0 ? "Complimentary" : `₹${selectedOrder.shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[rgba(17,17,17,0.10)] flex justify-between font-semibold text-sm text-[#111111]">
                  <span>Total Settled</span>
                  <span className="font-mono text-[#111111]">₹{selectedOrder.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Patron & Shipping Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)]">Patron Contact</div>
                  <div className="font-semibold text-[#111111]">{selectedOrder.customerName}</div>
                  <div className="text-[rgba(17,17,17,0.55)]">{selectedOrder.customerEmail}</div>
                  {selectedOrder.customerPhone && (
                    <div className="text-[rgba(17,17,17,0.55)] font-mono">{selectedOrder.customerPhone}</div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)]">Delivery Address</div>
                  <div className="text-[#111111]">{selectedOrder.shippingAddress?.line1}</div>
                  <div className="text-[rgba(17,17,17,0.55)]">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{" "}
                    {selectedOrder.shippingAddress?.postalCode}
                  </div>
                  <div className="text-[rgba(17,17,17,0.45)]">{selectedOrder.shippingAddress?.country}</div>
                </div>
              </div>

              {/* White Glove Dispatch Details */}
              <div className="p-4 rounded-xl bg-[#EAE8E1]/40 border border-[rgba(17,17,17,0.10)] space-y-2">
                <div className="text-[10px] uppercase font-bold text-[rgba(17,17,17,0.45)]">
                  Courier & Tracking Information
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[#111111] font-medium">Carrier: </span>
                    <span className="text-[#111111]">{selectedOrder.carrier || "Atelier White Glove"}</span>
                  </div>
                  <div>
                    <span className="text-[#111111] font-medium">Tracking Ref: </span>
                    <span className="font-mono text-[#111111]">
                      {selectedOrder.trackingNumber || "Pending Courier Assignment"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[rgba(17,17,17,0.10)] flex items-center justify-between bg-[#0B1120]">
              <div className="text-xs text-[rgba(17,17,17,0.45)]">ID: {selectedOrder.id}</div>
              <div className="flex items-center gap-2">
                {canEditOrders && selectedOrder.status !== "cancelled" && selectedOrder.status !== "refunded" && (
                  <button
                    type="button"
                    onClick={() => {
                      setCancelDialogOrder(selectedOrder);
                    }}
                    className="px-4 py-2 bg-[rgba(185,28,28,0.06)] hover:bg-[rgba(185,28,28,0.08)] text-[#b91c1c] border border-[rgba(185,28,28,0.20)] rounded-lg text-xs font-semibold"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-[rgba(17,17,17,0.06)] hover:bg-[#181818] text-[#111111] hover:text-white rounded-lg text-xs font-semibold"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATUS CHANGE CONFIRMATION MODAL */}
      {pendingStatusChange && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[rgba(17,17,17,0.15)] rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-[#111111]">Confirm Order Status Transition</h3>
            <p className="text-xs text-[rgba(17,17,17,0.55)]">
              You are changing status to{" "}
              <strong className="text-[#111111] uppercase font-mono">
                {pendingStatusChange.newStatus}
              </strong>
              . This will be recorded in the audit log and persisted to <code>orders.json</code>.
            </p>

            {(pendingStatusChange.newStatus === "shipped" ||
              pendingStatusChange.newStatus === "delivered") && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Courier / Dispatch Partner
                  </label>
                  <input
                    type="text"
                    value={carrierInput}
                    onChange={(e) => setCarrierInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PAB-EXP-88992"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] placeholder-[rgba(17,17,17,0.40)]"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(17,17,17,0.10)]">
              <button
                type="button"
                onClick={() => setPendingStatusChange(null)}
                className="px-3.5 py-1.5 rounded-lg bg-[#EAE8E1] text-xs text-[#111111]"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={handleApplyStatusChange}
                className="px-4 py-1.5 rounded-lg bg-[#181818] hover:bg-[#111111] text-xs font-semibold text-white shadow-md"
              >
                Confirm & Persist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION DIALOG */}
      {cancelDialogOrder && (
        <div className="pablo-admin-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[rgba(185,28,28,0.20)] rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-[#b91c1c]">Cancel Luxury Order</h3>
            <p className="text-xs text-[rgba(17,17,17,0.65)]">
              Order <strong className="text-[#111111]">{cancelDialogOrder.orderNumber}</strong> for{" "}
              <strong className="text-[#111111]">{cancelDialogOrder.customerName}</strong> will be
              marked as CANCELLED.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-[rgba(17,17,17,0.65)] mb-1">
                Reason for Cancellation
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Client requested cancellation before dispatch..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[rgba(17,17,17,0.15)] rounded-lg text-xs text-[#111111] placeholder-[rgba(17,17,17,0.40)]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(17,17,17,0.10)]">
              <button
                type="button"
                onClick={() => setCancelDialogOrder(null)}
                className="px-3.5 py-1.5 rounded-lg bg-[#EAE8E1] text-xs text-[#111111]"
              >
                Keep Order Active
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-xs font-semibold text-white shadow-md"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
