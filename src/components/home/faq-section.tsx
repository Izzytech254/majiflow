import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/lib/data/faqs";
import { AnimatedSection } from "@/components/ui/animated-section";

export function FaqSection() {
  const items = faqs.slice(0, 6).map((f) => ({ q: f.question, a: f.answer }));
  return (
    <section className="py-24 lg:py-32">
      <Container size="md">
        <SectionHeading
          label="Questions, answered"
          title={
            <>
              Everything folks ask <span className="text-gradient">before ordering</span>
            </>
          }
        />
        <AnimatedSection className="mt-12">
          <Accordion items={items} />
        </AnimatedSection>
        <AnimatedSection delay={0.1} className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Something else on your mind?{" "}
            <Link href="/faqs" className="font-semibold text-[#0052FF] hover:underline">
              View all FAQs
            </Link>
          </p>
          <Link href="/contact" className="mt-3 inline-flex">
            <Button variant="secondary" size="lg">
              Talk to our team
            </Button>
          </Link>
        </AnimatedSection>
      </Container>
    </section>
  );
}