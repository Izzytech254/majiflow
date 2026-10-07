import { PricingCard } from "@/components/shared/pricing-card";
import { Container } from "@/components/ui/container";
import { plans } from "@/lib/data/plans";

export const metadata = { title: "Manage your account plan" };

export default function AccountPlans() {
  return (
    <Container className="py-6 lg:py-8">
      <div className="mb-6">
        <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-[#0052FF] animate-pulse-dot" /> Customer plans
        </p>
        <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
          Home refill plans, <span className="text-gradient">billed simply</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Eligible customers on a station&apos;s Growth or Pro plan can set up regular refill
          subscriptions for homes and offices. The station delivers on schedule; you skip or pause
          anytime.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className={plan.highlighted ? "lg:-mt-4" : ""}>
            <PricingCard plan={plan} annual={false} />
          </div>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
        These are the SaaS plans stations pay — <strong className="text-foreground">not</strong>{" "}
        what you pay for water. Your refill subscription is set by the station in KES and appears in
        your order history.
      </p>
    </Container>
  );
}
