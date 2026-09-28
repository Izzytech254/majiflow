import type { StaticImageData } from "next/image";
import canImg from "@/assets/images/products/can.webp";
import bottleImg from "@/assets/images/products/bottle.webp";
import glassImg from "@/assets/images/products/glass.webp";
import dispenserImg from "@/assets/images/products/dispenser.webp";

const PRODUCT_IMAGES: Record<string, StaticImageData> = {
  can: canImg,
  bottle: bottleImg,
  glass: glassImg,
  dispenser: dispenserImg,
};

export function productImage(kind: string): StaticImageData {
  return PRODUCT_IMAGES[kind] ?? bottleImg;
}
