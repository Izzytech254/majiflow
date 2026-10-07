import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  MessageSquare,
  Repeat,
  Smartphone,
  Store,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem, AnimatedSection } from "@/components/ui/animated-section";

const benefits = [
  {
    icon: Smartphone,
    title: "Your own online storefront",
    text: "A branded profile with your menu, prices, delivery areas and reviews — live in under an hour.",
  },
  {
    icon: Repeat,
    title: "Customers who come back",
    text: "Repeat-order reminders, loyal-customer lists and retention tools turn one-off drop-ins into standing weekly orders.",
  },
  {
    icon: BarChart3,
    title: "Sales that show themselves",
    text: "Watch daily revenue, popular products and stock alerts on a dashboard designed to be read in a minute.",
  },
  {
    icon: Users,
    title: "Team, orders and customers in one place",
    text: "Assign staff, accept or reject orders, and message customers — no notebooks, no missed calls.",
  },
];

export function BusinessBenefits() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <Stagger className="grid gap-4 sm:grid-cols-2">
              {benefits.map((b) => (
                <StaggerItem key={b.title}>
                  <div className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0052FF]/25 hover:bg-white hover:shadow-layered">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-accent transition-transform duration-300 group-hover:scale-110">
                      <b.icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-base font-bold text-foreground">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* clip (not hidden) keeps the vertical axis intact while containing
              the horizontal reveal offset, which would otherwise widen the page
              on narrow viewports. An element cannot clip its own transform, so
              this has to sit on the parent column. */}
          <div className="order-1 overflow-x-clip lg:order-2 lg:sticky lg:top-28">
            <SectionHeading
              align="left"
              label="For businesses"
              title={
                <>
                  Turn every water order into a <span className="text-gradient">repeat customer</span>
                </>
              }
              description="MajiFlow is the storefront and back office for Kenya's water refill businesses. You keep the water, the prices and the profits — we handle the storefront, orders and payments."
            />
            <AnimatedSection from="right" className="mt-8 flex flex-col gap-6">
              <div className="flex items-start gap-3 rounded-2xl border border-success/25 bg-success-soft/50 p-4">
                <Store className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-foreground">No commission on orders</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Customers pay you through your M-Pesa till or Paybill before delivery. MajiFlow takes a flat SaaS fee — never a cut of your water.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-[#0052FF]/20 bg-[#0052FF]/5 p-4">
                <MessageSquare className="mt-0.5 size-5 shrink-0 text-[#0052FF]" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-foreground">Customers find you online</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Growth and Pro stations get priority placement when neighbours search for water in their area.
                  </p>
                </div>
              </div>
              <div>
                <Link href="/business/register">
                  <Button size="lg" className="group">
                    Register your business
                    <ArrowRight className="size-4" aria-hidden />
                  </Button>
                </Link>
                <p className="mt-3 text-sm text-muted-foreground">
                  Free for 14 days. No card required.{" "}
                  <Link href="/pricing" className="font-semibold text-[#0052FF] hover:underline">
                    See plans →
                  </Link>
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </Container>
    </section>
  );
}