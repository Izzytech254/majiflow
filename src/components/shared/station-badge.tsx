import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StationBadgeProps {
  /** The station's current approval flag; kept so the two tones still differ visually. */
  verified: boolean;
  /** Current subscription flag, used only to pick the darker tone. */
  paid?: boolean;
  className?: string;
}

/**
 * Verified listing badge.
 */
export function StationBadge({ verified, paid, className }: StationBadgeProps) {
  if (!verified) return null;
  const isPaid = Boolean(paid);

  return (
    <span
      title="Verified listing"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        isPaid
          ? "border-transparent bg-[var(--brand)] text-white shadow-soft"
          : "border-border bg-muted text-muted-foreground",
        className
      )}
    >
      <BadgeCheck className="size-3.5" aria-hidden />
      Verified
    </span>
  );
}
