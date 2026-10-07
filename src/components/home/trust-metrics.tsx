import { StatCard } from "@/components/shared/stat-card";
import { Container } from "@/components/ui/container";
import { Zap, Store, Wallet, Star } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/ui/animated-section";

const metrics = [
  { icon: Store, value: 240, suffix: "+", label: "Refill stations online", delta: "38 this month", trend: "up" as const },
  { icon: Zap, value: 180, suffix: "k", label: "Cans delivered", delta: "12% growth", trend: "up" as const },
  { icon: Wallet, value: 46, prefix: "KES ", suffix: "M", label: "Paid via M-Pesa", delta: "19% growth", trend: "up" as const },
  { icon: Star, value: 4.8, decimals: 1, suffix: "/5", label: "Average station rating", delta: "6% growth", trend: "up" as const },
];

export function TrustMetrics() {
  return (
    <section className="border-y border-border bg-white">
      <Container className="py-14">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <StaggerItem key={m.label}>
              <StatCard animated={false} {...m} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}