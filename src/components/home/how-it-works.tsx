import Link from "next/link";
import { MapPin, Store, PackagePlus, Wallet, Truck, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { AnimatedSection, Stagger, StaggerItem } from "@/components/ui/animated-section";

const steps = [
  {
    icon: MapPin,
    title: "Pick your location",
    text: "Tell us your estate — Kasarani, Nyali, Milimani or 40+ more — and we'll show refill stations that deliver there.",
  },
  {
    icon: Store,
    title: "Choose a trusted station",
    text: "Browse verified businesses with live ratings, delivery fees and lab-tested water. Every station operates independently.",
  },
  {
    icon: PackagePlus,
    title: "Order your refills",
    text: "Add 20L cans, 5L bottles, dispensers or office plans to your cart and set a delivery window.",
  },
  {
    icon: Wallet,
    title: "Pay with M-Pesa",
    text: "Confirm the STK push on your phone. Cards work too wherever a station has enabled them.",
  },
  {
    icon: Truck,
    title: "Track to your door",
    text: "Watch your order go out for delivery, get a call from the rider, and receive your clean refill.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              label="How it works"
              pulseLabel
              title={
                <>
                  From thirsty to refilled in <span className="text-gradient">five steps</span>
                </>
              }
              description="No accounts with every station, no cash in your pocket, no hauling cans across town. Just order, pay and receive."
            />
            <AnimatedSection delay={0.15} className="mt-8">
              <Link href="/browse">
                <Button size="lg" className="group">
                  Find your station
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Button>
              </Link>
            </AnimatedSection>
          </div>

          <Stagger className="flex flex-col gap-4" stagger={0.09}>
            {steps.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="group flex gap-5 rounded-2xl border border-border bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-[#0052FF]/25 hover:shadow-layered sm:p-6">
                  <div className="relative flex flex-col items-center">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-accent transition-transform duration-300 group-hover:scale-110">
                      <s.icon className="size-5" aria-hidden />
                    </span>
                    <span className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#0052FF]">
                      Step {i + 1}
                    </span>
                    {i < steps.length - 1 && (
                      <span className="absolute -bottom-4 left-1/2 h-4 w-px -translate-x-1/2 bg-border sm:hidden" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}