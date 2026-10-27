"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Banknote, CreditCard, Loader2, MapPin, Phone, ShieldCheck, Smartphone } from "lucide-react";
import { useCart } from "@/components/order/cart-provider";
import { useOrderSession } from "@/components/order/order-session-provider";
import { useOrderEntry } from "@/components/order/order-entry-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DeliveryAddress, Order, PaymentMethod } from "@/lib/types";
import { mapCartLinesToOrderItems } from "@/lib/cart";
import { getBusiness } from "@/lib/data/businesses";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value);
}

function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  return /^(\+254|0)([17]\d{8})$/.test(trimmed);
}

export function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const session = useOrderSession();
  const { openLocation } = useOrderEntry();

  const stationId = session.stationId ?? items[0]?.stationId ?? null;
  const business = stationId ? getBusiness(stationId) : null;

  const [address, setAddress] = useState<DeliveryAddress | null>(session.address);
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [phone, setPhone] = useState(session.phone ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address && session.address) {
      setAddress(session.address);
    }
  }, [address, session.address]);

  useEffect(() => {
    if (!phone && session.phone) {
      setPhone(session.phone);
    }
  }, [phone, session.phone]);

  const orderItems = useMemo(() => mapCartLinesToOrderItems(items), [items]);

  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [items]
  );
  const deliveryFee = useMemo(() => (business ? business.deliveryFee : 0), [business]);
  const total = subtotal + deliveryFee;

  const canPay =
    Boolean(business) &&
    Boolean(address) &&
    items.length > 0 &&
    (method === "cod" || isValidPhone(phone));

  async function handlePay() {
    if (!business || !address || items.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          items: orderItems,
          address,
          payment: method,
          fulfillment: "delivery",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "We couldn't place your order. Please try again.");
      }

      const order = (await res.json()) as Order;
      session.setPhone(phone);

      if (method === "mpesa") {
        const payRes = await fetch("/api/payments/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderIds: [order.id],
            phone,
            method: "mpesa",
            idempotencyKey: order.id,
          }),
        });
        if (!payRes.ok) {
          const data = await payRes.json().catch(() => ({}));
          throw new Error(data.error || "M-Pesa payment failed to start.");
        }
      } else if (method === "card") {
        const payRes = await fetch("/api/payments/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderIds: [order.id],
            phone,
            method: "card",
            idempotencyKey: order.id,
          }),
        });
        if (!payRes.ok) {
          const data = await payRes.json().catch(() => ({}));
          throw new Error(data.error || "Card payment failed to start.");
        }
      }

      clearCart();
      router.push(`/order/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add items from a station to checkout.</p>
        <Button className="mt-6">
          <Link href="/browse">Browse stations</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Link href="/cart">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Checkout</h1>
          <p className="text-sm text-muted-foreground">Review your order and pay securely</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">Delivery details</h2>
                <p className="text-sm text-muted-foreground">Where should we drop off your water?</p>
              </div>
              <Button variant="outline" size="sm" onClick={openLocation}>
                {address ? "Change" : "Set location"}
              </Button>
            </div>
            {address ? (
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-surface-2 p-3">
                <MapPin className="mt-0.5 size-5 text-brand" />
                <div>
                  <p className="font-medium text-foreground">{address.estate}</p>
                  {address.apartment ? <p className="text-sm text-muted-foreground">{address.apartment}</p> : null}
                  {address.notes ? <p className="text-sm text-muted-foreground">{address.notes}</p> : null}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No delivery location set yet.</p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-foreground">Payment method</h2>
            <p className="text-sm text-muted-foreground">Choose how you'd like to pay</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setMethod("mpesa")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                  method === "mpesa" ? "border-brand bg-brand/5 ring-1 ring-brand/20" : "border-border hover:border-brand/40"
                )}
              >
                <Smartphone className="size-5 text-brand" />
                <div>
                  <p className="text-sm font-semibold">Pay with M-Pesa</p>
                  <p className="text-xs text-muted-foreground">STK push to your phone</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMethod("card")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                  method === "card" ? "border-brand bg-brand/5 ring-1 ring-brand/20" : "border-border hover:border-brand/40"
                )}
              >
                <CreditCard className="size-5 text-brand" />
                <div>
                  <p className="text-sm font-semibold">Pay with Card</p>
                  <p className="text-xs text-muted-foreground">Visa/Mastercard</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMethod("cod")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                  method === "cod" ? "border-brand bg-brand/5 ring-1 ring-brand/20" : "border-border hover:border-brand/40"
                )}
              >
                <Banknote className="size-5 text-brand" />
                <div>
                  <p className="text-sm font-semibold">Pay on delivery</p>
                  <p className="text-xs text-muted-foreground">Cash on delivery</p>
                </div>
              </button>
            </div>

            {method === "mpesa" ? (
              <div className="mt-4">
                <label className="text-sm font-medium text-foreground">M-Pesa phone number</label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-border px-3">
                  <Phone className="size-4 text-muted-foreground" />
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XXXXXXXX or +254..."
                    className="border-0 px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                {!isValidPhone(phone) && phone.length > 0 ? (
                  <p className="mt-1 text-xs text-destructive">Enter a valid Kenyan number</p>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-foreground">Items</h2>
            <div className="mt-3 flex flex-col divide-y divide-border">
              {items.map((line) => (
                <div key={`${line.productId ?? line.id ?? ''}-${line.storeId ?? ''}-${line.name ?? ''}`} className="flex items-center gap-3 py-3">
                  <div className="relative size-14 overflow-hidden rounded-xl bg-surface-2">
                    {line.image ? <Image src={line.image} alt={line.name} fill className="object-cover" /> : <div className="size-full bg-surface-2" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{line.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {line.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(line.price * line.quantity)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-foreground">Order summary</h2>
            {business ? (
              <p className="mt-1 text-sm text-muted-foreground">{business.name} • {business.city}</p>
            ) : (
              <p className="mt-1 text-sm text-destructive">No station selected</p>
            )}
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Delivery fee</span>
                <span className="text-foreground">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
            <Button size="lg" className="mt-4 w-full" disabled={!canPay || submitting} onClick={handlePay}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Placing order...
                </>
              ) : method === "cod" ? (
                "Place order (Pay on delivery)"
              ) : method === "card" ? (
                "Pay with Card"
              ) : (
                "Pay with M-Pesa"
              )}
            </Button>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4" /> Secure checkout
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
