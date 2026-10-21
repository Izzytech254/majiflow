"use client";

import { motion } from "framer-motion";
import { easeOut } from "@/lib/constants";
import { OrderCard } from "@/components/home/order-card";
import { HeroSlider } from "@/components/home/hero-slider";
import { HERO_SLIDES, HERO_SLIDE_INTERVAL } from "@/config/hero-slides";
import { usePrefersReducedMotion } from "@/lib/motion";

export function Hero() {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-black lg:h-[866px] lg:min-h-[640px] lg:justify-center">
      <HeroSlider slides={HERO_SLIDES} interval={HERO_SLIDE_INTERVAL} />

      <div className="pointer-events-none relative z-20 mx-auto flex w-full max-w-[90rem] flex-1 items-center px-5 pb-10 pt-[290px] sm:px-8 lg:flex-none lg:justify-start lg:py-0 lg:pl-12 lg:pr-12">
        <motion.div
          initial={reduce ? false : { y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: easeOut }}
          className="pointer-events-auto w-full lg:w-[608px]"
        >
          <OrderCard />
        </motion.div>
      </div>
    </section>
  );
}
