"use client";

import { useMemo, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PricingCard } from "@/components/shared/pricing-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { plans } from "@/lib/data/plans";
import type { Plan } from "@/lib/types";

export function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const { toast } = useToast();

  const handleChoose = (plan: Plan) => {
    toast({
      kind: plan.highlighted ? "success" : "info",
      title: `${plan.name} selected`,
      message: `Start your ${plan.trialDays}-day free trial — no card required.`,
    });
  };

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <Container className="relative">
        <SectionHeading
          label="Simple pricing"
          title={
            <>
              Plans that pay for themselves by{" "}
              <span className="text-gradient">the first week</span>
            </>
          }
          description="Flat SaaS pricing in Kenyan Shillings. No setup fees, no commission on orders — the KES you charge customers is the KES you keep."
        />

        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="flex items-center rounded-xl border border-border bg-white p-1 shadow-card" role="group" aria-label="Billing period">
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                aria-pressed={billing === b}
                className={`relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors min-h-11 ${
                  billing === b ? "text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {billing === b && (
                  <span aria-hidden className="absolute inset-0 rounded-lg bg-brand-gradient shadow-accent" />
                )}
                <span className="relative">
                  {b === "monthly" ? "Monthly" : "Annual"}
                  {b === "annual" && (
                    <span className={`ml-1.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] ${billing === b ? "bg-white/20 text-white" : "bg-success-soft text-success"}`}>
                      −17%
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className={plan.highlighted ? "lg:-mt-4" : ""}>
              <PricingCard plan={plan} annual={billing === "annual"} onChoose={handleChoose} />
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-dashed border-[#0052FF]/30 bg-white/70 p-6 text-center shadow-card sm:flex-row sm:text-left">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-warning-soft text-warning">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Every plan includes a 14-day free trial.</strong>{" "}
            Set up your profile, list your products and take real M-Pesa orders before you pay a
            shilling.
          </p>
          <Button variant="secondary" className="shrink-0" onClick={() => handleChoose(plans[0])}>
            Start free trial
            <Check className="size-4" aria-hidden />
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          All prices in Kenyan Shillings. Annual billing saves two months per year.{" "}
          <a href="/contact" className="font-semibold text-[#0052FF] hover:underline">
            Talk to us for multi-branch quotes →
          </a>
        </p>
      </Container>
    </section>
  );
}