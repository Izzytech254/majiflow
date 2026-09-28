"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Droplets, Eye, EyeOff } from "lucide-react";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { CITIES } from "@/lib/constants";

const perks = [
  "Order refills from verified stations around you",
  "Pay with M-Pesa before the rider leaves",
  "Track every order from accepted to delivered",
  "Save addresses and reorder in two taps",
];

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[70vh] py-14 lg:py-20">
      <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-white shadow-layered lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-white lg:flex">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-60" />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-[#0052FF]/25 blur-[100px]"
          />

          <div className="relative">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-accent">
              <Droplets className="size-6" aria-hidden />
            </span>
            <h2 className="mt-8 font-display text-3xl leading-[1.15] text-white">
              Clean water, delivered simply
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{subtitle}</p>
          </div>

          <ul className="relative space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-slate-200">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-white">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-7 sm:p-10">{children}</div>
      </div>

      {title.includes("Sign in") ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/register" className="font-semibold text-[#0052FF] hover:underline">
            Create an account
          </Link>
        </p>
      ) : (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#0052FF] hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}

export function RegisterForm() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", city: "Nairobi", estate: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      toast({
        kind: "success",
        title: "Account created",
        message: `Karibu, ${form.name.split(" ")[0] || "friend"}! We'll use ${form.phone} for your M-Pesa orders.`,
      });
      window.location.href = "/account";
    }, 900);
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground sm:text-3xl">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Start ordering water or running a station — takes under a minute.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label="Full name" required>
          <Input
            required
            placeholder="e.g. Amina Yusuf"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoComplete="name"
          />
        </Field>
        <Field label="M-Pesa phone number" required hint="We send order updates and payment requests here.">
          <Input
            required
            type="tel"
            placeholder="+254 7XX XXX XXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            autoComplete="tel"
          />
        </Field>
        <Field label="Email" hint="For receipts and account recovery.">
          <Input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />
        </Field>
        <Field label="Password" required>
          <div className="relative">
            <Input
              required
              minLength={8}
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4.5" aria-hidden /> : <Eye className="size-4.5" aria-hidden />}
            </button>
          </div>
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nearest town" required>
            <Select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estate / area">
            <Input
              placeholder="e.g. Kasarani, Milimani…"
              value={form.estate}
              onChange={(e) => setForm({ ...form, estate: e.target.value })}
            />
          </Field>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={sending}>
          {sending ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[#0052FF]">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-[#0052FF]">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

export function LoginForm() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ phone: "", password: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      toast({ kind: "success", title: "Signed in", message: "Welcome back!" });
      window.location.href = "/account";
    }, 700);
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground sm:text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to order and track your refills.</p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label="Phone number" required>
          <Input
            required
            type="tel"
            placeholder="+254 7XX XXX XXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            autoComplete="tel"
          />
        </Field>
        <Field label="Password" required>
          <Input
            required
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={sending}>
          {sending ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-sm">
          <Link href="/contact" className="font-medium text-[#0052FF] hover:underline">
            Forgot your password? We can help.
          </Link>
        </p>
      </form>
    </div>
  );
}