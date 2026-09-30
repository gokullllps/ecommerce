export interface NavDropdownItem {
  label: string;
  href: string;
}

export interface NavCategoryConfig {
  id: string;
  label: string;
  href: string;
  hasDropdown: boolean;
  hasMega?: boolean;
  items: NavDropdownItem[];
  // For backwards compatibility:
  columns?: any;
  editorial?: any;
}

// Backwards compatibility alias
export type MegaMenuConfig = NavCategoryConfig;

export const NAVIGATION_DATA: NavCategoryConfig[] = [
  // ─── 1. MEN ───
  {
    id: "men",
    label: "Men",
    href: "/men",
    hasDropdown: false,
    hasMega: false,
    items: [],
  },

  // ─── 2. WOMEN ───
  {
    id: "women",
    label: "Women",
    href: "/women",
    hasDropdown: false,
    hasMega: false,
    items: [],
  },

  // ─── 3. KIDS ───
  {
    id: "kids",
    label: "Kids",
    href: "/kids",
    hasDropdown: false,
    hasMega: false,
    items: [],
  },

  // ─── 6. SALE ───
  {
    id: "sale",
    label: "Sale",
    href: "/sale",
    hasDropdown: false,
    hasMega: false,
    items: [],
  },

  // ─── 7. ABOUT ───
  {
    id: "about",
    label: "About",
    href: "/about",
    hasDropdown: false,
    hasMega: false,
    items: [],
  },
];
