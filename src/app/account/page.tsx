"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import { formatPrice } from "@/lib/catalogueUtils";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses" | "security">("orders");
  const [isSignedIn, setIsSignedIn] = useState(true);

  const mockOrders = [
    {
      id: "PAB-2026-78219",
      date: "September 14, 2026",
      status: "In Transit — Courier Appointment",
      items: [
        { name: "Double-Breasted Wool Overcoat", size: "48", price: 1850, quantity: 1 },
        { name: "Fine Cashmere Turtleneck", size: "M", price: 780, quantity: 1 },
      ],
      total: 2630,
    },
    {
      id: "PAB-2026-61024",
      date: "August 28, 2026",
      status: "Delivered & Signed",
      items: [
        { name: "Fluid Silk Charmeuse Gown", size: "38", price: 2150, quantity: 1 },
      ],
      total: 2150,
    },
  ];

  return (
    <PageWrapper navbarProps={{ isStaticPage: true }}>
      <main className="flex-1 page-container py-8 sm:py-10 lg:py-12 relative z-10">
        {/* Header */}
        <div className="border-b border-[#D9D8D3] pb-6 mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#666666]">
              CLIENT PORTAL
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
              MAISON PABLO ACCOUNT
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#666666]">
              Logged in as: <strong className="text-[#111111]">client@maisonpablo.com</strong>
            </span>
            <button
              onClick={() => setIsSignedIn(!isSignedIn)}
              className="text-xs uppercase tracking-wider text-[#666666] hover:text-[#111111] underline underline-offset-4"
            >
              {isSignedIn ? "Sign Out" : "Sign In"}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#D9D8D3] gap-6 text-xs uppercase tracking-[0.16em] mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "border-[#111111] text-[#111111]"
                : "border-transparent text-[#666666] hover:text-[#111111]"
            }`}
          >
            Orders & Acquisitions ({mockOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "border-[#111111] text-[#111111]"
                : "border-transparent text-[#666666] hover:text-[#111111]"
            }`}
          >
            Client Profile
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`pb-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "addresses"
                ? "border-[#111111] text-[#111111]"
                : "border-transparent text-[#666666] hover:text-[#111111]"
            }`}
          >
            Delivery Addresses
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "security"
                ? "border-[#111111] text-[#111111]"
                : "border-transparent text-[#666666] hover:text-[#111111]"
            }`}
          >
            Security & Authentication
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <div key={order.id} className="bg-white/70 border border-[#D9D8D3] p-6 space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#D9D8D3] pb-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#666666]">
                      Order Reference
                    </span>
                    <p className="font-serif text-lg font-medium text-[#111111]">{order.id}</p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#666666]">
                      Date Placed
                    </span>
                    <p className="text-xs text-[#111111]">{order.date}</p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#666666]">
                      Status
                    </span>
                    <p className="text-xs font-semibold text-emerald-800">{order.status}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-[#666666]">
                      Total
                    </span>
                    <p className="font-serif text-base text-[#111111]">{formatPrice(order.total)}</p>
                  </div>
                </div>

                <div className="divide-y divide-[#D9D8D3]/60">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-serif text-sm font-medium text-[#111111]">{item.name}</p>
                        <p className="text-[11px] text-[#666666]">Size: {item.size} &bull; Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-[#111111]">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end gap-3 text-xs">
                  <button className="px-4 py-2 border border-[#D9D8D3] text-[#111111] hover:border-[#111111] transition-colors">
                    Download Invoice
                  </button>
                  <button className="px-4 py-2 pablo-btn-dark cursor-pointer">
                    Track Courier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white/70 border border-[#D9D8D3] p-6 sm:p-8 max-w-2xl space-y-6">
            <h2 className="font-serif text-xl text-[#111111]">Client Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#666666] uppercase tracking-wider mb-1">First Name</label>
                <input
                  type="text"
                  defaultValue="Gokul"
                  className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111]"
                />
              </div>
              <div>
                <label className="block text-[#666666] uppercase tracking-wider mb-1">Last Name</label>
                <input
                  type="text"
                  defaultValue="Prasath"
                  className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111]"
                />
              </div>
              <div>
                <label className="block text-[#666666] uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  defaultValue="client@maisonpablo.com"
                  className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111]"
                />
              </div>
              <div>
                <label className="block text-[#666666] uppercase tracking-wider mb-1">Telephone</label>
                <input
                  type="tel"
                  defaultValue="+91 98765 43210"
                  className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#D9D8D3] flex justify-end">
              <button className="px-6 py-2.5 pablo-btn-dark text-xs font-medium uppercase tracking-[0.2em] cursor-pointer">
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/70 border border-[#111111] p-6 space-y-3 relative">
              <span className="absolute top-4 right-4 text-[10px] uppercase tracking-widest pablo-dark-badge text-white px-2 py-0.5 font-medium">
                Default
              </span>
              <h3 className="font-serif text-lg text-[#111111]">Primary Residence</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Gokul Prasath<br />
                74 Luxury Boulevard, Suite 12B<br />
                Mumbai, Maharashtra 400001<br />
                India<br />
                T: +91 98765 43210
              </p>
              <div className="pt-3 flex gap-3 text-xs">
                <button className="text-[#111111] underline underline-offset-4">Edit Address</button>
              </div>
            </div>

            <div className="border border-dashed border-[#D9D8D3] p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[180px]">
              <p className="font-serif text-base text-[#111111]">Add New Residence / Office</p>
              <button className="px-4 py-2 pablo-btn-dark text-xs uppercase tracking-wider cursor-pointer">
                + Add Address
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white/70 border border-[#D9D8D3] p-6 sm:p-8 max-w-2xl space-y-6 text-xs">
            <h2 className="font-serif text-xl text-[#111111]">Identity & Authentication</h2>
            <div className="p-4 bg-[#EAE8E1]/80 border border-[#D9D8D3] space-y-2">
              <p className="font-medium text-[#111111]">AWS Cognito Authentication Integration</p>
              <p className="text-[#666666] leading-relaxed">
                This client portal is architected for seamless integration with AWS Cognito User Pools and Identity Pools. Single sign-on, multi-factor authentication, and passwordless biometric authentication endpoints are pre-structured.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-[#666666] uppercase tracking-wider mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111]"
                />
              </div>
              <div>
                <label className="block text-[#666666] uppercase tracking-wider mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#D9D8D3] flex justify-end">
              <button className="px-6 py-2.5 pablo-btn-dark text-xs font-medium uppercase tracking-[0.2em] cursor-pointer">
                Update Password
              </button>
            </div>
          </div>
        )}
      </main>
    </PageWrapper>
  );
}
