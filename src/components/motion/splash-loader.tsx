"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MajiMark } from "@/components/layout/maji-mark";
import { cn } from "@/lib/utils";
import {
  LOADER_ASSETS,
  LOADER_TIMINGS,
  SPLASH_COPY,
  SPLASH_FALLBACK_BACKGROUND,
  SPLASH_OVERLAY,
  SPLASH_SESSION_KEY,
} from "@/config/loader";
import { detectConnectionProfile, prefersReducedMotion } from "@/lib/connection";
import { markLoaded, useLoadProgress } from "@/lib/load-progress";

type SplashMode = "boot" | "video" | "minimal";

/**
 * First-load splash.
 *
 * - Video: looping water footage under a navy-to-aqua wash, poster painted
 *   first so the first frame is never blank.
 * - Minimal: brand gradient with a breathing logo, used whenever the footage
 *   is not a good idea (slow connection, reduced motion, old device, or the
 *   video did not arrive in time).
 *
 * The progress line under the logo reflects real milestones (fonts, hero
 * image, first data fetch) rather than a timer. The splash is shown once per
 * session; a pre-paint script in the root layout hides it on later visits.
 */
export function SplashLoader() {
  const { ratio, done } = useLoadProgress();
  const [mode, setMode] = useState<SplashMode>("boot");
  const [posterReady, setPosterReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shownAtRef = useRef(0);

  // Fonts and the first paint.
  useEffect(() => {
    shownAtRef.current = performance.now();
    try {
      sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    } catch {
      // Private mode: the splash simply shows again next time.
    }

    if (typeof document !== "undefined" && document.fonts?.ready) {
      void document.fonts.ready.then(
        () => markLoaded("fonts"),
        () => markLoaded("fonts")
      );
    } else {
      markLoaded("fonts");
    }

    // The hero image reports itself; window load is the safety net for routes
    // that have no hero.
    const onWindowLoad = () => markLoaded("hero");
    window.addEventListener("load", onWindowLoad);
    if (document.readyState === "complete") markLoaded("hero");
    return () => window.removeEventListener("load", onWindowLoad);
  }, []);

  // Decide between footage and the minimal fallback. Runs after paint so the
  // poster is already on screen, and off the effect body so React does not
  // cascade a render.
  useEffect(() => {
    const profile = detectConnectionProfile();
    const fallback = profile.shouldFallback || prefersReducedMotion();
    let watchdog: number | undefined;
    const start = window.setTimeout(() => {
      if (fallback) {
        setMode("minimal");
        return;
      }
      setMode("video");
      watchdog = window.setTimeout(() => {
        setMode((current) => (current === "video" ? "minimal" : current));
      }, LOADER_TIMINGS.videoTimeoutMs);
    }, 0);
    return () => {
      window.clearTimeout(start);
      if (watchdog !== undefined) window.clearTimeout(watchdog);
    };
  }, []);

  // The footage only starts once the poster has painted.
  useEffect(() => {
    if (mode !== "video" || !posterReady) return;
    const video = videoRef.current;
    if (!video) return;
    const started = video.play();
    if (started && typeof started.catch === "function") {
      started.catch(() => setMode("minimal"));
    }
  }, [mode, posterReady]);

  // Leave once everything is ready, but never flash and never trap the user.
  useEffect(() => {
    if (gone || leaving) return;
    const hardCap = window.setTimeout(() => setLeaving(true), LOADER_TIMINGS.maxDisplayMs);
    let ready: number | undefined;
    if (done) {
      const elapsed = performance.now() - shownAtRef.current;
      const wait = Math.max(0, LOADER_TIMINGS.minDisplayMs - elapsed);
      ready = window.setTimeout(() => setLeaving(true), wait);
    }
    return () => {
      window.clearTimeout(hardCap);
      if (ready !== undefined) window.clearTimeout(ready);
    };
  }, [done, leaving, gone]);

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => setGone(true), LOADER_TIMINGS.exitMs);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  if (gone) return null;

  const minimal = mode === "minimal";

  return (
    <motion.div
      className="app-splash fixed inset-0 z-[200] overflow-hidden bg-[#04122c]"
      initial={false}
      animate={leaving ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
      transition={{
        duration: leaving ? LOADER_TIMINGS.exitMs / 1000 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      aria-busy
    >
      {/* Poster paints instantly and covers the whole splash. */}
      <Image
        src={LOADER_ASSETS.poster}
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover"
        onLoad={() => setPosterReady(true)}
      />

      {mode === "video" && (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out"
          style={{ opacity: videoReady ? 1 : 0 }}
          poster={LOADER_ASSETS.poster}
          preload="metadata"
          muted
          loop
          playsInline
          aria-hidden
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          onPlaying={() => setVideoReady(true)}
          onError={() => setMode("minimal")}
        >
          <source src={LOADER_ASSETS.videoWebm} type="video/webm" />
          <source src={LOADER_ASSETS.videoMp4} type="video/mp4" />
        </video>
      )}

      {/* Readability wash over the footage, or a solid brand gradient in the
          minimal fallback. */}
      <div
        className="absolute inset-0"
        style={
          minimal
            ? { background: SPLASH_FALLBACK_BACKGROUND, opacity: 0.94 }
            : { background: SPLASH_OVERLAY.gradient, opacity: SPLASH_OVERLAY.opacity }
        }
      />

      <div className="relative flex h-full flex-col items-center justify-center gap-6 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: LOADER_TIMINGS.logoInMs / 1000, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className={cn("loader-shimmer relative overflow-hidden rounded-2xl", minimal && "loader-breathe")}>
            <div className="flex items-center gap-3 px-1 py-1">
              <span className="flex size-12 items-center justify-center overflow-hidden rounded-2xl shadow-accent">
                <MajiMark />
              </span>
              <span className="font-display text-3xl font-semibold tracking-tight text-white">
                Maji<span className="text-[var(--aqua)]">Flow</span>
              </span>
            </div>
          </div>
        </motion.div>

        {mode === "video" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: LOADER_TIMINGS.taglineInMs / 1000, delay: 0.15, ease: "easeOut" }}
            className="text-sm tracking-[0.02em] text-white/80"
          >
            {SPLASH_COPY.tagline}
          </motion.p>
        )}

        <div className="relative h-[2px] w-40 overflow-hidden rounded-full bg-white/20 sm:w-56">
          <motion.div
            className="absolute inset-0 origin-left"
            style={{ background: "linear-gradient(90deg, var(--brand), var(--aqua))" }}
            initial={false}
            animate={{ scaleX: Math.max(0.04, ratio) }}
            transition={{
              duration: LOADER_TIMINGS.progressEaseMs / 1000,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {SPLASH_COPY.status}
      </span>
    </motion.div>
  );
}
