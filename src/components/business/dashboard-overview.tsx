"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, BadgeCheck, Boxes, Package, Repeat, TrendingUp, Users } from "lucide-react";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/format";
import { dashboardStats } from "@/lib/data/content";
import { cn } from "@/lib/utils";

export function DashboardOverview() {
  const s = dashboardStats;
  const [toast, setToast] = useState<string | null>(null);

  const maxRevenue = Math.max(...s.chart.map((c) => c.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-foreground sm:text-3xl">Good morning, Grace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })} · Here's how
            Githurai runs today.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setToast("Simulated — in production this opens your marketing site.")}
            className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-card hover:border-[#0052FF]/40"
          >
            View public page
          </button>
          <Link href="/business/promotions">
            <Button className="group">New promotion</Button>
          </Link>
        </div>
      </div>

      {toast && (
        <div role="status" className="flex items-center justify-between rounded-xl border border-[#0052FF]/25 bg-[#0052FF]/5 px-4 py-3 text-sm text-[#0052FF]">
          {toast}
          <button onClick={() => setToast(null)} className="font-semibold" aria-label="Dismiss">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={TrendingUp}
          label="Revenue today"
          value={formatKES(s.revenueToday)}
          delta={`+${s.revenueTrend}%`}
          positive
          hint={`vs ${formatKES(s.revenueToday / 1.124)} yesterday`}
        />
        <KpiCard
          icon={Package}
          label="Orders today"
          value={String(s.ordersToday)}
          delta="+8 vs yesterday"
          positive
          hint={`${s.pendingOrders} need attention right now`}
        />
        <KpiCard
          icon={Boxes}
          label="Out for delivery"
          value={String(s.outForDelivery)}
          delta={`${s.comingToday} more coming today`}
          hint="Riders are live on the map"
        />
        <KpiCard
          icon={Repeat}
          label="Repeat customers"
          value={`${s.repeatCustomerRate}%`}
          delta="Up 3.1% in 30 days"
          positive
          hint={`${s.recentOrders.length} best customers`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Chart */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg text-foreground">Revenue this week</h2>
              <p className="text-sm text-muted-foreground">Last 7 days · M-Pesa confirmed totals</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <ArrowUpRight className="size-3.5" aria-hidden /> +12.4%
            </span>
          </div>
          <div className="mt-8 flex h-44 items-end gap-3 sm:gap-4">
            {s.chart.map((c) => (
              <div key={c.period} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-brand-gradient opacity-90 transition-all group-hover:opacity-100 group-hover:shadow-accent"
                    style={{ height: `${(c.revenue / maxRevenue) * 100}%` }}
                    title={`${formatKES(c.revenue)}`}
                  />
                  <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 font-mono text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {formatKES(c.revenue)}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{c.period}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stock alerts */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
              <AlertTriangle className="size-5 text-warning" aria-hidden /> Stock alerts
            </h2>
            <Link href="/business/products" className="text-sm font-semibold text-[#0052FF] hover:underline">
              Manage →
            </Link>
          </div>
          <ul className="mt-5 space-y-4">
            {s.stockAlerts.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.stock} {a.unit} left · reorder at {a.threshold}
                  </p>
                </div>
                <div className="h-2 w-20 shrink-0 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", a.stock / a.threshold < 0.6 ? "bg-danger" : "bg-warning")}
                    style={{ width: `${Math.min(100, (a.stock / a.threshold) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl bg-warning-soft/50 p-3 text-xs leading-relaxed text-foreground/75">
            We remind you to top up inventory each morning so popular products never run dry.
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Recent orders */}
        <section className="rounded-2xl border border-border bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-lg text-foreground">Recent orders</h2>
            <Link href="/business/orders" className="text-sm font-semibold text-[#0052FF] hover:underline">
              All orders →
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {s.recentOrders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-muted font-display text-sm text-foreground">
                    {o.customer.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{o.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.orderNumber} · {o.area} · {o.time} · {o.items}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-base text-foreground">{formatKES(o.total)}</span>
                  {o.status === "pending" ? (
                    <Button size="sm" onClick={() => setToast(`Order ${o.orderNumber} accepted (simulated)`)}>
                      Accept
                    </Button>
                  ) : (
                    <OrderStatusBadge status={o.status} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Popular products */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
              <BadgeCheck className="size-5 text-[#0052FF]" aria-hidden /> Best sellers
            </h2>
            <Link href="/business/analytics" className="text-sm font-semibold text-[#0052FF] hover:underline">
              Analytics →
            </Link>
          </div>
          <ul className="mt-5 space-y-4">
            {s.popularProducts.map((p, i) => (
              <li key={p.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">{i + 1}</span>
                    {p.name}
                  </span>
                  <span className="font-semibold text-foreground">{formatKES(p.revenue)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-gradient"
                      style={{ width: `${(p.revenue / s.popularProducts[0].revenue) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">{p.orders} orders</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-muted/50 p-4">
            <Users className="mt-0.5 size-4.5 shrink-0 text-[#0052FF]" aria-hidden />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Dormant customers:</strong> 14 haven't ordered in 30+ days.
              A ₹ chai … er, a KES 20-off promotion could win 8 of them back this week.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  positive,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-lg bg-[#0052FF]/10 text-[#0052FF]">
          <Icon className="size-4.5" aria-hidden />
        </span>
        {positive && (
          <span className="flex items-center gap-1 text-xs font-semibold text-success">
            <ArrowUpRight className="size-3.5" aria-hidden /> {delta}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl text-foreground">{value}</p>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground/80">
        {!positive && <ArrowDownRight className="size-3 text-[#0052FF]" aria-hidden />}
        {delta}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground/70">{hint}</p>
    </div>
  );
}