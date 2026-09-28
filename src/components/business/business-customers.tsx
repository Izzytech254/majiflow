"use client";

import { useMemo, useState } from "react";
import { Download, Mail, MapPin, Phone, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/format";
import { customerRecords } from "@/lib/data/content";
import { cn } from "@/lib/utils";

type Segment = "all" | "active" | "new" | "dormant";

const TABS: { id: Segment; label: string }[] = [
  { id: "all", label: "All customers" },
  { id: "active", label: "Active" },
  { id: "new", label: "New" },
  { id: "dormant", label: "Dormant" },
];

export function BusinessCustomers() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Segment>("all");
  const [note, setNote] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      customerRecords.filter(
        (c) =>
          (tab === "all" || c.status === tab) &&
          (c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q) || c.location.toLowerCase().includes(q.toLowerCase()))
      ),
    [q, tab]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-foreground sm:text-3xl">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Every phone number that has ordered with you, on record.</p>
        </div>
        <Button variant="secondary" className="gap-2" onClick={() => setNote("CSV export queued — lands in your email.")}>
          <Download className="size-4" aria-hidden /> Export
        </Button>
      </div>

      {note && (
        <div role="status" className="flex items-center justify-between rounded-xl border border-[#0052FF]/25 bg-[#0052FF]/5 px-4 py-3 text-sm text-[#0052FF]">
          {note}
          <button onClick={() => setNote(null)} className="font-semibold" aria-label="Dismiss">
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 sm:max-w-md">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, or area…"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Search customers"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                tab === t.id ? "bg-[#0052FF]/8 text-[#0052FF]" : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={tab === t.id}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
        {filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No customers match your search.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-muted/30">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted font-display text-sm text-foreground">
                  {c.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{c.name}</p>
                    <Badge variant={c.status === "active" ? "success" : c.status === "new" ? "softAccent" : "muted"}>
                      {c.status}
                    </Badge>
                  </div>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="size-3" aria-hidden /> {c.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" aria-hidden /> {c.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="size-3" aria-hidden /> last order: {c.lastOrder}
                    </span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-base text-foreground">{formatKES(c.totalSpent)}</p>
                  <p className="text-xs text-muted-foreground">{c.orders} orders</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {tab === "dormant" && filtered.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-warning/25 bg-warning-soft/50 p-5">
          <Users className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground/85">
            These customers ordered 30+ days ago. One KES 50-off SMS each ("karibu nyumbani") has won back
            an average of 4 in 10 dormant customers for stations on Growth.
          </p>
        </div>
      )}
    </div>
  );
}