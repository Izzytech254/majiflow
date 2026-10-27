import { NextResponse } from "next/server";
import { reportFailure } from "@/lib/monitoring";
import {
  getEligiblePublishedDatabaseBusinesses,
  mapDatabaseBusinessToPublic,
} from "@/lib/server/station-publication";
import { haversineMeters } from "@/lib/geo";
import { DEFAULT_DELIVERY_RADIUS_KM } from "@/lib/station-discovery";

export const dynamic = "force-dynamic";

function parseNumber(value: string | null): number | null {
  if (!value) return null;
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return num;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseNumber(searchParams.get("lat"));
    const lng = parseNumber(searchParams.get("lng"));
    const radiusKmParam = parseNumber(searchParams.get("radiusKm"));

    const eligibleRows = await getEligiblePublishedDatabaseBusinesses(new Date());
    const stations = eligibleRows.map(({ business, application, subscription }) =>
      mapDatabaseBusinessToPublic(business, application, subscription)
    );

    if (lat === null || lng === null) {
      return NextResponse.json({ stations: [], databaseAvailable: true });
    }

    const results = stations
      .filter((station) => Number.isFinite(station.lat) && Number.isFinite(station.lng))
      .map((station) => {
        const distanceM = haversineMeters({ lat, lng }, { lat: station.lat!, lng: station.lng! });
        const distanceKm = distanceM / 1000;
        const radius = radiusKmParam ?? station.deliveryRadiusKm ?? DEFAULT_DELIVERY_RADIUS_KM;
        const delivers = distanceKm <= radius;
        return { station, distanceKm, delivers };
      })
      .filter((r) => r.delivers)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .map(({ station, distanceKm }) => ({
        ...station,
        distanceKm,
        etaMinutes: Math.round(station.avgDeliveryMinutes + distanceKm * 2),
      }));

    return NextResponse.json({ stations: results, databaseAvailable: true });
  } catch (error) {
    reportFailure("stations.nearby.failed", error);
    return NextResponse.json({ stations: [], databaseAvailable: false }, { status: 200 });
  }
}
