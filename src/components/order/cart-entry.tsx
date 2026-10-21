"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ArrowRight, Repeat2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { businesses } from "@/lib/data/businesses";
import { resolveCart } from "@/lib/cart";
import { computeCartTotals } from "@/lib/pricing";
import { formatKES } from "@/lib/format";
import { useMotionSafe } from "@/lib/motion";
import { useCart } from "@/components/order/cart-provider";
import { useCartUi } from "@/components/order/cart-ui-provider";

/**
 * Persistent bottom cart bar shown everywhere a drawer can open. Hidden while
 * the drawer itself is open so the two never stack.
 */
export function FloatingCartBar() {
  const { items, hydrated } = useCart();
  const { open, openCart } = useCartUi();
  const { reduce, transition } = useMotionSafe();
  const pathname = usePathname();

  const cart = resolveCart(items, businesses);
  const count = cart.lines.reduce((n, r) => n + r.line.quantity, 0);
  const totals = computeCartTotals(
    cart.orderable
      .filter((r) => r.max > 0)
      .map((r) => ({
        businessId: r.business!.id,
        quantity: Math.min(r.line.quantity, r.max),
        unitPrice: r.product!.price,
      })),
    businesses
  );

  // The cart, checkout and tracking screens own their own summary bars.
  const hiddenRoute =
    pathname === "/cart" || pathname === "/checkout" || pathname?.startsWith("/order/") === true;
  const visible = hydrated && count > 0 && !open && !hiddenRoute;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 px-3 lg:bottom-6"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={reduce ? { duration: 0 } : (transition ?? { duration: 0.3 })}
        >
          <button
            type="button"
            onClick={openCart}
            className="mx-auto flex w-full max-w-2xl items-center gap-3 rounded-2xl bg-[var(--brand)] p-3 text-left text-white shadow-accent transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <ShoppingCart className="size-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 text-sm leading-tight">
              <span className="block truncate font-semibold">
                {count} {count === 1 ? "item" : "items"} · {formatKES(totals.total)}
              </span>
              <span className="block truncate text-xs text-white/80">Tap to review your order</span>
            </span>
            <ArrowRight className="size-5 shrink-0" aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Confirmation shown when adding an item from a different station than the one
 * already in the cart. Nothing is cleared automatically.
 */
export function SwitchStationDialog() {
  const { pendingSwitch, confirmSwitch, cancelSwitch } = useCartUi();
  const { reduce } = useMotionSafe();

  return (
    <AnimatePresence>
      {pendingSwitch && (
        <motion.div
          className="fixed inset-0 z-[96] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={cancelSwitch} aria-hidden />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="switch-title"
            aria-describedby="switch-desc"
            className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-cta-soft text-[var(--brand)]">
              <Repeat2 className="size-6" aria-hidden />
            </span>
            <h2 id="switch-title" className="mt-4 font-display text-lg text-foreground">
              Add from {pendingSwitch.businessName}?
            </h2>
            <p id="switch-desc" className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your order already has items from another station. They&apos;ll stay in the cart together -
              you can remove them any time in the cart.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
              <Button className="flex-1" onClick={confirmSwitch}>
                Add to order
              </Button>
              <Button variant="outline" className="flex-1" onClick={cancelSwitch}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
