import type { Order } from "@/lib/types";

/**
 * Order data layer.
 *
 * Currently persists orders to localStorage so the whole purchase flow
 * (checkout → payment → confirmation → tracking) works end to end without a
 * backend. Swap these functions for API calls when the backend lands — the
 * Order type is the contract.
 */

const ORDERS_KEY = "mf:orders";

function readOrders(): Record<string, Order> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(ORDERS_KEY) ?? "{}") as Record<string, Order>;
  } catch {
    return {};
  }
}

function writeOrders(orders: Record<string, Order>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* noop */
  }
}

export function generateOrderNumber() {
  return `MF-${Math.floor(10000 + Math.random() * 89999)}`;
}

/** Persist an order and return it as stored. */
export async function createOrder(input: Order): Promise<Order> {
  const orders = readOrders();
  orders[input.id] = input;
  writeOrders(orders);
  return input;
}

/** Fetch a single order. */
export async function fetchOrder(id: string): Promise<Order | null> {
  const orders = readOrders();
  return orders[id] ?? null;
}

/** Fetch all orders for the current device (mock customer order history). */
export async function fetchOrders(): Promise<Order[]> {
  const orders = readOrders();
  return Object.values(orders).sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}

/** Update order status / payment state (used by demo controls & tracking). */
export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | null> {
  const orders = readOrders();
  if (!orders[id]) return null;
  orders[id] = { ...orders[id], ...patch };
  writeOrders(orders);
  return orders[id];
}

export const DEMO_ORDER: Order = {
  id: "demo-track",
  orderNumber: "MF-98121",
  businessId: "bio-water-kasarani",
  businessName: "BioWater Refill Station",
  customerName: "Jane Wanjiku",
  customerPhone: "+254 712 345 678",
  items: [
    { productId: "bw-refill-20", name: "Refill — 20L can", quantity: 2, unitPrice: 350 },
  ],
  subtotal: 700,
  deliveryFee: 120,
  total: 820,
  payment: "mpesa",
  paymentState: "success",
  status: "out_for_delivery",
  address: {
    label: "Home",
    estate: "Kasarani",
    street: "Mwiki Road",
    building: "Singa Court, Block B",
    floor: "3rd floor",
    notes: "Call on arrival at the gate",
    phone: "+254 712 345 678",
  },
  placedAt: "2026-09-21T10:42:00.000Z",
  eta: "11:25",
};