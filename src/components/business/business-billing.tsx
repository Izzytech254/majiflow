"use client";

import { useState } from "react";
import { Check, CreditCard, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatKES } from "@/lib/format";
import { plans } from "@/lib/data/plans";
import { cn } from "@/lib/utils";

const INVOICES = [
  { id: "INV-2026-010", date: "1 Oct 2026", plan: "Growth — monthly", amount: 4500, status: "Paid" },
  { id: "INV-2026-009", date: "1 Sep 2026", plan: "Growth — monthly", amount: 4500, status: "Paid" },
  { id: "INV-2026-008", date: "1 Aug 2026", plan: "Starter — monthly", amount: 1500, status: "Paid" },
];

export function BusinessBilling() {
  const [annual, setAnnual] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-foreground sm:text-3xl">Billing & plan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You're on the <strong className="text-foreground">Growth</strong> plan · trial ends in 6 days.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-white p-1">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={cn("rounded-lg px-3.5 py-1.5 text-sm font-medium", !annual ? "bg-[#0052FF]/8 text-[#0052FF]" : "text-muted-foreground")}
            aria-pressed={!annual}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={cn("rounded-lg px-3.5 py-1.5 text-sm font-medium", annual ? "bg-[#0052FF]/8 text-[#0052FF]" : "text-muted-foreground")}
            aria-pressed={annual}
          >
            Annual · save 17%
          </button>
        </div>
      </div>

      {note && (
        <div role="status" className="flex items-center justify-between rounded-xl border border-success/25 bg-success/5 px-4 py-3 text-sm text-success">
          <span className="flex items-center gap-2">
            <Check className="size-4" aria-hidden /> {note}
          </span>
          <button onClick={() => setNote(null)} className="font-semibold" aria-label="Dismiss">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((p) => {
          const current = p.id === "growth";
          return (
            <article
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-6 shadow-card",
                current ? "border-[#0052FF] ring-2 ring-[#0052FF]/15" : "border-border"
              )}
            >
              {current && (
                <span className="absolute -top-3 left-6 rounded-full bg-brand-gradient px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
                  Current plan
                </span>
              )}
              <h2 className="font-display text-xl text-foreground">{p.name}</h2>
              <p className="mt-3 font-display text-3xl text-foreground">
                {formatKES(annual ? p.annualPrice : p.monthlyPrice)}
                <span className="ml-1 text-sm font-normal text-muted-foreground">/{annual ? "year" : "month"}</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-muted-foreground">
                {p.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#0052FF]" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={current ? "secondary" : "default"}
                className="mt-6 w-full"
                onClick={() => setNote(current ? "You're already on Growth — no changes made." : `Switched to ${p.name} (simulated).`)}
              >
                {current ? "Manage plan" : `Upgrade to ${p.name}`}
              </Button>
            </article>
          );
        })}
      </div>

      <section className="rounded-2xl border border-border bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
            <CreditCard className="size-5 text-[#0052FF]" aria-hidden /> Invoices
          </h2>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Smartphone className="size-3.5" aria-hidden /> Charged to M-Pesa ···· 0417
          </span>
        </div>
        <ul className="divide-y divide-border">
          {INVOICES.map((inv) => (
            <li key={inv.id} className="flex flex-wrap items-center gap-3 px-6 py-4 hover:bg-muted/30">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-muted-foreground">{inv.id}</p>
                <p className="text-sm font-medium text-foreground">
                  {inv.plan} · {inv.date}
                </p>
              </div>
              <span className="font-display text-base text-foreground">{formatKES(inv.amount)}</span>
              <Badge variant="success">{inv.status}</Badge>
              <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => setNote(`${inv.id} receipt emailed to you.`)}>
                <Download className="size-3.5" aria-hidden /> Receipt
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}