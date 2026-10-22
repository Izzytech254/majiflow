"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessCheckProps {
  className?: string;
}

/**
 * Order confirmed: a quiet tick inside a soft brand disc, with one ripple
 * ring that expands and fades exactly once.
 */
export function SuccessCheck({ className }: SuccessCheckProps) {
  return (
    <div className={cn("relative flex size-32 items-center justify-center", className)}>
      <span aria-hidden className="absolute inset-0 rounded-full border border-[var(--brand)]/35 loader-ripple-once" />
      <span className="relative flex size-20 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
        <Check className="size-9" strokeWidth={2.5} aria-hidden />
      </span>
    </div>
  );
}
