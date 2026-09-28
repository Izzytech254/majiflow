"use client";

import { useState } from "react";
import Image from "next/image";
import { Pause, Plus, Trash2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatKES } from "@/lib/format";
import { productImage } from "@/lib/product-images";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: "p1", name: "Refill — 20L can", desc: "Borehole water, refilled on existing can", price: 400, stock: 220, unit: "cans", image: "can", on: true },
  { id: "p2", name: "5L bottle", desc: "Chilled, sealed, for fridges", price: 120, stock: 96, unit: "bottles", image: "bottle", on: true },
  { id: "p3", name: "Replacement 20L can — full", desc: "Swap-in full can, keep yours as spare", price: 650, stock: 6, unit: "cans", image: "can", on: true },
  { id: "p4", name: "10L bottle (chilled)", desc: "Best for small offices — Nyali favorite", price: 180, stock: 34, unit: "bottles", image: "bottle", on: false },
  { id: "p5", name: "Tabletop dispenser — rental", desc: "Monthly rental with free refills", price: 600, stock: 3, unit: "units", image: "dispenser", on: true },
];

export function BusinessProducts() {
  const [products, setProducts] = useState(PRODUCTS);
  const [note, setNote] = useState<string | null>(null);

  const toggle = (id: string) => {
    setProducts((all) => all.map((p) => (p.id === id ? { ...p, on: !p.on } : p)));
  };

  const remove = (id: string) => {
    setProducts((all) => all.filter((p) => p.id !== id));
    setNote("Product removed from your public menu. It stays in history for reports.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-foreground sm:text-3xl">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            What customers see on your public menu. Toggle off to hide, not delete.
          </p>
        </div>
        <Button
          className="group"
          onClick={() => setNote("Product draft created — fill in details from the station clipboard.")}
        >
          <Plus className="size-4" aria-hidden /> New product
        </Button>
      </div>

      {note && (
        <div role="status" className="flex items-center justify-between rounded-xl border border-[#0052FF]/25 bg-[#0052FF]/5 px-4 py-3 text-sm text-[#0052FF]">
          {note}
          <button onClick={() => setNote(null)} className="font-semibold" aria-label="Dismiss">
            Dismiss
          </button>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <article
            key={p.id}
            className={cn(
              "rounded-2xl border bg-white p-5 shadow-card transition-opacity",
              p.on ? "border-border" : "border-border opacity-55"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#0052FF]/10">
                <Image src={productImage(p.image)} alt="" className="size-full object-cover" />
              </span>
              <div className="flex items-center gap-2">
                <Badge variant={p.on ? "softAccent" : "muted"}>{p.on ? "Live" : "Hidden"}</Badge>
                <button
                  onClick={() => remove(p.id)}
                  aria-label={`Remove ${p.name}`}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger-soft hover:text-danger"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            </div>
            <h2 className="mt-3 font-display text-lg text-foreground">{p.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="font-display text-xl text-foreground">{formatKES(p.price)}</span>
              <span className={cn("font-mono text-xs", p.stock < 10 ? "text-danger" : p.stock < 15 ? "text-warning" : "text-muted-foreground")}>
                {p.stock} {p.unit} in stock
              </span>
            </div>
            <button
              onClick={() => toggle(p.id)}
              role="switch"
              aria-checked={p.on}
              className={cn("mt-4 flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-sm font-semibold transition-colors", p.on ? "border-border text-foreground hover:bg-muted" : "border-[#0052FF] text-[#0052FF]")}
            >
              {p.on ? <Pause className="size-4" aria-hidden /> : <Wrench className="size-4" aria-hidden />}
              {p.on ? "Hide from menu" : "Bring back"}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}