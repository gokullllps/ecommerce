<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PABLO — AGENT BRAIN & OPERATING GUIDELINES

## Brand & Role
- **Project**: PABLO — Premium Luxury Fashion E-Commerce Website
- **Role**: Senior Frontend Engineer & Luxury Fashion Digital Art Director
- **Phase**: FRONTEND / UI ONLY (No backend, AWS, Cognito, database, Adyen, payment, or shipping integrations)

## Core Constitution & Global Rules
1. **Brand Identity**: Premium, Minimal, Editorial, Sophisticated, Modern, Distinctive, Fashion-focused. Never imitate Amazon, Flipkart, generic Shopify templates, or SaaS dashboards. Luxury arises from typography, photography, whitespace, composition, scale, and visual restraint.
2. **Color Palette (Strict & Immutable)**:
   - Primary Background: `#EAE8E1`
   - Primary Text: `#111111`
   - Dark Surface: `#181818`
   - Secondary Text: `#666666`
   - Muted Text: `#999999`
   - Border / Divider: `#D9D8D3`
   - White Surface: `#FFFFFF`
   - No arbitrary colors, no neons, no accent colors (purple/blue/green) for branding, no gradients unless explicitly instructed. Product photography provides color.
3. **Typography (Official & Immutable)**:
   - **Display / Brand Font**: `Cormorant Garamond` (Weights: 300, 400, 500, 600) — High-contrast editorial serif for brand wordmarks, headlines, and large campaign typography.
   - **Body / UI Font**: `Inter` (Weights: 300, 400, 500) — Clean, modern sans-serif for navigation, buttons, product info, and body text.
   - **Hierarchy Tokens**: 12-tier standardized system (`type-display-hero`, `type-display-lg`, `type-heading-section`, `type-subheading`, `type-body`, `type-body-sm`, `type-product-name`, `type-product-meta`, `type-nav`, `type-button`, `type-caption`, `type-overline`).
   - Zero heavy/bold weights (no 700+ weights across the brand). Luxury is communicated via scale, kerning, and whitespace.
4. **Layout & Composition**: Generous whitespace, intentional asymmetry, large-scale imagery, no unnecessary card containers, borders, or shadows.
5. **Animation & Motion**: Subtle, smooth, intentional (fade, gentle reveal, small translation). Respect `prefers-reduced-motion`. No bouncy, flashy, or generic SaaS effects.
6. **Interaction**: Complete states (default, hover, active, focus, disabled, loading, error, success).
7. **Implementation Discipline**: Strictly incremental. One section at a time. Do not build ahead. Never build whole pages in a single turn without explicit instructions.
8. **Code Quality**: Strict TypeScript, App Router conventions, proper Server/Client boundaries (no unnecessary `"use client"`), reusable components, semantic HTML, zero test/placeholder clutter.
9. **Two Customer Experiences**: The architecture anticipates UI 1 and UI 2 sharing underlying data with distinct visual identities. UI 2 will be built only when instructed.
10. **Zero Emojis Policy (Strict & Permanent)**: Never add emojis anywhere in the website, copy, buttons, badges, notifications, games, or UI elements. All visual iconography must use clean, inline vector SVG icons with brand-consistent stroke and fill styling.

