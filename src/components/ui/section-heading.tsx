import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";
import { AnimatedSection } from "@/components/ui/animated-section";

interface SectionHeadingProps {
  label?: string;
  pulseLabel?: boolean;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  /** Max width for title + description block. */
  maxWidth?: string;
}

export function SectionHeading({
  label,
  pulseLabel,
  title,
  description,
  align = "center",
  tone = "light",
  className,
  maxWidth = "max-w-2xl",
}: SectionHeadingProps) {
  return (
    <AnimatedSection
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {label && (
        <SectionLabel pulse={pulseLabel} tone={tone}>
          {label}
        </SectionLabel>
      )}
      <h2
        className={cn(
          "font-display text-3xl leading-[1.12] sm:text-4xl md:text-[2.75rem]",
          tone === "light" ? "text-foreground" : "text-white",
          maxWidth
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base leading-relaxed sm:text-lg",
            tone === "light" ? "text-muted-foreground" : "text-slate-300",
            maxWidth
          )}
        >
          {description}
        </p>
      )}
    </AnimatedSection>
  );
}