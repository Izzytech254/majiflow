"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WaterBottle } from "@/components/motion/water-bottle";
import { Bubbles } from "@/components/motion/bubbles";
import { MajiMark } from "@/components/layout/maji-mark";

type Phase = "fill" | "cap" | "done";

const COPY: Record<Phase, string> = {
  fill: "Filling up",
  cap: "Almost there",
  done: "Ready to flow",
};

/**
 * Brand splash shown on the very first load while the app hydrates, then fades
 * away. It lives in the root layout, so client-side navigation never shows it.
 */
export function AppSplash() {
  const [phase, setPhase] = useState<Phase>("fill");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const cap = window.setTimeout(() => setPhase("cap"), 1000);
    const done = window.setTimeout(() => setPhase("done"), 1550);
    // Never trap the user behind the splash, even if the app is still booting.
    const hardStop = window.setTimeout(() => setHidden(true), 3000);
    return () => {
      window.clearTimeout(cap);
      window.clearTimeout(done);
      window.clearTimeout(hardStop);
    };
  }, []);

  useEffect(() => {
    if (phase !== "done") return;
    const hide = window.setTimeout(() => setHidden(true), 420);
    return () => window.clearTimeout(hide);
  }, [phase]);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="app-splash fixed inset-0 z-[200] flex flex-col items-center justify-center gap-7 overflow-hidden bg-background"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,var(--aqua-soft),transparent_70%)]" />
          <Bubbles />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center gap-2.5"
          >
            <span className="flex size-11 items-center justify-center overflow-hidden rounded-2xl shadow-accent">
              <MajiMark />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Maji<span className="text-[var(--brand)]">Flow</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-28"
          >
            <WaterBottle progress={1} capped={phase === "cap" || phase === "done"} />
          </motion.div>

          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative font-mono text-xs uppercase tracking-widest text-muted-foreground"
          >
            {COPY[phase]}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
