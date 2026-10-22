"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Promo = { id: string; title: string; subtitle: string; href: string };

export function PromotionsStrip() {
  const [loading, setLoading] = useState(true);
  const [promos, setPromos] = useState<Promo[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPromos([]);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  if (!loading && promos.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 overflow-x-auto pb-1">
        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 min-w-[260px] animate-pulse rounded-2xl bg-muted"
                role="status"
                aria-label="Loading promotions"
              />
            ))
          : promos.map((promo) => (
              <Link
                key={promo.id}
                href={promo.href}
                className="flex min-w-[260px] items-center justify-between rounded-2xl border border-border bg-white px-5 py-4 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-foreground">{promo.title}</p>
                  <p className="text-sm text-foreground/70">{promo.subtitle}</p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
