import Link from "next/link";
import { CheckCircle2, LayoutDashboard, PhoneCall, Repeat2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection, Stagger, StaggerItem } from "@/components/ui/animated-section";

const checklist = [
  "Accept or reject orders in one tap — riders get pushed SMS updates",
  "Set delivery zones, fees and free-delivery minimums for every estate",
  "Stock alerts before you run out of cans on a busy Friday",
  "Customer list with order history, totals and repeat rate",
  "Promotions: discounts and bundles you can switch on in minutes",
];

export function DashboardFeature() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHeading
              align="left"
              label="The business dashboard"
              title={
                <>
                  A back office that feels like a{" "}
                  <span className="text-gradient">morning brew</span>, not bookkeeping
                </>
              }
              description="Everything you need to run orders, delivery and customers from one calm screen. Clean enough to check in 60 seconds, deep enough for real decisions."
            />
            <Stagger className="mt-8 grid gap-3 sm:grid-cols-2" stagger={0.06}>
              {checklist.map((c) => (
                <StaggerItem key={c}>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
                    <p className="text-sm leading-relaxed text-foreground/85">{c}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <AnimatedSection delay={0.2} className="mt-9">
              <div className="flex flex-wrap gap-3">
                <Link href="/business/demo">
                  <Button size="lg" className="group">
                    Explore the live demo
                    <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </Button>
                </Link>
                <Link href="/business/register">
                  <Button size="lg" variant="secondary">
                    Start free trial
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>

          {/* Dashboard preview */}
          <AnimatedSection delay={0.1} className="relative">
            <div aria-hidden className="pointer-events-none absolute -inset-8 bg-radial-glow" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-layered">
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <LayoutDashboard className="size-4 text-[#0052FF]" aria-hidden />
                  BioWater Refill Station
                </div>
                <Badge variant="success">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-success" />
                  </span>
                  Growth · Live
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-3 px-5 pt-4">
                {[
                  { label: "Today", value: "KES 48,250", up: true },
                  { label: "Orders", value: "34", up: true },
                  { label: "Pending", value: "5", up: false },
                  { label: "Out", value: "9", up: false },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-muted/70 p-2.5">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
                    <p className="mt-0.5 truncate text-sm font-bold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="px-5 pt-4">
                <div className="flex items-baseline justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Weekly revenue
                  </p>
                  <p className="text-xs font-semibold text-success">+12.4%</p>
                </div>
                <div className="mt-2 flex h-20 items-end gap-1.5">
                  {[31800, 42900, 36600, 52400, 61000, 47300, 44150].map((v, i) => (
                    <div key={i} className="relative flex-1">
                      <div
                        className="w-full rounded-t-md bg-brand-gradient"
                        style={{ height: `${(v / 61000) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 px-5 pb-5 pt-4">
                {[
                  { n: "#MF-98121", c: "Jane Wanjiku", a: "Kasarani", total: "KES 820", s: "Out for delivery", tone: "accent" },
                  { n: "#MF-98120", c: "Moses Baraka", a: "Roysambu", total: "KES 120", s: "Accepted", tone: "softAccent" },
                ].map((o) => (
                  <div key={o.n} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {o.n} · {o.c}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{o.a}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <p className="text-xs font-bold text-foreground">{o.total}</p>
                      <Badge variant={o.tone as "accent"} className="hidden sm:inline-flex">
                        {o.s}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating chips */}
            <div className="absolute -left-4 -top-4 hidden rounded-xl border border-border bg-white px-3.5 py-2.5 shadow-card md:flex md:items-center md:gap-2">
              <Repeat2 className="size-4 text-[#0052FF]" aria-hidden />
              <p className="text-xs font-semibold text-foreground">68% repeat rate</p>
            </div>
            <div className="absolute -bottom-4 -right-2 hidden rounded-xl border border-border bg-white px-3.5 py-2.5 shadow-card md:flex md:items-center md:gap-2">
              <PhoneCall className="size-4 text-warning" aria-hidden />
              <p className="text-xs font-semibold text-foreground">Rider notified · SMS sent</p>
            </div>
          </AnimatedSection>
        </div>
      </Container>
    </section>
  );
}