"use client";

import { useMemo, useState } from "react";
import { Check, Filter, MapPin, Phone, Truck, X } from "lucide-react";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { Button } from "@/components/ui/button";
import { formatKES, formatPhone } from "@/lib/format";
import { dashboardStats } from "@/lib/data/content";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "all" | OrderStatus;

const TABS: { id: Tab; label: string; count: number }[] = [
  { id: "all", label: "All", count: 14 },
  { id: "pending", label: "Pending", count: dashboardStats.pendingOrders },
  { id: "accepted", label: "Accepted", count: 6 },
  { id: "out_for_delivery", label: "Out for delivery", count: dashboardStats.outForDelivery },
  { id: "delivered", label: "Delivered", count: 40 },
  { id: "rejected", label: "Rejected", count: 2 },
  { id: "cancelled", label: "Cancelled", count: 1 },
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

const ROWS: Row[] = [
  { id: "o1", orderNumber: "#MF-98112", customer: "Jane Wanjiku", phone: "+254 712 345 678", area: "Kasarani EBC", items: "2 × 20L refill", total: 820, status: "pending", time: "10:42", min: "3 min ago" },
  { id: "o2", orderNumber: "#MF-98111", customer: "Moses Baraka", phone: "+254 733 555 101", area: "Roysambu, Pipeline", items: "1 × 5L bottle", total: 120, status: "pending", time: "10:35", min: "8 min ago" },
  { id: "o3", orderNumber: "#MF-98110", customer: "Amina Yusuf", phone: "+254 722 111 222", area: "Nyali, Mombasa", items: "3 × 20L refill", total: 1260, status: "accepted", time: "10:28", min: "12 min ago" },
  { id: "o4", orderNumber: "#MF-98109", customer: "Stephen Gachiri", phone: "+254 701 909 808", area: "Elgon View, Eldoret", items: "1 × dispenser rental", total: 600, status: "out_for_delivery", time: "10:02", min: "30 min ago" },
  { id: "o5", orderNumber: "#MF-98108", customer: "Lilian Koech", phone: "+254 755 626 414", area: "Milimani, Nakuru", items: "2 × 20L refill", total: 700, status: "out_for_delivery", time: "09:56", min: "36 min ago" },
  { id: "o6", orderNumber: "#MF-98107", customer: "David Kimani", phone: "+254 700 123 456", area: "Maua Close, Nakuru", items: "3 × 20L refill", total: 1050, status: "delivered", time: "09:31", min: "1h ago" },
  { id: "o7", orderNumber: "#MF-98106", customer: "Fatuma Ali", phone: "+254 728 990 211", area: "Bamburi, Mombasa", items: "1 × 10L (chilled)", total: 180, status: "delivered", time: "09:18", min: "1h ago" },
  { id: "o8", orderNumber: "#MF-98105", customer: "Peter Nyongesa", phone: "+254 733 444 555", area: "Highway Estate", items: "4 × 20L refill", total: 1400, status: "cancelled", time: "08:47", min: "2h ago" },
];

export function BusinessOrders() {
  const [tab, setTab] = useState<Tab>("all");
  const [rows, setRows] = useState(ROWS);
  const [note, setNote] = useState<string | null>(null);

  const filtered = useMemo(() => (tab === "all" ? rows : rows.filter((r) => r.status === tab)), [rows, tab]);

  const advance = (id: string) => {
    setRows((all) =>
      all.map((r) => {
        if (r.id !== id) return r;
        const next: OrderStatus =
          r.status === "pending" ? "accepted" : r.status === "accepted" ? "out_for_delivery" : r.status === "out_for_delivery" ? "delivered" : r.status;
        setNote(next === "accepted" ? "Order accepted — customer notified by SMS." : next === "out_for_delivery" ? "Rider assigned and heading out." : next === "delivered" ? "Marked delivered. Payment already settled via M-Pesa." : "");
        return { ...r, status: next };
      })
    );
  };

  const reject = (id: string) => {
    setRows((all) => all.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
    setNote("Order rejected — we return the customer's payment automatically.");
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
                      <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">{o.orderNumber}</span>
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