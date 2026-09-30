import { AdminOrder, OrderStatus } from "@/types/admin";
import { readJsonFile, readJsonFileSync, writeJsonFile } from "./baseJsonStorage";
import { ValidationError } from "@/lib/errors";

const FILENAME = "orders.json";

export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["delivered", "returned"],
  delivered: ["returned", "refunded"],
  returned: ["refunded"],
  cancelled: [],
  refunded: [],
};

function validateOrders(orders: AdminOrder[]): void {

  const seenIds = new Set<string>();
  orders.forEach((o, idx) => {
    if (!o.id) {
      throw new Error(`[Validation Error] Order at index ${idx} is missing mandatory ID.`);
    }
    if (seenIds.has(o.id)) {
      console.warn(`[Validation Warning] Duplicate Order ID: ${o.id}`);
    }
    seenIds.add(o.id);
  });
}

export const ordersRepository = {
  async getOrders(): Promise<AdminOrder[]> {
    const list = await readJsonFile<AdminOrder[]>(FILENAME, []);
    validateOrders(list);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getOrdersSync(): AdminOrder[] {
    const list = readJsonFileSync<AdminOrder[]>(FILENAME, []);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getOrderById(id: string): Promise<AdminOrder | undefined> {
    const list = await this.getOrders();
    return list.find((o) => o.id === id);
  },

  async createOrder(newOrder: AdminOrder): Promise<AdminOrder> {
    const list = await this.getOrders();
    const updated = [newOrder, ...list];
    validateOrders(updated);
    await writeJsonFile(FILENAME, updated);
    return newOrder;
  },

  async updateOrder(id: string, updates: Partial<AdminOrder>): Promise<AdminOrder> {
    const list = await this.getOrders();
    const index = list.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Order ${id} not found.`);

    const updated: AdminOrder = {
      ...list[index],
      ...updates,
      id,
    };
    list[index] = updated;
    validateOrders(list);
    await writeJsonFile(FILENAME, list);
    return updated;
  },

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    trackingNumber?: string,
    carrier?: string
  ): Promise<AdminOrder> {
    const list = await this.getOrders();
    const index = list.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Order ${id} not found.`);

    const currentStatus = list[index].status;
    if (currentStatus !== status) {
      const allowedNext = VALID_ORDER_TRANSITIONS[currentStatus] || [];
      if (!allowedNext.includes(status)) {
        throw new ValidationError(
          `Invalid order status transition from "${currentStatus}" to "${status}". Allowed: ${allowedNext.join(", ") || "None (terminal state)"}`
        );
      }
    }

    const updated: AdminOrder = {
      ...list[index],
      status,
      ...(trackingNumber !== undefined && { trackingNumber }),
      ...(carrier !== undefined && { carrier }),
      ...(status === "shipped" && { fulfillmentStatus: "fulfilled" as const }),
      ...(status === "delivered" && { fulfillmentStatus: "fulfilled" as const }),
      ...(status === "refunded" && { paymentStatus: "refunded" as const }),
    };
    list[index] = updated;
    validateOrders(list);
    await writeJsonFile(FILENAME, list);
    return updated;
  },


  async deleteOrder(id: string): Promise<boolean> {
    const list = await this.getOrders();
    const filtered = list.filter((o) => o.id !== id);
    if (filtered.length === list.length) return false;
    await writeJsonFile(FILENAME, filtered);
    return true;
  },
};
