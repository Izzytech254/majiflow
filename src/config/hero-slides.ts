import type { StaticImageData } from "next/image";
import waterCansBg from "@/assets/images/hero/water-cans-bg.webp";

export interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  image: StaticImageData;
  alt: string;
}

export const HERO_WASH =
  "linear-gradient(90deg, rgba(2,18,40,0.72) 0%, rgba(2,18,40,0.45) 55%, rgba(2,18,40,0.22) 100%)";

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "fresh-water",
    eyebrow: "MajiFlow",
    headline: "Fresh water, just a tap away.",
    body: "Order clean water from refill stations near you and get it delivered to your door.",
    image: waterCansBg,
    alt: "Clean water refill containers ready for delivery",
  },
  {
    id: "majiflow-door",
    eyebrow: "Delivered",
    headline: "Majiflow, straight to your door.",
    body: "Fast, reliable doorstep delivery across Nairobi and beyond.",
    image: waterCansBg,
    alt: "Water delivery at the door",
  },
  {
    id: "skip-walk",
    eyebrow: "Convenient",
    headline: "Skip the walk, keep it fresh.",
    body: "Order in seconds and track your delivery in real time.",
    image: waterCansBg,
    alt: "Easy water ordering",
  },
  {
    id: "pure-easy",
    eyebrow: "Pure & easy",
    headline: "Pure water, the easy way.",
    body: "Affordable refills from trusted local stations, paid your way.",
    image: waterCansBg,
    alt: "Pure water delivered",
  },
];

export const HERO_SLIDE_INTERVAL = 7000;
