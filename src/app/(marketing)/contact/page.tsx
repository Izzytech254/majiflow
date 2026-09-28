"use client";

import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/shared/page-hero";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const topics = [
  "I want to order water",
  "I run a refill business — register me",
  "Billing or subscription help",
  "Support for an existing order",
  "Press or partnership",
  "Something else",
];

const channels = [
  { icon: MessageCircle, label: "WhatsApp support", value: "+254 700 123 456", note: "Fastest — replies in minutes" },
  { icon: Phone, label: "Phone", value: "+254 700 123 456", note: "Mon–Sat, 7am–9pm EAT" },
  { icon: Mail, label: "Email", value: "hello@majiflow.co.ke", note: "Replies within one business day" },
];

export default function Contact() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: topics[0], message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      toast({
        kind: "success",
        title: "Message sent",
        message: `Thanks ${form.name || "there"} — our team will reply within one business day.`,
      });
      setForm({ name: "", email: "", phone: "", topic: topics[0], message: "" });
    }, 900);
  };

  return (
    <>
      <PageHero
        label="Contact"
        pulseLabel
        title={
          <>
            Real humans, <span className="text-gradient">MajiFlow answers</span>
          </>
        }
        description="Questions about ordering water, running your station or getting paid? Reach us the way that suits your phone."
      />

      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="font-display text-2xl text-foreground">Talk to the team</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Whether you're a household in Roysambu or a station owner in Eldoret, the right
                person answers.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                {channels.map((c) => (
                  <div key={c.label} className="flex items-start gap-3.5 rounded-2xl border border-border bg-white p-5 shadow-card">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-accent">
                      <c.icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{c.label}</p>
                      <p className="mt-0.5 font-semibold text-foreground">{c.value}</p>
                      <p className="text-xs text-muted-foreground">{c.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-muted/50 p-5">
                <MapPin className="mt-0.5 size-5 shrink-0 text-[#0052FF]" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-foreground">Head office</p>
                  <p className="text-sm text-muted-foreground">
                    Level 3, Bishop Magua Centre, Ngong Road, Nairobi
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="rounded-3xl border border-border bg-white p-6 shadow-layered sm:p-8" aria-label="Contact form">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name" required>
                  <Input
                    required
                    placeholder="e.g. Amani Otieno"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Phone number" required hint="We'll only call about this enquiry.">
                  <Input
                    required
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    autoComplete="tel"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email" required>
                    <Input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      autoComplete="email"
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="What's this about?" required>
                    <Select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                      {topics.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Message" required>
                    <Textarea
                      required
                      rows={5}
                      placeholder="Tell us what's happening…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full group" disabled={sending}>
                {sending ? "Sending…" : "Send message"}
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}