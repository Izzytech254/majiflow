"use client";

import { motion } from "framer-motion";
import { easeOut } from "@/lib/constants";
import { HeroSlider } from "@/components/home/hero-slider";
import { HERO_SLIDES, HERO_SLIDE_INTERVAL } from "@/config/hero-slides";
import { usePrefersReducedMotion } from "@/lib/motion";

export function Hero() {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="relative isolate -mt-16 flex min-h-[70svh] w-full flex-col overflow-hidden bg-black pt-16 lg:min-h-[520px]">
      <HeroSlider slides={HERO_SLIDES} interval={HERO_SLIDE_INTERVAL} />

      <div className="pointer-events-none relative z-20 mx-auto flex w-full max-w-[1100px] flex-1 items-center px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          className="pointer-events-none max-w-[520px]"
        >
          <p className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {HERO_SLIDES[0].headline}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
