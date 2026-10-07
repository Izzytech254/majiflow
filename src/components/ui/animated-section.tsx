"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/constants";

type Reveal = "up" | "left" | "right" | "scale" | "none";

interface AnimatedSectionProps extends ComponentPropsWithoutRef<typeof motion.div> {
  /** Vertical/horizontal offset in px for the reveal (disables with reduced motion). */
  y?: number;
  delay?: number;
  children: ReactNode;
  as?: ElementType;
  from?: Reveal;
}

function getInitial(reduce: boolean, y: number, from: Reveal) {
  if (reduce) return { opacity: 1 };
  switch (from) {
    case "left":
      return { opacity: 0, x: -y };
    case "right":
      return { opacity: 0, x: y };
    case "scale":
      return { opacity: 0, scale: 0.96, y: y * 0.3 };
    case "none":
      return { opacity: 0 };
    default:
      return { opacity: 0, y };
  }
}

function getAnimate(from: Reveal) {
  switch (from) {
    case "left":
    case "right":
      return { opacity: 1, x: 0 };
    case "scale":
      return { opacity: 1, scale: 1, y: 0 };
    default:
      return { opacity: 1, y: 0 };
  }
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
  const reduce = useReducedMotion() ?? false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic motion component access
  const Comp = as && typeof as === "string" ? (motion as Record<string, any>)[as] : motion.div;
  return (
    <Comp
      initial={getInitial(reduce, y, from)}
      whileInView={getAnimate(from)}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: easeOut }}
      className={cn(className)}
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

/** Parent wrapper that staggers its direct motion children. */
export function Stagger({
  children,
  className,
  delayChildren = 0.05,
  stagger = 0.08,
  amount = 0.2,
}: StaggerProps) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren: reduce ? 0 : delayChildren,
            staggerChildren: reduce ? 0 : stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends ComponentPropsWithoutRef<typeof motion.div> {
  y?: number;
  from?: Reveal;
}

export function StaggerItem({ className, y = 24, from = "up", ...props }: StaggerItemProps) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      variants={{
        hidden: reduce ? { opacity: 1 } : getInitial(false, y, from),
        show: {
          ...getAnimate(from),
          transition: { duration: 0.65, ease: easeOut },
        },
      }}
      className={className}
      {...props}
    />
  );
}