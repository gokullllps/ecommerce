"use server";

import {
  productsRepository,
  inventoryRepository,
  ordersRepository,
  customersRepository,
  promotionsRepository,
  storefrontRepository,
  auditLogsRepository,
} from "@/lib/repositories";
import { AdminOrder, AdminOrderItem, AdminCustomer } from "@/types/admin";
import { validateEmail, validateSafeId } from "@/lib/security/inputValidation";
import { ValidationError, sanitizeErrorForClient } from "@/lib/errors";
import { logger } from "@/lib/logger";

export interface DemoOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    variantSku?: string;
    quantity: number;
    colorName?: string;
    sizeName?: string;
  }>;
  deliveryMethod?: "express" | "white-glove";
  paymentMethod?: "card" | "upi" | "concierge";
  promotionCode?: string;
}

export interface DemoOrderResult {
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  order?: AdminOrder;
  error?: string;
}

/**
 * Server Action for creating a verified demo order in the canonical JSON data store.
 *
 * Enforces:
 * - Server-side recalculation of canonical product prices, taxes, and shipping
 * - Promotion code discount rules verification
 * - Authoritative stock verification and inventory decrement with audit logging
 * - Persisting order into data/orders.json
 * - Updating/creating customer profile in data/customers.json
 * - Appending audit entry into data/audit-logs.json
 */
export async function serverCreateDemoOrder(input: DemoOrderInput): Promise<DemoOrderResult> {
  try {
    const email = validateEmail(input.customerEmail);
    if (!input.customerName || !input.customerName.trim()) {
      throw new ValidationError("Customer name is required.");
    }
    if (!input.shippingAddress || !input.shippingAddress.line1 || !input.shippingAddress.city) {
      throw new ValidationError("Valid shipping address is required.");
    }
    if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
      throw new ValidationError("Order must contain at least one item.");
    }

    const { settings } = await storefrontRepository.getStorefrontData();

    // 1. Recalculate line items strictly from canonical products.json
    let subtotal = 0;
    const orderItems: AdminOrderItem[] = [];

    for (const item of input.items) {
      validateSafeId(item.productId, "Product ID");
      if (!item.quantity || item.quantity <= 0) {
        throw new ValidationError("Invalid quantity for product item.");
      }

      const product = await productsRepository.getProductById(item.productId);
      if (!product) {
        throw new ValidationError(`Product ${item.productId} not found in catalog.`);
      }

      // Check variant price override or base price
      let unitPrice = product.price;
      let sku = product.sku;
      let variantColor = item.colorName;
      let variantSize = item.sizeName;

      if (item.variantSku && product.variants && product.variants.length > 0) {
        const variant = product.variants.find((v) => v.sku === item.variantSku);
        if (variant) {
          sku = variant.sku;
          variantColor = variant.colorName || variantColor;
          variantSize = variant.sizeName || variantSize;
          if (variant.priceOverride) {
            unitPrice = variant.priceOverride;
          }
        }
      }

      // Decrement stock in canonical storage
      await inventoryRepository.adjustInventory(
        product.id,
        item.variantSku,
        -item.quantity,
        `Demo Order Purchase by ${input.customerName}`,
        "Demo Concierge"
      );

      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      const primaryImg =
        typeof product.images?.[0] === "string"
          ? product.images[0]
          : (product.images?.[0] as any)?.url || "/images/placeholder.jpg";

      orderItems.push({
        productId: product.id,
        title: product.name,
        sku,
        image: primaryImg,
        color: variantColor,
        size: variantSize,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    // 2. Promotion verification
    let discount = 0;
    if (input.promotionCode) {
      const promo = await promotionsRepository.getPromotionByCode(input.promotionCode);
      if (promo && promo.isActive) {
        const now = Date.now();
        const start = new Date(promo.startDate).getTime();
        const end = new Date(promo.endDate).getTime();

        if (now >= start && now <= end) {
          if (!promo.minOrderValue || subtotal >= promo.minOrderValue) {
            if (promo.type === "percentage") {
              discount = Math.round((subtotal * promo.value) / 100);
            } else {
              discount = promo.value;
            }
            if (promo.maxDiscount && discount > promo.maxDiscount) {
              discount = promo.maxDiscount;
            }
          }
        }
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const taxRate = settings.taxRate || 12;
    const tax = Math.round((discountedSubtotal * taxRate) / 100);

    const isWhiteGlove = input.deliveryMethod === "white-glove";
    const isFreeShipping = discountedSubtotal >= (settings.freeShippingThreshold || 50000);
    const shipping = isWhiteGlove ? 1500 : isFreeShipping ? 0 : settings.standardShippingFee || 1500;

    const total = discountedSubtotal + tax + shipping;

    const orderNumber = `PAB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = `ord_${Date.now()}`;

    const newOrder: AdminOrder = {
      id: orderId,
      orderNumber,
      customerName: input.customerName.trim(),
      customerEmail: email,
      customerPhone: input.customerPhone,
      items: orderItems,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      currency: settings.currency || "INR",
      paymentStatus: "paid",
      fulfillmentStatus: "unfulfilled",
      status: "confirmed",
      createdAt: new Date().toISOString(),
      shippingAddress: input.shippingAddress,
      notes: `Demo acquisition via ${input.paymentMethod || "card"} · ${input.deliveryMethod || "express"} delivery`,
    };

    // 3. Save order into data/orders.json
    await ordersRepository.createOrder(newOrder);

    // 4. Update or create customer in data/customers.json
    try {
      const existingCustomer = await customersRepository.getCustomerByEmail(email);
      if (existingCustomer) {
        await customersRepository.updateCustomer(existingCustomer.id, {
          totalOrders: existingCustomer.totalOrders + 1,
          totalSpent: existingCustomer.totalSpent + total,
          lastOrderDate: newOrder.createdAt,
        });
      } else {
        const newCustomer: AdminCustomer = {
          id: `cust_${Date.now()}`,
          name: input.customerName.trim(),
          email,
          phone: input.customerPhone || "+91 98765 00000",
          totalOrders: 1,
          totalSpent: total,
          lastOrderDate: newOrder.createdAt,
          status: total > 200000 ? "vip" : "active",
          city: input.shippingAddress.city,
          country: input.shippingAddress.country || "India",
          joinedAt: newOrder.createdAt,
        };

        await customersRepository.createCustomer(newCustomer);
      }
    } catch (custErr) {
      logger.warn("CUSTOMERS", "Could not update customer record during order creation", {
        error: String(custErr),
      });
    }

    // 5. Append audit log in data/audit-logs.json
    await auditLogsRepository.logAction(
      "ORDER_CREATED",
      `Order #${orderNumber}`,
      `Created demo order for ${input.customerName} (${orderItems.length} items, total ₹${total.toLocaleString("en-IN")})`,
      "Demo Customer"
    );

    logger.info("CHECKOUT", "Demo order successfully created and persisted to JSON", {
      orderId,
      orderNumber,
      total,
    });

    return {
      success: true,
      orderId,
      orderNumber,
      order: newOrder,
    };
  } catch (error: unknown) {
    logger.error("CHECKOUT", "Failed to create demo order", {
      error: (error as Error)?.message,
    });
    const sanitized = sanitizeErrorForClient(error);
    return {
      success: false,
      error: sanitized.error.message,
    };
  }
}
