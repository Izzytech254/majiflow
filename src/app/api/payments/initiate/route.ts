import { NextResponse } from "next/server";
import { reportFailure } from "@/lib/monitoring";
import { initiatePayment, PaymentError } from "@/lib/server/payments";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = body as { orderIds?: string[]; phone?: string; method?: string; idempotencyKey?: string };

  try {
    const result = await initiatePayment({
      orderIds: Array.isArray(input.orderIds) ? input.orderIds : [],
      phone: typeof input.phone === "string" ? input.phone : "",
      method: (input.method as "mpesa" | "card" | "cod") ?? "mpesa",
      idempotencyKey: typeof input.idempotencyKey === "string" ? input.idempotencyKey : "",
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof PaymentError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    await reportFailure("payments.initiate.failed", error);
    return NextResponse.json({ error: "Could not initiate payment." }, { status: 500 });
  }
}
