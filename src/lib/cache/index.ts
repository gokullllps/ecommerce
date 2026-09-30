/**
 * PABLO Production Caching Layer
 *
 * Implements deterministic caching for stable catalog and storefront data
 * while strictly bypassing cache for mutable transactional data (orders, inventory, payments).
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

export const CacheTags = {
  CATEGORIES: "categories",
  COLLECTIONS: "collections",
  THEMES: "themes",
  STOREFRONT: "storefront",
  PRODUCTS: "products",
} as const;

export type CacheTag = (typeof CacheTags)[keyof typeof CacheTags];

/**
 * Default TTLs in milliseconds:
 * Stable catalog data: 5 minutes (300,000ms)
 * Themes & Storefront: 10 minutes (600,000ms)
 */
export const DEFAULT_TTLS: Record<string, number> = {
  [CacheTags.CATEGORIES]: 300_000,
  [CacheTags.COLLECTIONS]: 300_000,
  [CacheTags.THEMES]: 600_000,
  [CacheTags.STOREFRONT]: 600_000,
  [CacheTags.PRODUCTS]: 60_000,
};

export async function getOrSetCache<T>(
  key: string,
  tag: CacheTag,
  fetchFn: () => Promise<T>,
  ttlMs?: number
): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(key) as CacheEntry<T> | undefined;

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const fresh = await fetchFn();
  const effectiveTtl = ttlMs ?? DEFAULT_TTLS[tag] ?? 60_000;

  memoryCache.set(key, {
    data: fresh,
    expiresAt: now + effectiveTtl,
  });

  return fresh;
}

export function invalidateCacheTag(tag: CacheTag): void {
  for (const key of memoryCache.keys()) {
    if (key.startsWith(tag)) {
      memoryCache.delete(key);
    }
  }
}

export function clearEntireCache(): void {
  memoryCache.clear();
}
