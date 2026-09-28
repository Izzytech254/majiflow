import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { Stagger, StaggerItem } from "@/components/ui/animated-section";
import { testimonials } from "@/lib/data/content";

export function TestimonialsSection() {
  return (
    <section className="bg-muted/50 py-24 lg:py-32">
      <Container>
        <SectionHeading
          label="Word of mouth"
          pulseLabel
          title={
            <>
              Kenyan businesses, <span className="text-gradient">Kenyan stories</span>
            </>
          }
          description="Station owners, office managers and estate residents — the people making water work every day."
        />

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {testimonials.map((t, i) => (
            <StaggerItem key={t.id}>
              <TestimonialCard testimonial={t} offset={[1, 4].includes(i)} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}