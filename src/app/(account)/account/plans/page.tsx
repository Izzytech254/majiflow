import { PricingCard } from "@/components/shared/pricing-card";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/shared/page-hero";
import { plans } from "@/lib/data/plans";

export const metadata = { title: "Manage your account plan" };

export default function AccountPlans() {
  return (
    <>
      <PageHero
        label="Customer plans"
        title={
          <>
            Home refill plans, <span className="text-gradient">billed simply</span>
          </>
        }
        description="Eligible customers on a station's Growth or Pro plan can set up regular refill subscriptions for homes and offices. The station delivers on schedule; you skip or pause anytime."
      />
      <Container className="py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className={plan.highlighted ? "lg:-mt-4" : ""}>
              <PricingCard plan={plan} annual={false} />
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          These are the SaaS plans stations pay — <strong className="text-foreground">not</strong> what
          you pay for water. Your refill subscription is set by the station in KES and appears in
          your order history.
        </p>
      </Container>
    </>
  );
}