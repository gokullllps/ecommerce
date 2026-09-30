/**
 * PABLO Input Validation & Sanitization Engine
 *
 * Enforces strict boundary checks on all external inputs:
 * IDs, slugs, pagination, prices, stock, promotions, dates, emails, and strings.
 */
import { ValidationError } from "@/lib/errors";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]{2,64}$/;

export function validateSafeId(id: unknown, fieldName: string = "ID"): string {
  if (typeof id !== "string" || !SAFE_ID_REGEX.test(id)) {
    throw new ValidationError(`Invalid ${fieldName}: Must be alphanumeric with hyphens or underscores (2-64 chars).`);
  }
  return id;
}

export function validateSlug(slug: unknown): string {
  if (typeof slug !== "string" || !SLUG_REGEX.test(slug)) {
    throw new ValidationError(`Invalid slug "${String(slug)}": Must be lowercase alphanumeric separated by single hyphens.`);
  }
  return slug;
}

export function validateEmail(email: unknown): string {
  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    throw new ValidationError(`Invalid email address: "${String(email)}".`);
  }
  return email.trim().toLowerCase();
}

export function validatePrice(price: unknown, fieldName: string = "price"): number {
  const num = Number(price);
  if (isNaN(num) || num < 0 || !isFinite(num)) {
    throw new ValidationError(`Invalid ${fieldName}: Must be a positive numeric value.`);
  }
  return Math.round(num); // Store currency in whole cents/paisa/units
}

export function validateStock(stock: unknown, fieldName: string = "stock"): number {
  const num = Number(stock);
  if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
    throw new ValidationError(`Invalid ${fieldName}: Stock must be a non-negative integer.`);
  }
  return num;
}

export function validatePagination(
  pageParam?: unknown,
  limitParam?: unknown,
  maxLimit: number = 100
): { page: number; limit: number; offset: number } {
  const page = Math.max(1, parseInt(String(pageParam || 1), 10) || 1);
  const rawLimit = parseInt(String(limitParam || 20), 10) || 20;
  const limit = Math.min(Math.max(1, rawLimit), maxLimit);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function validateSortField<T extends string>(field: unknown, allowedFields: readonly T[], defaultField: T): T {
  if (typeof field === "string" && (allowedFields as readonly string[]).includes(field)) {
    return field as T;
  }
  return defaultField;
}

export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  // Strip HTML script tags and potential injection patterns
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}
