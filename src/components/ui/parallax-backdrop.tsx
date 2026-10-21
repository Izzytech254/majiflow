"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

interface ParallaxBackdropProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function ParallaxBackdrop({
  children,
  className,
  strength = 30,
}: ParallaxBackdropProps) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [-strength, strength],
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}