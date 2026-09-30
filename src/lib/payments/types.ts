/**
 * PABLO Payment Integration Architecture & Provider Interfaces.
 *
 * Implements tokenized payments, server-side cart recalculation,
 * webhook idempotency, and refund operations.
 */

export interface CheckoutLineItem {
  productId: string;
  variantSku?: string;
  quantity: number;
}

export interface CheckoutSessionParams {
  items: CheckoutLineItem[];
  customerEmail: string;
  customerName: string;
  promotionCode?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
  calculatedSubtotal: number;
  calculatedDiscount: number;
  calculatedTax: number;
  calculatedShipping: number;
  calculatedTotal: number;
  currency: string;
}

export interface PaymentVerificationResult {
  verified: boolean;
  orderId?: string;
  paymentIntentId: string;
  status: "succeeded" | "pending" | "failed" | "refunded";
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

export interface PaymentRefundParams {
  paymentIntentId: string;
  amount?: number; // Optional partial refund
  reason?: string;
}

export interface PaymentRefundResult {
  refundId: string;
  status: "succeeded" | "failed";
  amountRefunded: number;
}

export interface IPaymentProvider {
  createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult>;
  verifyWebhookEvent(payload: string, signature: string): Promise<{ eventType: string; data: unknown }>;
  refundPayment(params: PaymentRefundParams): Promise<PaymentRefundResult>;
}
