"use client";

import React from "react";
import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getRoleDisplayName } from "@/lib/permissions";

export default function AdminUnauthorizedPage() {
  const { currentUser } = useAdminAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 py-12">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #D9D8D3",
          boxShadow: "0 2px 8px rgba(17,17,17,0.04)",
        }}
      >
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#111111"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <span
        className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] mb-2"
        style={{ color: "#666666" }}
      >
        Security &amp; Authorization
      </span>

      <h1
        className="font-serif text-3xl md:text-4xl font-normal tracking-tight mb-3"
        style={{ color: "#111111" }}
      >
        ACCESS RESTRICTED
      </h1>

      <p
        className="font-sans text-sm max-w-md leading-relaxed mb-6"
        style={{ color: "#666666" }}
      >
        You do not have permission to access this section. Please contact your system administrator if you require access.
      </p>

      {currentUser && (
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans mb-8"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #D9D8D3",
            color: "#111111",
          }}
        >
          <span style={{ color: "#666666" }}>Authenticated as:</span>
          <span className="font-medium">{currentUser.email}</span>
          <span
            className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium"
            style={{ backgroundColor: "#181818", color: "#FFFFFF" }}
          >
            {getRoleDisplayName(currentUser.role)}
          </span>
        </div>
      )}

      <div>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center px-6 py-3 text-xs font-sans font-medium tracking-[0.15em] uppercase transition-colors rounded"
          style={{
            backgroundColor: "#181818",
            color: "#FFFFFF",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#333333";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#181818";
          }}
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
