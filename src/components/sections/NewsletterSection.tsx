"use client";

import React, { useState } from "react";
import { Reveal } from "@/components/animation/Reveal";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <section
      id="newsletter"
      aria-label="PABLO Private Invitations"
      className="w-full bg-[#EAE8E1] text-[#111111] py-10 sm:py-12 lg:py-14 select-none border-t border-[#D9D8D3]"
      style={{ backgroundColor: "#EAE8E1", color: "#111111" }}
    >
      <div className="page-container flex flex-col items-center justify-center text-center">
        <Reveal direction="up" distance={20} className="w-full max-w-lg">
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.32em] text-[#666666] font-medium mb-2.5">
            Brand Relationship · Atelier PABLO
          </span>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.03em] sm:tracking-[0.04em] text-[#111111] mb-3 sm:mb-4"
            style={{ fontFamily: "'Beverly', var(--font-editorial), serif", fontKerning: "normal" }}
          >
            PRIVATE INVITATIONS
          </h2>

          <p className="text-xs sm:text-sm font-light tracking-wide text-[#666666] leading-relaxed mb-6 sm:mb-8">
            Subscribe to receive salon previews, archival capsule releases, and private appointments
            directly from the Maison.
          </p>

          {isSubmitted ? (
            <div className="py-4 px-6 bg-[#FFFFFF] border border-[#D9D8D3]">
              <p className="text-xs uppercase tracking-[0.22em] text-[#111111] font-medium">
                Thank you. Your invitation has been registered.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col sm:flex-row items-stretch border-b border-[#111111] pb-1 gap-2 sm:gap-0">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Email address for private invitations"
                  className="flex-1 bg-transparent py-2 px-1 text-xs text-[#111111] placeholder-[#999999] focus:outline-none font-light tracking-wide"
                />
                <button
                  type="submit"
                  className="px-6 py-2 pablo-btn-dark pablo-btn-luxury text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-medium cursor-pointer shrink-0"
                >
                  REQUEST INVITATION
                </button>
              </div>
              <p className="text-[10px] text-[#999999] tracking-wider mt-3 font-light">
                Discretion assured. You may revoke communication at any time.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
