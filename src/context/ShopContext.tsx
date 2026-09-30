"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/catalogue";
import { CartItem, WishlistItem } from "@/types/shop";

interface ShopContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color?: string, quantity?: number, imageOverride?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  // Modals & Quick Shop
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickShopProduct: Product | null;
  openQuickShop: (product: Product) => void;
  closeQuickShop: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = "pablo_cart_v1";
const WISHLIST_STORAGE_KEY = "pablo_wishlist_v1";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickShopProduct, setQuickShopProduct] = useState<Product | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (e) {
      console.error("Failed to load shop state from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Save Cart to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
  }, [cart, isHydrated]);

  // Save Wishlist to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to persist wishlist", e);
    }
  }, [wishlist, isHydrated]);

  // Cart operations
  const addToCart = (product: Product, size: string, color?: string, quantity: number = 1, imageOverride?: string) => {
    const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0].name : "Standard");
    const cartItemId = `${product.id}-${size}-${selectedColor}`;

    const matchingVariant = product.colorVariants?.find(
      (v) => v.name.toLowerCase() === selectedColor.toLowerCase()
    );
    const variantImage =
      imageOverride ||
      matchingVariant?.images?.[0]?.url ||
      product.images?.[0]?.url ||
      "";
    const variantHex =
      matchingVariant?.hex ||
      matchingVariant?.value ||
      product.colors?.find((c) => c.name.toLowerCase() === selectedColor.toLowerCase())?.hex;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        price: product.salePrice || product.price,
        originalPrice: product.salePrice ? product.price : product.originalPrice,
        size,
        color: selectedColor,
        colorHex: variantHex,
        image: variantImage,
        quantity,
      };
      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Wishlist operations
  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.productId === product.id);
      if (exists) {
        return prev.filter((item) => item.productId !== product.id);
      } else {
        const newItem: WishlistItem = {
          productId: product.id,
          product,
          addedAt: new Date().toISOString(),
        };
        return [...prev, newItem];
      }
    });
  };

  const wishlistCount = wishlist.length;

  // Quick Shop
  const openQuickShop = (product: Product) => {
    setQuickShopProduct(product);
  };

  const closeQuickShop = () => {
    setQuickShopProduct(null);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        isSearchOpen,
        setIsSearchOpen,
        quickShopProduct,
        openQuickShop,
        closeQuickShop,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
