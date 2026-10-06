"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, PackageOpen } from "lucide-react";
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

export function OrderHistoryPage() {
  const { profile } = useCustomer();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    fetchOrders(profile.phone ? { phone: profile.phone } : {}).then(setOrders);
  }, [profile.phone]);

  return (
    <Container className="py-14 lg:py-20">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-[#0052FF] animate-pulse-dot" /> Order history
        </p>
        <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">All your orders</h1>
      </div>

      {!orders ? (
        <LoadingState label="Loading orders…" />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<PackageOpen className="size-7" aria-hidden />}
          title="Nothing here yet"
          description="Place your first order and it'll live in this history — handy for reordering next week."
          action={
            <Link href="/browse">
              <Button className="group">
                Start an order
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
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
                {orders
                  .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
                  .map((o) => (
                    <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{o.orderNumber}</td>
                      <td className="px-5 py-4 font-medium text-foreground">{o.businessName}</td>
                      <td className="px-5 py-4 text-foreground/85">
                        {o.items.map((i) => `${i.quantity}×${i.name.split("—")[0].trim()}`).join(", ")}
                      </td>
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
                        <Link
                          href={`/order/${o.id}`}
                          className="inline-flex items-center gap-1.5 font-semibold text-[#0052FF] hover:underline"
                        >
                          Track <ArrowRight className="size-3.5" aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Container>
  );
}