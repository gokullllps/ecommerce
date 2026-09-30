import { NextResponse } from "next/server";
import { paymentProvider } from "@/lib/payments";
import { ordersRepository, auditLogsRepository } from "@/lib/repositories";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("stripe-signature") || req.headers.get("x-webhook-signature") || "";
    const rawBody = await req.text();

    if (!rawBody) {
      return NextResponse.json({ error: "Missing webhook payload" }, { status: 400 });
    }

    // Verify signature & idempotency
    const { eventType, data } = await paymentProvider.verifyWebhookEvent(rawBody, signature);

    if (eventType === "DUPLICATE_IGNORED") {
      return NextResponse.json({ received: true, note: "Duplicate event skipped" });
    }

    const eventPayload = data as Record<string, any>;
    const orderId = eventPayload?.metadata?.orderId || eventPayload?.client_reference_id;

    logger.info("PAYMENTS", `Received verified payment webhook: ${eventType}`, {
      eventType,
      orderId,
    });

    if (orderId) {
      const existingOrder = await ordersRepository.getOrderById(orderId);
      if (existingOrder) {
        if (eventType === "checkout.session.completed" || eventType === "payment_intent.succeeded") {
          await ordersRepository.updateOrder(orderId, {
            paymentStatus: "paid",
            status: existingOrder.status === "pending" ? "confirmed" : existingOrder.status,
          });

          await auditLogsRepository.logAction(
            "ORDER_STATUS_CHANGED",
            `Order #${existingOrder.orderNumber}`,
            `Payment confirmed via webhook (${eventType}). Payment status set to PAID.`,
            "PaymentProvider"
          );
        } else if (eventType === "payment_intent.payment_failed") {
          await ordersRepository.updateOrder(orderId, {
            paymentStatus: "failed",
          });

          await auditLogsRepository.logAction(
            "ORDER_STATUS_CHANGED",
            `Order #${existingOrder.orderNumber}`,
            `Payment failed via webhook (${eventType}). Payment status set to FAILED.`,
            "PaymentProvider"
          );
        }
      }
    }

    return NextResponse.json({ received: true, eventType });
  } catch (error: any) {
    logger.error("PAYMENTS", "Webhook processing failed", { error: error.message });
    return NextResponse.json(
      { error: error.message || "Webhook verification failed" },
      { status: 400 }
    );
  }
}
