import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";

interface PageHeroProps {
  label?: string;
  pulseLabel?: boolean;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  tone?: "light" | "dark";
  align?: "center" | "left";
  className?: string;
}

/** Sticky-style page hero used across inner marketing pages. */
export function PageHero({
  label,
  pulseLabel,
  title,
  description,
  children,
  tone = "light",
  align = "center",
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        tone === "dark" ? "bg-ink text-white" : "bg-background",
        "border-b",
        tone === "dark" ? "border-white/10" : "border-border"
      )}
    >
      {tone === "light" ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-glow" />
      ) : (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-60" />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 size-[30rem] -translate-x-1/2 rounded-full bg-[#0052FF]/20 blur-[120px]"
          />
        </>
      )}
      <Container className="relative py-16 lg:py-24">
        <AnimatedSection
          className={cn(
            "flex flex-col gap-5",
            align === "center" ? "items-center text-center" : "items-start",
            align === "center" && "mx-auto max-w-3xl"
          )}
        >
          {label && (
            <SectionLabel pulse={pulseLabel} tone={tone === "dark" ? "dark" : "light"}>
              {label}
            </SectionLabel>
          )}
          <h1
            className={cn(
              "font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-[3.25rem]",
              tone === "dark" ? "text-white" : "text-foreground"
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                "max-w-2xl text-base leading-relaxed sm:text-lg",
                tone === "dark" ? "text-slate-300" : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          )}
          {children && <div className="mt-2">{children}</div>}
        </AnimatedSection>
      </Container>
    </section>
  );
}