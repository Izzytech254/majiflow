"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PackageOpen } from "lucide-react";
import { Container } from "@/components/ui/container";
import { OrderStatusBadge, PAYMENT_STATE_META } from "@/components/ui/order-status-badge";
import { Badge } from "@/components/ui/badge";
import { EmptyState, LoadingState } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { fetchOrders } from "@/lib/orders";
import { useCustomer } from "@/components/order/customer-provider";
import { formatKES } from "@/lib/format";
import type { Order } from "@/lib/types";

const statusOrder = ["pending", "accepted", "out_for_delivery", "delivered", "rejected", "cancelled"] as const;

function itemsSummary(order: Order) {
  return order.items.map((i) => `${i.quantity}×${i.name.split(" - ")[0].trim()}`).join(", ");
}

export function OrderHistoryPage() {
  const { profile } = useCustomer();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    fetchOrders(profile.phone ? { phone: profile.phone } : {}).then(setOrders);
  }, [profile.phone]);

  const sorted = orders?.slice().sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  return (
    <Container className="py-6 lg:py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">All your orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">Every refill you have ordered, newest first.</p>
      </div>

      {!orders ? (
        <LoadingState label="Loading orders…" />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<PackageOpen className="size-7" aria-hidden />}
          title="Nothing here yet"
          description="Place your first order and it will live in this history - handy for reordering next week."
          action={
            <Link href="/browse">
              <Button>Start an order</Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Mobile: cards */}
          <ul className="flex flex-col gap-3 md:hidden">
            {sorted!.map((o) => (
              <li key={o.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{o.orderNumber}</span>
                  <OrderStatusBadge status={o.status} />
                </div>
                <p className="mt-2 font-medium text-foreground">{o.businessName}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{itemsSummary(o)}</p>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{formatKES(o.total)}</span>
                    <Badge variant={PAYMENT_STATE_META[o.paymentState].tone}>
                      {PAYMENT_STATE_META[o.paymentState].label}
                    </Badge>
                  </div>
                  <Link href={`/order/${o.id}`} className="text-sm font-semibold text-[#0052FF] hover:underline">
                    Track
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {["Order", "Station", "Items", "Total", "Payment", "Status", ""].map((h) => (
                      <th key={h} scope="col" className="px-5 py-3.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted!.map((o) => (
                    <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{o.orderNumber}</td>
                      <td className="px-5 py-4 font-medium text-foreground">{o.businessName}</td>
                      <td className="px-5 py-4 text-foreground/85">{itemsSummary(o)}</td>
                      <td className="px-5 py-4 font-bold text-foreground">{formatKES(o.total)}</td>
                      <td className="px-5 py-4">
                        <Badge variant={PAYMENT_STATE_META[o.paymentState].tone}>
                          {PAYMENT_STATE_META[o.paymentState].label}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/order/${o.id}`} className="font-semibold text-[#0052FF] hover:underline">
                          Track
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
