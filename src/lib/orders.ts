import type { Order, OrderLocation, OrderStatus } from "@/lib/types";

/**
 * Order data layer.
 *
 * Thin client over the `/api/orders` route handlers (file-backed store in
 * `.data/orders.json`), so orders persist across tabs and devices and are
 * visible to the vendor dashboard and the platform admin in real time.
 */

const BASE = "/api/orders";

/** Raised when the server rejects an order with actionable, field-level errors. */
export class OrderValidationError extends Error {
  readonly fields: Record<string, string>;
  constructor(message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = "OrderValidationError";
    this.fields = fields;
  }
}

export interface OrderQuery {
  businessId?: string;
  status?: OrderStatus | string;
  phone?: string;
}

export function generateOrderNumber() {
  return `MF-${Math.floor(10000 + Math.random() * 89999)}`;
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Persist an order server-side. Throws `OrderValidationError` (with per-field
 * errors) or a generic `Error` when the server rejects the request, so callers
 * never mistake a failed request for a placed order.
 */
export async function createOrder(input: Order): Promise<Order> {
  let res: Response;
  try {
    res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error("Could not reach the order service. Check your connection and retry.");
  }
  if (!res.ok) {
    let detail: { error?: string; fields?: Record<string, string> } = {};
    try {
      detail = (await res.json()) as typeof detail;
    } catch {
      /* ignore unparseable body */
    }
    throw new OrderValidationError(
      detail.error ?? "We couldn't place this order. Please review the highlighted fields.",
      detail.fields ?? {}
    );
  }
  const data = (await res.json()) as { order: Order };
  return data.order;
}

/** Fetch a single order. */
export async function fetchOrder(id: string): Promise<Order | null> {
  const data = await getJson<{ order: Order }>(`${BASE}/${encodeURIComponent(id)}`);
  return data?.order ?? null;
}

/** Fetch orders, optionally filtered by station / status / customer phone. */
export async function fetchOrders(query: OrderQuery = {}): Promise<Order[]> {
  const result = await fetchOrdersResult(query);
  return result.ok ? result.orders : [];
}

/**
 * Same fetch, but the caller can tell "the station has no orders" apart from
 * "the store could not be reached" so screens can show an error instead of a
 * misleading empty table.
 */
export async function fetchOrdersResult(
  query: OrderQuery = {}
): Promise<{ ok: true; orders: Order[] } | { ok: false }> {
  const params = new URLSearchParams();
  if (query.businessId) params.set("businessId", query.businessId);
  if (query.status) params.set("status", query.status);
  if (query.phone) params.set("phone", query.phone);
  const qs = params.toString();
  try {
    const res = await fetch(`${BASE}${qs ? `?${qs}` : ""}`, { cache: "no-store" });
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as { orders: Order[] };
    return { ok: true, orders: data.orders ?? [] };
  } catch {
    return { ok: false };
  }
}

/** Update order status / payment state (vendor actions). */
export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | null> {
  try {
    const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { order: Order };
    return data.order;
  } catch {
    return null;
  }
}

/** Stream the customer's live GPS fix for an order. */
export async function postLocation(id: string, location: OrderLocation): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/${encodeURIComponent(id)}/location`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface OrderLocationSnapshot {
  location: OrderLocation | null;
  history: OrderLocation[];
  status: OrderStatus;
}

/** Read the latest live location for an order (vendor / admin views). */
export async function fetchOrderLocation(id: string): Promise<OrderLocationSnapshot | null> {
  return getJson<OrderLocationSnapshot>(`${BASE}/${encodeURIComponent(id)}/location`);
}
