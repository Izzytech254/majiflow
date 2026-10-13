import type { NextRequest } from "next/server";
import { reportFailure } from "@/lib/monitoring";
import { createOrder, listOrders, validateOrder } from "@/lib/server/order-store";

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
  const { order, errors } = validateOrder(body);
  if (!order || errors) {
    return Response.json(
      {
        error: "Please fix the highlighted fields and try again.",
        fields: errors ?? { _form: "Invalid order payload" },
      },
      { status: 422 }
    );
  }
  try {
    const { order: created, created: isNew } = await createOrder(order);
    return Response.json({ order: created }, { status: isNew ? 201 : 200 });
  } catch (error) {
    await reportFailure("order", "Could not save an order.", {
      businessId: order.businessId,
      reason: error instanceof Error ? error.message : "unknown",
    });
    return Response.json(
      { error: "We could not save your order. Please try again." },
      { status: 500 }
    );
  }
}
