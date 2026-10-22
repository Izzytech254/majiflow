"use client";

import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface MpesaWaitProps {
  className?: string;
  /** Optional detail under the headline, e.g. the amount. */
  detail?: string;
}

/**
 * The waiting state for an M-Pesa STK push: a calm brand-coloured pulse ring
 * around a phone, so the customer knows the prompt is on its way.
 */
export function MpesaWait({ className, detail }: MpesaWaitProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative flex size-32 items-center justify-center">
        <span aria-hidden className="absolute inset-0 rounded-full border-2 border-[var(--brand)]/35 loader-pulse" />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-[var(--brand)]/35 loader-pulse"
          style={{ animationDelay: "1.2s" }}
        />
        <span className="relative flex size-16 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
          <Smartphone className="size-7" aria-hidden />
        </span>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-semibold text-foreground">Check your phone and enter your PIN</p>
        {detail ? <p className="text-sm text-muted-foreground">{detail}</p> : null}
      </div>
    </div>
  );
}
