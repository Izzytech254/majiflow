import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
  /** Offset this card vertically on desktop for an asymmetric rhythm. */
  offset?: boolean;
}

export function TestimonialCard({ testimonial, className, offset }: TestimonialCardProps) {
  const t = testimonial;
  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-layered sm:p-7",
        offset && "sm:mt-10 md:mt-16",
        className
      )}
    >
      <Quote
        className="absolute right-6 top-6 size-8 text-[#0052FF]/10 transition-colors group-hover:text-[#0052FF]/20"
        aria-hidden
      />
      <div className="flex gap-0.5 text-warning" aria-label="5 star rating">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-3.5 fill-current" strokeWidth={0} aria-hidden />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/90">
        “{t.quote}”
      </blockquote>
      <footer className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-[13px] font-bold text-white shadow-accent">
          {t.initials}
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{t.name}</p>
          <p className="text-xs text-muted-foreground">
            {t.role} · {t.location}
          </p>
        </div>
      </footer>
    </Card>
  );
}