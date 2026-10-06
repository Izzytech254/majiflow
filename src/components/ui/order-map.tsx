"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import type * as Leaflet from "leaflet";
import type { OrderLocation } from "@/lib/types";
import "leaflet/dist/leaflet.css";

type LeafletNS = typeof import("leaflet");

export interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
}

const STATION_ICON = (L: LeafletNS) =>
  L.divIcon({
    className: "",
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:#0052FF;border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.45)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

const ADDRESS_ICON = (L: LeafletNS) =>
  L.divIcon({
    className: "",
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#64748b;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const CUSTOMER_ICON = (L: LeafletNS) =>
  L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:#16A34A;border:3px solid #fff;box-shadow:0 0 0 4px rgba(22,163,74,.25),0 1px 6px rgba(0,0,0,.45)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const FALLBACK_CENTER: [number, number] = [-1.2921, 36.8219];

/**
 * Live order map (client-only). Shows the station, the delivery address as
 * a fallback pin, and — while the customer is sharing GPS — their moving dot
 * with an accuracy circle and the recent path.
 */
export function OrderMap({
  station,
  address,
  location,
  history = [],
  className = "",
}: {
  station?: MapPoint;
  address?: MapPoint;
  location?: OrderLocation | null;
  history?: OrderLocation[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const customerRef = useRef<{ marker: Leaflet.Marker; circle: Leaflet.Circle } | null>(null);
  const lineRef = useRef<Leaflet.Polyline | null>(null);
  const flewRef = useRef(false);
  const propsRef = useRef({ location, history });

  // Keep the latest props reachable from the async map setup.
  useEffect(() => {
    propsRef.current = { location, history };
  });

  const stationKey = station ? `${station.lat},${station.lng},${station.label ?? ""}` : "";
  const addressKey = address ? `${address.lat},${address.lng},${address.label ?? ""}` : "";

  useEffect(() => {
    let disposed = false;
    const el = containerRef.current;
    if (!el) return;

    (async () => {
      const mod = await import("leaflet");
      const L = (mod as { default?: LeafletNS }).default ?? (mod as LeafletNS);
      if (disposed || !containerRef.current) return;

      const center: [number, number] = station
        ? [station.lat, station.lng]
        : address
          ? [address.lat, address.lng]
          : FALLBACK_CENTER;

      const map = L.map(containerRef.current, { attributionControl: true }).setView(center, 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      mapRef.current = map;

      if (station) {
        L.marker([station.lat, station.lng], { icon: STATION_ICON(L), keyboard: false })
          .addTo(map)
          .bindTooltip(station.label ?? "Station", { direction: "top", offset: [0, -10] });
      }
      if (address) {
        L.marker([address.lat, address.lng], { icon: ADDRESS_ICON(L), keyboard: false })
          .addTo(map)
          .bindTooltip(address.label ?? "Delivery address", { direction: "top", offset: [0, -8] });
      }

      const latest = propsRef.current.location;
      if (latest) applyCustomer(L, map, latest, propsRef.current.history, customerRef, lineRef, flewRef);
    })();

    return () => {
      disposed = true;
      customerRef.current?.marker.remove();
      customerRef.current?.circle.remove();
      customerRef.current = null;
      lineRef.current?.remove();
      lineRef.current = null;
      flewRef.current = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Station/address pins are static for the life of the view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationKey, addressKey]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location) return;
    const mod = import("leaflet");
    void mod.then((m) => {
      const L = (m as { default?: LeafletNS }).default ?? (m as LeafletNS);
      if (mapRef.current !== map) return;
      applyCustomer(L, map, location, history, customerRef, lineRef, flewRef);
    });
  }, [location, history]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-xl border border-border bg-muted ${className}`}
      role="application"
      aria-label="Live order map"
    />
  );
}

function applyCustomer(
  L: LeafletNS,
  map: Leaflet.Map,
  location: OrderLocation,
  history: OrderLocation[],
  customerRef: MutableRefObject<{ marker: Leaflet.Marker; circle: Leaflet.Circle } | null>,
  lineRef: MutableRefObject<Leaflet.Polyline | null>,
  flewRef: MutableRefObject<boolean>
) {
  const latlng: [number, number] = [location.lat, location.lng];

  if (!customerRef.current) {
    const marker = L.marker(latlng, { icon: CUSTOMER_ICON(L), keyboard: false, zIndexOffset: 500 })
      .addTo(map)
      .bindTooltip("Customer · live", { direction: "top", offset: [0, -10] });
    const circle = L.circle(latlng, {
      radius: location.accuracy ?? 25,
      color: "#16A34A",
      weight: 1,
      fillColor: "#16A34A",
      fillOpacity: 0.12,
    }).addTo(map);
    customerRef.current = { marker, circle };
  } else {
    customerRef.current.marker.setLatLng(latlng);
    customerRef.current.circle.setLatLng(latlng);
    customerRef.current.circle.setRadius(location.accuracy ?? 25);
  }

  if (history.length > 1) {
    const pts = history.slice(-80).map((h) => [h.lat, h.lng]) as [number, number][];
    if (lineRef.current) lineRef.current.setLatLngs(pts);
    else lineRef.current = L.polyline(pts, { color: "#0052FF", weight: 2, opacity: 0.45, dashArray: "6 8" }).addTo(map);
  }

  if (!flewRef.current) {
    flewRef.current = true;
    map.setView(latlng, 15, { animate: true });
  }
}
