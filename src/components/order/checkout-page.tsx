"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  Smartphone,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { useCart } from "@/components/order/cart-provider";
import { useCustomer } from "@/components/order/customer-provider";
import { useToast } from "@/components/ui/toast";
import { businesses } from "@/lib/data/businesses";
import { CITIES, ESTATES } from "@/lib/constants";
import { formatKES } from "@/lib/format";
import { createOrder, generateOrderNumber } from "@/lib/orders";
import { useMotionSafe } from "@/lib/motion";
import type { Order, PaymentMethod } from "@/lib/types";

type PayState = "idle" | "pending" | "success" | "failed";

export function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const { profile, saveCustomer } = useCustomer();
  const { toast } = useToast();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [city, setCity] = useState("Nairobi");
  const [estate, setEstate] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [touch, setTouch] = useState(false);
  const [payState, setPayState] = useState<PayState>("idle");
  const { reduce, transition } = useMotionSafe();

  const rows = useMemo(
    () =>
      items
        .map((line) => {
          const business = businesses.find((b) => b.id === line.businessId);
          const product = business?.products.find((p) => p.id === line.productId);
          return { line, business, product };
        })
        .filter((r) => r.business && r.product),
    [items]
  );

  const invalidEstate =
    touch && (city === "Nairobi" || city === "Mombasa") && !estate.trim();

  const subtotal = rows.reduce((s, r) => s + (r.product?.price ?? 0) * r.line.quantity, 0);
  const deliveryFee = [...new Map(rows.map((r) => [r.business!.id, r.business!])).values()].reduce(
    (s, b) => (subtotal >= b.freeDeliveryAbove ? 0 : b.deliveryFee) + s,
    0
  );
  const total = subtotal + deliveryFee;

  if (rows.length === 0 && payState !== "success") {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-3xl text-foreground">Nothing to check out</h1>
        <p className="mt-3 text-muted-foreground">Add water to your cart first.</p>
        <Link href="/browse" className="mt-6 inline-flex">
          <Button size="lg">Browse stations</Button>
        </Link>
      </Container>
    );
  }

  const submitDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    setTouch(true);
    if (invalidEstate) {
      toast({
        kind: "error",
        title: "Delivery address needs fixing",
        message: "Choose a recognised estate so our riders can find you. We check against real estate lists.",
      });
      document.getElementById("estate")?.focus();
      return;
    }
    saveCustomer({ name, phone, addresses: [] });
  };

  const startPayment = () => {
    setPayState("pending");
  };

  const paymentSucceeded = async () => {
    setPayState("success");
    // One order per station so each vendor receives (and tracks) their own.
    const groups = new Map<string, typeof rows>();
    for (const r of rows) {
      const list = groups.get(r.business!.id) ?? [];
      list.push(r);
      groups.set(r.business!.id, list);
    }
    const created: Order[] = [];
    for (const group of groups.values()) {
      const station = group[0].business!;
      const groupSubtotal = group.reduce((s, r) => s + (r.product?.price ?? 0) * r.line.quantity, 0);
      const groupFee = groupSubtotal >= station.freeDeliveryAbove ? 0 : station.deliveryFee;
      const order: Order = {
        id: `order-${Date.now()}-${station.id}`,
        orderNumber: generateOrderNumber(),
        businessId: station.id,
        businessName: station.name,
        customerName: name,
        customerPhone: phone,
        items: group.map((r) => ({
          productId: r.product!.id,
          name: r.product!.name,
          quantity: r.line.quantity,
          unitPrice: r.product!.price,
        })),
        subtotal: groupSubtotal,
        deliveryFee: groupFee,
        total: groupSubtotal + groupFee,
        payment: method,
        paymentState: "success",
        status: "pending",
        address: {
          label: "Delivery",
          estate: estate || building || "Estate on file",
          street: estate,
          building,
          floor,
          notes,
          phone,
        },
        placedAt: new Date().toISOString(),
        eta: "≈ 50 min",
      };
      created.push(await createOrder(order));
    }
    const first = created[0];
    clear();
    saveCustomer({ name, phone });
    toast({
      kind: "success",
      title: "Payment received",
      message:
        created.length > 1
          ? `${created.length} orders placed from ${formatKES(total)}. Start with ${first.orderNumber} — ${first.businessName}.`
          : `Order ${first.orderNumber} is with ${first.businessName}. Track it now.`,
    });
    window.setTimeout(() => router.push(`/order/${first.id}`), 900);
  };

  const paymentFailed = () => {
    setPayState("failed");
  };

  return (
    <Container className="py-14 lg:py-20">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-[#0052FF] animate-pulse-dot" /> Delivery & payment
        </p>
        <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">Finish your order</h1>
      </div>

      <form onSubmit={submitDelivery} className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]" noValidate>
        {/* Delivery details */}
        <div className="flex flex-col gap-8">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2.5 font-display text-lg text-foreground">
              <MapPin className="size-5 text-[#0052FF]" aria-hidden /> Delivery details
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" required>
                <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Wanjiku" autoComplete="name" />
              </Field>
              <Field label="Phone for rider" required hint="The rider calls this number.">
                <Input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7XX XXX XXX" autoComplete="tel" />
              </Field>
              <Field label="Town" required>
                <Select value={city} onChange={(e) => setCity(e.target.value)}>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Estate / area" required error={invalidEstate ? "Choose a recognised estate — riders use these to navigate." : undefined}>
                <Input
                  id="estate"
                  required
                  value={estate}
                  invalid={invalidEstate}
                  onChange={(e) => setEstate(e.target.value)}
                  list="estate-options"
                  placeholder="e.g. Kasarani, Nyali, Milimani…"
                  autoComplete="street-address"
                />
                <datalist id="estate-options">
                  {ESTATES.map((e) => (
                    <option key={e} value={e} />
                  ))}
                </datalist>
              </Field>
              <Field label="Building / apartment">
                <Input value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="e.g. Singa Court, Block B" />
              </Field>
              <Field label="Floor / apt no.">
                <Input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="e.g. 3rd floor, Unit 12" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Delivery notes">
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Call on arrival, gate on the left, avoid the school run 3–4pm…" />
                </Field>
              </div>
            </div>
          </section>

          {/* Payment method */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2.5 font-display text-lg text-foreground">
              <ShieldCheck className="size-5 text-[#0052FF]" aria-hidden /> Payment method
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <PaymentOption
                selected={method === "mpesa"}
                onSelect={() => setMethod("mpesa")}
                icon={<Smartphone className="size-5" aria-hidden />}
                title="M-Pesa"
                subtitle="STK push to your phone"
                badge="Fastest"
              />
              <PaymentOption
                selected={method === "card"}
                onSelect={() => setMethod("card")}
                icon={<CreditCard className="size-5" aria-hidden />}
                title="Card"
                subtitle="Visa & Mastercard"
              />
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              Payment is released to the station only after your order is accepted. Failed or
              rejected orders are refunded automatically.
            </p>
          </section>
        </div>

        {/* Summary + pay */}
        <div className="h-fit rounded-2xl border border-border bg-white p-6 shadow-layered lg:sticky lg:top-24">
          <h2 className="font-display text-xl text-foreground">Your order</h2>
          <ul className="mt-4 space-y-2.5">
            {rows.map((r) => (
              <li key={`${r.line.businessId}-${r.line.productId}`} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-muted-foreground">
                  {r.line.quantity} × {r.product!.name}
                </span>
                <span className="shrink-0 font-semibold text-foreground">
                  {formatKES((r.product?.price ?? 0) * r.line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold text-foreground">{formatKES(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Truck className="size-4" aria-hidden /> Delivery
              </dt>
              <dd className="font-semibold text-foreground">
                {deliveryFee === 0 ? <span className="text-success">Free</span> : formatKES(deliveryFee)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <dt className="font-semibold text-foreground">Total</dt>
              <dd className="font-display text-2xl text-foreground">{formatKES(total)}</dd>
            </div>
          </dl>

          {payState === "idle" && (
            <>
              <Button type="button" size="lg" className="group mt-5 w-full" onClick={startPayment}>
                {method === "mpesa" ? `Pay ${formatKES(total)} with M-Pesa` : `Pay ${formatKES(total)} by card`}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <p className="mt-3 textcenter font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                You'll confirm on your phone
              </p>
            </>
          )}
          {payState === "failed" && (
            <div className="mt-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-danger">
                <AlertCircle className="size-4" aria-hidden /> Payment didn't go through
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                No money was moved. You can retry — or try the 5L option your provider doesn't block.
              </p>
              <Button type="button" size="lg" className="group mt-4 w-full" onClick={startPayment}>
                Retry M-Pesa payment
              </Button>
            </div>
          )}
        </div>
      </form>

      {/* M-Pesa payment overlay */}
      <AnimatePresence>
        {payState === "pending" && (
          <MpesaOverlay
            phone={phone}
            amount={total}
            onSuccess={paymentSucceeded}
            onFail={paymentFailed}
            onClose={() => setPayState("idle")}
            reduce={reduce}
            transition={transition}
          />
        )}
      </AnimatePresence>
    </Container>
  );
}

function PaymentOption({
  selected,
  onSelect,
  icon,
  title,
  subtitle,
  badge,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all min-h-[64px] ${
        selected
          ? "border-[#0052FF] bg-[#0052FF]/5 ring-2 ring-[#0052FF]/20"
          : "border-border bg-white hover:border-[#0052FF]/40"
      }`}
    >
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-brand-gradient text-white" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {badge && (
            <span className="rounded-full bg-success-soft px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-success">
              {badge}
            </span>
          )}
        </span>
        <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
      </span>
      <span
        className={`size-4 shrink-0 rounded-full border-2 ${selected ? "border-[#0052FF] bg-[#0052FF]" : "border-border bg-white"}`}
        style={selected ? { boxShadow: "inset 0 0 0 3px white" } : undefined}
        aria-hidden
      />
    </button>
  );
}

import type { Transition } from "framer-motion";

function MpesaOverlay({
  phone,
  amount,
  onSuccess,
  onFail,
  onClose,
  reduce,
  transition,
}: {
  phone: string;
  amount: number;
  onSuccess: () => void;
  onFail: () => void;
  onClose: () => void;
  reduce?: boolean;
  transition?: Transition;
}) {
  const [sent, setSent] = useState(false);
  const r = reduce ?? false;
  const t = transition ?? { duration: 0.35, ease: [0.16, 1, 0.3, 1] };
  const overlayTransition: Transition = r ? { duration: 0 } : { duration: 0.2 };
  const panelTransition: Transition = r ? { duration: 0 } : t;
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      initial={r ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={r ? { opacity: 0 } : { opacity: 0 }}
      transition={overlayTransition}
    >
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="M-Pesa payment"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-layered"
        initial={r ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={r ? { opacity: 0, y: 0, scale: 1 } : { opacity: 0, y: 16 }}
        transition={panelTransition}
      >
        <div className="bg-brand-gradient px-6 py-5 text-white">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">
            <Smartphone className="size-4" aria-hidden /> M-Pesa · B2C
          </p>
          <p className="mt-2 font-display text-xl">Confirm payment on your phone</p>
        </div>

        <div className="flex flex-col items-center px-6 py-8 text-center">
          {!sent ? (
            <div className="flex flex-col items-center gap-3">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-success-soft text-success">
                <Smartphone className="size-7" aria-hidden />
              </span>
              <p className="text-sm text-muted-foreground">
                An STK push for <strong className="text-foreground">{formatKES(amount)}</strong> has
                been sent to <strong className="text-foreground">{phone}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Enter your M-Pesa PIN and press Send.
              </p>
              <Button size="lg" className="group mt-3 w-full" onClick={() => setSent(true)}>
                I've confirmed — verify payment
              </Button>
              <button
                onClick={onFail}
                className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
              >
                Payment didn't arrive on my phone
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-10 animate-spin text-[#0052FF]" aria-hidden />
              <p className="text-sm text-muted-foreground">Verifying with M-Pesa…</p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                DO NOT close this window
              </p>

              <fieldset className="mt-5 w-full rounded-xl border border-border bg-muted/40 p-4">
                <legend className="sr-only">Demo payment controls</legend>
                <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Demo controls
                </p>
                <div className="flex flex-col gap-2.5">
                  <Button size="lg" className="w-full" onClick={onSuccess}>
                    <CheckCircle2 className="size-4" aria-hidden /> Payment received
                  </Button>
                  <Button size="lg" variant="secondary" className="w-full" onClick={onFail}>
                    <AlertCircle className="size-4 text-danger" aria-hidden /> Simulate failure
                  </Button>
                </div>
              </fieldset>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}