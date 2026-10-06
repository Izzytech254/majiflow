"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, Filter, MapPin, Phone, Truck, X } from "lucide-react";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { Button } from "@/components/ui/button";
import { useBusiness } from "@/components/business/business-provider";
import { fetchOrders, updateOrder } from "@/lib/orders";
import { nextStatus } from "@/lib/order-status";
import { formatKES, formatPhone, formatRelativeTime } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "all" | OrderStatus;

const TAB_DEFS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "out_for_delivery", label: "Out for delivery" },
  { id: "delivered", label: "Delivered" },
  { id: "rejected", label: "Rejected" },
  { id: "cancelled", label: "Cancelled" },
];

type Row = {
  id: string;
  orderNumber: string;
  customer: string;
  phone: string;
  area: string;
  items: string;
  total: number;
  status: OrderStatus;
  time: string;
  min: string;
};

function toRow(o: Order): Row {
  return {
    id: o.id,
    orderNumber: `#${o.orderNumber}`,
    customer: o.customerName,
    phone: o.customerPhone,
    area: [o.address.estate, o.address.building].filter(Boolean).join(", "),
    items: o.items.map((i) => `${i.quantity} × ${i.name}`).join(", "),
    total: o.total,
    status: o.status,
    time: new Date(o.placedAt).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }),
    min: formatRelativeTime(o.placedAt),
  };
}

export function BusinessOrders() {
  const { business } = useBusiness();
  const [tab, setTab] = useState<Tab>("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const orders = await fetchOrders({ businessId: business.id });
      if (!alive) return;
      setRows(orders.map(toRow));
    };
    void tick();
    const poll = window.setInterval(() => void tick(), 4000);
    return () => {
      alive = false;
      window.clearInterval(poll);
    };
  }, [business.id]);

  const TABS = useMemo(
    () =>
      TAB_DEFS.map((t) => ({
        ...t,
        count: t.id === "all" ? rows.length : rows.filter((r) => r.status === t.id).length,
      })),
    [rows]
  );

  const filtered = useMemo(() => (tab === "all" ? rows : rows.filter((r) => r.status === tab)), [rows, tab]);

  const applyStatus = async (id: string, status: OrderStatus, message: string) => {
    const updated = await updateOrder(id, { status });
    if (updated) setRows((all) => all.map((r) => (r.id === id ? toRow(updated) : r)));
    setNote(message);
  };

  const advance = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const next = nextStatus(row.status);
    if (next === row.status) return;
    void applyStatus(
      id,
      next,
      next === "accepted"
        ? "Order accepted — customer notified by SMS."
        : next === "out_for_delivery"
          ? "Rider assigned and heading out."
          : "Marked delivered. Payment already settled via M-Pesa."
    );
  };

  const reject = (id: string) => {
    void applyStatus(id, "rejected", "Order rejected — we return the customer's payment automatically.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-foreground sm:text-3xl">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} shown · customer pays M-Pesa first, so fulfilment is just delivery.
          </p>
        </div>
        <Button variant="secondary" className="gap-2">
          <Filter className="size-4" aria-hidden /> Filters
        </Button>
      </div>

      {note && (
        <div role="status" className="flex items-center justify-between rounded-xl border border-success/25 bg-success/5 px-4 py-3 text-sm text-success">
          <span className="flex items-center gap-2">
            <Check className="size-4" aria-hidden /> {note}
          </span>
          <button onClick={() => setNote(null)} aria-label="Dismiss" className="font-semibold">
            Dismiss
          </button>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-[#0052FF] bg-[#0052FF]/8 text-[#0052FF]"
                : "border-border bg-white text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={tab === t.id}
          >
            {t.label}
            <span className={cn("ml-2 font-mono text-xs", tab === t.id ? "text-[#0052FF]" : "text-muted-foreground")}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
        {filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No orders in this state right now.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-muted/30">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted font-display text-sm text-foreground">
                    {o.customer.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {o.customer}
                      <Link
                        href={`/business/orders/${o.id}`}
                        className="ml-2 font-mono text-xs font-normal text-muted-foreground hover:text-[#0052FF] hover:underline"
                      >
                        {o.orderNumber}
                      </Link>
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" aria-hidden /> {o.area}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" aria-hidden /> {formatPhone(o.phone)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="size-3" aria-hidden /> {o.min}
                      </span>
                    </p>
                    <p className="mt-1 truncate text-xs text-foreground/75">{o.items}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2.5">
                  <span className="hidden text-right font-display text-base text-foreground sm:block">{formatKES(o.total)}</span>
                  {o.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => reject(o.id)} aria-label={`Reject order ${o.orderNumber}`}>
                        <X className="size-3.5" aria-hidden /> Reject
                      </Button>
                      <Button size="sm" onClick={() => advance(o.id)}>
                        Accept
                      </Button>
                    </div>
                  )}
                  {(o.status === "accepted" || o.status === "out_for_delivery") && (
                    <Button size="sm" variant="secondary" onClick={() => advance(o.id)}>
                      {o.status === "accepted" ? "Assign rider" : "Mark delivered"}
                    </Button>
                  )}
                  {(o.status === "delivered" || o.status === "cancelled" || o.status === "rejected") && (
                    <OrderStatusBadge status={o.status} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
