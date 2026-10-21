import { cn } from "@/lib/utils";

interface BubblesProps {
  className?: string;
  count?: number;
}

/**
 * Ambient bubbles drifting upward. Purely decorative, so it is hidden from
 * assistive tech and pauses under reduced-motion.
 */
export function Bubbles({ className, count = 14 }: BubblesProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: count }).map((_, i) => {
        const size = 6 + ((i * 7) % 22);
        const left = (i * 137) % 100;
        const delay = -((i * 1.7) % 9);
        const duration = 7 + ((i * 3) % 7);
        return (
          <span
            key={i}
            className="absolute bottom-[-10%] rounded-full border border-[var(--brand)]/20 bg-[var(--aqua)]/10"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              animation: `bubble-rise ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
