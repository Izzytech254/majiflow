import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "accepted",
  "out_for_delivery",
  "delivered",
  "rejected",
  "cancelled",
];

export function isOrderStatus(v: unknown): v is OrderStatus {
  return typeof v === "string" && (STATUSES as string[]).includes(v);
}

/** Advance one step along the fulfilment path (used by vendor dashboards). */
export function nextStatus(status: OrderStatus): OrderStatus {
  if (status === "pending") return "accepted";
  if (status === "accepted") return "out_for_delivery";
  if (status === "out_for_delivery") return "delivered";
  return status;
}

export function isActiveStatus(status: OrderStatus) {
  return status === "pending" || status === "accepted" || status === "out_for_delivery";
}
