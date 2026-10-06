import { getOrder, recordLocation } from "@/lib/server/order-store";
import type { OrderLocation } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, ctx: Context) {
  const { id } = await ctx.params;
  const order = await getOrder(id);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  return Response.json({
    location: order.location ?? null,
    history: order.locationHistory ?? [],
    status: order.status,
  });
}

function parseLocation(body: unknown): OrderLocation | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  if (typeof b.lat !== "number" || !Number.isFinite(b.lat)) return null;
  if (typeof b.lng !== "number" || !Number.isFinite(b.lng)) return null;
  if (b.lat < -90 || b.lat > 90 || b.lng < -180 || b.lng > 180) return null;
  const accuracy =
    typeof b.accuracy === "number" && Number.isFinite(b.accuracy) && b.accuracy >= 0
      ? b.accuracy
      : undefined;
  const at =
    typeof b.at === "string" && !Number.isNaN(Date.parse(b.at)) ? b.at : new Date().toISOString();
  return { lat: b.lat, lng: b.lng, accuracy, at };
}

export async function POST(request: Request, ctx: Context) {
  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const location = parseLocation(body);
  if (!location) {
    return Response.json({ error: "Invalid location payload" }, { status: 400 });
  }
  const order = await recordLocation(id, location);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  return Response.json({ location: order.location, status: order.status }, { status: 201 });
}
