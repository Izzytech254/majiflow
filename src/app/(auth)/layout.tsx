import Image from "next/image";
import waterCansBg from "@/assets/images/hero/water-cans-bg.webp";
import { BrandMark } from "@/components/layout/brand-mark";
import { PageTransition } from "@/components/layout/page-transition";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-black px-5 py-14 sm:px-8">
      <Image
        src={waterCansBg}
        alt=""
        fill
        sizes="100vw"
        preload
        aria-hidden
        className="pointer-events-none object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/60"
      />
      <div className="relative z-10 flex w-full flex-col items-center">
        <BrandMark dark className="mb-8" />
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
