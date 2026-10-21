"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Crest sits on y=0 and the shape repeats every 60px, so the group can be
 * translated to any fill level and drifted sideways to make the surface move.
 */
const WAVE_PATH =
  "M-60 0 C-40 -12 -20 -12 0 0 S40 12 60 0 S100 -12 120 0 S160 12 180 0 L180 240 L-60 240 Z";

const BODY_TOP = 52;
const BODY_BOTTOM = 186;
const BODY_HEIGHT = BODY_BOTTOM - BODY_TOP;

interface WaterBottleProps {
  /** Fill level from 0 (empty) to 1 (full). */
  progress?: number;
  /** Pops the cap off and splashes. */
  capped?: boolean;
  /** Loops the fill from empty to full, for indefinite waiting states. */
  loop?: boolean;
  className?: string;
}

export function WaterBottle({ progress = 0, capped = false, loop = false, className }: WaterBottleProps) {
  const uid = useId().replace(/:/g, "");
  const reduce = usePrefersReducedMotion();
  const clipId = `bottle-clip-${uid}`;
  const [cycle, setCycle] = useState(0);
  const level = loop ? cycle : Math.min(1, Math.max(0, progress));
  const levelY = BODY_BOTTOM - level * BODY_HEIGHT;

  useEffect(() => {
    if (!loop || reduce) return;
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      setCycle(((now - started) / 2000) % 1);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loop, reduce]);

  const drift = reduce
    ? {}
    : { animate: { x: [0, -60] }, transition: { duration: 3.4, repeat: Infinity, ease: "linear" as const } };

  const driftBack = reduce
    ? {}
    : { animate: { x: [-30, -90] }, transition: { duration: 4.8, repeat: Infinity, ease: "linear" as const } };

  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      aria-hidden
      className={cn("h-auto w-full", className)}
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="46" y="16" width="28" height="46" rx="8" />
          <rect x="30" y="50" width="60" height="136" rx="20" />
        </clipPath>
        <linearGradient id={`bottle-water-${uid}`} x1="30" y1="50" x2="90" y2="186" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2e8cff" />
          <stop offset="1" stopColor="#0057e6" />
        </linearGradient>
        <linearGradient id={`bottle-back-${uid}`} x1="30" y1="50" x2="90" y2="186" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00c2d6" />
          <stop offset="1" stopColor="#0aa6b8" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <motion.g
          initial={{ y: BODY_BOTTOM }}
          animate={{ y: levelY }}
          transition={{ duration: reduce ? 0 : loop ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.g {...driftBack}>
            <path d={WAVE_PATH} fill={`url(#bottle-back-${uid})`} opacity={0.55} />
          </motion.g>
          <motion.g {...drift}>
            <path d={WAVE_PATH} fill={`url(#bottle-water-${uid})`} />
          </motion.g>
        </motion.g>
      </g>

      <rect x="46" y="16" width="28" height="46" rx="8" className="fill-white/60 stroke-[var(--brand)]" strokeWidth={2.5} />
      <rect x="30" y="50" width="60" height="136" rx="20" className="fill-white/40 stroke-[var(--brand)]" strokeWidth={2.5} />

      <path
        d="M40 74c0-6 2-11 5-15"
        className="stroke-white"
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.75}
      />

      {!reduce && !capped && (
        <motion.path
          d="M60 4c2.6 3.4 4.4 5.6 4.4 7.8a4.4 4.4 0 1 1-8.8 0C55.6 9.6 57.4 7.4 60 4z"
          fill="#2e8cff"
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: [-6, 40, 46], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, times: [0, 0.45, 0.62, 0.72], ease: "easeIn" }}
        />
      )}

      <motion.rect
        x="42"
        y="2"
        width="36"
        height="18"
        rx="6"
        className="fill-[var(--brand)]"
        animate={
          reduce
            ? { y: 2, rotate: 0, opacity: 1 }
            : capped
              ? { y: [2, -26, -40], rotate: [0, -14, -28], opacity: [1, 1, 0] }
              : { y: 2, rotate: 0, opacity: 1 }
        }
        transition={{ duration: reduce ? 0 : 0.55, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ originX: "60px", originY: "11px" }}
      />

      {!reduce && capped && (
        <g>
          {[
            { dx: -26, dy: -18, d: 0.55 },
            { dx: -14, dy: -30, d: 0.35 },
            { dx: 0, dy: -34, d: 0 },
            { dx: 15, dy: -28, d: 0.4 },
            { dx: 27, dy: -16, d: 0.6 },
          ].map((p, i) => (
            <motion.circle
              key={i}
              cx={60}
              cy={14}
              r={3.2}
              fill="#2e8cff"
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
              animate={{ x: p.dx, y: p.dy, opacity: [0, 1, 0], scale: [0.4, 1, 0.5] }}
              transition={{ duration: 0.7, delay: p.d, ease: "easeOut" }}
            />
          ))}
          <motion.ellipse
            cx={60}
            cy={52}
            rx={30}
            ry={7}
            className="stroke-[var(--brand)]"
            strokeWidth={2}
            fill="none"
            initial={{ opacity: 0.7, scaleX: 0.4 }}
            animate={{ opacity: 0, scaleX: 1.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ originX: "60px", originY: "52px" }}
          />
        </g>
      )}
    </svg>
  );
}
