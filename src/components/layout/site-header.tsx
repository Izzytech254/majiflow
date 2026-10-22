"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/layout/brand-mark";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
    return () => {};
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        scrolled || !isHome
          ? "border-b border-border bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandMark />

        <Link href="/register">
          <Button
            className="min-h-10 rounded-full px-6 text-sm font-semibold"
            style={{ backgroundColor: "var(--brand)" }}
          >
            Get started
          </Button>
        </Link>
      </div>
    </header>
  );
}
