import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/ui/animated-section";
import {
  MapPin,
  Store,
  PackagePlus,
  Wallet,
  Truck,
  Bell,
  BadgeCheck,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

const customerSteps = [
  {
    icon: MapPin,
    title: "Choose your area",
    text: "Select your estate — or let us detect it. We show only verified refill stations that deliver to your door.",
    detail: "Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Thika & Machakos — more towns monthly.",
  },
  {
    icon: Store,
    title: "Pick your station",
    text: "Compare ratings, delivery fees, free-delivery minimums and what's on the menu. Every station is an independent Kenyan business.",
    detail: "See lab results, reviews and real delivery times before you choose.",
  },
  {
    icon: PackagePlus,
    title: "Build your order",
    text: "Add 20L cans, 5L bottles, dispensers or office plans. Set quantities, then tell us where and when to deliver.",
    detail: "Save addresses so next week's refill is one tap.",
  },
  {
    icon: Wallet,
    title: "Pay with M-Pesa",
    text: "Choose M-Pesa at checkout and confirm the STK push on your phone. Payment is held and released to the station only when your order ships.",
    detail: "Card payments available at stations that have enabled them.",
  },
  {
    icon: Truck,
    title: "Track until arrival",
    text: "Follow your order from accepted → out for delivery → delivered. The rider calls before arrival — there is always water at your gate.",
    detail: "Average delivery in major towns: 40–60 minutes.",
  },
  {
    icon: Bell,
    title: "Never run dry again",
    text: "Set a weekly or two-weekly refill schedule and get a reminder a day before. Pause or skip whenever you like.",
    detail: "Standing orders save you up to 15% on delivery fees.",
  },
];

const faqItems = [
  { q: "How fast is delivery?", a: "Stations in Nairobi, Mombasa, Kisumu and Nakuru typically deliver within 40–60 minutes during the day. Each business publishes its own average on its profile." },
  { q: "Is there a free-delivery minimum?", a: "Many stations offer free delivery above a set amount, for example KES 1,000. It's always shown on the station's page before you order." },
  { q: "What if the delivery arrives damaged?", a: "Tell us within 24 hours with a photo and the station replaces the product at no cost. MajiFlow follows up until it's resolved." },
  { q: "Can I pay cash on delivery?", a: "Not on the platform — payments are prepaid via M-Pesa or card. This keeps riders, drivers and stations accountable, and means nobody carries cash." },
];

export default function HowItWorks() {
  return (
    <>
      <PageHero
        label="How it works"
        pulseLabel
        title={
          <>
            From thirsty to <span className="text-gradient">refilled</span> in five steps
          </>
        }
        description="Ordering drinking water in Kenya should be easier than schlepping a can up three floors. Here's exactly how it works."
      >
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/browse">
            <Button size="lg" className="group w-full sm:w-auto">
              Browse stations
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Create an account
            </Button>
          </Link>
        </div>
      </PageHero>

      <section className="py-16 lg:py-24">
        <Container>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {customerSteps.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="group flex h-full flex-col rounded-2xl border border-border bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-layered">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-accent transition-transform duration-300 group-hover:scale-110">
                      <s.icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-mono text-sm font-bold text-[#0052FF]/40">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl text-foreground">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  <p className="mt-4 border-t border-border pt-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    {s.detail}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading
              label="Works on any phone"
              title={
                <>
                  No app to install. <span className="text-gradient">No data-heavy pages.</span>
                </>
              }
              description="The whole ordering flow runs in your browser and works on even modest phones and 2G. SMS receipts, M-Pesa pushes and WhatsApp updates mean you're never offline."
            />
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-background px-6 py-4 shadow-card">
              <Smartphone className="size-6 text-[#0052FF]" aria-hidden />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Try the demo order</p>
                <p className="text-xs text-muted-foreground">
                  Full cart → M-Pesa → tracking flow, ready to explore.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container size="md">
          <SectionHeading
            label="Quick answers"
            title={
              <>
                Delivery you can <span className="text-gradient">count on</span>
              </>
            }
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2" stagger={0.07}>
            {faqItems.map((f) => (
              <StaggerItem key={f.q}>
                <div className="h-full rounded-2xl border border-border bg-white p-6 shadow-card">
                  <h3 className="flex items-start gap-2.5 font-semibold text-foreground">
                    <BadgeCheck className="mt-0.5 size-5 shrink-0 text-[#0052FF]" aria-hidden />
                    {f.q}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}