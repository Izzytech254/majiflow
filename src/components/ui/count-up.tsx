"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useInView, animate } from "framer-motion";

interface CountUpProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.2,
  className,
}: CountUpProps) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState(() => format(value, decimals, prefix, suffix));

  useEffect(() => {
    if (reduce || !isInView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: set initial display when reduced or not in view
      setDisplay(format(value, decimals, prefix, suffix));
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        const withPrefixSuffix = format(latest, decimals, prefix, suffix);
        setDisplay(withPrefixSuffix);
      },
    });
    return () => controls.stop();
  }, [value, decimals, prefix, suffix, duration, reduce, isInView]);

  return <span ref={ref} className={className}>{display}</span>;
}

function format(n: number, decimals: number, prefix: string, suffix: string) {
  const formatted = new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
  return `${prefix}${formatted}${suffix}`;
}