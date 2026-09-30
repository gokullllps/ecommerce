"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Product, SortOption } from "@/types/catalogue";
import { ActiveFilterState, CatalogueContext, FilterGroupId } from "@/types/filters";
import {
  INITIAL_FILTER_STATE,
  filterProducts,
  sortProducts,
  generateFilterGroups,
  getCataloguePriceBounds,
} from "@/lib/filterEngine";

export function useProductFilters(baseProducts: Product[], context: CatalogueContext) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Price boundaries for current products
  const priceBounds = useMemo(() => getCataloguePriceBounds(baseProducts), [baseProducts]);

  // Initialize state from URL params once
  const [activeFilters, setActiveFilters] = useState<ActiveFilterState>(() => {
    const sortParam = (searchParams.get("sort") as SortOption) || "recommended";
    const parseList = (key: string) => {
      const v = searchParams.get(key);
      return v ? v.split(",").map((s) => decodeURIComponent(s).trim()) : [];
    };

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    return {
      ...INITIAL_FILTER_STATE,
      categories: parseList("category"),
      productTypes: parseList("productType"),
      footwearTypes: parseList("footwearType"),
      accessoryTypes: parseList("accessoryType"),
      sizes: parseList("size"),
      colors: parseList("color"),
      fits: parseList("fit"),
      materials: parseList("material"),
      collections: parseList("collection"),
      minPrice: minPriceParam ? Number(minPriceParam) : undefined,
      maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
      inStockOnly: searchParams.get("inStock") === "true",
      saleOnly: searchParams.get("sale") === "true" || !!context.isSaleOnly,
      newOnly: searchParams.get("new") === "true" || !!context.isNewOnly,
      sort: sortParam,
    };
  });

  // Drawer / Accordion UI states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Sync activeFilters to URL search parameters seamlessly
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();

    if (activeFilters.categories.length) params.set("category", activeFilters.categories.join(","));
    if (activeFilters.productTypes.length) params.set("productType", activeFilters.productTypes.join(","));
    if (activeFilters.footwearTypes.length) params.set("footwearType", activeFilters.footwearTypes.join(","));
    if (activeFilters.accessoryTypes.length) params.set("accessoryType", activeFilters.accessoryTypes.join(","));
    if (activeFilters.sizes.length) params.set("size", activeFilters.sizes.join(","));
    if (activeFilters.colors.length) params.set("color", activeFilters.colors.join(","));
    if (activeFilters.fits.length) params.set("fit", activeFilters.fits.join(","));
    if (activeFilters.materials.length) params.set("material", activeFilters.materials.join(","));
    if (activeFilters.collections.length) params.set("collection", activeFilters.collections.join(","));
    if (activeFilters.minPrice !== undefined) params.set("minPrice", String(activeFilters.minPrice));
    if (activeFilters.maxPrice !== undefined) params.set("maxPrice", String(activeFilters.maxPrice));
    if (activeFilters.inStockOnly) params.set("inStock", "true");
    if (activeFilters.saleOnly && !context.isSaleOnly) params.set("sale", "true");
    if (activeFilters.newOnly && !context.isNewOnly) params.set("new", "true");
    if (activeFilters.sort !== "recommended") params.set("sort", activeFilters.sort);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    window.history.replaceState(null, "", newUrl);
  }, [activeFilters, pathname, context.isSaleOnly, context.isNewOnly]);

  // Filter computation
  const filteredProducts = useMemo(
    () => filterProducts(baseProducts, activeFilters, context),
    [baseProducts, activeFilters, context]
  );

  // Sort computation
  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, activeFilters.sort),
    [filteredProducts, activeFilters.sort]
  );

  // Dynamic filter groups and facet counts
  const filterGroups = useMemo(
    () => generateFilterGroups(baseProducts, activeFilters, context),
    [baseProducts, activeFilters, context]
  );

  // Action: Toggle a filter option
  const toggleFilterOption = useCallback((groupId: FilterGroupId, optionId: string) => {
    setActiveFilters((prev) => {
      switch (groupId) {
        case "category": {
          const next = prev.categories.includes(optionId)
            ? prev.categories.filter((x) => x !== optionId)
            : [...prev.categories, optionId];
          return { ...prev, categories: next };
        }
        case "productType": {
          const next = prev.productTypes.includes(optionId)
            ? prev.productTypes.filter((x) => x !== optionId)
            : [...prev.productTypes, optionId];
          return { ...prev, productTypes: next };
        }
        case "footwearType": {
          const next = prev.footwearTypes.includes(optionId)
            ? prev.footwearTypes.filter((x) => x !== optionId)
            : [...prev.footwearTypes, optionId];
          return { ...prev, footwearTypes: next };
        }
        case "accessoryType": {
          const next = prev.accessoryTypes.includes(optionId)
            ? prev.accessoryTypes.filter((x) => x !== optionId)
            : [...prev.accessoryTypes, optionId];
          return { ...prev, accessoryTypes: next };
        }
        case "size": {
          const next = prev.sizes.includes(optionId)
            ? prev.sizes.filter((x) => x !== optionId)
            : [...prev.sizes, optionId];
          return { ...prev, sizes: next };
        }
        case "color": {
          const next = prev.colors.includes(optionId)
            ? prev.colors.filter((x) => x !== optionId)
            : [...prev.colors, optionId];
          return { ...prev, colors: next };
        }
        case "fit": {
          const next = prev.fits.includes(optionId)
            ? prev.fits.filter((x) => x !== optionId)
            : [...prev.fits, optionId];
          return { ...prev, fits: next };
        }
        case "material": {
          const next = prev.materials.includes(optionId)
            ? prev.materials.filter((x) => x !== optionId)
            : [...prev.materials, optionId];
          return { ...prev, materials: next };
        }
        case "collection": {
          const next = prev.collections.includes(optionId)
            ? prev.collections.filter((x) => x !== optionId)
            : [...prev.collections, optionId];
          return { ...prev, collections: next };
        }
        case "availability": {
          if (optionId === "inStockOnly") return { ...prev, inStockOnly: !prev.inStockOnly };
          if (optionId === "saleOnly") return { ...prev, saleOnly: !prev.saleOnly };
          if (optionId === "newOnly") return { ...prev, newOnly: !prev.newOnly };
          return prev;
        }
        default:
          return prev;
      }
    });
  }, []);

  // Action: Set price range
  const setPriceRange = useCallback((min?: number, max?: number) => {
    setActiveFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  }, []);

  // Action: Set sort option
  const setSort = useCallback((sort: SortOption) => {
    setActiveFilters((prev) => ({ ...prev, sort }));
  }, []);

  // Action: Remove specific filter chip
  const removeFilter = useCallback(
    (dimension: keyof ActiveFilterState, value?: string | number) => {
      setActiveFilters((prev) => {
        if (dimension === "minPrice" || dimension === "maxPrice") {
          return { ...prev, minPrice: undefined, maxPrice: undefined };
        }
        if (dimension === "inStockOnly") return { ...prev, inStockOnly: false };
        if (dimension === "saleOnly") return { ...prev, saleOnly: false };
        if (dimension === "newOnly") return { ...prev, newOnly: false };

        if (Array.isArray(prev[dimension])) {
          return {
            ...prev,
            [dimension]: (prev[dimension] as string[]).filter((x) => x !== value),
          };
        }
        return prev;
      });
    },
    []
  );

  // Action: Reset all filters
  const resetAllFilters = useCallback(() => {
    setActiveFilters({
      ...INITIAL_FILTER_STATE,
      saleOnly: !!context.isSaleOnly,
      newOnly: !!context.isNewOnly,
      sort: activeFilters.sort,
    });
  }, [context.isSaleOnly, context.isNewOnly, activeFilters.sort]);

  // Total applied active filters count
  const appliedFilterCount = useMemo(() => {
    return (
      activeFilters.categories.length +
      activeFilters.productTypes.length +
      activeFilters.footwearTypes.length +
      activeFilters.accessoryTypes.length +
      activeFilters.sizes.length +
      activeFilters.colors.length +
      activeFilters.fits.length +
      activeFilters.materials.length +
      activeFilters.collections.length +
      (activeFilters.minPrice !== undefined || activeFilters.maxPrice !== undefined ? 1 : 0) +
      (activeFilters.inStockOnly ? 1 : 0) +
      (activeFilters.saleOnly && !context.isSaleOnly ? 1 : 0) +
      (activeFilters.newOnly && !context.isNewOnly ? 1 : 0)
    );
  }, [activeFilters, context.isSaleOnly, context.isNewOnly]);

  // Action: Clear an entire filter group
  const clearFilterGroup = useCallback(
    (groupId: string) => {
      setActiveFilters((prev) => {
        switch (groupId) {
          case "category":
            return { ...prev, categories: [] };
          case "productType":
            return { ...prev, productTypes: [] };
          case "footwearType":
            return { ...prev, footwearTypes: [] };
          case "accessoryType":
            return { ...prev, accessoryTypes: [] };
          case "size":
            return { ...prev, sizes: [] };
          case "color":
            return { ...prev, colors: [] };
          case "fit":
            return { ...prev, fits: [] };
          case "material":
            return { ...prev, materials: [] };
          case "collection":
            return { ...prev, collections: [] };
          case "availability":
            return {
              ...prev,
              inStockOnly: false,
              saleOnly: !!context.isSaleOnly,
              newOnly: !!context.isNewOnly,
            };
          case "price":
            return { ...prev, minPrice: undefined, maxPrice: undefined };
          default:
            return prev;
        }
      });
    },
    [context.isSaleOnly, context.isNewOnly]
  );

  return {
    activeFilters,
    filterGroups,
    filteredProducts,
    sortedProducts,
    totalCount: sortedProducts.length,
    baseCount: baseProducts.length,
    appliedFilterCount,
    hasActiveFilters: appliedFilterCount > 0,
    priceBounds,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    toggleFilterOption,
    setPriceRange,
    setSort,
    removeFilter,
    resetAllFilters,
    clearFilterGroup,
  };
}
