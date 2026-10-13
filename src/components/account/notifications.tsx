"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, CheckCircle2, Clock, Truck, XCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { EmptyState, LoadingState } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { fetchOrders } from "@/lib/orders";
import { useCustomer } from "@/components/order/customer-provider";
import { formatKES, formatRelativeTime } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_META: Record<OrderStatus, { label: string; icon: typeof Clock }> = {
  pending: { label: "Order placed", icon: Clock },
  accepted: { label: "Order accepted", icon: CheckCircle2 },
  out_for_delivery: { label: "Out for delivery", icon: Truck },
  delivered: { label: "Delivered", icon: CheckCircle2 },
  rejected: { label: "Order rejected", icon: XCircle },
  cancelled: { label: "Order cancelled", icon: XCircle },
};

export function NotificationsPage() {
  const { profile } = useCustomer();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    fetchOrders(profile.phone ? { phone: profile.phone } : {}).then(setOrders);
  }, [profile.phone]);

  const items = (orders ?? [])
    .flatMap((order) =>
      (order.timeline ?? [{ status: order.status, at: order.placedAt }]).map((entry) => ({
        id: `${order.id}-${entry.at}`,
        order,
        status: entry.status,
        at: entry.at,
      }))
    )
    .sort((a, b) => b.at.localeCompare(a.at));

  return (
    <Container className="py-6 lg:py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">Notifications</h1>
        <p className="mt-2 text-sm text-muted-foreground">Updates on every order you have placed.</p>
      </div>

      {!orders ? (
        <LoadingState label="Loading notifications…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Bell className="size-7" aria-hidden />}
          title="No notifications yet"
          description="When you place an order, its status updates will show up here."
          action={
            <Link href="/browse">
              <Button>Browse stations</Button>
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((n) => {
            const meta = STATUS_META[n.status];
            const Icon = meta.icon;
            return (
              <li key={n.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-black">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {meta.label}
                    <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">{n.order.orderNumber}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {n.order.businessName} · {formatKES(n.order.total)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(n.at)}</p>
                </div>
                <Link
                  href={`/order/${n.order.id}`}
                  className="shrink-0 self-center text-sm font-semibold text-[#0052FF] hover:underline"
                >
                  View
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
