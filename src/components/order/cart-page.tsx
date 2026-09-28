"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Droplets, Minus, Plus, ShoppingCart, Trash2, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { productImage } from "@/lib/product-images";
import { useCart } from "@/components/order/cart-provider";
import { businesses } from "@/lib/data/businesses";
import { formatKES } from "@/lib/format";

export function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();

  const rows = items
    .map((line) => {
      const business = businesses.find((b) => b.id === line.businessId);
      const product = business?.products.find((p) => p.id === line.productId);
      return { line, business, product };
    })
    .filter((r) => r.business && r.product);

  if (rows.length === 0) {
    return (
      <Container className="py-24">
        <EmptyState
          icon={<ShoppingCart className="size-7" aria-hidden />}
          title="Your cart is empty"
          description="No cans in here yet. Find a trusted station near you and add a refill — it takes seconds."
          action={
            <Link href="/browse">
              <Button size="lg" className="group">
                Browse stations
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>
          }
        />
      </Container>
    );
  }

  const subtotal = rows.reduce(
    (sum, r) => sum + (r.product?.price ?? 0) * r.line.quantity,
    0
  );
  const grouped = new Map(rows.map((r) => [r.business!.id, r.business!]));
  const deliveryFee = [...grouped.values()].reduce(
    (sum, b) => (subtotal >= b.freeDeliveryAbove ? 0 : b.deliveryFee) + sum,
    0
  );
  const total = subtotal + deliveryFee;

  return (
    <Container className="py-14 lg:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-[#0052FF] animate-pulse-dot" /> Your order
          </p>
          <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
            Review your cart
          </h1>
        </div>
        <Link href="/browse" className="text-sm font-semibold text-[#0052FF] hover:underline">
          ← Keep shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="flex flex-col gap-4">
          {rows.map(({ line, business, product }) => (
            <div
              key={`${line.businessId}-${line.productId}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-card sm:p-5"
            >
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                <Image
                  src={productImage(product!.image)}
                  alt=""
                  className="size-full object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-foreground">{product!.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {business!.name} · {business!.city}
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {formatKES(product!.price)}{" "}
                  <span className="font-normal text-muted-foreground">/ {product!.unit}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1">
                <button
                  onClick={() => updateQuantity(line.businessId, line.productId, line.quantity - 1)}
                  aria-label={`Decrease quantity of ${product!.name}`}
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Minus className="size-3.5" aria-hidden />
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">
                  {line.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(line.businessId, line.productId, line.quantity + 1)}
                  aria-label={`Increase quantity of ${product!.name}`}
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Plus className="size-3.5" aria-hidden />
                </button>
              </div>

              <div className="w-20 text-right">
                <p className="text-sm font-bold text-foreground">
                  {formatKES((product?.price ?? 0) * line.quantity)}
                </p>
                <button
                  onClick={() => removeItem(line.businessId, line.productId)}
                  aria-label={`Remove ${product!.name} from cart`}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-danger"
                >
                  <Trash2 className="size-3.5" aria-hidden /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-border bg-white p-6 shadow-layered lg:sticky lg:top-24">
          <h2 className="font-display text-xl text-foreground">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold text-foreground">{formatKES(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Truck className="size-4" aria-hidden /> Delivery
              </dt>
              <dd className="font-semibold text-foreground">
                {deliveryFee === 0 ? <span className="text-success">Free</span> : formatKES(deliveryFee)}
              </dd>
            </div>
            {deliveryFee === 0 && subtotal > 0 && (
              <p className="text-xs text-success">
                Free delivery applied — your order qualifies.
              </p>
            )}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <dt className="font-semibold text-foreground">Total</dt>
              <dd className="font-display text-2xl text-foreground">{formatKES(total)}</dd>
            </div>
          </dl>

          <p className="mt-4 flex items-center gap-2 rounded-lg bg-success-soft/70 px-3 py-2.5 text-xs text-success">
            <Droplets className="size-4 shrink-0" aria-hidden />
            Payment is collected with M-Pesa before dispatch.
          </p>

          <Link href="/checkout" className="mt-5 block">
            <Button size="lg" className="group w-full">
              Continue to checkout
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </Link>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            1 of 2 · Next: delivery & payment
          </p>
        </div>
      </div>
    </Container>
  );
}