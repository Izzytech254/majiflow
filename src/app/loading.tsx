import { Container } from "@/components/ui/container";
import { SkeletonCard, SkeletonBlock } from "@/components/ui/skeleton-card";
import { RouteProgressTrigger } from "@/components/motion/top-progress-bar";

export default function Loading() {
  return (
    <>
      <RouteProgressTrigger />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24">
        <SkeletonBlock className="h-9 w-40 rounded-full" />
        <SkeletonCard variant="text" className="w-full max-w-sm" lines={3} />
      </Container>
    </>
  );
}
