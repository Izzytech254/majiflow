import { randomUUID } from "node:crypto";
import { OrderValidationError } from "@/lib/orders";
import type { CartItem, DeliveryAddress, Order, OrderStatus, PaymentMethod } from "@/lib/types";
import { businesses } from "@/lib/data/businesses";

export { OrderValidationError };

export class OrderNotFoundError extends Error {
  constructor(id: string) {
    super(`Order ${id} was not found`);
    this.name = "OrderNotFoundError";
  }
}

export interface CreateOrderInput {
  businessId: string;
  items: CartItem[];
  address: DeliveryAddress;
  payment: PaymentMethod;
  fulfillment: "delivery" | "pickup";
}

const BUSINESS_MAP = new Map(businesses.map((business) => [business.id, business]));

function money(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function nowIso(): string {
  return new Date().toISOString();
}

const orders = new Map<string, Order>();

function assertValid(input: CreateOrderInput) {
  if (!input.businessId?.trim()) throw new OrderValidationError("Select a station.", { businessId: "Select a station." });
  if (!BUSINESS_MAP.has(input.businessId)) throw new OrderValidationError("Select a valid station.", { businessId: "Select a valid station." });
  if (!Array.isArray(input.items) || input.items.length === 0) throw new OrderValidationError("Add items to your cart.", { items: "Add items to your cart." });
  if (!input.address?.estate?.trim()) throw new OrderValidationError("Add a delivery address.", { address: "Add a delivery address." });
  if (typeof input.address.lat !== "number" || typeof input.address.lng !== "number") {
    throw new OrderValidationError("Add a delivery location.", { address: "Add a delivery location." });
  }
  if (input.payment !== "mpesa" && input.payment !== "card" && input.payment !== "cod") {
    throw new OrderValidationError("Choose a payment method.", { payment: "Choose a payment method." });
  }
  if (input.fulfillment !== "delivery" && input.fulfillment !== "pickup") {
    throw new OrderValidationError("Choose a fulfillment method.", { fulfillment: "Choose a fulfillment method." });
  }
}

export function validateOrder(body: unknown): { order?: Order; errors?: Record<string, string> } {
  try {
    if (!body || typeof body !== "object") throw new OrderValidationError("Invalid order payload", { _form: "Invalid order payload" });
    const input = body as Partial<CreateOrderInput> & { items?: CartItem[]; customerUserId?: string };
    if (!Array.isArray(input.items) || input.items.length === 0) {
      throw new OrderValidationError("Add items to your cart.", { items: "Add items to your cart." });
    }
    if (!input.businessId) throw new OrderValidationError("Select a station.", { businessId: "Select a station." });
    if (!input.address?.estate) throw new OrderValidationError("Add a delivery address.", { address: "Add a delivery address." });
    if (!input.payment) throw new OrderValidationError("Choose a payment method.", { payment: "Choose a payment method." });
    if (!input.fulfillment) throw new OrderValidationError("Choose a fulfillment method.", { fulfillment: "Choose a fulfillment method." });
    const id = randomUUID();
    const now = nowIso();
    const business = BUSINESS_MAP.get(input.businessId)!;
    const items = input.items.map((item) => ({ ...item }));
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = input.fulfillment === "delivery" ? (business?.deliveryFee ?? 0) : 0;
    const total = money(subtotal + deliveryFee);
    const order: Order = {
      id,
      businessId: input.businessId,
      items,
      address: input.address as DeliveryAddress,
      payment: input.payment as PaymentMethod,
      subtotal,
      deliveryFee,
      total,
      status: "pending" as OrderStatus,
      paymentState: input.payment === "cod" ? "unpaid" : "unpaid",
      fulfillment: input.fulfillment as "delivery" | "pickup",
      createdAt: now,
      updatedAt: now,
      customerUserId: input.customerUserId,
    };
    return { order };
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return { errors: error.fields };
    }
    return { errors: { _form: "Invalid order payload" } };
  }
}

export async function createOrder(order: Order): Promise<{ order: Order; created: boolean }> {
  const input: CreateOrderInput = {
    businessId: order.businessId,
    items: order.items,
    address: order.address,
    payment: order.payment,
    fulfillment: order.fulfillment,
  };
  assertValid(input);
  if (orders.has(order.id)) {
    return { order: orders.get(order.id)!, created: false };
  }
  const business = BUSINESS_MAP.get(order.businessId)!;
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = order.fulfillment === "delivery" ? business.deliveryFee : 0;
  const total = money(subtotal + deliveryFee);
  const now = nowIso();
  const stored: Order = {
    ...order,
    id: order.id || randomUUID(),
    subtotal,
    deliveryFee,
    total,
    status: order.status || "pending",
    paymentState: order.payment === "cod" ? "unpaid" : order.paymentState || "unpaid",
    createdAt: order.createdAt || now,
    updatedAt: now,
  };
  orders.set(stored.id, stored);
  return { order: stored, created: true };
}

export async function getOrder(id: string): Promise<Order | null> {
  return orders.get(id) ?? null;
}

export async function listOrders(filters?: { businessId?: string; status?: string; phone?: string }): Promise<Order[]> {
  let result = Array.from(orders.values());
  if (filters?.businessId) {
    result = result.filter((order) => order.businessId === filters.businessId);
  }
  if (filters?.status) {
    result = result.filter((order) => order.status === filters.status);
  }
  return result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function listOrdersForUser(userId: string): Promise<Order[]> {
  void userId;
  return [];
}

export async function cancelOrder(id: string): Promise<Order> {
  const order = orders.get(id);
  if (!order) throw new OrderNotFoundError(id);
  const updated = { ...order, status: "cancelled" as OrderStatus, updatedAt: nowIso() };
  orders.set(id, updated);
  return updated;
}

export async function updateOrderLocation(
  id: string,
  location: { lat: number; lng: number },
  history?: Array<{ lat: number; lng: number; at: string }>
): Promise<Order> {
  const order = orders.get(id);
  if (!order) throw new OrderNotFoundError(id);
  const updated = {
    ...order,
    location: { ...location, at: nowIso() },
    locationHistory: history ?? order.locationHistory ?? [],
    updatedAt: nowIso(),
  };
  orders.set(id, updated);
  return updated;
}

export async function updateOrderConsent(id: string, consent: { location?: boolean }): Promise<Order> {
  const order = orders.get(id);
  if (!order) throw new OrderNotFoundError(id);
  const updated = { ...order, consent: { ...(order.consent ?? {}), ...consent }, updatedAt: nowIso() };
  orders.set(id, updated);
  return updated;
}

export function publicOrder(order: Order): Order {
  return order;
}

export function staffOrder(order: Order): Order {
  return order;
}

export async function applyOrderRetention(): Promise<void> {
  return;
}

export async function setOrderReorderSource(_orderId: string, _sourceOrderId: string): Promise<void> {
  return;
}

export async function getReorderSourceOrderId(_orderId: string): Promise<string | null> {
  return null;
}

export async function detachCustomerOrders(userId: string): Promise<void> {
  void userId;
  return;
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
  const order = orders.get(id);
  if (!order) throw new OrderNotFoundError(id);
  const updated = { ...order, ...updates, updatedAt: nowIso() };
  orders.set(id, updated);
  return updated;
}

export async function transitionOrder(id: string, status: OrderStatus): Promise<Order> {
  const order = orders.get(id);
  if (!order) throw new OrderNotFoundError(id);
  const updated = { ...order, status, updatedAt: nowIso() };
  orders.set(id, updated);
  return updated;
}

export async function findOrderById(id: string): Promise<Order | null> {
  return orders.get(id) ?? null;
}

export async function listOrdersForCustomer(userId: string): Promise<Order[]> {
  return Array.from(orders.values()).filter((o) => o.customerUserId === userId);
}

export async function saveOrder(order: Order): Promise<Order> {
  const updated = { ...order, updatedAt: nowIso() };
  orders.set(updated.id, updated);
  return updated;
}

export async function setOrderRefund(id: string, refund: unknown): Promise<Order> {
  const order = orders.get(id);
  if (!order) throw new OrderNotFoundError(id);
  const updated = { ...order, updatedAt: nowIso() };
  orders.set(id, updated);
  void refund;
  return updated;
}

export async function markOrderPayment(id: string, paymentState: "paid" | "unpaid" | "processing" | "failed" | "refunded"): Promise<Order> {
  const order = orders.get(id);
  if (!order) throw new OrderNotFoundError(id);
  const updated = { ...order, paymentState, updatedAt: nowIso() };
  orders.set(id, updated);
  return updated;
}

export async function recordLocation(id: string, location: { lat: number; lng: number; at?: string }, history?: Array<{ lat: number; lng: number; at: string }>): Promise<Order> {
  return updateOrderLocation(id, location, history);
}

export async function getOrdersByBusiness(businessId: string): Promise<Order[]> {
  return listOrders({ businessId });
}

export const locationBlockReason = "location unavailable" as const;

export function canPlaceOrder() {
  return { ok: true };
}

export async function findOrderByRiderToken(token: string): Promise<Order | null> {
  void token;
  return null;
}

export async function getCustomerOrder(userId: string, orderId: string): Promise<Order | null> {
  const order = orders.get(orderId);
  if (!order) return null;
  if (order.customerUserId && order.customerUserId !== userId) return null;
  return order;
}

export { normalizePhone } from "@/lib/server/payments";
