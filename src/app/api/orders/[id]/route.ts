import { getOrder, updateOrder } from "@/lib/server/order-store";
import { isOrderStatus } from "@/lib/order-status";

export const dynamic = "force-dynamic";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, ctx: Context) {
  const { id } = await ctx.params;
  const order = await getOrder(id);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  return Response.json({ order });
}

const PATCHABLE = new Set(["status", "eta", "paymentState"]);

export async function PATCH(request: Request, ctx: Context) {
  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Invalid patch" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (!PATCHABLE.has(key)) continue;
    if (key === "status" && !isOrderStatus(value)) {
      return Response.json({ error: "Unknown status" }, { status: 400 });
    }
    if (key === "paymentState" && value !== "pending" && value !== "success" && value !== "failed") {
      return Response.json({ error: "Unknown payment state" }, { status: 400 });
    }
    if (key === "eta" && typeof value !== "string") {
      return Response.json({ error: "ETA must be a string" }, { status: 400 });
    }
    patch[key] = value;
  }
  if (Object.keys(patch).length === 0) {
    return Response.json({ error: "No patchable fields supplied" }, { status: 400 });
  }

  const order = await updateOrder(id, patch);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  return Response.json({ order });
}
