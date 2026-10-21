"use client";

import { motion } from "framer-motion";
import { DropLoader } from "@/components/motion/drop-loader";

export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <DropLoader className="size-9 text-[var(--brand)]" />
        <p className="text-sm font-medium text-foreground">{message}</p>
      </motion.div>
    </div>
  );
}
