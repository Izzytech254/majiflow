import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-60" />
      <div className="pointer-events-none absolute inset-0 animate-float">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0052FF]/25 blur-[130px]"
        />
      </div>

      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <AnimatedSection className="flex flex-col items-center gap-5">
            <SectionLabel tone="dark" pulse>
              Clean water, delivered simply
            </SectionLabel>
            <h2 className="font-display text-4xl leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Today's the day you <span className="text-gradient">stop carrying water.</span>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Join 240+ Kenyan refill stations and thousands of homes already ordering the modern
              way. Free to start, M-Pesa simple, tracker live.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href="/browse">
                <Button size="lg" className="group w-full sm:w-auto">
                  <Smartphone className="size-4" aria-hidden />
                  Order water
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/business/register">
                <Button size="lg" variant="dark" className="group w-full sm:w-auto">
                  Register your business
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </Link>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Free 14-day trial · No card · No commission
            </p>
          </AnimatedSection>
        </div>
      </Container>
    </section>
  );
}