"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Reveal = "up" | "left" | "right" | "scale" | "none";

/** Reveal an element once it scrolls into view, using CSS transitions only. */
function useInView<T extends HTMLElement>(margin = "-80px", threshold = 0.2) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin, threshold]);

  return { ref, shown };
}

interface AnimatedSectionProps extends ComponentPropsWithoutRef<"div"> {
  /** Vertical/horizontal offset in px for the reveal. */
  y?: number;
  delay?: number;
  children: ReactNode;
  as?: ElementType;
  from?: Reveal;
}

export function AnimatedSection({
  className,
  y = 28,
  delay = 0,
  children,
  as,
  from = "up",
  ...props
}: AnimatedSectionProps) {
  const { ref, shown } = useInView<HTMLDivElement>();
  const Comp = (as ?? "div") as ElementType;

  return (
    <Comp
      ref={ref}
      data-from={from}
      style={
        {
          "--reveal-y": `${y}px`,
          transitionDelay: `${delay}s`,
        } as CSSProperties
      }
      className={cn("reveal", shown && "is-in", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  stagger?: number;
  amount?: number;
}

/** Parent wrapper that staggers its direct children as they scroll into view. */
export function Stagger({
  children,
  className,
  delayChildren = 0.05,
  stagger = 0.08,
  amount = 0.2,
}: StaggerProps) {
  const { ref, shown } = useInView<HTMLDivElement>("-80px", amount);

  return (
    <div
      ref={ref}
      style={
        {
          "--stagger-base": `${delayChildren}s`,
          "--stagger-step": `${stagger}s`,
        } as CSSProperties
      }
      className={cn("stagger", shown && "is-in", className)}
    >
      {children}
    </div>
  );
}

export function StaggerItem({ className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
