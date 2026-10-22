import { Container } from "@/components/ui/container";
import { SkeletonCard, SkeletonBlock } from "@/components/ui/skeleton-card";
import { RouteProgressTrigger } from "@/components/motion/top-progress-bar";

export default function Loading() {
  return (
    <>
      <RouteProgressTrigger />

      {/* Hero band, matching the real hero proportions. */}
      <section className="relative overflow-hidden bg-[#04122c]">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_20%,rgba(0,87,230,0.35),transparent_70%)]" />
        <Container className="relative py-16 lg:py-24">
          <div className="max-w-xl space-y-4">
            <SkeletonBlock className="h-4 w-32 rounded-full bg-white/10" />
            <SkeletonBlock className="h-11 w-full bg-white/10" />
            <SkeletonBlock className="h-11 w-3/4 bg-white/10" />
            <SkeletonBlock className="h-4 w-2/3 bg-white/10" />
          </div>
        </Container>
      </section>

      {/* Trust metrics row. */}
      <section className="border-y border-border bg-white">
        <Container className="grid gap-4 py-12 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} variant="metric" />
          ))}
        </Container>
      </section>

      {/* Featured stations. */}
      <Container className="py-14 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} variant="station" />
          ))}
        </div>
      </Container>
    </>
  );
}
