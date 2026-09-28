import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { AnimatedSection } from "@/components/ui/animated-section";

interface ContentPageProps {
  label: string;
  title: ReactNode;
  description?: ReactNode;
  updated?: string;
  children: ReactNode;
}

/** Reusable layout for long-form pages (terms, privacy, about copy). */
export function ContentPage({ label, title, description, updated, children }: ContentPageProps) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-glow" />
        <Container className="relative py-16 lg:py-24">
          <AnimatedSection className="mx-auto max-w-3xl">
            <SectionLabel className="mb-4">{label}</SectionLabel>
            <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{description}</p>
            )}
            {updated && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Last updated {updated}
              </p>
            )}
          </AnimatedSection>
        </Container>
      </section>
      <section className="py-16 lg:py-20">
        <Container size="md">
          <AnimatedSection className="prose-custom space-y-8">{children}</AnimatedSection>
        </Container>
      </section>
    </>
  );
}

export function ProseSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export function ProseList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-inside list-disc space-y-2 text-[15px] leading-relaxed text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}