"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/constants";

interface AnimatedSectionProps extends ComponentPropsWithoutRef<typeof motion.div> {
  /** Vertical offset in px for the reveal (disables with reduced motion). */
  y?: number;
  delay?: number;
  children: ReactNode;
  as?: ElementType;
}

export function AnimatedSection({
  className,
  y = 28,
  delay = 0,
  children,
  ...props
}: AnimatedSectionProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: easeOut }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
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
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { delayChildren, staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends ComponentPropsWithoutRef<typeof motion.div> {
  y?: number;
}

export function StaggerItem({ className, y = 24, ...props }: StaggerItemProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: reduce ? { opacity: 1 } : { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: easeOut },
        },
      }}
      className={className}
      {...props}
    />
  );
}