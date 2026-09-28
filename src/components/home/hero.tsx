"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import waterLiquid from "@/assets/images/backdrops/water-liquid.webp";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  MapPin,
  MessageCircle,
  Smartphone,
  Truck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { Badge } from "@/components/ui/badge";
import { CITIES, easeOut } from "@/lib/constants";

export function Hero() {
  const reduce = useReducedMotion();
  const [city, setCity] = useState("Nairobi");

  return (
    <section className="relative overflow-hidden">
      <Image
        src={waterLiquid}
        alt=""
        fill
        sizes="100vw"
        aria-hidden
        className="pointer-events-none scale-110 object-cover opacity-20 blur-3xl"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-[#0052FF]/10 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-[72rem] items-center gap-14 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-32 lg:pt-20">
        {/* Copy */}
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <SectionLabel pulse>
              Trusted water, ordered in seconds
            </SectionLabel>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: easeOut }}
            className="mt-5 font-display text-[2.75rem] leading-[1.06] tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem]"
          >
            Clean water,{" "}
            <span className="text-gradient">delivered</span> simply — from refill stations near you.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: easeOut }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Order clean, affordable drinking water from trusted refill businesses in your estate.
            Pay with M-Pesa, track the rider, and get your cans at the door — no lifting, no waiting.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: easeOut }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <div className="flex w-full items-center gap-2 rounded-xl border border-border bg-white p-1.5 shadow-card sm:max-w-sm">
              <MapPin className="ml-2.5 size-5 shrink-0 text-[#0052FF]" aria-hidden />
              <label htmlFor="hero-city" className="sr-only">
                Choose your city
              </label>
              <select
                id="hero-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 w-full rounded-lg bg-transparent text-sm font-medium text-foreground focus:outline-none"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Link href={`/browse?city=${encodeURIComponent(city)}`} className="shrink-0">
                <Button size="lg" className="group px-5">
                  Order water
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </Link>
            </div>
            <Link href="/business/register" className="sm:w-auto">
              <Button size="lg" variant="secondary" className="group w-full sm:w-auto">
                Register your business
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-success" aria-hidden /> Verified stations
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="size-4 text-[#0052FF]" aria-hidden /> Real-time tracking
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="size-4 text-warning" aria-hidden /> Delivery in ~40 min
            </span>
          </motion.div>
        </div>

        {/* Hero graphic */}
        <HeroGraphic />
      </div>
    </section>
  );
}

function HeroGraphic() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="relative mx-auto hidden aspect-[4/3.4] w-full max-w-[34rem] select-none lg:block"
    >
      {/* Rotating decorative ring */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
        <div className="size-[32rem] rounded-full border border-[#0052FF]/15" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="size-[27rem] rounded-full border border-dashed border-[#0052FF]/20" />
      </div>

      {/* Main dashboard card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.25, ease: easeOut }}
        className="absolute inset-x-6 top-8 overflow-hidden rounded-2xl border border-border bg-white shadow-layered"
      >
        <DashboardCard />
      </motion.div>

      {/* Floating: new order card */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-2 top-10 w-60 rounded-xl border border-border bg-white p-3.5 shadow-layered"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <Truck className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">New order arrived</p>
            <p className="truncate text-[11px] text-muted-foreground">#MF-98121 · 2 × 20L refill</p>
          </div>
          <Badge variant="accent" className="px-2 py-0.5 text-[10px]">
            KES 820
          </Badge>
        </div>
      </motion.div>

      {/* Floating: payment success card */}
      <motion.div
        animate={reduce ? undefined : { y: [0, 10, 0] }}
        transition={{ duration: 7, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 bottom-24 w-56 rounded-xl border border-border bg-white p-3.5 shadow-layered"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-success-soft text-success">
            <Smartphone className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">M-Pesa received</p>
            <p className="truncate text-[11px] text-muted-foreground">STK push confirmed</p>
          </div>
        </div>
        <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          ✓ Payment successful
        </p>
      </motion.div>

      {/* Floating: rider status chip */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5.4, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-6 flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 shadow-card"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        <p className="text-[11px] font-semibold text-foreground">John K. is on the way</p>
      </motion.div>

      {/* Floating: today stat chip */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: 6.6, delay: 1.1, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-4 top-8 flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 shadow-card"
      >
        <span className="flex size-6 items-center justify-center rounded-md bg-[#0052FF]/10 text-[#0052FF]">
          <Bell className="size-3.5" />
        </span>
        <p className="text-[11px] font-semibold text-foreground">
          KES 48,250 <span className="font-normal text-success">today</span>
        </p>
      </motion.div>
    </div>
  );
}

function DashboardCard() {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-warning" />
          <span className="size-2.5 rounded-full bg-[#0052FF]/30" />
          <span className="size-2.5 rounded-full bg-success/50" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Business overview
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 px-5 pt-4">
        {[
          { label: "Revenue today", value: "KES 48,250" },
          { label: "Orders", value: "34" },
          { label: "Repeat rate", value: "68%" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-muted/70 p-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-0.5 text-sm font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex h-24 items-end gap-1.5 px-5 pb-2 pt-4">
        {[38, 55, 42, 68, 80, 60, 72].map((h, i) => (
          <motion.div
            key={i}
            initial={reduce ? { height: h } : { height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.9, delay: 0.7 + i * 0.06, ease: easeOut }}
            className="flex-1 rounded-t-md bg-brand-gradient"
          />
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <span className="font-mono text-[11px] text-muted-foreground">#MF-98121 · Out for delivery</span>
        <span className="relative flex items-center gap-1.5 text-[11px] font-semibold text-success">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Live
        </span>
      </div>
    </div>
  );
}