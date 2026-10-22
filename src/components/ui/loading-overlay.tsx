"use client";

import { ButtonLoader } from "@/components/ui/button-loader";

export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <ButtonLoader className="size-8 text-[var(--brand)]" label={message} />
        <p className="text-sm font-medium text-foreground">{message}</p>
      </div>
    </div>
  );
}
