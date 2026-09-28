"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/field";
import { BusinessCard } from "@/components/shared/business-card";
import { EmptyState } from "@/components/ui/feedback";
import { Stagger, StaggerItem } from "@/components/ui/animated-section";
import { getBusinessesByCity } from "@/lib/data/businesses";
import { CITIES } from "@/lib/constants";

export function BrowsePage({ initialCity }: { initialCity: string }) {
  const [city, setCity] = useState(initialCity || "All cities");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const byCity = getBusinessesByCity(city);
    const q = query.trim().toLowerCase();
    if (!q) return byCity;
    return byCity.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.estates.some((e) => e.toLowerCase().includes(q)) ||
        b.tagline.toLowerCase().includes(q)
    );
  }, [city, query]);

  const countLabel = city === "All cities" ? "all stations" : `stations in ${city}`;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-glow" />
        <Container className="relative py-14 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-[#0052FF] animate-ping-slow" />
                <span className="relative inline-flex size-2 rounded-full bg-[#0052FF]" />
              </span>
              Browse water businesses
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Trusted refill stations, <span className="text-gradient">near you</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Every business is independently owned, verified and rated by the neighbours it serves.
            </p>
            <div className="relative mt-8">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <label htmlFor="search-stations" className="sr-only">
                Search stations by name or estate
              </label>
              <Input
                id="search-stations"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or estate — e.g. Kasarani"
                className="h-14 rounded-xl pl-12 text-base shadow-card"
              />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filter by city">
              {["All cities", ...CITIES].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  aria-pressed={city === c}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    city === c
                      ? "border-transparent bg-brand-gradient text-white shadow-accent"
                      : "border-border bg-white text-muted-foreground hover:border-[#0052FF]/40 hover:text-[#0052FF]"
                  }`}
                >
                  {c === "All cities" ? "All Kenya" : c}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <strong className="font-semibold text-foreground">{results.length}</strong>{" "}
              {countLabel}
            </p>
          </div>

          {results.length > 0 ? (
            <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
              {results.map((b) => (
                <StaggerItem key={b.id}>
                  <BusinessCard business={b} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <div className="mt-8">
              <EmptyState
                title="No stations matched"
                description={`No refill business matched "${query}" in ${city}. Try a different estate or clear your search.`}
                action={
                  <button
                    onClick={() => setQuery("")}
                    className="mt-2 font-semibold text-[#0052FF] hover:underline"
                  >
                    Clear search
                  </button>
                }
              />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}