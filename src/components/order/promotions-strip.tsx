import { Sparkles, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Promotion {
  id: string;
  title: string;
  detail?: string;
}

/**
 * Compact horizontal strip of active offers. Offers are derived from station
 * data (e.g. free-delivery threshold) rather than invented copy.
 */
export function PromotionsStrip({
  promotions,
  className,
}: {
  promotions: Promotion[];
  className?: string;
}) {
  if (promotions.length === 0) return null;
  return (
    <div className={cn("flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>
      {promotions.map((p) => (
        <div
          key={p.id}
          className="flex min-w-[15rem] flex-1 items-center gap-3 rounded-2xl border border-[#0052FF]/15 bg-cta-soft/50 px-4 py-3"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#0052FF] text-white">
            <Tag className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{p.title}</p>
            {p.detail && <p className="truncate text-xs text-muted-foreground">{p.detail}</p>}
          </div>
          <Sparkles className="ml-auto size-4 shrink-0 text-[#0052FF]" aria-hidden />
        </div>
      ))}
    </div>
  );
}
