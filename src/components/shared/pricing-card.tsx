"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { Plan } from "@/lib/types";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  plan: Plan;
  annual: boolean;
  /** Where the CTA sends the visitor; defaults to the business sign-up. */
  href?: string;
  className?: string;
}

export function PricingCard({ plan, annual, href = "/business/register", className }: PricingCardProps) {
  const price = annual ? plan.annualPrice / 12 : plan.monthlyPrice;
  const highlighted = Boolean(plan.highlighted);

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-card",
        highlighted ? "border-[var(--brand)] ring-2 ring-[var(--brand)]/15" : "border-border",
        className
      )}
    >
      {highlighted && (
        <span className="absolute -top-3 left-6 rounded-full bg-[var(--brand)] px-3 py-1 text-[11px] font-semibold text-white">
          Most popular
        </span>
      )}

      <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{plan.audience}</p>

      <p className="mt-5 font-display text-4xl font-black tracking-tight text-foreground">
        {formatKES(Math.round(price))}
        <span className="text-sm font-medium text-muted-foreground">/mo</span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {annual ? `${formatKES(plan.annualPrice)} billed yearly` : "Billed monthly"}
      </p>

      <ul className="mt-5 flex-1 space-y-2.5">
        {plan.features.slice(0, 5).map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
            {f}
          </li>
        ))}
      </ul>

      {plan.planned && plan.planned.length > 0 && (
        <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          Coming soon: {plan.planned.slice(0, 3).join(" · ")}
        </p>
      )}

      <Link href={href} className="mt-5 block">
        <Button
          size="lg"
          variant={highlighted ? "default" : "secondary"}
          className="w-full"
          aria-label={`Start the ${plan.name} plan`}
        >
          {plan.cta}
        </Button>
      </Link>
    </div>
  );
}
