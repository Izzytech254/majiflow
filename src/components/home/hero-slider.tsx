"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { easeOut } from "@/lib/constants";
import { ParallaxBackdrop } from "@/components/ui/parallax-backdrop";
import { HERO_WASH, type HeroSlide } from "@/config/hero-slides";

/** How long one slide takes to cross-fade into the next. */
const CROSSFADE_SECONDS = 0.9;
const CROSSFADE_MS = CROSSFADE_SECONDS * 1000;
/** How far a drag has to travel before it counts as a swipe. */
const SWIPE_THRESHOLD = 60;
/** How long to wait for a not-yet-loaded slide before showing it anyway. */
const LOAD_TIMEOUT_MS = 2500;

interface HeroSliderProps {
  slides: HeroSlide[];
  /** How long a slide holds before the hero advances, in milliseconds. */
  interval?: number;
}

/**
 * The hero's rotating backdrop.
 *
 * Slides cross-fade with a slow Ken Burns push, advance on their own, and can
 * be driven by swipe, arrow keys or the dots. Only the current slide and its
 * neighbours are mounted, so the browser never downloads the whole set at once.
 */
export function HeroSlider({ slides, interval = 7000 }: HeroSliderProps) {
  const reduce = usePrefersReducedMotion();
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [pending, setPending] = useState<number | null>(null);
  const [previous, setPrevious] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set());
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);

  const indexRef = useRef(0);
  const loadedRef = useRef<ReadonlySet<string>>(loaded);
  const clearPreviousRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dragX = useMotionValue(0);
  const echoX = useTransform(dragX, (value) => value * 0.28);

  const markLoaded = useCallback((id: string) => {
    if (loadedRef.current.has(id)) return;
    const next = new Set(loadedRef.current);
    next.add(id);
    loadedRef.current = next;
    setLoaded(next);
  }, []);

  /** Move to a slide that is already on screen. */
  const applyIndex = useCallback((target: number) => {
    const previousIndex = indexRef.current;
    if (target === previousIndex) return;
    indexRef.current = target;
    setIndex(target);
    setPending(null);
    // Keep the outgoing slide mounted until it has finished fading out.
    setPrevious(previousIndex);
    if (clearPreviousRef.current) clearTimeout(clearPreviousRef.current);
    clearPreviousRef.current = setTimeout(() => setPrevious(null), CROSSFADE_MS + 120);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const target = ((next % count) + count) % count;
      if (target === indexRef.current) return;
      if (loadedRef.current.has(slides[target].id)) {
        applyIndex(target);
        return;
      }
      // The slide is not in the DOM yet, so hold the current one until the
      // image arrives rather than cutting to an empty frame.
      setPending(target);
    },
    [count, slides, applyIndex]
  );

  // Show a pending slide once its photo is ready, or after a short timeout so
  // a slow or failed image can never trap the hero.
  useEffect(() => {
    if (pending === null) return;
    if (loaded.has(slides[pending].id)) {
      applyIndex(pending);
      return;
    }
    const timer = setTimeout(() => applyIndex(pending), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [pending, loaded, slides, applyIndex]);

  // Auto-advance, unless the reader has asked for less motion, the slider is
  // hovered or focused, or the tab is in the background.
  useEffect(() => {
    if (reduce || paused || hidden || count < 2) return;
    const timer = setTimeout(() => goTo(indexRef.current + 1), interval);
    return () => clearTimeout(timer);
  }, [reduce, paused, hidden, count, interval, goTo, index]);

  // Pause while the tab is hidden so the hero does not race through slides.
  useEffect(() => {
    const onVisibilityChange = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(
    () => () => {
      if (clearPreviousRef.current) clearTimeout(clearPreviousRef.current);
    },
    []
  );

  const mounted = useMemo(() => {
    const set = new Set<number>([index, (index + 1) % count]);
    if (previous !== null) set.add(previous);
    if (pending !== null) set.add(pending);
    return set;
  }, [index, count, previous, pending]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(indexRef.current - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(indexRef.current + 1);
    }
  };

  const activeSlide = slides[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured water delivery highlights"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="absolute inset-0 z-0"
    >
      <motion.div
        style={{ x: echoX }}
        className="absolute inset-x-0 top-0 h-[270px] lg:inset-0 lg:h-full"
      >
        <ParallaxBackdrop strength={30} className="absolute inset-0">
          {slides.map((slide, i) => {
            if (!mounted.has(i)) return null;
            const active = i === index;
            return (
              <motion.div
                key={slide.id}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : CROSSFADE_SECONDS, ease: easeOut }}
                aria-hidden={active ? undefined : true}
                inert={!active}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{ scale: reduce ? 1 : active ? 1.07 : 1 }}
                  transition={{
                    duration: reduce ? 0 : active ? interval / 1000 : CROSSFADE_SECONDS,
                    ease: "linear",
                  }}
                >
                  {/* Oversized so the parallax drift never exposes an edge. */}
                  <div className="absolute -inset-[10%]">
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      sizes="120vw"
                      className="object-cover"
                      preload={i === 0}
                      onLoad={() => markLoaded(slide.id)}
                    />
                    <div className="absolute inset-0" style={{ background: HERO_WASH }} />
                  </div>
                </motion.div>
                <SlideCopy slide={slide} />
              </motion.div>
            );
          })}
        </ParallaxBackdrop>
      </motion.div>

      {/* Swipe surface. Sits above the slides but below the order card. */}
      <motion.div
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
        style={{ x: dragX }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.16}
        onDragEnd={(_event, info) => {
          if (info.offset.x < -SWIPE_THRESHOLD) goTo(indexRef.current + 1);
          else if (info.offset.x > SWIPE_THRESHOLD) goTo(indexRef.current - 1);
        }}
      />

      <div className="absolute right-5 top-4 z-20 flex items-center gap-3 lg:bottom-10 lg:right-12 lg:top-auto">
        <div className="hidden items-center gap-1.5 lg:flex">
          <ArrowButton label="Previous slide" onClick={() => goTo(indexRef.current - 1)}>
            <ChevronLeft className="size-5" aria-hidden />
          </ArrowButton>
          <ArrowButton label="Next slide" onClick={() => goTo(indexRef.current + 1)}>
            <ChevronRight className="size-5" aria-hidden />
          </ArrowButton>
        </div>
        <div className="flex items-center gap-1" role="group" aria-label="Choose a slide">
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1} of ${count}: ${slide.headline}`}
                aria-current={active ? "true" : undefined}
                className="flex h-8 items-center rounded-full px-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--aqua)]"
              >
                <motion.span
                  className="block h-2 rounded-full bg-white"
                  initial={false}
                  animate={{ width: active ? 22 : 8, opacity: active ? 1 : 0.45 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: easeOut }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`Slide ${index + 1} of ${count}: ${activeSlide.headline}`}
      </p>
    </div>
  );
}

function ArrowButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--aqua)]"
    >
      {children}
    </button>
  );
}

/**
 * The slide's message. It stays a paragraph on purpose: the headline rotates,
 * so it must not take the page's single `h1` away from "Order water".
 */
function SlideCopy({ slide }: { slide: HeroSlide }) {
  return (
    <div className="absolute inset-x-0 bottom-0 px-5 pb-5 sm:px-8 lg:inset-y-0 lg:bottom-auto lg:left-auto lg:right-12 lg:top-1/2 lg:w-[21rem] lg:-translate-y-1/2 lg:px-0 lg:pb-0 xl:w-[25rem]">
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 -inset-y-10"
          style={{
            background:
              "radial-gradient(130% 160% at 50% 50%, rgba(2,18,40,0.93) 0%, rgba(2,18,40,0.88) 40%, rgba(2,18,40,0.62) 72%, rgba(2,18,40,0) 100%)",
          }}
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-[var(--aqua)]" aria-hidden />
            {slide.eyebrow}
          </span>
          <p className="mt-3 font-display text-xl font-semibold leading-[1.2] tracking-tight text-white sm:text-2xl lg:text-[1.7rem]">
            {slide.headline}
          </p>
          <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-white/85">
            {slide.body}
          </p>
        </div>
      </div>
    </div>
  );
}
