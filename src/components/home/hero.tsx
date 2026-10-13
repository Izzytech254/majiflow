"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import waterCansBg from "@/assets/images/hero/water-cans-bg.webp";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { easeOut } from "@/lib/constants";
import { ParallaxBackdrop } from "@/components/ui/parallax-backdrop";
import { RotatingWord } from "@/components/home/rotating-word";
import { CitySelect } from "@/components/home/city-select";

const HERO_WORDS = ["ordered", "compared", "priced", "in your cart"] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const [city, setCity] = useState("Nairobi");

  return (
    <section className="relative overflow-hidden">
      <ParallaxBackdrop strength={30} className="absolute inset-0">
        <Image
          src={waterCansBg}
          alt=""
          fill
          sizes="100vw"
          preload
          aria-hidden
          className="pointer-events-none scale-110 object-cover"
        />
      </ParallaxBackdrop>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-glow" />

      <div className="relative mx-auto w-full max-w-[72rem] px-5 pb-24 pt-14 sm:px-8 lg:pb-32 lg:pt-20">
        <div className="max-w-[42rem]">
          <motion.h1
            initial={reduce ? false : { y: 28 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: easeOut }}
            className="font-display text-[2.75rem] leading-[1.06] tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem]"
          >
            Clean water,{" "}
            <RotatingWord words={HERO_WORDS} className="text-gradient" /> from stations
            near you.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { y: 24 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: easeOut }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80"
          >
            Order clean drinking water from refill stations near you. Compare prices, pay with
            M-Pesa, and follow your delivery to the gate.
          </motion.p>

          <motion.div
            initial={reduce ? false : { y: 24 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: easeOut }}
            className="mt-9"
          >
            <div className="flex w-full items-center gap-1 rounded-xl border border-border bg-card p-1.5 shadow-card sm:max-w-sm">
              <CitySelect value={city} onChange={setCity} />
              <Link href={`/browse?city=${encodeURIComponent(city)}`} className="ml-auto shrink-0">
                <Button size="lg" className="group px-5">
                  Order water
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
