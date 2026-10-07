import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/shared/business-card";
import { Stagger, StaggerItem, AnimatedSection } from "@/components/ui/animated-section";
import { featuredBids } from "@/lib/data/businesses";
import { CITIES } from "@/lib/constants";

export function FeaturedBusinesses() {
  const featured = featuredBids();
  return (
    <section className="bg-muted/50 py-24 lg:py-32">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            align="left"
            className="max-w-xl"
            label="Near you, right now"
            pulseLabel
            title={
              <>
                Refill stations <span className="text-gradient">worth trusting</span> in your estate
              </>
            }
            description="Every station is independently owned, verified and rated by the neighbours who use it."
          />
          <Link href="/browse" className="hidden shrink-0 md:inline-flex">
            <Button size="lg" variant="secondary" className="group">
              Browse all stations
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </Link>
        </div>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {featured.map((b) => (
            <StaggerItem key={b.id}>
              <BusinessCard business={b} />
            </StaggerItem>
          ))}
        </Stagger>

        <AnimatedSection className="mt-12 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 pr-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <MapPin className="size-3.5 text-[#0052FF]" aria-hidden /> Also live in
          </span>
          {CITIES.map((c) => (
            <Link
              key={c}
              href={`/browse?city=${encodeURIComponent(c)}`}
              className="rounded-md border border-border bg-white px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground transition-colors hover:border-[#0052FF]/40 hover:text-[#0052FF]"
            >
              {c}
            </Link>
          ))}
        </AnimatedSection>
      </Container>
    </section>
  );
}