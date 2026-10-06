import type { NextRequest } from "next/server";
import { createOrder, listOrders, sanitizeOrder } from "@/lib/server/order-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const orders = await listOrders({
    businessId: searchParams.get("businessId") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    phone: searchParams.get("phone") ?? undefined,
  });
  return Response.json({ orders });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const order = sanitizeOrder(body);
  if (!order) {
    return Response.json({ error: "Invalid order payload" }, { status: 400 });
  }
  const created = await createOrder(order);
  return Response.json({ order: created }, { status: 201 });
}
