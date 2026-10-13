"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RotatingWordProps {
  words: readonly string[];
  className?: string;
  interval?: number;
}

/**
 * Cycles through words with a horizontal 3D flip. The container width animates
 * to the current word so the surrounding headline shifts with it, and because
 * the flip rotates around the vertical axis the baseline never moves, so every
 * word sits on the same line as the rest of the sentence.
 */
export function RotatingWord({ words, className, interval = 2400 }: RotatingWordProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [reduce, words.length, interval]);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const spans = Array.from(el.children) as HTMLElement[];
    setWidths(spans.map((s) => s.getBoundingClientRect().width));
  }, [words]);

  const first = words[0] ?? "";
  if (reduce || words.length < 2) {
    return <span className={className}>{first}</span>;
  }

  const word = words[index] ?? first;
  const width = widths[index];

  return (
    <span className="relative inline-block align-baseline" style={{ perspective: "600px" }}>
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -z-10 whitespace-nowrap opacity-0"
      >
        {words.map((w, i) => (
          <span key={i} className={cn("inline-block whitespace-nowrap", className)}>
            {w}
          </span>
        ))}
      </span>

      <motion.span
        className="relative inline-block align-baseline"
        animate={width !== undefined ? { width } : undefined}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={word}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "50% 50%", backfaceVisibility: "hidden" }}
            className={cn("inline-block whitespace-nowrap", className)}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  );
}
