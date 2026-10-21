"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Order confirmed: a full bottle with a slow slosh, a ring of ripples and a
 * checkmark badge.
 */
export function SuccessIllustration({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const reduce = usePrefersReducedMotion();
  const clipId = `success-clip-${uid}`;

  return (
    <svg
      viewBox="0 0 200 170"
      fill="none"
      aria-hidden
      className={cn("h-auto w-full", className)}
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="66" y="18" width="28" height="44" rx="8" />
          <rect x="50" y="52" width="60" height="102" rx="20" />
        </clipPath>
        <linearGradient id={`success-water-${uid}`} x1="50" y1="52" x2="110" y2="154" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2e8cff" />
          <stop offset="1" stopColor="#00c2d6" />
        </linearGradient>
      </defs>

      {[0, 1, 2].map((i) => (
        <motion.ellipse
          key={i}
          cx={80}
          cy={152}
          rx={38}
          ry={9}
          className="stroke-[var(--brand)]"
          strokeWidth={2}
          fill="none"
          initial={{ opacity: 0.45, scaleX: 0.5 }}
          animate={reduce ? { opacity: 0.2 } : { opacity: [0.45, 0], scaleX: [0.5, 1.25] }}
          transition={{ duration: 2.2, repeat: reduce ? 0 : Infinity, delay: i * 0.7, ease: "easeOut" }}
          style={{ originX: "80px", originY: "152px" }}
        />
      ))}

      <g clipPath={`url(#${clipId})`}>
        <motion.g
          initial={{ y: 154 }}
          animate={{ y: 56 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.g
            animate={reduce ? undefined : { x: [0, -60] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          >
            <path
              d="M-60 0 C-40 -8 -20 -8 0 0 S40 8 60 0 S100 -8 120 0 S160 8 180 0 L180 200 L-60 200 Z"
              fill={`url(#success-water-${uid})`}
            />
          </motion.g>
        </motion.g>
      </g>

      <rect x="66" y="18" width="28" height="44" rx="8" className="fill-white/50 stroke-[var(--brand)]" strokeWidth={2.5} />
      <rect x="50" y="52" width="60" height="102" rx="20" className="fill-white/40 stroke-[var(--brand)]" strokeWidth={2.5} />
      <rect x="62" y="4" width="36" height="17" rx="6" className="fill-[var(--brand)]" />
      <path d="M60 78c0-6 2-11 5-15" className="stroke-white" strokeWidth={4} strokeLinecap="round" opacity={0.75} />

      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.45, type: "spring", stiffness: 320, damping: 18 }}
        style={{ originX: "132px", originY: "44px" }}
      >
        <circle cx={132} cy={44} r={22} className="fill-white stroke-[var(--brand)]" strokeWidth={3} />
        <motion.path
          d="M122 44.5l7 7 13.5-14"
          className="stroke-[var(--brand)]"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: reduce ? 0 : 0.6, duration: 0.4, ease: "easeOut" }}
        />
      </motion.g>
    </svg>
  );
}
