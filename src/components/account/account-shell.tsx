"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/order/cart-provider";
import { useCustomer } from "@/components/order/customer-provider";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/plans", label: "Plans" },
] as const;

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { count } = useCart();
  const { profile } = useCustomer();
  const name = profile.name || "";
  const initial = name ? name.trim().slice(0, 1).toUpperCase() : "U";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-md sm:h-16">
        <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="MajiFlow home" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-accent">
              <BrandMark className="scale-85" />
            </Link>
            <nav aria-label="Account" className="hidden overflow-x-auto flex gap-1 px-1 sm:flex">
              {TABS.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                    pathname === tab.href
                      ? "bg-[#0052FF]/10 text-[#0052FF]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  aria-current={pathname === tab.href ? "page" : undefined}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              aria-label={`Cart, ${count} items`}
              className="relative flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ShoppingCart className="size-5" aria-hidden />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-brand-gradient text-[11px] font-bold text-white shadow-accent">
                  {count}
                </span>
              )}
            </Link>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient font-display text-sm text-white">
              {initial}
            </span>
            <Link href="/browse" className="hidden sm:inline-flex">
              <Button className="group min-h-10">
                Browse water
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-[80rem] items-center justify-between gap-4 px-4 py-3 text-xs text-muted-foreground sm:px-6 sm:py-2">
          <p>MajiFlow — Water refill, delivered.</p>
          <nav className="flex items-center gap-4" aria-label="Footer">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/for-business" className="hover:underline">For businesses</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            <Link href="/contact" className="hover:underline">Support</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}