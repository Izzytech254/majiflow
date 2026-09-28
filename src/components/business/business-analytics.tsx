"use client";

import { useState } from "react";
import { CalendarDays, Package, Repeat, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/format";
import { dashboardStats } from "@/lib/data/content";
import { cn } from "@/lib/utils";

const RANGES = ["7 days", "30 days", "This month", "Last month"] as const;

export function BusinessAnalytics() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("30 days");
  const s = dashboardStats;
  const max = Math.max(...s.chart.map((c) => c.revenue));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-foreground sm:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The numbers behind your water — refreshed every 15 minutes.
          </p>
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                range === r ? "bg-[#0052FF]/8 text-[#0052FF]" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-pressed={range === r}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: TrendingUp, label: "Revenue", value: formatKES(s.chart.reduce((t, c) => t + c.revenue, 0)), delta: "+12.4% vs prior period", positive: true },
          { icon: Package, label: "Orders", value: String(s.chart.reduce((t, c) => t + c.orders, 0)), delta: "+8.1%", positive: true },
          { icon: Repeat, label: "Repeat rate", value: `${s.repeatCustomerRate}%`, delta: "+3.1 pts", positive: true },
          { icon: Users, label: "New customers", value: "23", delta: "+5 this month", positive: true },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#0052FF]/10 text-[#0052FF]">
              <k.icon className="size-4.5" aria-hidden />
            </span>
            <p className="mt-3 font-display text-2xl text-foreground">{k.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-[11px] text-success">{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground">Revenue trend</h2>
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" aria-hidden /> Last {range.replace(" days", "d")}
            </span>
          </div>
          <div className="mt-8 flex h-52 items-end gap-3 sm:gap-4">
            {s.chart.map((c) => (
              <div key={c.period} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-brand-gradient opacity-90 group-hover:opacity-100"
                    style={{ height: `${(c.revenue / max) * 100}%` }}
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

        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h2 className="font-display text-lg text-foreground">Order mix</h2>
          <ul className="mt-5 space-y-4">
            {s.popularProducts.map((p) => {
              const pct = Math.round((p.revenue / s.chart.reduce((t, c) => t + c.revenue, 0)) * 100 * 3);
              return (
                <li key={p.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 rounded-xl bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
            Full stats (hourly heatmap, delivery zones, staff performance) arrive with{" "}
            <strong className="text-foreground">Analytics</strong> on the Pro plan.
          </div>
        </section>
      </div>
    </div>
  );
}