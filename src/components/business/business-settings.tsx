"use client";

import { useState } from "react";
import { Bell, Check, Clock, MapPin, Save, Smartphone, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ZONES = [
  { id: "z1", name: "Kasarani", fee: 50, eta: "30–45 min", on: true },
  { id: "z2", name: "Roysambu", fee: 50, eta: "35–50 min", on: true },
  { id: "z3", name: "Kahawa West", fee: 80, eta: "45–60 min", on: true },
  { id: "z4", name: "Githurai 45", fee: 100, eta: "60–75 min", on: false },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function BusinessSettings() {
  const [saved, setSaved] = useState(false);
  const [zones, setZones] = useState(ZONES);
  const [notify, setNotify] = useState({ orders: true, sms: true, daily: true, stock: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-foreground sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Everything customers see, plus how you get paid.</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          }}
        >
          {saved ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
          {saved ? "Saved" : "Save changes"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Profile */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
            <Store className="size-5 text-[#0052FF]" aria-hidden /> Business profile
          </h2>
          <div className="mt-5 space-y-5">
            <Field label="Business name" required>
              <Input defaultValue="BioWater Refill Station" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone (M-Pesa)">
                <Input defaultValue="+254 712 000 001" />
              </Field>
              <Field label="Category">
                <select
                  defaultValue="Water refill"
                  className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-foreground outline-none focus-visible:border-[#0052FF] focus-visible:ring-4 focus-visible:ring-[#0052FF]/12"
                >
                  <option>Water refill</option>
                  <option>Water bottling</option>
                  <option>Water + dispenser rental</option>
                </select>
              </Field>
            </div>
            <Field label="Location" hint="Shown on your public profile and used for search.">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input className="pl-10" defaultValue="Kasarani, Mwiki Road, Nairobi" />
              </div>
            </Field>
            <Field label="About your station" hint="Two or three warm sentences go a long way.">
              <Textarea rows={4} defaultValue="Family-run since 2018. We refill your own cans with UV-treated borehole water, deliver on boda within the hour, and never charge for the first delivery in Kasarani." />
            </Field>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {/* Hours */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
              <Clock className="size-5 text-[#0052FF]" aria-hidden /> Operating hours
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DAYS.map((d) => (
                <div key={d} className="rounded-xl border border-border px-3 py-2 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{d}</p>
                  <p className="mt-1 text-xs font-semibold text-foreground">{d === "Sun" ? "9–14" : "6–20"}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Orders placed after hours queue for the next morning and are clearly marked.
            </p>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
              <Bell className="size-5 text-[#0052FF]" aria-hidden /> Notifications
            </h2>
            <ul className="mt-4 space-y-3">
              {(
                [
                  { key: "orders", label: "New order alerts", desc: "Sound + banner on every order" },
                  { key: "sms", label: "SMS to customers", desc: "Accepted, on the way, delivered" },
                  { key: "daily", label: "Daily summary", desc: "7am revenue + orders digest" },
                  { key: "stock", label: "Low stock reminders", desc: "When inventory dips below threshold" },
                ] as const
              ).map((n) => (
                <li key={n.key} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={notify[n.key]}
                    aria-label={n.label}
                    onClick={() => setNotify((v) => ({ ...v, [n.key]: !v[n.key] }))}
                    className={cn(
                      "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                      notify[n.key] ? "bg-brand-gradient" : "bg-muted-foreground/30"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
                        notify[n.key] ? "translate-x-[22px]" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Delivery zones */}
      <section className="rounded-2xl border border-border bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
            <MapPin className="size-5 text-[#0052FF]" aria-hidden /> Delivery zones & fees
          </h2>
          <Button size="sm" variant="secondary">
            Add zone
          </Button>
        </div>
        <ul className="divide-y divide-border">
          {zones.map((z) => (
            <li key={z.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{z.name}</p>
                <p className="text-xs text-muted-foreground">Delivery in {z.eta}</p>
              </div>
              <span className="font-mono text-sm text-foreground">KES {z.fee}</span>
              <button
                role="switch"
                aria-checked={z.on}
                aria-label={`Deliver to ${z.name}`}
                onClick={() => setZones((all) => all.map((x) => (x.id === z.id ? { ...x, on: !x.on } : x)))}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  z.on ? "bg-brand-gradient" : "bg-muted-foreground/30"
                )}
              >
                <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform", z.on ? "translate-x-[22px]" : "translate-x-0.5")} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Payments */}
      <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
            <Smartphone className="size-5 text-[#0052FF]" aria-hidden /> M-Pesa payout account
          </h2>
          <Badge variant="success">Verified</Badge>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Field label="Till / Paybill number">
            <Input defaultValue="4040417" readOnly />
          </Field>
          <Field label="Payout schedule">
            <Input defaultValue="Daily at 8pm" readOnly />
          </Field>
          <Field label="Settlement account">
            <Input defaultValue="Equity ···· 8842" readOnly />
          </Field>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Customer payments settle to your till instantly; MajiFlow deducts its subscription on the 1st.
        </p>
      </section>
    </div>
  );
}