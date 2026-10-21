import { WaterSkeleton } from "@/components/motion/water-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <WaterSkeleton className="h-32 w-full rounded-[var(--radius-card)]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <WaterSkeleton key={i} className="h-28 w-full rounded-[var(--radius-card)]" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <WaterSkeleton className="h-64 w-full rounded-[var(--radius-card)]" />
        <WaterSkeleton className="h-64 w-full rounded-[var(--radius-card)]" />
      </div>
    </div>
  );
}
