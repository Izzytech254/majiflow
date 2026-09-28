import Link from "next/link";
import { ArrowRight, HeartHandshake, Repeat, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/ui/animated-section";
import { CtaSection } from "@/components/home/cta-section";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust is our product",
    text: "Every station we list is verified — identity, licence and water testing. Ratings come from real neighbours in your estate, and we actually look at them.",
  },
  {
    icon: Repeat,
    title: "Local first",
    text: "Water is delivered by local businesses, not flown in. We build software that makes Kasarani, Nyali and Milimani run better — not that replaces them.",
  },
  {
    icon: Users,
    title: "Lift the whole chain",
    text: "When a station grows, riders get more trips, staff get steadier work and households get reliable water. Our growth story is their growth story.",
  },
  {
    icon: HeartHandshake,
    title: "Fair to businesses",
    text: "Flat pricing, no commission on water, data you can export, and no lock-in. If MajiFlow stops being worth it, you leave with everything.",
  },
];

const timeline = [
  { year: "2024", text: "Two friends in Nairobi get tired of juggling refill shop phone calls. MajiFlow is sketched on a napkin at a Westlands cafe." },
  { year: "2025", text: "First 12 stations pilot online ordering. 4,000 cans delivered in the first month — and 0 lost to cash disputes." },
  { year: "2026", text: "240+ stations live, from Kasarani to Kwale. M-Pesa-native, SMS-driven and built for 2G phones." },
];

export default function About() {
  return (
    <>
      <PageHero
        label="About us"
        title={
          <>
            We believe the best water company in town is{" "}
            <span className="text-gradient">already in town</span>
          </>
        }
        description="MajiFlow exists so Kenyan water refill businesses can run their shop online — and so homes and offices can get clean, affordable water without carrying it."
      />

      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionHeading
                align="left"
                label="Why we exist"
                title="Water businesses already do the hard part. We make it visible."
              />
              <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
                Refill stations across Kenya already filter, test and deliver excellent water. What
                they lack is storefront software: a way to show up online, take prepaid orders, and
                prove to new customers that they're trustworthy.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                That's the gap MajiFlow fills. It's a multi-tenant platform — each business has its
                own profile, customers and dashboard — built specifically for how Kenya orders,
                pays (M-Pesa), and lives (estates, apartments, office blocks).
              </p>
            </div>
            <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.07}>
              {values.map((v) => (
                <StaggerItem key={v.title}>
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-layered">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-accent">
                      <v.icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-semibold text-foreground">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <SectionHeading
            label="The short story"
            title={
              <>
                From napkin to <span className="text-gradient">240 stations</span>
              </>
            }
          />
          <Stagger className="mx-auto mt-12 max-w-2xl" stagger={0.1}>
            {timeline.map((t) => (
              <StaggerItem key={t.year}>
                <div className="relative flex gap-5 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-mono text-[11px] font-bold text-white shadow-accent">
                      {t.year.slice(2)}
                    </span>
                    {t !== timeline[timeline.length - 1] && (
                      <span className="mt-1 w-px flex-1 bg-gradient-to-b from-[#0052FF]/40 to-transparent" />
                    )}
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-[#0052FF]">{t.year}</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85">{t.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container size="md">
          <div className="rounded-3xl border border-[#0052FF]/20 bg-white p-8 text-center shadow-card sm:p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Our promise to you
            </p>
            <p className="mx-auto mt-4 max-w-xl font-display text-2xl leading-snug text-foreground sm:text-3xl">
              "We measure success in cans delivered, customers retained, and the evening a parent
              realises they didn't carry water home today."
            </p>
            <p className="mt-5 text-sm text-muted-foreground">— The MajiFlow team, Nairobi</p>
            <Link href="/contact" className="mt-8 inline-flex">
              <Button size="lg" className="group">
                Say hello
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}