import type { StaticImageData } from "next/image";
import waterCansBg from "@/assets/images/hero/water-cans-bg.webp";
import aquaSpringCover from "@/assets/images/business/aqua-spring-kisumu.webp";
import nightWater from "@/assets/images/backdrops/night-water.webp";
import pureBlueCover from "@/assets/images/business/pure-blue-nakuru.webp";

export interface HeroSlide {
  /** Stable key. Also used as the React key and the slide's accessible id. */
  id: string;
  /** Short pill above the headline. */
  eyebrow: string;
  headline: string;
  body: string;
  image: StaticImageData;
  /**
   * Description of the photo for assistive technology. The image is decorative
   * behind the copy, so this is only read when the slide is active.
   */
  alt: string;
}

/**
 * The wash laid over every photo. One wash for all four slides keeps the
 * rotation feeling like a single brand, and the deep navy on the left gives
 * the white order card a clean edge to sit against.
 */
export const HERO_WASH =
  "linear-gradient(100deg, rgba(3,20,44,0.88) 0%, rgba(0,60,140,0.58) 42%, rgba(0,120,180,0.28) 72%, rgba(0,190,214,0.18) 100%)";


/**
 * The hero's rotating slides. Copy and imagery live here so the marketing
 * team can change the hero without touching the slider itself.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "stations-near-you",
    eyebrow: "Six cities, one app",
    headline: "Refill water from a station near you",
    body: "Pick your estate, choose a verified station and we will bring clean drinking water to your door.",
    image: waterCansBg,
    alt: "Rows of clean water jerrycans at a refill station",
  },
  {
    id: "delivered-fast",
    eyebrow: "Average 40 minutes",
    headline: "Track the rider all the way to your gate",
    body: "Every order follows a live map, so you always know when the water is two streets away.",
    image: aquaSpringCover,
    alt: "Clear blue spring water at a roadside refill point",
  },
  {
    id: "pay-your-way",
    eyebrow: "M-Pesa or cash",
    headline: "Pay the way that suits you",
    body: "Settle up with M-Pesa on delivery, or pay cash to the rider when the water reaches you.",
    image: nightWater,
    alt: "Still water reflecting a night sky",
  },
  {
    id: "homes-and-businesses",
    eyebrow: "Homes and businesses",
    headline: "Standing deliveries for your team",
    body: "Offices, shops and restaurants get scheduled refills and one monthly invoice instead of daily trips.",
    image: pureBlueCover,
    alt: "Pale blue water stretching towards the horizon",
  },
];

/** How long a slide holds before the hero advances. */
export const HERO_SLIDE_INTERVAL = 7000;
