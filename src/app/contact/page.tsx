"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Personal Styling & Sizing",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <PageWrapper navbarProps={{ isStaticPage: true }}>
      <main className="flex-1 page-container-reading py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#666666]">
            DIRECT CORRESPONDENCE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111]">
            Contact the Atelier
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Our private client concierge and tailoring team are at your service for bespoke appointments and inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Contact Details: 5 Columns */}
          <div className="md:col-span-5 space-y-8 text-xs text-[#666666]">
            <div>
              <h3 className="font-serif text-xl text-[#111111] mb-2">Flagship Atelier</h3>
              <p className="leading-relaxed">
                Maison PABLO<br />
                The Heritage Arcade, 1st Floor<br />
                Colaba, Mumbai 400005<br />
                India
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[#111111] mb-2">Telephone & Electronic</h3>
              <p className="leading-relaxed">
                VIP Concierge: +91 (0) 22 8900 4400<br />
                Client Advisory: concierge@maisonpablo.com<br />
                Editorial & Press: press@maisonpablo.com
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[#111111] mb-2">Concierge Hours</h3>
              <p className="leading-relaxed">
                Monday through Sunday<br />
                09:00 — 21:00 Indian Standard Time
              </p>
            </div>
          </div>

          {/* Form: 7 Columns */}
          <div className="md:col-span-7 bg-white/70 border border-[#D9D8D3] p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-900 text-white flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-[#111111]">Dispatch Transmitted</h3>
                <p className="text-xs text-[#666666] max-w-sm mx-auto leading-relaxed">
                  Thank you, {formData.name}. A Maison PABLO client advisor has received your message and will respond within 4 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "Personal Styling & Sizing", message: "" });
                  }}
                  className="mt-4 px-6 py-2.5 border border-[#111111] text-xs uppercase tracking-wider text-[#111111] hover:bg-black hover:text-white transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#666666] uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[#666666] uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[#666666] uppercase tracking-wider mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                  >
                    <option value="Personal Styling & Sizing">Personal Styling & Sizing</option>
                    <option value="Private Atelier Appointment">Private Atelier Appointment</option>
                    <option value="Order & Delivery Assistance">Order & Delivery Assistance</option>
                    <option value="Archival Garment Inquiries">Archival Garment Inquiries</option>
                    <option value="Editorial & Press">Editorial & Press</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#666666] uppercase tracking-wider mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How may our concierge assist you?"
                    className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 pablo-btn-dark text-[#EAE8E1] text-xs font-sans font-medium uppercase tracking-[0.24em] border border-[#222222] hover:border-white transition-all"
                  >
                    TRANSMIT INQUIRY
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
