import { cn } from "@/lib/utils";

/**
 * Shimmering placeholder. A soft light sweep travels across the block the way
 * light moves over the surface of water.
 */
export function WaterSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative overflow-hidden rounded-lg bg-[var(--surface-3)]", className)}>
      <span
        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent"
        style={{ animation: "water-shimmer 1.7s ease-in-out infinite" }}
      />
    </div>
  );
}

export function StationCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card p-5">
      <WaterSkeleton className="h-28 w-full rounded-[var(--radius-card-sm)]" />
      <WaterSkeleton className="mt-4 h-4 w-2/3" />
      <WaterSkeleton className="mt-2.5 h-3 w-1/2" />
      <div className="mt-4 flex items-center gap-2">
        <WaterSkeleton className="h-6 w-16 rounded-full" />
        <WaterSkeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card p-4">
      <WaterSkeleton className="h-24 w-full rounded-[var(--radius-card-sm)]" />
      <WaterSkeleton className="mt-3.5 h-4 w-3/4" />
      <WaterSkeleton className="mt-2 h-3 w-1/3" />
      <WaterSkeleton className="mt-4 h-9 w-full rounded-xl" />
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-border py-4 last:border-0">
      <WaterSkeleton className="size-14 shrink-0 rounded-[var(--radius-card-sm)]" />
      <div className="flex-1">
        <WaterSkeleton className="h-4 w-1/2" />
        <WaterSkeleton className="mt-2 h-3 w-3/4" />
      </div>
      <WaterSkeleton className="h-4 w-12" />
    </div>
  );
}
