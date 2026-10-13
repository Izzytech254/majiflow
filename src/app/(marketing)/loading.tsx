import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/feedback";

export default function Loading() {
  return (
    <>
      <section className="border-b border-border bg-background">
        <Container className="py-14 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <Skeleton className="mx-auto h-10 w-3/4" />
            <Skeleton className="mx-auto h-5 w-1/2" />
          </div>
        </Container>
      </section>
      <Container className="py-14 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      </Container>
    </>
  );
}
