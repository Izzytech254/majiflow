"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/layout/brand-mark";
import { useCustomer } from "@/components/order/customer-provider";
import { DeliveryPickupModal } from "@/components/order/delivery-pickup-modal";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { loggedIn } = useCustomer();

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
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-200",
          scrolled || !isHome
            ? "border-b border-border bg-white/95 backdrop-blur-sm shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <BrandMark />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm shadow-sm sm:flex"
            >
              <MapPin className="size-4 text-[var(--brand)]" aria-hidden />
              <span className="font-medium text-foreground">Delivery to</span>
              <span className="text-foreground/70">Select location</span>
              <ChevronDown className="size-4 text-foreground/70" aria-hidden />
            </button>
          </div>

          <Link href={loggedIn ? "/browse" : "/register"}>
            <Button
              className="min-h-10 rounded-full px-6 text-sm font-semibold"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Get started
            </Button>
          </Link>
        </div>
      </header>
      <DeliveryPickupModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
