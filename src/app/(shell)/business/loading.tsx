import { WaterSkeleton } from "@/components/motion/water-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <WaterSkeleton className="h-9 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <WaterSkeleton key={i} className="h-32 w-full rounded-[var(--radius-card)]" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <WaterSkeleton className="h-72 w-full rounded-[var(--radius-card)]" />
        <WaterSkeleton className="h-72 w-full rounded-[var(--radius-card)]" />
      </div>
    </div>
  );
}
