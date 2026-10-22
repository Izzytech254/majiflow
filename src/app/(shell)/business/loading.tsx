import { SkeletonBlock, SkeletonCard } from "@/components/ui/skeleton-card";
import { RouteProgressTrigger } from "@/components/motion/top-progress-bar";

export default function Loading() {
  return (
    <>
      <RouteProgressTrigger />
      <div className="space-y-6">
        <SkeletonBlock className="h-9 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} variant="metric" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <SkeletonCard variant="metric" className="h-72 w-full" />
          <SkeletonCard variant="metric" className="h-72 w-full" />
        </div>
      </div>
    </>
  );
}
