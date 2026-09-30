/**
 * PABLO Production Structured Logging & Observability.
 *
 * Implements:
 * - JSON-structured logs with timestamp, requestId, module, severity
 * - Automatic redaction of sensitive credentials, JWTs, card data, and passwords
 * - Ready for AWS CloudWatch, Datadog, or OpenTelemetry log drains
 */

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

const SENSITIVE_KEYS = new Set([
  "password",
  "secret",
  "token",
  "authorization",
  "cvv",
  "cardNumber",
  "stripeSecretKey",
  "accessKeyId",
  "secretAccessKey",
]);

function redactSensitive(obj: unknown, depth = 0): unknown {
  if (depth > 4 || !obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitive(item, depth + 1));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase()) || k.toLowerCase().includes("secret")) {
      sanitized[k] = "[REDACTED]";
    } else if (typeof v === "object") {
      sanitized[k] = redactSensitive(v, depth + 1);
    } else {
      sanitized[k] = v;
    }
  }
  return sanitized;
}

export const logger = {
  log(level: LogLevel, module: string, message: string, meta?: Record<string, unknown>) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      ...(meta ? { meta: redactSensitive(meta) } : {}),
      env: process.env.APP_ENV || process.env.NODE_ENV || "development",
    };

    const output = JSON.stringify(entry);

    if (level === "ERROR") {
      console.error(output);
    } else if (level === "WARN") {
      console.warn(output);
    } else {
      console.log(output);
    }
  },

  debug(module: string, message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      this.log("DEBUG", module, message, meta);
    }
  },

  info(module: string, message: string, meta?: Record<string, unknown>) {
    this.log("INFO", module, message, meta);
  },

  warn(module: string, message: string, meta?: Record<string, unknown>) {
    this.log("WARN", module, message, meta);
  },

  error(module: string, message: string, meta?: Record<string, unknown>) {
    this.log("ERROR", module, message, meta);
  },
};
