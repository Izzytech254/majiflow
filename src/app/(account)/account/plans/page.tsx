import { PricingCard } from "@/components/shared/pricing-card";
import { Container } from "@/components/ui/container";
import { plans } from "@/lib/data/plans";

export const metadata = { title: "Plans and billing" };

export default function AccountPlans() {
  return (
    <Container className="py-6 lg:py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">
          Plans and{" "}
          <span className="text-gradient">station billing</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
          Refill businesses subscribe to a monthly plan to sell on MajiFlow, and customers are never
          billed for using the platform. Every plan starts with a 14-day free trial, and each item
          is marked as included today or planned next.
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
        These are the plans stations pay for - <strong className="text-foreground">not</strong>{" "}
        what you pay for water. Your orders show the delivery fee each station charges, and nothing
        else is added to your total.
      </p>
    </Container>
  );
}
