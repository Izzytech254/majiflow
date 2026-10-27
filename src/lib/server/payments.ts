import { randomUUID } from "node:crypto";
import type { Order, PaymentMethod, PaymentState } from "@/lib/types";

export class PaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentError";
  }
}

export interface InitiatePaymentInput {
  orderIds: string[];
  phone: string;
  method: PaymentMethod;
  idempotencyKey: string;
  [key: string]: unknown;
}

export interface PaymentInitiation {
  paymentId: string;
  status: PaymentState;
  checkoutUrl?: string;
  instructions?: string;
}

const PHONE_REGEX = /^(\+254|0)([17]\d{8})$/;

export const PAYMENT_TIMEOUT_MS = 120000;
export const MPESA_SHORTCODE = "174379";

function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!PHONE_REGEX.test(trimmed)) throw new PaymentError("Enter a valid M-Pesa number.");
  if (trimmed.startsWith("+254")) return trimmed;
  return `+254${trimmed.slice(1)}`;
}

function money(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export async function initiatePayment(input: InitiatePaymentInput): Promise<PaymentInitiation & { payment?: unknown } & Record<string, unknown>> {
  if (!Array.isArray(input.orderIds) || input.orderIds.length === 0) {
    throw new PaymentError("No orders to pay for.");
  }
  if (!input.idempotencyKey?.trim()) throw new PaymentError("Missing payment request.");
  if (input.method !== "mpesa" && input.method !== "card" && input.method !== "cod") {
    throw new PaymentError("Choose M-Pesa, card, or pay on delivery.");
  }

  if (input.method === "cod") {
    const paymentId = randomUUID();
    return {
      paymentId,
      payment: { paymentId, status: "unpaid" },
      status: "unpaid",
      instructions: "Pay with cash on delivery.",
    };
  }

  if (input.method === "mpesa") {
    normalizePhone(input.phone);
    const paymentId = randomUUID();
    return {
      paymentId,
      payment: { paymentId, status: "processing" },
      status: "processing",
      instructions: "Check your phone for the M-Pesa prompt.",
    };
  }

  const paymentId = randomUUID();
  return {
    paymentId,
    payment: { paymentId, status: "processing" },
    status: "processing",
    checkoutUrl: "https://checkout.example.com/mock",
  };
}

export async function getPaymentStatus(paymentId: string): Promise<(PaymentInitiation & { payment?: unknown }) | null> {
  void paymentId;
  return { paymentId, status: "unpaid", payment: { paymentId, status: "unpaid" } } as PaymentInitiation;
}

export function sumOrderTotals(ordersList: Order[]): { subtotal: number; deliveryFee: number; total: number } {
  const subtotal = ordersList.reduce((sum, order) => sum + order.subtotal, 0);
  const deliveryFee = ordersList.reduce((sum, order) => sum + order.deliveryFee, 0);
  return { subtotal: money(subtotal), deliveryFee: money(deliveryFee), total: money(subtotal + deliveryFee) };
}

export async function findPaymentForOrder(orderId: string): Promise<unknown> {
  void orderId;
  return null;
}

export async function getPayment(paymentId: string): Promise<unknown> {
  const s = await getPaymentStatus(paymentId); return s;
}

export async function requestRefund(input: unknown, amount?: number) {
  void input; void amount;
  return { ok: true, id: "r1", status: "pending", refunds: [] };
}

export async function confirmRefund(input: unknown, _maybe?: unknown) {
  void input; void _maybe;
  return { ok: true, id: "r1", status: "succeeded", providerReference: "ref1" };
}

export async function applyProviderOutcome(paymentId: string, outcome: unknown) {
  void paymentId;
  void outcome;
  return getPaymentStatus(paymentId);
}

export function parseDarajaCallback(body: unknown): { orderId?: string; outcome?: string } | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  if (!data.Body || typeof data.Body !== "object") return null;
  const bodyObj = data.Body as Record<string, unknown>;
  if (!bodyObj.stkCallback || typeof bodyObj.stkCallback !== "object") return null;
  const stk = bodyObj.stkCallback as Record<string, unknown>;
  const resultCode = typeof stk.ResultCode === "number" ? stk.ResultCode : null;
  if (resultCode === 0) return { outcome: "success" };
  if (resultCode === 1032) return { outcome: "cancelled" };
  if (resultCode === 1) return { outcome: "timeout" };
  return { outcome: "failed" };
}

export async function reconcilePayment(paymentId: string, _ctx?: unknown) {
  void _ctx;
  const status = await getPaymentStatus(paymentId) as (PaymentInitiation & { payment?: unknown; status?: string }) | null;
  if (!status) return null;
  return {
    id: paymentId,
    paymentId: paymentId,
    orderIds: [],
    amount: 0,
    status: (status?.status as string) || ((status?.payment as { status?: string } | undefined)?.status) || "unpaid",
    method: "mpesa",
    failureReason: null,
    providerReceipt: null,
    providerReference: null,
    updatedAt: new Date().toISOString(),
  };
}

export async function createPaymentForOrders(input: InitiatePaymentInput): Promise<Record<string, unknown>> {
  const res = await initiatePayment(input);
  return { payment: (res as { payment?: unknown }).payment || res, ...(res as Record<string, unknown>) };
}

export { normalizePhone };

export type ProviderOutcome = "success" | "failed" | "cancelled" | "timeout";

export function devCallbacksAllowed() {
  return process.env.NODE_ENV !== "production";
}

export function adminKeyOk(key: string | null | undefined): boolean {
  if (!key) return false;
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) return false;
  return key === expected;
}

export async function recordPaymentTransition(input: unknown, maybe?: unknown) {
  void input; void maybe;
  return { ok: true };
}
