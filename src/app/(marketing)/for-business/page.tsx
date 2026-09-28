import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Coins,
  PackagePlus,
  Repeat,
  Store,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stagger, StaggerItem, AnimatedSection } from "@/components/ui/animated-section";
import { CtaSection } from "@/components/home/cta-section";

const pillars = [
  {
    icon: Store,
    title: "Your own online storefront",
    text: "A branded profile listing your menu in KES, your delivery areas, fees and reviews. Built in under an hour, discoverable by neighbours searching for water.",
  },
  {
    icon: Repeat,
    title: "Customers who come back",
    text: "Repeat-order reminders and standing schedules turn one-off drop-ins into weekly deliveries. Growth and Pro stations average a 68% repeat rate.",
  },
  {
    icon: Coins,
    title: "Prepaid payments, no cash angst",
    text: "M-Pesa STK or card, paid before the rider leaves. Every payment reconciles to an order — your till balance and your dashboard always agree.",
  },
  {
    icon: BarChart3,
    title: "Numbers that make sense",
    text: "Revenue per day, popular products, stock alerts and rider performance — a dashboard you can read between deliveries, not a spreadsheet project.",
  },
  {
    icon: Users,
    title: "Team and customers together",
    text: "Staff accounts on Growth, customer history and notes, and SMS/WhatsApp updates — the whole business in one calm screen.",
  },
  {
    icon: PackagePlus,
    title: "Experiment without risk",
    text: "Run a discount, bundle cans with a dispenser rental, or push a new 5L size. Change menu prices in a tap — go live instantly.",
  },
];

const numbers = [
  { value: "240+", label: "stations already online" },
  { value: "2.8M+", label: "cans delivered through the platform" },
  { value: "34%", label: "average revenue growth after going online" },
  { value: "68%", label: "repeat-customer rate on Growth & Pro" },
];

export default function ForBusiness() {
  return (
    <>
      <PageHero
        tone="dark"
        label="For businesses"
        pulseLabel
        title={
          <>
            Your station, your prices. <span className="text-gradient">Our storefront.</span>
          </>
        }
        description="MajiFlow gives Kenya's water refill businesses a professional online storefront, an easy order and delivery back office, and prepaid M-Pesa payments — no commissions, no lock-in."
      >
        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/business/register">
            <Button size="lg" className="group w-full sm:w-auto">
              Register your business
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </Link>
          <Link href="/business/demo">
            <Button size="lg" variant="dark" className="w-full sm:w-auto">
              See the live dashboard
            </Button>
          </Link>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          14-day free trial · No card · No commission
        </p>
      </PageHero>

      <section className="relative overflow-hidden bg-ink py-14">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-50" />
        <Container className="relative grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {numbers.map((n) => (
            <div key={n.label} className="bg-ink p-7 text-center">
              <p className="font-display text-3xl text-white">{n.value}</p>
              <p className="mt-1.5 text-xs text-slate-400">{n.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <SectionHeading
            label="What's included"
            title={
              <>
                Everything between your station and a{" "}
                <span className="text-gradient">standing customer</span>
              </>
            }
            description="One subscription covers the storefront, orders, payments, delivery and analytics. The only thing it doesn't do is carry the cans."
          />
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {pillars.map((p) => (
              <StaggerItem key={p.title}>
                <div className="group flex h-full flex-col rounded-2xl border border-border bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-layered">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-accent transition-transform duration-300 group-hover:scale-110">
                    <p.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-6 font-display text-xl text-foreground">{p.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-muted/50 py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading
                align="left"
                label="Proof it works"
                title={
                  <>
                    From a phone call to a <span className="text-gradient">queue of orders</span>
                  </>
                }
                description="“We signed up on a Monday lunch break. By Friday we had 40 online orders and I was telling my brother how to clear stock alerts on the dashboard. It's like the shop grew a second head.”"
              />
              <div className="mt-6 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                  GM
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Grace Mwangi</p>
                  <p className="text-xs text-muted-foreground">Owner, BioWater Refill Station · Kasarani</p>
                </div>
              </div>
            </div>
            <AnimatedSection>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-layered">
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Week one, BioWater Kasarani
                  </p>
                  <Badge variant="success">Live · Growth plan</Badge>
                </div>
                <div className="space-y-2 px-5 py-4">
                  {[
                    { day: "Monday lunch", orders: "14 orders", ksh: "KES 6,300", highlight: false },
                    { day: "Wednesday", orders: "27 orders", ksh: "KES 12,150", highlight: false },
                    { day: "Friday", orders: "40 orders", ksh: "KES 18,000", highlight: true },
                  ].map((o) => (
                    <div
                      key={o.day}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3.5 ${o.highlight ? "border-[#0052FF]/30 bg-[#0052FF]/5" : "border-border"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Bell className={`size-4 ${o.highlight ? "text-[#0052FF]" : "text-muted-foreground"}`} aria-hidden />
                        <p className="text-sm font-medium text-foreground">{o.day}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{o.orders}</p>
                        <p className="text-xs text-muted-foreground">{o.ksh}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border px-5 py-3.5">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-mono text-xs font-semibold text-success">+12 recruits</span>{" "}
                    from repeat reminders that week
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container size="md">
          <SectionHeading
            label="Getting started"
            title={
              <>
                Online in <span className="text-gradient">four steps</span>
              </>
            }
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
            {[
              { n: "01", t: "Create your profile", d: "Business name, location, M-Pesa till or Paybill number." },
              { n: "02", t: "List your products", d: "Cans, bottles, dispensers and prices in KES. Copy from a template if you like." },
              { n: "03", t: "Set delivery zones", d: "Choose estates, delivery fees and free-delivery minimums." },
              { n: "04", t: "Go live", d: "Share your link, take the first prepaid order, watch it track itself." },
            ].map((s) => (
              <StaggerItem key={s.n}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-card">
                  <p className="font-mono text-sm font-bold text-[#0052FF]">{s.n}</p>
                  <h3 className="mt-3 font-semibold text-foreground">{s.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-10 text-center">
            <Link href="/business/register">
              <Button size="lg" className="group">
                Start the 14-day free trial
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