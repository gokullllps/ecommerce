/**
 * PABLO Environment Configuration
 *
 * PABLO is a JSON-only ecommerce template.
 * data/*.json is the canonical data source — no external database or auth provider required.
 */

export interface AppConfig {
  appEnv: "development" | "test" | "production";
  media: {
    provider: "local" | "s3" | "r2";
    s3Bucket: string;
    s3Region: string;
    cdnDomain?: string;
  };
  logLevel: string;
  rateLimits: {
    adminPerMinute: number;
    authPerMinute: number;
    checkoutPerMinute: number;
  };
}

export function validateEnvironment(): { valid: boolean; errors: string[]; config: AppConfig } {
  const errors: string[] = [];

  const appEnv = (process.env.APP_ENV || process.env.NODE_ENV || "development") as
    | "development"
    | "test"
    | "production";

  const mediaProvider = (process.env.MEDIA_PROVIDER || "local") as "local" | "s3" | "r2";
  const s3Bucket = process.env.S3_BUCKET || "pablo-media";
  const s3Region = process.env.S3_REGION || "ap-south-1";
  const cdnDomain = process.env.MEDIA_CDN_DOMAIN;

  const logLevel = process.env.LOG_LEVEL || "info";
  const adminRateLimit = parseInt(process.env.ADMIN_RATE_LIMIT_PER_MINUTE || "100", 10);
  const authRateLimit = parseInt(process.env.AUTH_RATE_LIMIT_PER_MINUTE || "5", 10);
  const checkoutRateLimit = parseInt(process.env.CHECKOUT_RATE_LIMIT_PER_MINUTE || "10", 10);

  // Production assertions
  if (appEnv === "production") {
    if ((mediaProvider === "s3" || mediaProvider === "r2") && !process.env.S3_BUCKET) {
      errors.push("Missing S3_BUCKET for cloud media storage in production.");
    }
  }

  const config: AppConfig = {
    appEnv,
    media: {
      provider: mediaProvider,
      s3Bucket,
      s3Region,
      cdnDomain,
    },
    logLevel,
    rateLimits: {
      adminPerMinute: adminRateLimit,
      authPerMinute: authRateLimit,
      checkoutPerMinute: checkoutRateLimit,
    },
  };

  return {
    valid: errors.length === 0,
    errors,
    config,
  };
}

export const envConfig = validateEnvironment().config;
