"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, List, Loader2, Map as MapIcon, Navigation, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { StationRow } from "@/components/shared/station-row";
import { EmptyState } from "@/components/ui/feedback";
import { Stagger, StaggerItem } from "@/components/ui/animated-section";
import { businesses, getBusinessesByCity } from "@/lib/data/businesses";
import { CITIES } from "@/lib/constants";
import {
  captureCurrentLocation,
  geolocationErrorMessage,
  haversineMeters,
  townLocation,
  type CapturedLocation,
} from "@/lib/geo";
import { browseHref } from "@/lib/journey";
import { rememberJourneyStep } from "@/components/order/journey";

const StationMap = dynamic(() => import("@/components/ui/station-map").then((m) => m.StationMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
    </div>
  ),
});

const DISCOVERY_RADII_KM = [3, 5, 10, 20] as const;

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
  const [view, setView] = useState<"list" | "map">("map");
  const locationRequestRef = useRef(0);

  // Keep the search in the URL so back navigation from a station restores it.
  useEffect(() => {
    const href = browseHref(city, query);
    if (`${window.location.pathname}${window.location.search}` !== href) {
      window.history.replaceState(window.history.state, "", href);
    }
    rememberJourneyStep("browse", href);
  }, [city, query]);

  const discovery = useMemo(() => {
    const source = locationMode === "current" ? businesses : getBusinessesByCity(city);
    const q = query.trim().toLowerCase();
    const searched = !q
      ? source
      : source.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.city.toLowerCase().includes(q) ||
            b.estates.some((e) => e.toLowerCase().includes(q)) ||
            b.tagline.toLowerCase().includes(q)
        );

    if (locationMode !== "current" || !location) {
      return {
        results: searched
          .map((business, index) => {
            const hasValidLocation =
              location !== null &&
              Number.isFinite(location.lat) &&
              Number.isFinite(location.lng) &&
              Number.isFinite(business.lat) &&
              Number.isFinite(business.lng);
            const distanceKm = hasValidLocation
              ? haversineMeters(location, business) / 1000
              : undefined;
            return { business, distanceKm, index };
          })
          .sort((a, b) => {
            if (a.distanceKm === undefined && b.distanceKm === undefined) {
              return a.index - b.index;
            }
            if (a.distanceKm === undefined) return 1;
            if (b.distanceKm === undefined) return -1;
            return a.distanceKm - b.distanceKm;
          }),
        radiusKm: null,
      };
    }

    const radiusKm =
      DISCOVERY_RADII_KM.find((radius) =>
        searched.some(
          (business) =>
            Number.isFinite(business.lat) &&
            Number.isFinite(business.lng) &&
            haversineMeters(location, business) / 1000 <= radius
        )
      ) ?? DISCOVERY_RADII_KM[DISCOVERY_RADII_KM.length - 1];

    return {
      results: searched
        .map((business, index) => {
          if (!Number.isFinite(business.lat) || !Number.isFinite(business.lng)) {
            return null;
          }
          const distanceKm = haversineMeters(location, business) / 1000;
          return distanceKm <= radiusKm ? { business, distanceKm, index } : null;
        })
        .filter(
          (
            result
          ): result is {
            business: (typeof businesses)[number];
            distanceKm: number;
            index: number;
          } => result !== null
        )
        .sort((a, b) => a.distanceKm - b.distanceKm),
      radiusKm,
    };
  }, [city, location, locationMode, query]);

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
    <div className="flex min-h-[calc(100svh-4rem)] flex-col">
      {/* Toolbar */}
      <section className="border-b border-border bg-background">
        <Container className="py-5">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-display text-xl text-foreground sm:text-2xl">Find a water station</h1>
            {discovery.results.length > 0 && (
              <div
                className="inline-flex rounded-full border border-border bg-white p-1 shadow-soft lg:hidden"
                role="group"
                aria-label="Switch between map and list"
              >
                <button
                  type="button"
                  onClick={() => setView("map")}
                  aria-pressed={view === "map"}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 text-sm font-medium transition-colors ${
                    view === "map" ? "bg-[#0052FF] text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MapIcon className="size-4" aria-hidden /> Map
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 text-sm font-medium transition-colors ${
                    view === "list" ? "bg-[#0052FF] text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="size-4" aria-hidden /> List
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <label htmlFor="search-stations" className="sr-only">
                Search stations by name or estate
              </label>
              <Input
                id="search-stations"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or estate - e.g. Kasarani"
                className="h-12 rounded-xl pl-12 text-base shadow-soft"
              />
            </div>
            <div className="flex gap-3">
              <label htmlFor="city-filter" className="sr-only">
                Filter by city
              </label>
              <select
                id="city-filter"
                value={city}
                onChange={(e) => selectCity(e.target.value)}
                className="h-12 min-w-40 rounded-xl border border-border bg-white px-3 text-sm font-medium text-foreground shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052FF]"
              >
                {["All cities", ...CITIES].map((c) => (
                  <option key={c} value={c}>
                    {c === "All cities" ? "Every city" : c}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={useCurrentLocation}
                disabled={locating}
                className="h-12 shrink-0"
              >
                {locating ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Navigation className="size-4" aria-hidden />
                )}
                <span className="hidden sm:inline">{locating ? "Locating…" : "Near me"}</span>
              </Button>
            </div>
          </div>

          {locationError && (
            <p className="mt-3 flex items-start gap-2 text-xs text-danger" role="alert">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{locationError} Pick a city above to browse by an approximate location.</span>
            </p>
          )}
        </Container>
      </section>

      {/* Full-height locator */}
      {discovery.results.length > 0 ? (
        <div className="relative flex-1 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:px-6 lg:py-6">
          {/* Map pane (left) */}
          <div
            className={`${view === "map" ? "block" : "hidden"} lg:order-1 lg:sticky lg:top-20 lg:block lg:h-fit`}
            aria-busy={locating}
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-card">
              <StationMap
                stations={mapStations}
                selectedId={selectedId}
                onSelect={setSelectedId}
                userLocation={mapUserLocation}
                className="h-[60svh] w-full lg:h-[calc(100svh-10rem)]"
              />
              {locationMode === "current" && discovery.radiusKm !== null && (
                <p className="absolute bottom-5 left-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur">
                  Within {discovery.radiusKm} km
                  {discovery.radiusKm > DISCOVERY_RADII_KM[0] ? " (expanded)" : ""}
                </p>
              )}
            </div>
          </div>

          {/* List pane (right) */}
          <div
            className={`${view === "list" ? "block" : "hidden"} lg:order-2 lg:sticky lg:top-20 lg:block lg:h-[calc(100svh-10rem)] lg:overflow-y-auto lg:pr-1`}
          >
            <div className="flex items-center justify-between gap-3 py-1 lg:pt-0">
              <p className="text-sm text-muted-foreground">
                <strong className="font-semibold text-foreground">{discovery.results.length}</strong> {countLabel}
              </p>
              {locating && (
                <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" aria-hidden /> Updating…
                </span>
              )}
            </div>
            <Stagger className={`mt-3 grid gap-3 pb-6 sm:grid-cols-2 lg:grid-cols-1 ${locating ? "opacity-70" : ""}`} stagger={0.05}>
              {discovery.results.map(({ business, distanceKm }) => (
                <StaggerItem key={business.id}>
                  <StationRow
                    business={business}
                    distanceKm={distanceKm}
                    selected={selectedId === business.id}
                    onSelect={() => setSelectedId(business.id)}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      ) : (
        <Container className="py-16">
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
        </Container>
      )}
    </div>
  );
}
