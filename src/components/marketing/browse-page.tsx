"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, List, Loader2, Map as MapIcon, Navigation, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/shared/business-card";
import { EmptyState } from "@/components/ui/feedback";
import { Stagger, StaggerItem } from "@/components/ui/animated-section";
import { CITIES } from "@/lib/constants";
import {
  captureCurrentLocation,
  geolocationErrorMessage,
  townLocation,
  type CapturedLocation,
} from "@/lib/geo";
import { DISCOVERY_RADII_KM, discoverStations } from "@/lib/station-discovery";
import { browseHref } from "@/lib/journey";
import { rememberJourneyStep } from "@/components/order/journey";
import { OrderTypeBar } from "@/components/order/order-type-bar";

const StationMap = dynamic(() => import("@/components/ui/station-map").then((m) => m.StationMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-border bg-muted">
      <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
    </div>
  ),
});

type LocationMode = "manual" | "current";

export function BrowsePage({ initialCity, initialQuery = "" }: { initialCity: string; initialQuery?: string }) {
  const [city, setCity] = useState<string>(
    () => CITIES.find((c) => c.toLowerCase() === initialCity.trim().toLowerCase()) ?? "All cities"
  );
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState<CapturedLocation | null>(null);
  const [locationMode, setLocationMode] = useState<LocationMode>("manual");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const locationRequestRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the search in the URL so back navigation from a station restores it.
  useEffect(() => {
    const href = browseHref(city, query);
    if (`${window.location.pathname}${window.location.search}` !== href) {
      window.history.replaceState(window.history.state, "", href);
    }
    rememberJourneyStep("browse", href);
  }, [city, query]);

  const discovery = useMemo(
    () =>
      discoverStations({
        city,
        query,
        location,
        byDistance: locationMode === "current",
      }),
    [city, location, locationMode, query]
  );

  const mapStations = useMemo(
    () =>
      discovery.results
        .filter(({ business }) => Number.isFinite(business.lat) && Number.isFinite(business.lng))
        .map(({ business, distanceKm }) => ({
          id: business.id,
          slug: business.slug,
          name: business.name,
          city: business.city,
          lat: business.lat,
          lng: business.lng,
          deliveryFee: business.deliveryFee,
          distanceKm,
        })),
    [discovery.results]
  );

  const mapUserLocation = useMemo(
    () =>
      location && Number.isFinite(location.lat) && Number.isFinite(location.lng)
        ? { lat: location.lat, lng: location.lng }
        : null,
    [location]
  );

  const countLabel =
    locationMode === "current"
      ? "nearby stations"
      : city === "All cities"
        ? "all stations"
        : `stations in ${city}`;

  const selectCity = (nextCity: string) => {
    locationRequestRef.current += 1;
    setCity(nextCity);
    setLocationMode("manual");
    setLocation(nextCity === "All cities" ? null : townLocation(nextCity));
    setLocationError(null);
    setLocating(false);
  };

  const useCurrentLocation = async () => {
    const requestId = ++locationRequestRef.current;
    setLocating(true);
    setLocationError(null);
    try {
      const nextLocation = await captureCurrentLocation({
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 0,
      });
      if (requestId !== locationRequestRef.current) return;
      setLocation(nextLocation);
      setLocationMode("current");
    } catch (err) {
      if (requestId !== locationRequestRef.current) return;
      setLocationMode("manual");
      setLocation(city === "All cities" ? null : townLocation(city));
      setLocationError(geolocationErrorMessage(err));
    } finally {
      if (requestId === locationRequestRef.current) {
        setLocating(false);
      }
    }
  };

  return (
    <>
      <OrderTypeBar />
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-glow" />
        <Container className="relative py-14 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-foreground animate-ping-slow" />
                <span className="relative inline-flex size-2 rounded-full bg-foreground" />
              </span>
              Browse refill stations
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Refill stations <span className="text-gradient">near you</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Search and filter stations by name, estate or city. Each one lists its own products,
              prices and delivery fee before you order.
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
                placeholder="Search by name or estate - e.g. Kasarani"
                className="h-14 rounded-xl pl-12 text-base shadow-card"
              />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filter by city">
              {["All cities", ...CITIES].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => selectCity(c)}
                  aria-pressed={city === c}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    city === c
                      ? "border-[#0052FF] bg-[#0052FF] text-white shadow-accent"
                      : "border-border bg-white text-muted-foreground hover:border-[#0052FF]/40 hover:text-[#0052FF]"
                  }`}
                >
                  {c === "All cities" ? "Every city" : c}
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-col items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={useCurrentLocation}
                disabled={locating}
              >
                {locating ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Navigation className="size-4" aria-hidden />
                )}
                {locating ? "Finding stations near you…" : "Use my current location"}
              </Button>
              {locationError && (
                <p className="flex items-start gap-2 text-left text-xs text-danger" role="alert">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    {locationError} Choose a city above to browse by an approximate location.
                  </span>
                </p>
              )}
              {!location && !locationError && (
                <p className="text-xs text-muted-foreground">
                  Choose a city or allow location access to sort stations by distance.
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 lg:py-14">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <strong className="font-semibold text-foreground">{discovery.results.length}</strong>{" "}
              {countLabel}
            </p>

            {discovery.results.length > 0 && (
              <div
                className="inline-flex rounded-full border border-border bg-white p-1 shadow-soft"
                role="group"
                aria-label="Switch between map and list"
              >
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
                    view === "list" ? "bg-[#0052FF] text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="size-4" aria-hidden /> List
                </button>
                <button
                  type="button"
                  onClick={() => setView("map")}
                  aria-pressed={view === "map"}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
                    view === "map" ? "bg-[#0052FF] text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MapIcon className="size-4" aria-hidden /> Map
                </button>
              </div>
            )}
          </div>

          {discovery.results.length > 0 ? (
            <div className="mt-6 lg:grid lg:grid-cols-[1.6fr_1fr] lg:gap-8">
              {/* Map pane */}
              <div
                className={`${view === "map" ? "block" : "hidden"} lg:sticky lg:top-20 lg:block lg:h-[calc(100svh-6rem)] lg:order-2`}
                aria-busy={locating}
              >
                <StationMap
                  stations={mapStations}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  userLocation={mapUserLocation}
                  className="h-[65svh] w-full lg:h-full"
                />
                {locationMode === "current" && discovery.radiusKm !== null && (
                  <p className="mt-2 text-center text-xs text-muted-foreground lg:text-left">
                    Showing stations within {discovery.radiusKm} km
                    {discovery.radiusKm > DISCOVERY_RADII_KM[0] ? " after expanding the search" : ""}.
                  </p>
                )}
              </div>

              {/* List pane */}
              <div
                ref={listRef}
                className={`${view === "list" ? "block" : "hidden"} mt-6 lg:mt-0 lg:order-1 lg:block ${
                  locating ? "opacity-70" : ""
                }`}
              >
                {locating && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Updating distances…
                  </div>
                )}
                <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" stagger={0.06}>
                  {discovery.results.map(({ business, distanceKm }) => (
                    <StaggerItem key={business.id}>
                      <div
                        data-station-id={business.id}
                        onMouseEnter={() => setSelectedId(business.id)}
                        className={`h-full rounded-2xl transition-shadow ${
                          selectedId === business.id ? "ring-2 ring-[#0052FF] ring-offset-2 ring-offset-background" : ""
                        }`}
                      >
                        <BusinessCard business={business} distanceKm={distanceKm} />
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                title={locationMode === "current" ? "No nearby stations found" : "No stations matched"}
                description={
                  locationMode === "current"
                    ? `No stations were found within ${DISCOVERY_RADII_KM[DISCOVERY_RADII_KM.length - 1]} km of your location. Try manual city selection or clear your search.`
                    : `No refill business matched "${query}" in ${city}. Try a different estate or clear your search.`
                }
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