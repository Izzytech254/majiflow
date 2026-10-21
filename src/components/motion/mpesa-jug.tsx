"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion";

const WAVE_PATH =
  "M-60 0 C-40 -9 -20 -9 0 0 S40 9 60 0 S100 -9 120 0 S160 9 180 0 L180 200 L-60 200 Z";

/**
 * M-Pesa waiting state: a jug fills while the phone keeps pinging for the STK
 * push, so the wait reads as "water is on its way" rather than a dead spinner.
 */
export function MpesaJug({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const reduce = usePrefersReducedMotion();
  const clipId = `jug-clip-${uid}`;

  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      aria-hidden
      className={cn("h-auto w-full", className)}
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="26" y="60" width="94" height="74" rx="12" />
        </clipPath>
        <linearGradient id={`jug-water-${uid}`} x1="26" y1="60" x2="120" y2="134" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00c2d6" />
          <stop offset="1" stopColor="#0057e6" />
        </linearGradient>
      </defs>

      <path
        d="M48 60V48a12 12 0 0 1 24 0v12"
        className="stroke-[var(--brand)]"
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.5}
      />
      <path d="M26 60 16 44l20 10" className="fill-[var(--brand)]" opacity={0.35} />

      <g clipPath={`url(#${clipId})`}>
        <motion.g
          initial={{ y: 134 }}
          animate={{ y: 60 }}
          transition={{ duration: reduce ? 0 : 2.4, ease: "easeInOut", repeat: reduce ? 0 : Infinity, repeatType: "mirror" }}
        >
          <motion.g
            animate={reduce ? undefined : { x: [0, -60] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
          >
            <path d={WAVE_PATH} fill={`url(#jug-water-${uid})`} />
          </motion.g>
        </motion.g>
      </g>

      <rect
        x="26"
        y="60"
        width="94"
        height="74"
        rx="12"
        className="fill-white/40 stroke-[var(--brand)]"
        strokeWidth={3}
      />

      <rect
        x="142"
        y="46"
        width="44"
        height="82"
        rx="9"
        className="fill-white stroke-[var(--brand)]"
        strokeWidth={3}
      />
      <rect x="149" y="56" width="30" height="58" rx="4" className="fill-[var(--surface-3)]" />
      <path
        d="M164 66c1.9 2.5 3.1 4.2 3.1 5.7a3.1 3.1 0 1 1-6.2 0c0-1.5 1.2-3.2 3.1-5.7z"
        className="fill-[var(--brand)]"
      />
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x={153 + i * 10}
          y={104}
          width={6}
          height={6}
          rx={1.5}
          className="fill-[var(--brand)]"
          animate={reduce ? undefined : { opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}
