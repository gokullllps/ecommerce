/**
 * PABLO Payment Architecture Factory & Exports
 */
import { IPaymentProvider } from "./types";
import { stripePaymentProvider } from "./stripeProvider";

export * from "./types";
export * from "./stripeProvider";

export function getPaymentProvider(): IPaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER || "stripe";

  switch (provider.toLowerCase()) {
    case "stripe":
    default:
      return stripePaymentProvider;
  }
}

export const paymentProvider = getPaymentProvider();
