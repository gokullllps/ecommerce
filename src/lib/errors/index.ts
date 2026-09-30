/**
 * PABLO Typed Error Hierarchy & Production Sanitizer.
 *
 * Ensures all server errors fail closed, return structured codes,
 * and strip stack traces or database internals before returning to client.
 */

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, code: string = "INTERNAL_SERVER_ERROR", statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string> = {}) {
    super(message, "VALIDATION_ERROR", 400);
    this.errors = errors;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required to access this resource.") {
    super(message, "AUTHENTICATION_REQUIRED", 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient administrative privileges for requested resource.") {
    super(message, "FORBIDDEN", 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    super(
      `${resource}${identifier ? ` with identifier "${identifier}"` : ""} was not found.`,
      "NOT_FOUND",
      404
    );
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Concurrent mutation conflict detected. Please reload state and retry.") {
    super(message, "CONCURRENCY_CONFLICT", 409);
  }
}

export class PaymentError extends AppError {
  constructor(message: string, code: string = "PAYMENT_PROCESSING_FAILED") {
    super(message, code, 402);
  }
}

/**
 * Strips sensitive traces, credentials, or internal exceptions before sending responses to the client.
 */
export function sanitizeErrorForClient(error: unknown): {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: unknown;
  };
} {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error instanceof ValidationError ? error.errors : undefined,
      },
    };
  }

  const isProd = process.env.APP_ENV === "production" || process.env.NODE_ENV === "production";
  const rawMessage = (error as Error)?.message || "An unexpected error occurred.";

  return {
    success: false,
    error: {
      message: isProd ? "An unexpected server error occurred. Please contact the concierge." : rawMessage,
      code: "INTERNAL_ERROR",
      statusCode: 500,
    },
  };
}
