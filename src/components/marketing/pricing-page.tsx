"use client";

import { useState } from "react";
import { Check, Minus, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { PricingCard } from "@/components/shared/pricing-card";
import { Accordion } from "@/components/ui/accordion";
import { plans } from "@/lib/data/plans";
import type { Plan, PlanName } from "@/lib/types";
import { cn } from "@/lib/utils";

const comparison: { feature: string; plans: (string | boolean)[] }[] = [
  { feature: "Business profile & online menu", plans: [true, true, true] },
  { feature: "Orders from the website", plans: [true, true, true] },
  { feature: "M-Pesa checkout", plans: [true, true, true] },
  { feature: "Sales reports from your orders", plans: [true, true, true] },
  { feature: "Stock alerts", plans: [false, true, true] },
  { feature: "Advanced analytics & charts", plans: [false, true, true] },
  { feature: "Promotions dashboard", plans: [false, true, true] },
  { feature: "Staff accounts", plans: [false, "Planned", "Planned"] },
  { feature: "Customer SMS & WhatsApp updates", plans: [false, "Planned", "Planned"] },
  { feature: "Card payments", plans: ["Planned", "Planned", "Planned"] },
  { feature: "Multiple branches & fleets", plans: [false, false, "Planned"] },
];

const planIds: PlanName[] = ["starter", "growth", "pro"];

export function PricingPage() {
  const [annual, setAnnual] = useState(true);
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
        description="Flat monthly pricing in Kenyan Shillings. Every plan starts with a 14-day free trial, and you keep the full price your customers pay."
      />

      <section className="py-16 lg:py-20">
        <Container>
          <div className="flex justify-center">
            <BillingToggle annual={annual} onChange={setAnnual} />
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className={plan.highlighted ? "lg:-mt-3" : ""}>
                <PricingCard plan={plan} annual={annual} />
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-card sm:flex-row sm:text-left">
            <ShieldCheck className="size-5 shrink-0 text-[#0052FF]" aria-hidden />
            <p className="text-sm leading-relaxed text-foreground/85">
              No surprise fees, ever. You keep the full KES price customers pay, and you can cancel
              any time.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-card py-16 lg:py-20">
        <Container>
          <SectionHeading
            label="Compare plans"
            title={
              <>
                What is included, <span className="text-gradient">and what is next</span>
              </>
            }
          />
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border shadow-card">
            <table className="w-full min-w-[560px] border-collapse bg-card text-left text-sm">
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
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <td className="px-6 py-3 font-medium text-foreground">{row.feature}</td>
                    {row.plans.map((val, i) => (
                      <td key={i} className="px-6 py-3 text-center">
                        {val === true ? (
                          <span className="inline-flex size-5 items-center justify-center rounded-full bg-success-soft text-success">
                            <Check className="size-3" strokeWidth={3} aria-hidden />
                          </span>
                        ) : val === false ? (
                          <span className="inline-flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Minus className="size-3" aria-hidden />
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">{val}</span>
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

      <section className="py-16 lg:py-20">
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
              { q: "How does the free trial work?", a: "Every plan starts with a 14-day free trial. We only charge you once the trial ends, and you can cancel before then at no cost." },
              { q: "Which payment methods can my customers use?", a: "Customers pay with M-Pesa at checkout, and with card where a station accepts it. Payments settle to your station account." },
              { q: "Can I change plans at any time?", a: "Yes. Move up or down between plans from your billing settings, and the change is prorated on your next invoice." },
              { q: "Is there a commission on orders?", a: "No. You pay a flat monthly subscription and keep the full price your customers pay." },
            ]}
          />
        </Container>
      </section>
    </>
  );
}

function BillingToggle({ annual, onChange }: { annual: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-border bg-card p-1 text-sm shadow-card"
      role="group"
      aria-label="Billing period"
    >
      {[
        { id: false, label: "Monthly" },
        { id: true, label: "Annual" },
      ].map((option) => (
        <button
          key={String(option.id)}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={annual === option.id}
          className={cn(
            "rounded-full px-4 py-1.5 font-semibold transition-colors",
            annual === option.id ? "bg-[#0052FF] text-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
          {option.id && <span className="ml-1.5 text-[11px] font-medium opacity-80">save 17%</span>}
        </button>
      ))}
    </div>
  );
}
