"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Inbox,
  MapPin,
  Phone,
  RefreshCcw,
  Smartphone,
  Truck,
  XCircle,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { LoadingState, ErrorState } from "@/components/ui/feedback";
import { useCart } from "@/components/order/cart-provider";
import { useToast } from "@/components/ui/toast";
import { fetchOrder, updateOrder } from "@/lib/orders";
import { formatKES, formatPhone } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TrackOrderPage({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    let alive = true;
    fetchOrder(id).then((o) => {
      if (!alive) return;
      setOrder(o);
      setLoading(false);
    });
    const poll = window.setInterval(async () => {
      const o = await fetchOrder(id);
      if (alive && o) setOrder(o);
    }, 4000);
    return () => {
      alive = false;
      window.clearInterval(poll);
    };
  }, [id]);

  const setStatus = async (status: OrderStatus) => {
    const next = await updateOrder(id, { status });
    if (next) setOrder(next);
  };

  if (loading) {
    return (
      <Container className="py-20">
        <LoadingState label="Loading your order…" />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-20">
        <ErrorState
          title="Order not found"
          message="We couldn't find that order on this device. Check the link, or browse for a station to place a new order."
          action={
            <Link href="/browse">
              <Button size="lg">Browse stations</Button>
            </Link>
          }
        />
      </Container>
    );
  }

  const cancelled = order.status === "cancelled" || order.status === "rejected";
  const delivered = order.status === "delivered";

  const reorder = () => {
    order.items.forEach((item) =>
      addItem({ businessId: order.businessId, productId: item.productId, quantity: item.quantity })
    );
    toast({
      kind: "success",
      title: "Same order, added to cart",
      message: `${order.items.length} item${order.items.length > 1 ? "s" : ""} added. Check out when ready.`,
    });
  };

  return (
    <Container className="py-10 lg:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className={cn("size-1.5 rounded-full animate-pulse-dot", cancelled ? "bg-danger" : "bg-[#0052FF]")} />
            Order tracking · {order.orderNumber}
          </p>
          <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
            {delivered ? "Delivered" : cancelled ? "Order not dispatched" : `${order.businessName} is on it`}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" aria-hidden />
            Placed {new Date(order.placedAt).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}
            {order.eta && <span>· ETA {order.eta}</span>}
          </p>
        </div>
        <OrderStatusBadge status={order.status} className="text-sm" />
      </div>

      {cancelled && (
        <div className="mb-10 flex items-start gap-4 rounded-2xl border border-danger/25 bg-danger-soft/50 p-6">
          <XCircle className="mt-0.5 size-6 shrink-0 text-danger" aria-hidden />
          <div>
            <h2 className="font-display text-lg text-danger">
              {order.status === "rejected" ? "The station couldn't accept this order" : "This order was cancelled"}
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-foreground/80">
              Your payment of {formatKES(order.total)} was not released to the station and is being
              returned to your M-Pesa within 24 hours. Try another station nearby — there are
              usually several with water ready now.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/browse">
                <Button className="group">
                  Find another station
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </Link>
              <Button variant="secondary" onClick={reorder}>
                <RefreshCcw className="size-4" aria-hidden /> Retry this order elsewhere
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Timeline */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
          <h2 className="flex items-center gap-2.5 font-display text-lg text-foreground">
            <Truck className="size-5 text-[#0052FF]" aria-hidden /> Delivery progress
          </h2>
          <ol className="mt-8">
            {[
              { status: "accepted" as const, label: "Order accepted", desc: order.status === "pending" ? "The station will confirm shortly." : "The station confirmed and sealed your water." },
              { status: "out_for_delivery" as const, label: "Out for delivery", desc: "The rider is on the road and will call before arrival." },
              { status: "delivered" as const, label: "Delivered", desc: "Your refills are at the door — open a can and enjoy." },
            ].map((step, i) => {
              const reached =
                (order.status === "accepted" && i === 0) ||
                (order.status === "out_for_delivery" && i <= 1) ||
                order.status === "delivered";
              const current =
                (order.status === "accepted" && i === 0) ||
                (order.status === "out_for_delivery" && i === 1);
              return (
                <li key={step.status} className="relative flex gap-5 pb-10 last:pb-0">
                  {i < 2 && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-[23px] top-12 h-[calc(100%-2.4rem)] w-px",
                        reached && i < 1 || (order.status === "out_for_delivery" && i === 0) || order.status === "delivered"
                          ? "bg-brand-gradient"
                          : "bg-border"
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full text-white",
                      reached || current
                        ? "bg-brand-gradient shadow-accent"
                        : "border-2 border-border bg-white text-muted-foreground"
                    )}
                  >
                    {reached || (delivered && i === 2) ? (
                      <CheckCircle2 className="size-5" aria-hidden />
                    ) : current ? (
                      <span className="relative flex size-3">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-50" />
                        <span className="relative inline-flex size-3 rounded-full bg-white" />
                      </span>
                    ) : (
                      <Clock className="size-5" aria-hidden />
                    )}
                  </span>
                  <div className="pt-1.5">
                    <p className={cn("font-semibold", current || reached ? "text-foreground" : "text-muted-foreground")}>
                      {step.label}
                    </p>
                    <p className={cn("mt-1 text-sm leading-relaxed", current || reached ? "text-muted-foreground" : "text-muted-foreground/60")}>
                      {step.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {order.status === "pending" && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-warning/25 bg-warning-soft/50 p-4">
              <Inbox className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
              <p className="text-sm leading-relaxed text-foreground/85">
                <strong className="font-semibold text-foreground">Waiting for the station.</strong>{" "}
                Your payment of {formatKES(order.total)} is held safely and released to{" "}
                {order.businessName} only when your order is accepted.
              </p>
            </div>
          )}
        </section>

        {/* Order details */}
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <h2 className="font-display text-lg text-foreground">Order details</h2>
            <ul className="mt-4 space-y-2.5">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate text-muted-foreground">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="shrink-0 font-semibold text-foreground">
                    {formatKES(item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="text-foreground">{formatKES(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="text-foreground">
                  {order.deliveryFee === 0 ? "Free" : formatKES(order.deliveryFee)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <dt className="font-semibold text-foreground">Total</dt>
                <dd className="font-display text-xl text-foreground">{formatKES(order.total)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/60 px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Smartphone className="size-4 text-success" aria-hidden /> Paid via M-Pesa
              </span>
              <Badge variant="success">Payment successful</Badge>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
              <MapPin className="size-5 text-[#0052FF]" aria-hidden /> Delivery address
            </h2>
            <p className="mt-3 text-sm font-semibold text-foreground">{order.address.estate}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {[order.address.building, order.address.floor].filter(Boolean).join(" · ") || "No building info"}
            </p>
            {order.address.notes && (
              <p className="mt-2 text-xs italic text-muted-foreground">“{order.address.notes}”</p>
            )}
            <p className="mt-3 flex items-center gap-2 text-sm text-foreground/80">
              <Phone className="size-4 text-[#0052FF]" aria-hidden /> {formatPhone(order.customerPhone)}
            </p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={reorder} className="group">
              <RefreshCcw className="size-4" aria-hidden /> Reorder this
            </Button>
            <Link href="/account/orders" className="flex-1">
              <Button className="group w-full">
                View all orders
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>
          </div>

          {/* Demo controls */}
          <details className="rounded-2xl border border-dashed border-[#0052FF]/30 bg-[#0052FF]/3 p-4">
            <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-widest text-[#0052FF]">
              Demo controls — advance the delivery
            </summary>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => setStatus("pending")} disabled={order.status === "pending"}>
                Set pending
              </Button>
              <Button size="sm" onClick={() => setStatus("accepted")} disabled={order.status === "accepted"}>
                Accept
              </Button>
              <Button size="sm" onClick={() => setStatus("out_for_delivery")} disabled={order.status === "out_for_delivery"}>
                Out for delivery
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setStatus("delivered")} disabled={order.status === "delivered"}>
                Delivered
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setStatus("rejected")}>
                Reject order
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              In production, these transitions happen in the station's dashboard and via SMS to your
              phone. This sandbox simulates them so every state is explorable.
            </p>
          </details>
        </div>
      </div>
    </Container>
  );
}