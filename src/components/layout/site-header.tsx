"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { Bell, Menu, ShoppingCart, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/layout/brand-mark";
import { useCart } from "@/components/order/cart-provider";
import { useCustomer } from "@/components/order/customer-provider";
import { useMotionSafe } from "@/lib/motion";

export const NAV_LINKS = [
  { href: "/browse", label: "Browse water" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/for-business", label: "For businesses" },
] as const;

/** Routes where the cart belongs - the ordering flow only. */
const ORDER_FLOW = ["/browse", "/cart", "/checkout", "/order"] as const;

const MENU_EASE = [0.16, 1, 0.3, 1] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();
  const { loggedIn } = useCustomer();
  const { reduce, transition } = useMotionSafe();
  const inOrderFlow = ORDER_FLOW.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
    return () => {};
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [menuOpen]);

  const navTransition: Transition = transition ?? { duration: 0.32, ease: [0.16, 1, 0.3, 1] };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || menuOpen
          ? "border-b border-border bg-background/85 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[72rem] items-center justify-between gap-4 px-5 sm:px-8">
        <BrandMark />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname !== "/" && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors min-h-11 inline-flex items-center",
                  active
                    ? "text-[var(--brand)]"
                    : "text-foreground hover:text-[var(--brand)] hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {inOrderFlow && (
            <Link
              href="/cart"
              data-cart-target
              aria-label={`Cart, ${count} items`}
              className="relative flex size-11 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              <ShoppingCart className="size-5" aria-hidden />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-white shadow-accent">
                  {count}
                </span>
              )}
            </Link>
          )}

          <Link
            href="/account/notifications"
            aria-label="Notifications"
            className="flex size-11 items-center justify-center rounded-lg border border-border bg-white text-foreground transition-colors hover:border-[var(--brand)]/40 hover:text-[var(--brand)] lg:hidden"
          >
            <Bell className="size-5" aria-hidden />
          </Link>

          <Link
            href={loggedIn ? "/account/profile" : "/login"}
            aria-label={loggedIn ? "Your profile" : "Sign in or create an account"}
            className="hidden size-11 items-center justify-center rounded-lg border border-border bg-white text-foreground transition-colors hover:border-[var(--brand)]/40 hover:text-[var(--brand)] lg:flex"
          >
            <User className="size-5" aria-hidden />
          </Link>

          {!loggedIn && (
            <Link href="/register" className="hidden sm:inline-flex">
              <Button className="group min-h-11">
                Order water
              </Button>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex size-11 items-center justify-center rounded-lg border border-border bg-white text-foreground lg:hidden"
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={reduce ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
            transition={navTransition}
            className="overflow-hidden rounded-b-2xl border-b border-border bg-background shadow-layered lg:hidden"
          >
            {/* Ripple rings */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-6 top-16 size-20 rounded-full border-2 border-[var(--brand)]/40"
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 1, ease: MENU_EASE, delay: reduce ? 0 : 0.18 }}
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-12 top-24 size-12 rounded-full border-2 border-[var(--brand)]/30"
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 3.4, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 1.3, ease: MENU_EASE, delay: reduce ? 0 : 0.34 }}
            />

            <div className="drawer-stagger flex flex-col gap-1 px-5 pb-6 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 text-[15px] font-medium text-foreground hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2.5">
                {loggedIn ? (
                  <Link href="/account/profile" className="w-full" onClick={() => setMenuOpen(false)}>
                    <Button size="lg" className="w-full">
                      My profile
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register" className="w-full" onClick={() => setMenuOpen(false)}>
                      <Button size="lg" className="group w-full">
                        Order water
                      </Button>
                    </Link>
                    <Link href="/login" className="w-full" onClick={() => setMenuOpen(false)}>
                      <Button size="lg" variant="secondary" className="w-full">
                        Sign in
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Tide sheet: covers the menu then sweeps off to reveal it */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-transparent"
              initial={reduce ? { x: "-104%" } : { x: 0 }}
              animate={{ x: "-104%" }}
              transition={{ duration: reduce ? 0 : 0.55, ease: MENU_EASE, delay: reduce ? 0 : 0.12 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}