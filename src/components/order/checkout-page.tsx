"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Transition } from "framer-motion";
import {
  AlertCircle, CheckCircle2, CreditCard, Loader2, MapPin, Navigation, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { useCart } from "@/components/order/cart-provider";
import { useCustomer, type CustomerProfile } from "@/components/order/customer-provider";
import { useToast } from "@/components/ui/toast";
import { businesses } from "@/lib/data/businesses";
import { CITIES, ESTATES } from "@/lib/constants";
import { formatKES } from "@/lib/format";
import { computeCartTotals } from "@/lib/pricing";
import {
  captureLocationBestEffort,
  geolocationErrorMessage,
  nearestPlace,
  resolveCity,
  reverseGeocode,
  type CapturedLocation,
} from "@/lib/geo";
import { createOrder, generateOrderNumber, OrderValidationError, postLocation } from "@/lib/orders";
import { useMotionSafe } from "@/lib/motion";
import type { DeliveryAddress, Order, PaymentMethod } from "@/lib/types";

type PayState = "idle" | "pending" | "failed";
type FieldErrors = Record<string, string>;

const CONSENT_KEY = "mf:profileConsent";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVER_FIELD_MAP: Record<string, string> = {
  customerName: "name",
  customerPhone: "phone",
  phone: "phone",
  city: "city",
  estate: "estate",
  notes: "notes",
  items: "_form",
  address: "_form",
  subtotal: "_form",
  total: "_form",
  payment: "_form",
};

function mapServerFields(fields: Record<string, string>): FieldErrors {
  const out: FieldErrors = {};
  for (const [key, message] of Object.entries(fields)) {
    out[SERVER_FIELD_MAP[key] ?? "_form"] = message;
  }
  return out;
}

function makeId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `k-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function readConsent(): boolean {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    return raw === "1";
  } catch {
    return false;
  }
}

function writeConsent(v: boolean) {
  try {
    window.localStorage.setItem(CONSENT_KEY, v ? "1" : "0");
  } catch {
    /* noop */
  }
}

function defaultAddress(profile: CustomerProfile): DeliveryAddress | undefined {
  return profile.addresses[profile.defaultAddressIndex] ?? profile.addresses[0];
}

function addressLocation(a: DeliveryAddress | undefined): CapturedLocation | null {
  if (!a || typeof a.lat !== "number" || typeof a.lng !== "number") return null;
  return { lat: a.lat, lng: a.lng, accuracy: a.accuracy, at: a.locationAt ?? "" };
}

/** Delivery fields prefilled from the location saved in the user's profile. */
function prefillFromAddress(a: DeliveryAddress | undefined) {
  const location = addressLocation(a);
  const near = location ? nearestPlace(location.lat, location.lng) : {};
  return {
    city: a?.city || near.city || "Nairobi",
    estate: a?.estate || near.estate || "",
    street: a?.street ?? "",
    building: a?.building ?? "",
    floor: a?.floor ?? "",
    notes: a?.landmark ?? "",
    location,
  };
}

export function CheckoutPage() {
  const { hydrated } = useCustomer();
  return <CheckoutForm key={hydrated ? "hydrated" : "initial"} />;
}

function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCart();
  const { profile, loggedIn, saveProfileDetails } = useCustomer();
  const { toast } = useToast();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email ?? "");
  const [prefill] = useState(() => prefillFromAddress(defaultAddress(profile)));
  const [city, setCity] = useState(prefill.city);
  const [estate, setEstate] = useState(prefill.estate);
  const [street, setStreet] = useState(prefill.street);
  const [building, setBuilding] = useState(prefill.building);
  const [floor, setFloor] = useState(prefill.floor);
  const [notes, setNotes] = useState(prefill.notes);
  const [location, setLocation] = useState<CapturedLocation | null>(prefill.location);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [saveProfile, setSaveProfile] = useState(readConsent);
  const [shareLocation, setShareLocation] = useState(true);
  const [touch, setTouch] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [payState, setPayState] = useState<PayState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const { reduce, transition } = useMotionSafe();

  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const attemptKeyRef = useRef<string | null>(null);
  const lastSigRef = useRef<string | null>(null);

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

  const totals = computeCartTotals(
    rows.map((r) => ({
      businessId: r.business!.id,
      quantity: r.line.quantity,
      unitPrice: r.product!.price,
    })),
    businesses
  );
  const { subtotal, deliveryFee, total } = totals;
  const totalsByStation = new Map(totals.groups.map((group) => [group.businessId, group]));

  const savedAddress = defaultAddress(profile);
  const profileComplete = Boolean(
    profile.name && profile.phone && profile.email && typeof savedAddress?.lat === "number"
  );

  const signature = useMemo(
    () =>
      [
        rows.map((r) => `${r.line.businessId}:${r.line.productId}:${r.line.quantity}`).join(","),
        name.trim(),
        phone.trim(),
        email.trim(),
        city,
        estate.trim(),
        street.trim(),
        building.trim(),
        floor.trim(),
        notes.trim(),
        method,
        location ? `${location.lat},${location.lng}` : "",
      ].join("|"),
    [rows, name, phone, email, city, estate, street, building, floor, notes, method, location]
  );

  const ensureAttemptKey = () => {
    if (attemptKeyRef.current === null || lastSigRef.current !== signature) {
      attemptKeyRef.current = makeId();
      lastSigRef.current = signature;
    }
    return attemptKeyRef.current;
  };

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    const n = name.trim();
    if (!n || n.length < 2) {
      errs.name = "Enter your full name.";
    } else if (!/^[\p{L}\p{M}'’.\- ]+$/u.test(n) || n.length > 80) {
      errs.name = "Name can only contain letters (up to 80 chars).";
    }
    const p = phone.trim();
    let digits = p.replace(/[\s()\-.]/g, "");
    if (digits.startsWith("+254")) digits = "0" + digits.slice(4);
    else if (digits.startsWith("254")) digits = "0" + digits.slice(3);
    if (!/^0\d{9}$/.test(digits)) {
      errs.phone = "Use a Kenyan number, e.g. 07XX XXX XXX or +254 7XX….";
    }
    if (!city) errs.city = "Choose your town.";
    if (!estate.trim()) errs.estate = "Choose a recognised estate - riders use these to navigate.";
    if (notes.length > 500) errs.notes = "Directions must be under 500 characters.";
    if (saveProfile) {
      if (!email.trim()) errs.email = "Add your email to save it to your profile.";
      else if (!EMAIL_RE.test(email.trim())) errs.email = "Enter a valid email address.";
    }
    return errs;
  };

  const focusField = (key: string) => {
    formRef.current
      ?.querySelector<HTMLElement>(`[name="${key}"]`)
      ?.focus();
  };

  const allowNewLocation = async () => {
    setLocating(true);
    setLocationError(null);
    try {
      const loc = await captureLocationBestEffort();
      const near = nearestPlace(loc.lat, loc.lng);
      const geo = await reverseGeocode(loc.lat, loc.lng, loc.accuracy);
      const nextEstate = geo?.estate || near.estate || "";
      const nextCity = resolveCity(geo?.city, near.city) ?? city;
      setLocation(loc);
      if (nextEstate) setEstate(nextEstate);
      setCity(nextCity);
      if (geo?.street) setStreet(geo.street);
      if (geo?.building) setBuilding(geo.building);
      toast({
        kind: "success",
        title: "New location set",
        message: nextEstate
          ? `We'll deliver to ${nextEstate}${nextCity ? `, ${nextCity}` : ""}.`
          : "We'll deliver to your current location.",
      });
    } catch (err) {
      setLocationError(geolocationErrorMessage(err));
    } finally {
      setLocating(false);
    }
  };

  const submitDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    setTouch(true);
    const errs = validate();
    setErrors(errs);
    const first = ["name", "phone", "email", "city", "estate", "street", "notes"].find((k) => errs[k]);
    if (first) {
      toast({
        kind: "error",
        title: "A few details need fixing",
        message:
          errs[first] ??
          "Please correct the highlighted fields before paying. Nothing was charged.",
      });
      focusField(first);
      return;
    }
    startPayment();
  };

  const startPayment = () => {
    setErrors({});
    ensureAttemptKey();
    setPayState("pending");
  };

  const paymentSucceeded = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      let coords: CapturedLocation | null = location;
      let addrEstate = estate;
      let addrStreet = street;
      let addrCity = city;
      let addrBuilding = building;
      if (!coords && shareLocation) {
        try {
          coords = await captureLocationBestEffort();
          const near = nearestPlace(coords.lat, coords.lng);
          const geo = await reverseGeocode(coords.lat, coords.lng, coords.accuracy);
          if (!addrEstate) addrEstate = geo?.estate || near.estate || "";
          if (!addrStreet) addrStreet = geo?.street || "";
          if (!addrCity) addrCity = resolveCity(geo?.city, near.city) ?? city;
          if (!addrBuilding) addrBuilding = geo?.building || "";
        } catch {
          coords = null;
        }
      }
      const groups = new Map<string, typeof rows>();
      for (const r of rows) {
        const list = groups.get(r.business!.id) ?? [];
        list.push(r);
        groups.set(r.business!.id, list);
      }
      const attemptKey = ensureAttemptKey();
      const created: Order[] = [];
      for (const group of groups.values()) {
        const station = group[0].business!;
        // The station totals come from the same calculation the summary shows,
        // so the amount charged can never drift from the amount displayed.
        const stationTotals = totalsByStation.get(station.id);
        const groupSubtotal =
          stationTotals?.subtotal ??
          group.reduce((s, r) => s + (r.product?.price ?? 0) * r.line.quantity, 0);
        const groupFee =
          stationTotals?.deliveryFee ?? (groupSubtotal >= station.freeDeliveryAbove ? 0 : station.deliveryFee);
        const order: Order = {
          id: `order-${attemptKey}-${station.id}`,
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
          total: stationTotals?.total ?? groupSubtotal + groupFee,
          payment: method,
          paymentState: "success",
          status: "pending",
          address: {
            label: "Delivery",
            estate: addrEstate || addrBuilding || "Estate on file",
            street: addrStreet.trim() || undefined,
            city: addrCity || undefined,
            building: addrBuilding || undefined,
            floor: floor || undefined,
            landmark: notes.trim() || undefined,
            notes: notes || undefined,
            phone,
            lat: coords?.lat,
            lng: coords?.lng,
            accuracy: coords?.accuracy,
            locationAt: coords?.at,
          },
          placedAt: new Date().toISOString(),
          eta: "≈ 50 min",
        };
        created.push(await createOrder(order));
      }
      if (shareLocation && coords) {
        await Promise.all(
          created.map((o) =>
            postLocation(o.id, {
              lat: coords!.lat,
              lng: coords!.lng,
              accuracy: coords!.accuracy,
              at: coords!.at,
            })
          )
        );
      }
      const first = created[0];
      setLastOrder(first);
      clear();
      if (saveProfile) {
        saveProfileDetails({
          name,
          phone,
          email: email.trim() || undefined,
          address: {
            label: "Home",
            estate: addrEstate,
            street: addrStreet.trim() || undefined,
            city: addrCity || undefined,
            building: addrBuilding.trim() || undefined,
            floor: floor.trim() || undefined,
            landmark: notes.trim() || undefined,
            phone,
            lat: coords?.lat,
            lng: coords?.lng,
            accuracy: coords?.accuracy,
            locationAt: coords?.at,
          },
        });
      }
      setPayState("idle");
      toast({
        kind: "success",
        title: "Order placed",
        message:
          created.length > 1
            ? `${created.length} orders placed from ${formatKES(total)}. Start with ${first.orderNumber} - ${first.businessName}.`
            : `Order ${first.orderNumber} is with ${first.businessName}. Track it now.`,
      });
      window.setTimeout(() => router.push(`/order/${first.id}`), 1600);
    } catch (err) {
      const fields =
        err instanceof OrderValidationError ? mapServerFields(err.fields) : {};
      setErrors(fields);
      setPayState("failed");
      toast({
        kind: "error",
        title: "Order not placed",
        message:
          err instanceof OrderValidationError
            ? fields._form ?? "Please fix the highlighted fields and retry."
            : err instanceof Error
              ? err.message
              : "We hit a snag - nothing was charged and nothing was duplicated, so please retry.",
      });
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const paymentFailed = () => {
    if (submittingRef.current) return;
    setPayState("failed");
  };

  if (lastOrder) {
    return (
      <Container className="py-24 text-center">
        <div className="mx-auto max-w-md">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-transparent-soft text-success">
            <CheckCircle2 className="size-9" aria-hidden />
          </span>
          <h1 className="mt-6 font-display text-3xl text-foreground">Order confirmed</h1>
          <p className="mt-3 text-muted-foreground">
            <strong className="text-foreground">{lastOrder.orderNumber}</strong> ·{" "}
            {lastOrder.businessName} · <strong className="text-foreground">{formatKES(lastOrder.total)}</strong>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;re taking you to live tracking in a moment.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={`/order/${lastOrder.id}`}>
              <Button size="lg">Track order</Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline">
                Continue browsing
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (rows.length === 0) {
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

  return (
    <Container className="py-14 lg:py-20">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-foreground animate-pulse-dot" /> Delivery & payment
        </p>
        <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">Finish your order</h1>
      </div>

      <form
        ref={formRef}
        onSubmit={submitDelivery}
        className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]"
        noValidate
      >
        {/* Delivery details */}
        <div className="flex flex-col gap-8">
          {loggedIn && !profileComplete && (
            <div className="flex items-start gap-3 rounded-2xl border border-[#0052FF]/20 bg-transparent/5 p-4">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#0052FF]" aria-hidden />
              <p className="text-sm text-foreground/85">
                <strong className="font-semibold text-foreground">Finish your profile</strong> to
                speed up checkout.{" "}
                <Link href="/account/profile" className="font-semibold text-[#0052FF] hover:underline">
                  Complete your delivery details
                </Link>
              </p>
            </div>
          )}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2.5 font-display text-lg text-foreground">
              <MapPin className="size-5 text-[#0052FF]" aria-hidden /> Delivery details
            </h2>
            <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-transparent/10 text-[#0052FF]"
                    aria-hidden
                  >
                    <MapPin className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {location ? "Delivering to your shared location" : "Delivery location"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {[street, estate, city].filter(Boolean).join(" · ") || "No town or area set yet"}
                      {location && typeof location.accuracy === "number" && location.accuracy > 0
                        ? ` · ±${Math.round(location.accuracy)} m`
                        : ""}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={allowNewLocation}
                  disabled={locating}
                >
                  {locating ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Navigation className="size-4" aria-hidden />
                  )}
                  {locating ? "Locating…" : "Allow new location"}
                </Button>
              </div>
              {locationError && (
                <p className="mt-3 flex items-start gap-2 text-xs text-danger">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> {locationError}
                </p>
              )}
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" required error={touch ? errors.name : undefined}>
                <Input
                  name="name"
                  required
                  invalid={Boolean(touch && errors.name)}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Wanjiku"
                  autoComplete="name"
                />
              </Field>
              <Field label="Phone for rider" required hint="The rider calls this number." error={touch ? errors.phone : undefined}>
                <Input
                  name="phone"
                  required
                  type="tel"
                  invalid={Boolean(touch && errors.phone)}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  autoComplete="tel"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  label="Email"
                  required={saveProfile}
                  error={touch ? errors.email : undefined}
                  hint={saveProfile ? undefined : "Shown on your receipt when provided."}
                >
                  <Input
                    name="email"
                    type="email"
                    invalid={Boolean(touch && errors.email)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Field>
              </div>
              <Field label="Town" required error={touch ? errors.city : undefined}>
                <Select
                  name="city"
                  invalid={Boolean(touch && errors.city)}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Estate / area"
                required
                error={touch ? errors.estate : undefined}
              >
                <Input
                  id="estate"
                  name="estate"
                  required
                  value={estate}
                  invalid={Boolean(touch && errors.estate)}
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
              <Field
                label="Street / road"
                required={saveProfile}
                error={touch ? errors.street : undefined}
              >
                <Input
                  name="street"
                  value={street}
                  invalid={Boolean(touch && errors.street)}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Mwiki Road"
                  autoComplete="address-line1"
                />
              </Field>
              <Field label="Building / apartment">
                <Input name="building" value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="e.g. Singa Court, Block B" />
              </Field>
              <Field label="Floor / apt no.">
                <Input name="floor" value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="e.g. 3rd floor, Unit 12" />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  label="Landmark / delivery directions"
                  required={saveProfile}
                  error={touch ? errors.notes : undefined}
                  hint={saveProfile ? undefined : "Call on arrival, gate on the left…"}
                >
                  <Textarea
                    name="notes"
                    invalid={Boolean(touch && errors.notes)}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Call on arrival, gate on the left, avoid the school run 3–4pm…"
                  />
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
              rejected orders are refunded automatically. Card numbers and M-Pesa PINs are never
              stored on your profile.
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

          <label className="mt-5 flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-3">
            <input
              type="checkbox"
              checked={saveProfile}
              onChange={(e) => {
                setSaveProfile(e.target.checked);
                writeConsent(e.target.checked);
              }}
              className="mt-0.5 size-4 shrink-0 accent-[#0052FF]"
              aria-describedby="profile-save-note"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Update my profile with these details</span>{" "}
              so your next checkout fills itself - name, phone, email and this delivery address.
              <span id="profile-save-note" className="block text-muted-foreground/80">
                Never saved: card numbers, M-Pesa PINs or quantities.
              </span>
            </span>
          </label>

          <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-3">
            <input
              type="checkbox"
              checked={shareLocation}
              onChange={(e) => setShareLocation(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[#0052FF]"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                <Navigation className="size-3.5 text-[#0052FF]" aria-hidden /> Share my live location
              </span>{" "}
              with the delivery person so they can see and find you.
              <span className="block text-muted-foreground/80">
                Sharing stops automatically when the order is delivered.
              </span>
            </span>
          </label>

          {payState === "idle" && (
            <>
              <Button type="submit" size="lg" className="group mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_-4px_rgb(249,115,22)]">
                {method === "mpesa" ? `Pay ${formatKES(total)} with M-Pesa` : `Pay ${formatKES(total)} by card`}
              </Button>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                You&apos;ll confirm on your phone
              </p>
            </>
          )}
          {payState === "failed" && (
            <div className="mt-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-danger">
                <AlertCircle className="size-4" aria-hidden /> Order didn&apos;t go through
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Your account has not been charged. Review the highlighted fields (if any) or retry
                the payment.
              </p>
              <Button
                type="button"
                size="lg"
                className="group mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_-4px_rgb(249,115,22)]"
                onClick={startPayment}
                disabled={submitting}
              >
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
            busy={submitting}
            onSuccess={paymentSucceeded}
            onFail={paymentFailed}
            onClose={() => {
              if (!submitting) setPayState("idle");
            }}
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
          ? "border-[#0052FF] bg-transparent/5 ring-2 ring-[#0052FF]/20"
          : "border-border bg-white hover:border-[#0052FF]/40"
      }`}
    >
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-foreground text-white" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {badge && (
            <span className="rounded-full bg-transparent-soft px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-success">
              {badge}
            </span>
          )}
        </span>
        <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
      </span>
      <span
        className={`size-4 shrink-0 rounded-full border-2 ${selected ? "border-[#0052FF] bg-transparent" : "border-border bg-white"}`}
        style={selected ? { boxShadow: "inset 0 0 0 3px white" } : undefined}
        aria-hidden
      />
    </button>
  );
}

function MpesaOverlay({
  phone,
  amount,
  busy,
  onSuccess,
  onFail,
  onClose,
  reduce,
  transition,
}: {
  phone: string;
  amount: number;
  busy?: boolean;
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
      <div className="absolute inset-0 bg-transparent/70 backdrop-blur-sm" onClick={busy ? undefined : onClose} aria-hidden />
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
        <div className="bg-foreground px-6 py-5 text-white">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">
            <Smartphone className="size-4" aria-hidden /> M-Pesa · B2C
          </p>
          <p className="mt-2 font-display text-xl">Confirm payment on your phone</p>
        </div>

        <div className="flex flex-col items-center px-6 py-8 text-center">
          {!sent ? (
            <div className="flex flex-col items-center gap-3">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-transparent-soft text-success">
                <Smartphone className="size-7" aria-hidden />
              </span>
              <p className="text-sm text-muted-foreground">
                An STK push for <strong className="text-foreground">{formatKES(amount)}</strong> has
                been sent to <strong className="text-foreground">{phone}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Enter your M-Pesa PIN and press Send.
              </p>
              <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_-4px_rgb(249,115,22)]" disabled={busy} onClick={() => setSent(true)}>
                I&apos;ve confirmed - verify payment
              </Button>
              <button
                onClick={onFail}
                className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
              >
                Payment didn&apos;t arrive on my phone
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
                <legend className="sr-only">Confirm your payment</legend>
                <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Confirm on this screen
                </p>
                <div className="flex flex-col gap-2.5">
                  <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_-4px_rgb(249,115,22)]" disabled={busy} onClick={onSuccess}>
                    {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <CheckCircle2 className="size-4" aria-hidden />}
                    {busy ? "Placing your order…" : "Payment received - place order"}
                  </Button>
                  <Button size="lg" variant="secondary" className="w-full" disabled={busy} onClick={onFail}>
                    <AlertCircle className="size-4 text-danger" aria-hidden /> I didn&apos;t receive the request
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