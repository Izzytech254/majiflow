import { SkeletonCard } from "@/components/ui/skeleton-card";
import { RouteProgressTrigger } from "@/components/motion/top-progress-bar";

export default function Loading() {
  return (
    <>
      <RouteProgressTrigger />
      <div className="space-y-6">
        <SkeletonCard variant="metric" className="h-32 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} variant="metric" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <SkeletonCard variant="metric" className="h-64 w-full" />
          <SkeletonCard variant="metric" className="h-64 w-full" />
        </div>
      </div>
    </>
  );
}
