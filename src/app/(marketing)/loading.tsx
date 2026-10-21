import { Container } from "@/components/ui/container";
import { ProductCardSkeleton, WaterSkeleton } from "@/components/motion/water-skeleton";

export default function Loading() {
  return (
    <>
      <section className="border-b border-border bg-surface-2">
        <Container className="py-14 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <WaterSkeleton className="mx-auto h-10 w-3/4" />
            <WaterSkeleton className="mx-auto h-5 w-1/2" />
            <WaterSkeleton className="mx-auto h-11 w-40 rounded-xl" />
          </div>
        </Container>
      </section>
      <Container className="py-14 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </>
  );
}
