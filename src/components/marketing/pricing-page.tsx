"use client";

import { useState } from "react";
import { Check, Minus, ShieldCheck, WandSparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { PricingCard } from "@/components/shared/pricing-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Accordion } from "@/components/ui/accordion";
import { plans } from "@/lib/data/plans";
import type { Plan, PlanName } from "@/lib/types";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "annual";

const comparison: { feature: string; plans: (string | boolean)[] }[] = [
  { feature: "Business profile & online menu", plans: [true, true, true] },
  { feature: "Orders from the website", plans: [true, true, true] },
  { feature: "M-Pesa / card checkout", plans: [true, true, true] },
  { feature: "Basic sales reports", plans: [true, true, true] },
  { feature: "Advanced analytics & charts", plans: [false, true, true] },
  { feature: "Staff accounts", plans: [false, "Up to 5", "Unlimited"] },
  { feature: "Promotions & discounts", plans: [false, true, true] },
  { feature: "Customer SMS / WhatsApp", plans: [false, true, true] },
  { feature: "Priority search placement", plans: [false, true, true] },
  { feature: "Custom branding & domain", plans: [false, false, true] },
  { feature: "Multiple branches", plans: [false, false, true] },
  { feature: "Priority support", plans: [false, false, "WhatsApp line"] },
];

const planIds: PlanName[] = ["starter", "growth", "pro"];

export function PricingPage() {
  const [billing, setBilling] = useState<Billing>("annual");
  const { toast } = useToast();

  const choose = (plan: Plan) =>
    toast({
      kind: "success",
      title: `${plan.name} chosen`,
      message: `Begin your ${plan.trialDays}-day free trial — no card required.`,
    });

  const planMap = Object.fromEntries(plans.map((p) => [p.id, p])) as Record<PlanName, Plan>;

  return (
    <>
      <PageHero
        label="Pricing"
        pulseLabel
        title={
          <>
            A subscription, <span className="text-gradient">not a commission</span>
          </>
        }
        description="Transparent KES pricing that scales with your station. Every plan starts with a 14-day free trial — take real orders before you spend a shilling."
      />

      <section className="py-16 lg:py-24">
        <Container>
          <div className="flex justify-center">
            <BillingToggle billing={billing} onChange={setBilling} />
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className={plan.highlighted ? "lg:-mt-4" : ""}>
                <PricingCard plan={plan} annual={billing === "annual"} onChoose={choose} />
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-3 rounded-2xl border border-success/25 bg-success-soft/40 p-6 sm:flex-row">
            <ShieldCheck className="size-6 shrink-0 text-success" aria-hidden />
            <p className="flex-1 text-sm leading-relaxed text-foreground/85">
              <strong className="font-semibold text-foreground">No surprise fees, ever.</strong> You
              keep the full KES price customers pay. Cancel anytime — export your data and your
              profile stays live until the end of the billing period.
            </p>
          </div>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <SectionHeading
            label="Compare plans"
            title={
              <>
                What every plan <span className="text-gradient">includes</span>
              </>
            }
          />
          <div className="mt-12 overflow-x-auto rounded-2xl border border-border shadow-card">
            <table className="w-full min-w-[640px] border-collapse bg-white text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="px-6 py-4 text-left font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Feature
                  </th>
                  {planIds.map((id) => (
                    <th key={id} scope="col" className="px-6 py-4 text-center">
                      <span className={cn("font-display text-base", planMap[id].highlighted && "text-[#0052FF]")}>
                        {planMap[id].name}
                      </span>
                      {planMap[id].highlighted && (
                        <p className="font-mono text-[10px] uppercase tracking-wider text-[#0052FF]">
                          Most popular
                        </p>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <td className="px-6 py-3.5 font-medium text-foreground">{row.feature}</td>
                    {row.plans.map((val, i) => (
                      <td key={i} className="px-6 py-3.5 text-center">
                        {val === true ? (
                          <span className="inline-flex size-5 items-center justify-center rounded-full bg-success-soft text-success">
                            <Check className="size-3" strokeWidth={3} aria-hidden />
                          </span>
                        ) : val === false ? (
                          <span className="inline-flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Minus className="size-3" aria-hidden />
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-foreground">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Value section */}
      <section className="py-16 lg:py-24">
        <Container>
          <SectionHeading
            label="The business value"
            title={
              <>
                What your money <span className="text-gradient">actually buys</span>
              </>
            }
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: WandSparkles,
                title: "An online storefront in an hour",
                text: "Skip the flyers and phone-call ordering. Your profile, menu, prices and delivery zones go live the day you register — usually before lunch.",
              },
              {
                icon: ShieldCheck,
                title: "Prepaid, reconciled payments",
                text: "Customers pay via M-Pesa before the rider leaves. No cash disputes, no 'pole, nikulipia kesho'. Every payment matches an order automatically.",
              },
              {
                icon: Check,
                title: "Retention without extra work",
                text: "Repeat reminders, loyal-customer lists and promotions switch customers from 'occasional' to 'weekly'. Growth and Pro stations report 68% average repeat rates.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-white p-7 shadow-card">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-accent">
                  <v.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl text-foreground">{v.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container size="md">
          <SectionHeading
            label="Pricing FAQs"
            title={
              <>
                Questions about <span className="text-gradient">billing</span>
              </>
            }
          />
          <Accordion
            className="mt-10"
            items={[
              { q: "Do I need a card for the free trial?", a: "No. Register, set up your station, take real M-Pesa orders for 14 days, then choose a plan to keep selling." },
              { q: "What payment methods do my customers get?", a: "M-Pesa STK push on every station. Card payments can be enabled per business on the Growth and Pro plans." },
              { q: "Can I change plans later?", a: "Yes — upgrade or downgrade anytime from Billing. Changes prorate to your next billing date." },
              { q: "Is there a setup fee or commission?", a: "No setup fee, no commission on orders. The flat subscription is the only charge." },
            ]}
          />
          <div className="mt-10 text-center">
            <Button size="lg" onClick={() => choose(plans[0])}>
              Start your free trial
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function BillingToggle({ billing, onChange }: { billing: Billing; onChange: (b: Billing) => void }) {
  return (
    <div className="flex items-center rounded-xl border border-border bg-white p-1 shadow-card" role="group" aria-label="Billing period">
      {(["monthly", "annual"] as const).map((b) => (
        <button
          key={b}
          onClick={() => onChange(b)}
          aria-pressed={billing === b}
          className={cn(
            "relative rounded-lg px-4 py-2 text-sm font-semibold min-h-11",
            billing === b ? "text-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {billing === b && <span aria-hidden className="absolute inset-0 rounded-lg bg-brand-gradient shadow-accent" />}
          <span className="relative">
            {b === "monthly" ? "Monthly" : "Annual"}
            {b === "annual" && (
              <span className={cn("ml-1.5 rounded-full px-1.5 py-0.5 font-mono text-[10px]", billing === b ? "bg-white/20 text-white" : "bg-success-soft text-success")}>
                −17%
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}