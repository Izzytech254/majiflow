import { MapPin, Package, Store } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Container } from "@/components/ui/container";
import { businesses } from "@/lib/data/businesses";
import { Stagger, StaggerItem } from "@/components/ui/animated-section";

/**
 * Counts are read from the station catalogue rather than typed in, so they
 * stay correct as stations and products are added.
 */
const cities = new Set(businesses.map((b) => b.city));
const products = businesses.reduce((total, b) => total + b.products.length, 0);

const metrics = [
  { icon: Store, value: businesses.length, label: "Refill stations" },
  { icon: MapPin, value: cities.size, label: "Cities covered" },
  { icon: Package, value: products, label: "Products in the catalogue" },
];

export function TrustMetrics() {
  return (
    <section className="border-y border-border bg-white">
      <Container className="py-14">
        <Stagger className="grid gap-4 sm:grid-cols-3">
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
