import { promises as fs } from "node:fs";
import path from "node:path";
import type { Order, OrderLocation, OrderStatus } from "@/lib/types";

/**
 * File-backed order store.
 *
 * Orders live in `.data/orders.json` (gitignored) so the whole flow —
 * customer checkout → vendor dashboard → live tracking → platform admin —
 * works across tabs and devices without an external database. Every read
 * and write is serialized through a single queue.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

const LOCATION_HISTORY_CAP = 300;

const VALID_STATUS: OrderStatus[] = [
  "pending",
  "accepted",
  "out_for_delivery",
  "delivered",
  "rejected",
  "cancelled",
];

const SEED: Order = {
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
  eta: "≈ 50 min",
  timeline: [
    { status: "pending", at: "2026-09-21T10:42:00.000Z" },
    { status: "accepted", at: "2026-09-21T10:43:12.000Z" },
    { status: "out_for_delivery", at: "2026-09-21T10:51:40.000Z" },
  ],
  location: null,
  locationHistory: [],
};

let queue: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<Record<string, Order>> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf8");
    const parsed = JSON.parse(raw) as Record<string, Order>;
    if (!parsed["demo-track"]) parsed["demo-track"] = structuredClone(SEED);
    return parsed;
  } catch {
    return { "demo-track": structuredClone(SEED) };
  }
}

async function persist(orders: Record<string, Order>) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

/** Serialize a read-modify-write cycle against the order file. */
function mutate<T>(fn: (orders: Record<string, Order>) => T | Promise<T>): Promise<T> {
  const run = async () => {
    const orders = await readAll();
    const result = await fn(orders);
    await persist(orders);
    return result;
  };
  const next = queue.then(run, run);
  queue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function readOnly<T>(fn: (orders: Record<string, Order>) => T | Promise<T>): Promise<T> {
  const run = () => readAll().then(fn);
  const next = queue.then(run, run);
  queue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function clone(order: Order): Order {
  return JSON.parse(JSON.stringify(order)) as Order;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function isStatus(v: unknown): v is OrderStatus {
  return typeof v === "string" && (VALID_STATUS as string[]).includes(v);
}

/**
 * Validate an untrusted create payload. Returns a normalized order or null
 * when required fields are missing/invalid.
 */
export function sanitizeOrder(input: unknown): Order | null {
  if (typeof input !== "object" || input === null) return null;
  const o = input as Record<string, unknown>;

  if (typeof o.businessId !== "string" || !o.businessId.trim()) return null;
  if (typeof o.businessName !== "string" || !o.businessName.trim()) return null;
  if (typeof o.customerName !== "string" || !o.customerName.trim()) return null;
  if (typeof o.customerPhone !== "string" || !o.customerPhone.trim()) return null;
  if (!isFiniteNumber(o.subtotal) || o.subtotal < 0) return null;
  if (!isFiniteNumber(o.deliveryFee) || o.deliveryFee < 0) return null;
  if (!isFiniteNumber(o.total) || o.total < 0) return null;
  if (o.payment !== "mpesa" && o.payment !== "card") return null;
  if (o.paymentState !== "pending" && o.paymentState !== "success" && o.paymentState !== "failed")
    return null;
  if (!isStatus(o.status)) return null;
  if (typeof o.placedAt !== "string" || Number.isNaN(Date.parse(o.placedAt))) return null;

  if (!Array.isArray(o.items) || o.items.length === 0) return null;
  const items = [];
  for (const raw of o.items) {
    if (typeof raw !== "object" || raw === null) return null;
    const item = raw as Record<string, unknown>;
    if (typeof item.productId !== "string" || !item.productId.trim()) return null;
    if (typeof item.name !== "string" || !item.name.trim()) return null;
    if (!isFiniteNumber(item.quantity) || item.quantity <= 0) return null;
    if (!isFiniteNumber(item.unitPrice) || item.unitPrice < 0) return null;
    items.push({
      productId: item.productId,
      name: item.name,
      quantity: Math.round(item.quantity),
      unitPrice: item.unitPrice,
    });
  }

  if (typeof o.address !== "object" || o.address === null) return null;
  const a = o.address as Record<string, unknown>;
  if (typeof a.estate !== "string" || typeof a.phone !== "string") return null;
  const address = {
    label: typeof a.label === "string" && a.label.trim() ? a.label : "Delivery",
    estate: a.estate,
    street: typeof a.street === "string" ? a.street : undefined,
    building: typeof a.building === "string" ? a.building : undefined,
    floor: typeof a.floor === "string" ? a.floor : undefined,
    notes: typeof a.notes === "string" ? a.notes : undefined,
    phone: a.phone,
  };

  return {
    id: typeof o.id === "string" && o.id.trim() ? o.id : `order-${Date.now()}`,
    orderNumber:
      typeof o.orderNumber === "string" && o.orderNumber.trim()
        ? o.orderNumber
        : generateOrderNumber(),
    businessId: o.businessId,
    businessName: o.businessName,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    items,
    subtotal: o.subtotal,
    deliveryFee: o.deliveryFee,
    total: o.total,
    payment: o.payment,
    paymentState: o.paymentState,
    status: o.status,
    address,
    placedAt: o.placedAt,
    eta: typeof o.eta === "string" ? o.eta : undefined,
    timeline: [{ status: o.status, at: o.placedAt }],
    location: null,
    locationHistory: [],
  };
}

export function generateOrderNumber() {
  return `MF-${Math.floor(10000 + Math.random() * 89999)}`;
}

export interface ListOptions {
  businessId?: string;
  status?: string;
  phone?: string;
}

export async function listOrders(opts: ListOptions = {}): Promise<Order[]> {
  return readOnly((orders) => {
    let list = Object.values(orders);
    if (opts.businessId) list = list.filter((o) => o.businessId === opts.businessId);
    if (opts.status) list = list.filter((o) => o.status === opts.status);
    if (opts.phone) {
      const needle = opts.phone.replace(/\s+/g, "");
      list = list.filter((o) => o.customerPhone.replace(/\s+/g, "").includes(needle));
    }
    return list
      .sort((a, b) => b.placedAt.localeCompare(a.placedAt))
      .map(clone);
  });
}

export async function getOrder(id: string): Promise<Order | null> {
  return readOnly((orders) => (orders[id] ? clone(orders[id]) : null));
}

export async function createOrder(input: Order): Promise<Order> {
  return mutate((orders) => {
    let id = input.id;
    if (orders[id]) id = `${input.id}-${Math.random().toString(36).slice(2, 7)}`;
    const order: Order = {
      ...input,
      id,
      timeline: input.timeline?.length ? input.timeline : [{ status: input.status, at: input.placedAt }],
      location: input.location ?? null,
      locationHistory: input.locationHistory ?? [],
    };
    orders[id] = order;
    return clone(order);
  });
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | null> {
  return mutate((orders) => {
    const existing = orders[id];
    if (!existing) return null;
    const next: Order = { ...existing, ...patch, id: existing.id };
    if (patch.status && patch.status !== existing.status) {
      next.timeline = [...(existing.timeline ?? []), { status: patch.status, at: new Date().toISOString() }];
    } else {
      next.timeline = existing.timeline;
    }
    next.location = patch.location !== undefined ? patch.location : existing.location;
    next.locationHistory =
      patch.locationHistory !== undefined ? patch.locationHistory : existing.locationHistory;
    orders[id] = next;
    return clone(next);
  });
}

export async function recordLocation(id: string, loc: OrderLocation): Promise<Order | null> {
  return mutate((orders) => {
    const existing = orders[id];
    if (!existing) return null;
    const history = [...(existing.locationHistory ?? []), loc].slice(-LOCATION_HISTORY_CAP);
    orders[id] = { ...existing, location: loc, locationHistory: history };
    return clone(orders[id]);
  });
}
