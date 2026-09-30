"use client";

import React, { useState } from "react";
import { loginAdminAction } from "@/app/actions/authActions";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const { refreshSession } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await loginAdminAction(formData);

      if (!result.success) {
        setErrorMessage(result.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Refresh client context and navigate to admin portal
      await refreshSession();
      window.location.href = "/admin";
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#EAE8E1" }}
    >
      <div
        className="w-full max-w-sm rounded-lg p-8 shadow-sm"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(17, 17, 17, 0.10)",
        }}
      >
        {/* Editorial Brand Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex w-10 h-10 rounded-md items-center justify-center font-serif text-lg font-medium tracking-tight mb-3"
            style={{ backgroundColor: "#181818", color: "#FFFFFF" }}
          >
            P
          </div>
          <h1
            className="font-serif text-2xl font-light tracking-[0.25em] uppercase"
            style={{ color: "#111111" }}
          >
            PABLO
          </h1>
          <p
            className="text-[10px] tracking-[0.2em] uppercase mt-1 font-medium"
            style={{ color: "#666666" }}
          >
            Atelier Management
          </p>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div
            className="mb-6 p-3 rounded text-xs flex items-start gap-2.5"
            style={{
              backgroundColor: "rgba(185, 28, 28, 0.06)",
              border: "1px solid rgba(185, 28, 28, 0.20)",
              color: "#991B1B",
            }}
          >
            <svg
              className="w-4 h-4 shrink-0 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-[11px] font-medium tracking-wider uppercase mb-1.5"
              style={{ color: "#666666" }}
            >
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pablo-luxury.com"
              className="w-full px-3 py-2.5 rounded text-xs transition-colors"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #D9D8D3",
                color: "#111111",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#111111")}
              onBlur={(e) => (e.target.style.borderColor = "#D9D8D3")}
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-[11px] font-medium tracking-wider uppercase mb-1.5"
              style={{ color: "#666666" }}
            >
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2.5 rounded text-xs transition-colors"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #D9D8D3",
                color: "#111111",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#111111")}
              onBlur={(e) => (e.target.style.borderColor = "#D9D8D3")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded text-xs font-medium tracking-widest uppercase transition-all cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: "#181818",
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget.style.backgroundColor = "#111111");
            }}
            onMouseLeave={(e) => {
              if (!loading) (e.currentTarget.style.backgroundColor = "#181818");
            }}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div
          className="mt-6 pt-4 text-center text-[10px] tracking-wider uppercase font-sans"
          style={{
            borderTop: "1px solid rgba(17, 17, 17, 0.08)",
            color: "#999999",
          }}
        >
          Protected administrative portal
        </div>
      </div>
    </div>
  );
}
