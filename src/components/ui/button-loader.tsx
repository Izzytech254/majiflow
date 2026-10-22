"use client";

import { cn } from "@/lib/utils";

export type ButtonLoaderState = "loading" | "success";

interface ButtonLoaderProps {
  state?: ButtonLoaderState;
  className?: string;
  /** Announced to assistive tech; omit to stay silent inside buttons. */
  label?: string;
}

/**
 * The inline busy indicator for buttons: a thin brand-coloured ring while the
 * request runs, then a tick once it succeeds. Deliberately small so the
 * button never changes size.
 */
export function ButtonLoader({ state = "loading", className, label }: ButtonLoaderProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("relative inline-flex items-center justify-center", className)}
    >
      {state === "success" ? (
        <svg viewBox="0 0 24 24" className="size-full text-[var(--brand)]" aria-hidden>
          <path
            d="M4.8 12.4 9.6 17.2 19.2 6.9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            className="loader-check"
          />
        </svg>
      ) : (
        <span
          aria-hidden
          className="size-full rounded-full border-2 border-current border-r-transparent loader-ring"
        />
      )}
    </span>
  );
}
