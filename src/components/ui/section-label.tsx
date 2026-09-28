import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SectionLabelProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Show a pulsing live dot before the label. */
  pulse?: boolean;
  tone?: "light" | "dark";
}

export function SectionLabel({ className, pulse, tone = "light", children, ...props }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em]",
        tone === "light" ? "text-muted-foreground" : "text-slate-400",
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full rounded-full bg-[#0052FF] animate-ping-slow" />
          <span className="relative inline-flex size-2 rounded-full bg-[#0052FF]" />
        </span>
      )}
      {children}
    </p>
  );
}