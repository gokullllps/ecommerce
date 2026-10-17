/**
 * PABLO Editorial Scroll Utilities
 * Smooth scrolling helpers accounting for dynamic sticky navbar height
 * and editorial whitespace alignment.
 */

export function scrollToCategorySection(categoryId?: string) {
  if (typeof window === "undefined") return;

  const norm = (categoryId || "").toLowerCase().trim();

  // Try finding the destination section in order of specificity
  const targetEl =
    (norm && document.getElementById(`category-${norm}`)) ||
    (norm && document.getElementById(`category-heading-${norm}`)) ||
    (norm && document.getElementById(`category-section-${norm}`)) ||
    document.getElementById("category-heading") ||
    document.getElementById("catalogue-heading") ||
    document.getElementById("catalogue");

  if (!targetEl) return;

  // Measure dynamic sticky navbar height
  const navbar = document.querySelector("header.sticky") || document.querySelector("header");
  const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80;
  const paddingOffset = 24; // Generous editorial breathing room below navbar

  const rect = targetEl.getBoundingClientRect();
  const absoluteTop = window.scrollY + rect.top;
  const targetY = Math.max(0, absoluteTop - navbarHeight - paddingOffset);

  // Smoothly scroll down to target section
  window.scrollTo({
    top: targetY,
    behavior: "smooth",
  });
}
