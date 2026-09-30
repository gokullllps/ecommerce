/**
 * PABLO Rate Limiting & Abuse Prevention Engine.
 *
 * Implements sliding window token bucket rate limiting for sensitive endpoints:
 * - Admin Authentication
 * - Checkout & Payment Sessions
 * - Public Search & Catalogue Queries
 * - Administrative Mutations
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

const rateLimitBuckets = new Map<string, { count: number; expiresAt: number }>();

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check whether key has exceeded limit
   */
  check(key: string): RateLimitResult {
    const now = Date.now();
    const bucket = rateLimitBuckets.get(key);

    if (!bucket || bucket.expiresAt < now) {
      // First hit or window expired
      const expiresAt = now + this.config.windowMs;
      rateLimitBuckets.set(key, { count: 1, expiresAt });
      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        resetTime: expiresAt,
      };
    }

    if (bucket.count >= this.config.maxRequests) {
      return {
        success: false,
        limit: this.config.maxRequests,
        remaining: 0,
        resetTime: bucket.expiresAt,
      };
    }

    bucket.count += 1;
    return {
      success: true,
      limit: this.config.maxRequests,
      remaining: this.config.maxRequests - bucket.count,
      resetTime: bucket.expiresAt,
    };
  }

  reset(key: string): void {
    rateLimitBuckets.delete(key);
  }
}

// Pre-configured rate limiters
export const loginRateLimiter = new RateLimiter({ maxRequests: 5, windowMs: 60_000 }); // 5/min
export const checkoutRateLimiter = new RateLimiter({ maxRequests: 10, windowMs: 60_000 }); // 10/min
export const searchRateLimiter = new RateLimiter({ maxRequests: 120, windowMs: 60_000 }); // 120/min
export const adminActionRateLimiter = new RateLimiter({ maxRequests: 100, windowMs: 60_000 }); // 100/min
