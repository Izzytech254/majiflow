"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  Download,
  Radio,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/format";
import { businesses } from "@/lib/data/businesses";
import { cn } from "@/lib/utils";

type Sub = "trial" | "growth" | "starter" | "pro" | "past_due";

const ROWS: {
  id: string;
  name: string;
  owner: string;
  area: string;
  plan: Sub;
  mrr: number;
  orders30d: number;
  status: "live" | "pending" | "suspended";
}[] = [
  { id: "b1", name: "BioWater Refill Station", owner: "Grace Mwangi", area: "Kasarani, Nairobi", plan: "growth", mrr: 4500, orders30d: 612, status: "live" },
  { id: "b2", name: "TruFlow Waters", owner: "Keith Otieno", area: "Nyali, Mombasa", plan: "pro", mrr: 12000, orders30d: 940, status: "live" },
  { id: "b3", name: "AquaSpring Refills", owner: "Sharon Achieng", area: "Milimani, Kisumu", plan: "starter", mrr: 1500, orders30d: 187, status: "live" },
  { id: "b4", name: "PureBlue Refills", owner: "David Kimani", area: "Nakuru CBD", plan: "growth", mrr: 4500, orders30d: 388, status: "live" },
  { id: "b5", name: "Highlands Aqua", owner: "Peter Nyongesa", area: "Eldoret", plan: "trial", mrr: 0, orders30d: 41, status: "pending" },
  { id: "b6", name: "Diani Pure Water", owner: "Fatuma Ali", area: "Diani, Kwale", plan: "starter", mrr: 1500, orders30d: 96, status: "live" },
  { id: "b7", name: "Nzoia Springs", owner: "Brian Wekesa", area: "Bungoma", plan: "past_due", mrr: 1500, orders30d: 12, status: "suspended" },
];

const COMPLAINTS = [
  { id: "c1", business: "Highlands Aqua", issue: "Order accepted but rider never arrived — customer refunded", age: "2h ago", severity: "high" },
  { id: "c2", business: "Nzoia Springs", issue: "Subscription payment failed 3 times (insufficient M-Pesa balance)", age: "1d ago", severity: "medium" },
  { id: "c3", business: "AquaSpring Refills", issue: "Requested help setting delivery zone fees", age: "2d ago", severity: "low" },
];

const PLAN_TONE: Record<Sub, "muted" | "softAccent" | "accent" | "success" | "danger"> = {
  trial: "muted",
  starter: "softAccent",
  growth: "accent",
  pro: "success",
  past_due: "danger",
};

export function AdminOverview() {
  const [rows, setRows] = useState(ROWS);
  const [q, setQ] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const filtered = rows.filter(
    (r) => r.name.toLowerCase().includes(q.toLowerCase()) || r.owner.toLowerCase().includes(q.toLowerCase()) || r.area.toLowerCase().includes(q.toLowerCase())
  );

  const mrr = rows.filter((r) => r.plan !== "trial" && r.plan !== "past_due").reduce((t, r) => t + r.mrr, 0);
  const active = rows.filter((r) => r.status === "live").length;

  const setStatus = (id: string, status: "live" | "suspended") => {
    setRows((all) => all.map((r) => (r.id === id ? { ...r, status } : r)));
    setNote(status === "live" ? "Business reactivated — their page is back online." : "Business suspended — customers see a pause notice.");
  };

  return (
    <Container className="py-14 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-[#0052FF]" aria-hidden /> Platform admin
          </p>
          <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">MajiFlow control room</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Every station, subscription and payment across Kenya — in one view.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-[#0052FF]/30 bg-[#0052FF]/5 px-4 py-2.5 text-sm font-semibold text-[#0052FF] transition-colors hover:bg-[#0052FF]/10"
          >
            <Radio className="size-4" aria-hidden /> Live orders
          </Link>
          <Button variant="secondary" className="gap-2" onClick={() => setNote("Platform report exported as CSV.")}>
            <Download className="size-4" aria-hidden /> Export report
          </Button>
        </div>
      </div>

      {note && (
        <div role="status" className="mt-6 flex items-center justify-between rounded-xl border border-[#0052FF]/25 bg-[#0052FF]/5 px-4 py-3 text-sm text-[#0052FF]">
          {note}
          <button onClick={() => setNote(null)} className="font-semibold" aria-label="Dismiss">
            Dismiss
          </button>
        </div>
      )}

      {/* Platform KPIs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Building2, label: "Active businesses", value: String(active), hint: `${rows.length - active} pending / suspended` },
          { icon: Banknote, label: "Platform MRR", value: formatKES(mrr), hint: "+18.2% month on month" },
          { icon: TrendingUp, label: "Orders processed", value: "2,276", hint: "Last 30 days across all stations" },
          { icon: Users, label: "End customers", value: "8,410", hint: "Unique phone numbers served" },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#0052FF]/10 text-[#0052FF]">
              <k.icon className="size-4.5" aria-hidden />
            </span>
            <p className="mt-3 font-display text-2xl text-foreground">{k.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-[11px] text-muted-foreground/70">{k.hint}</p>
          </div>
        ))}
      </div>

      {/* Businesses table */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="font-display text-lg text-foreground">Businesses</h2>
          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border px-3 py-2 sm:w-72">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search businesses, owners…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search businesses"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Business", "Plan", "MRR", "Orders (30d)", "Status", ""].map((h) => (
                  <th key={h} scope="col" className="px-5 py-3.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-muted font-display text-xs text-foreground">
                        {r.name.slice(0, 1)}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">{r.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.owner} · {r.area}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={PLAN_TONE[r.plan]}>
                      {r.plan === "past_due" ? "Past due" : r.plan === "trial" ? "Trial" : r.plan[0].toUpperCase() + r.plan.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">{r.mrr ? formatKES(r.mrr) : "—"}</td>
                  <td className="px-5 py-4 text-foreground/85">{r.orders30d}</td>
                  <td className="px-5 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", r.status === "live" ? "text-success" : r.status === "pending" ? "text-warning" : "text-danger")}>
                      <span className={cn("size-1.5 rounded-full", r.status === "live" ? "bg-success" : r.status === "pending" ? "bg-warning" : "bg-danger")} />
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {r.status === "suspended" ? (
                      <Button size="sm" onClick={() => setStatus(r.id, "live")}>
                        <Check className="size-3.5" aria-hidden /> Reactivate
                      </Button>
                    ) : r.status === "live" ? (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(r.id, "suspended")}>
                        <X className="size-3.5" aria-hidden /> Suspend
                      </Button>
                    ) : (
                      <Link href="/business/demo" className="text-xs font-semibold text-[#0052FF] hover:underline">
                        Review
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Complaints */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
            <AlertTriangle className="size-5 text-warning" aria-hidden /> Support queue
          </h2>
          <ul className="mt-5 space-y-4">
            {COMPLAINTS.map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    c.severity === "high" ? "bg-danger" : c.severity === "medium" ? "bg-warning" : "bg-muted-foreground/40"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{c.business}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{c.issue}</p>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{c.age}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Payments + plan mix */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
            <BadgeCheck className="size-5 text-[#0052FF]" aria-hidden /> Subscription mix
          </h2>
          <ul className="mt-5 space-y-4">
            {[
              { label: "Pro", value: 1, color: "bg-[#0052FF]" },
              { label: "Growth", value: 2, color: "bg-[#4D7CFF]" },
              { label: "Starter", value: 3, color: "bg-[#0052FF]/40" },
              { label: "Trial", value: 1, color: "bg-muted-foreground/40" },
              { label: "Past due", value: 1, color: "bg-danger" },
            ].map((s) => (
              <li key={s.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{s.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{s.value} businesses</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", s.color)} style={{ width: `${(s.value / rows.length) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Collections:</strong> {formatKES(mrr)} collected this month via
            M-Pesa. One business is past due and has been auto-suspended after 3 failed charges.
          </div>
        </section>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Demo data for the MajiFlow platform admin. Businesses are seeded from{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">src/lib/data/businesses.ts</code> ({businesses.length} stations).
      </p>
    </Container>
  );
}