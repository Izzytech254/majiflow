"use client";

import { Check, ArrowRight } from "lucide-react";
import type { Plan } from "@/lib/types";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientBorderCard } from "@/components/ui/card";

interface PricingCardProps {
  plan: Plan;
  annual: boolean;
  onChoose?: (plan: Plan) => void;
  className?: string;
}

export function PricingCard({ plan, annual, onChoose, className }: PricingCardProps) {
  const price = annual ? plan.annualPrice / 12 : plan.monthlyPrice;
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-foreground">{plan.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
        </div>
        {plan.highlighted && (
          <Badge variant="accent" className="shrink-0">
            Most popular
          </Badge>
        )}
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-[2.5rem] leading-none font-bold tracking-tight text-foreground">
          {formatKES(Math.round(price))}
        </span>
        <span className="text-sm text-muted-foreground">/ month</span>
      </div>
      <p className="mt-1.5 text-xs font-mono uppercase tracking-wide text-muted-foreground">
        {annual ? `Billed annually — ${formatKES(plan.annualPrice)}/yr` : `Billed monthly`}
      </p>

      <ul className="mt-6 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/85">
            <span
              className={cn(
                "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full",
                plan.highlighted ? "bg-brand-gradient text-white" : "bg-success-soft text-success"
              )}
            >
              <Check className="size-3" strokeWidth={3} aria-hidden />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3">
        <Button
          size="lg"
          variant={plan.highlighted ? "default" : "secondary"}
          onClick={() => onChoose?.(plan)}
          className="group w-full"
          aria-label={`Start with the ${plan.name} plan`}
        >
          {plan.cta}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
        <p className="text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {plan.audience} · {plan.trialDays}-day free trial
        </p>
      </div>
    </>
  );

  const CardWrap = plan.highlighted ? GradientBorderCard : "div";

  return (
    <CardWrap className={className}>
      <div className={cn("flex h-full flex-col p-7", plan.highlighted && "p-[calc(1.75rem-1px)]")}>
        {inner}
      </div>
    </CardWrap>
  );
}