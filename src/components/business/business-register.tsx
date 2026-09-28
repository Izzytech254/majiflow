"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Check, CreditCard, MapPin, PartyPopper, Store } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { plans } from "@/lib/data/plans";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";

const STEPS = ["Business details", "Location & delivery", "Choose plan", "Payment"];

export function BusinessRegister() {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState("growth");
  const [done, setDone] = useState(false);

  const selected = plans.find((p) => p.id === plan)!;

  if (done) {
    return (
      <Container className="py-16 lg:py-24">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-white p-8 text-center shadow-layered sm:p-12">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-accent">
            <PartyPopper className="size-7" aria-hidden />
          </span>
          <h1 className="mt-6 font-display text-3xl text-foreground">Karibu, BioWater!</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your 14-day free trial on the <strong className="text-foreground">{selected.name}</strong> plan has
            started. We've created a starter catalogue you can edit, and your public page is live for
            customers to order from today.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/business">
              <Button size="lg" className="group w-full sm:w-auto">
                Open my dashboard
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>
            <Link href="/business/demo">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Take the tour first
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-14 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <Store className="size-3.5 text-[#0052FF]" aria-hidden /> Business onboarding
          </p>
          <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
            Get your station online in <span className="text-gradient">one lunch break</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Four short steps, no card required. Most owners finish before their chai gets cold.
          </p>
        </div>

        {/* Stepper */}
        <ol className="mt-10 flex items-center justify-between gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full font-mono text-xs font-semibold",
                  i < step
                    ? "bg-brand-gradient text-white"
                    : i === step
                      ? "bg-[#0052FF]/10 text-[#0052FF] ring-2 ring-[#0052FF]/25"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span className={cn("text-[11px] font-medium sm:text-xs", i <= step ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="flex items-center gap-2 font-display text-xl text-foreground">
                <Building2 className="size-5 text-[#0052FF]" aria-hidden /> Tell us about the business
              </h2>
              <Field label="Business name" required>
                <Input placeholder="e.g. BioWater Refill Station" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Owner name" required>
                  <Input placeholder="Grace Mwangi" />
                </Field>
                <Field label="Phone (M-Pesa)" required>
                  <Input placeholder="+254 712 345 678" />
                </Field>
              </div>
              <Field label="What do you sell?" hint="Pick the closest match — you can refine your catalogue later.">
                <select
                  defaultValue="refill"
                  className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-foreground outline-none focus-visible:border-[#0052FF] focus-visible:ring-4 focus-visible:ring-[#0052FF]/12"
                >
                  <option value="refill">Water refills</option>
                  <option value="bottled">Bottled water delivery</option>
                  <option value="rental">Refills + dispenser rental</option>
                </select>
              </Field>
              <Field label="Short description">
                <Textarea rows={3} placeholder="Family-run since 2018. UV-treated borehole water, delivered on boda within the hour." />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="flex items-center gap-2 font-display text-xl text-foreground">
                <MapPin className="size-5 text-[#0052FF]" aria-hidden /> Where do you deliver?
              </h2>
              <Field label="Station address" required>
                <Input placeholder="Mwiki Road, Kasarani, Nairobi" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Town / city">
                  <Input placeholder="Nairobi" />
                </Field>
                <Field label="Default delivery fee (KES)">
                  <Input type="number" defaultValue={50} />
                </Field>
              </div>
              <Field label="Delivery zones" hint="Comma-separated for now — the dashboard lets you fine-tune fees per zone.">
                <Input placeholder="Kasarani, Roysambu, Kahawa West, Githurai" />
              </Field>
              <Field label="Typical delivery time">
                <select
                  defaultValue="45"
                  className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-foreground outline-none focus-visible:border-[#0052FF] focus-visible:ring-4 focus-visible:ring-[#0052FF]/12"
                >
                  <option value="30">Under 30 minutes</option>
                  <option value="45">30–60 minutes</option>
                  <option value="90">1–2 hours</option>
                  <option value="240">Same day</option>
                </select>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl text-foreground">Pick your plan — first 14 days free</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlan(p.id)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all",
                      plan === p.id ? "border-[#0052FF] ring-2 ring-[#0052FF]/15" : "border-border hover:border-[#0052FF]/40"
                    )}
                    aria-pressed={plan === p.id}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg text-foreground">{p.name}</span>
                      {p.highlighted && <Badge variant="accent">Popular</Badge>}
                    </div>
                    <p className="mt-2 font-display text-2xl text-foreground">
                      {formatKES(p.monthlyPrice)}
                      <span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.audience}</p>
                  </button>
                ))}
              </div>
              <ul className="space-y-2 rounded-2xl bg-muted/50 p-5 text-sm text-muted-foreground">
                {selected.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#0052FF]" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="flex items-center gap-2 font-display text-xl text-foreground">
                <CreditCard className="size-5 text-[#0052FF]" aria-hidden /> How should we bill you?
              </h2>
              <div className="rounded-2xl border border-[#0052FF]/25 bg-[#0052FF]/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-lg text-foreground">{selected.name} plan</p>
                    <p className="text-sm text-muted-foreground">
                      {formatKES(selected.monthlyPrice)}/month after the 14-day free trial
                    </p>
                  </div>
                  <Badge variant="success">Free for 14 days</Badge>
                </div>
              </div>
              <Field label="M-Pesa number for billing" required>
                <Input placeholder="+254 712 345 678" />
              </Field>
              <label className="flex items-start gap-3 rounded-xl border border-border p-4">
                <input type="checkbox" defaultChecked className="mt-0.5 size-4 accent-[#0052FF]" />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  Charge my M-Pesa on the 1st of each month. I can cancel anytime — my public page stays
                  up until the end of the paid period.
                </span>
              </label>
              <p className="text-xs text-muted-foreground">
                No card, no hidden fees. We'll send an SMS reminder 3 days before your first charge.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="size-4" aria-hidden /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button className="group" onClick={() => setStep((s) => s + 1)}>
                Continue
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button size="lg" className="group" onClick={() => setDone(true)}>
                Start free trial
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#0052FF] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </Container>
  );
}