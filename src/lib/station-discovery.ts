import type { Business } from "@/lib/types";
import { businesses, getBusinessesByCity } from "@/lib/data/businesses";
import { haversineMeters } from "@/lib/geo";
import { getBusinessOrderBlockReason } from "@/lib/business-hours";

/** Radii (km) searched from nearest outwards until at least one station matches. */
export const DISCOVERY_RADII_KM = [3, 5, 10, 20, 40] as const;

export interface DiscoveredStation {
  business: Business;
  distanceKm?: number;
  /** True when the station is currently open (ordering available). */
  open: boolean;
}

export interface DiscoveryQuery {
  city: string;
  query?: string;
  location?: { lat: number; lng: number } | null;
  /** When true, ignore the city filter and rank purely by distance. */
  byDistance?: boolean;
  /** Used to work out whether a station can take orders right now. */
  now?: Date;
}

export interface DiscoveryResult {
  results: DiscoveredStation[];
  /** The radius that produced the first match, when searching by distance. */
  radiusKm: number | null;
}

function matchesQuery(business: Business, q: string): boolean {
  return (
    business.name.toLowerCase().includes(q) ||
    business.city.toLowerCase().includes(q) ||
    business.estates.some((e) => e.toLowerCase().includes(q)) ||
    business.tagline.toLowerCase().includes(q)
  );
}

/**
 * Pure station search shared by the locator page and the location step, so the
 * radius/haversine rules live in exactly one place.
 */
export function discoverStations({
  city,
  query = "",
  location,
  byDistance = false,
  now = new Date(),
}: DiscoveryQuery): DiscoveryResult {
  const source = byDistance ? businesses : getBusinessesByCity(city);
  const q = query.trim().toLowerCase();
  const searched = q ? source.filter((b) => matchesQuery(b, q)) : source;

  const finite = (b: Business) => Number.isFinite(b.lat) && Number.isFinite(b.lng);
  const hasPoint =
    location && Number.isFinite(location.lat) && Number.isFinite(location.lng) ? location : null;
  const isOpen = (b: Business) => getBusinessOrderBlockReason(b, now) === null;

  if (!byDistance || !hasPoint) {
    const results = searched
      .map((business) => ({
        business,
        distanceKm:
          hasPoint && finite(business) ? haversineMeters(hasPoint, business) / 1000 : undefined,
        open: isOpen(business),
      }))
      .sort((a, b) => {
        if (a.distanceKm === undefined && b.distanceKm === undefined) return 0;
        if (a.distanceKm === undefined) return 1;
        if (b.distanceKm === undefined) return -1;
        return a.distanceKm - b.distanceKm;
      });
    return { results, radiusKm: null };
  }

  const radiusKm =
    DISCOVERY_RADII_KM.find((radius) =>
      searched.some(
        (b) => finite(b) && haversineMeters(hasPoint, b) / 1000 <= radius
      )
    ) ?? DISCOVERY_RADII_KM[DISCOVERY_RADII_KM.length - 1];

  const results = searched
    .filter(finite)
    .map((business) => ({ business, distanceKm: haversineMeters(hasPoint, business) / 1000 }))
    .filter((r) => r.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .map((r) => ({ ...r, open: isOpen(r.business) }));

  return { results, radiusKm };
}
