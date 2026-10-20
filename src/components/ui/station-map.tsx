"use client";

import { useEffect, useRef } from "react";
import type * as Leaflet from "leaflet";
import {
  createBaseMap,
  finitePoint,
  loadLeaflet,
  selectedPin,
  stationPin,
  youPin,
  type LeafletNS,
} from "@/lib/leaflet-client";
import "leaflet/dist/leaflet.css";

export interface StationPinData {
  id: string;
  slug: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  deliveryFee: number;
  distanceKm?: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface StationMapProps {
  stations: StationPinData[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  userLocation?: UserLocation | null;
  center?: [number, number];
  zoom?: number;
  className?: string;
  /** Drop the card border/rounding so the map bleeds edge-to-edge in a full-height pane. */
  bare?: boolean;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );
}

/** Short initials shown inside a pin head, KFC-style (e.g. "Maji Springs" -> "MS"). */
function markerLabel(s: StationPinData) {
  const words = s.name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** KFC-style station card shown in the map popup. */
function popupHtml(s: StationPinData) {
  const distance =
    typeof s.distanceKm === "number" ? ` · ${s.distanceKm.toFixed(1)} km` : "";
  return `<div class="mf-popup-card">
    <strong class="mf-popup-title">${escapeHtml(s.name)}</strong>
    <span class="mf-popup-meta">${escapeHtml(s.city)} · KES ${s.deliveryFee} delivery${distance}</span>
    <a class="mf-popup-link" href="/browse/${encodeURIComponent(s.slug)}">View menu →</a>
  </div>`;
}

export function StationMap({
  stations,
  selectedId,
  onSelect,
  userLocation,
  center,
  zoom = 12,
  className = "",
  bare = false,
}: StationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<LeafletNS | null>(null);
  const markersRef = useRef<Map<string, Leaflet.Marker>>(new Map());
  const userRef = useRef<{ marker: Leaflet.Marker; circle: Leaflet.Circle } | null>(null);
  const selectRef = useRef(onSelect);
  const fittedRef = useRef(false);

  useEffect(() => {
    selectRef.current = onSelect;
  });

  // Create the map once.
  useEffect(() => {
    let disposed = false;
    const el = containerRef.current;
    const markers = markersRef.current;
    if (!el) return;

    (async () => {
      const L = await loadLeaflet();
      if (disposed || !containerRef.current) return;
      LRef.current = L;
      const start = center ?? (userLocation ? [userLocation.lat, userLocation.lng] : undefined);
      const map = createBaseMap(L, containerRef.current, start ?? undefined, zoom);
      mapRef.current = map;
      map.whenReady(() => map.invalidateSize());
    })();

    return () => {
      disposed = true;
      userRef.current?.marker.remove();
      userRef.current?.circle.remove();
      userRef.current = null;
      markers.forEach((m) => m.remove());
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
      LRef.current = null;
      fittedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync station pins.
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    const seen = new Set<string>();
    for (const s of stations) {
      if (!finitePoint(s)) continue;
      seen.add(s.id);
      const selected = s.id === selectedId;
      let marker = markersRef.current.get(s.id);
      const label = markerLabel(s);
      const icon = selected ? selectedPin(L, label) : stationPin(L, label);
      if (!marker) {
        marker = L.marker([s.lat, s.lng], { icon, keyboard: false, zIndexOffset: selected ? 400 : 0 })
          .addTo(map)
          .on("click", () => selectRef.current?.(s.id));
        markersRef.current.set(s.id, marker);
      } else {
        marker.setIcon(icon);
        marker.setZIndexOffset(selected ? 400 : 0);
      }
      marker.bindPopup(popupHtml(s), { className: "mf-map-popup", closeButton: false });
    }
    markersRef.current.forEach((marker, id) => {
      if (!seen.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    if (selectedId) {
      const sel = stations.find((s) => s.id === selectedId);
      if (sel && finitePoint(sel)) map.panTo([sel.lat, sel.lng], { animate: true });
    }
  }, [stations, selectedId]);

  // Sync the user's location dot.
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    if (!userLocation || !finitePoint(userLocation)) {
      userRef.current?.marker.remove();
      userRef.current?.circle.remove();
      userRef.current = null;
      return;
    }
    const latlng: [number, number] = [userLocation.lat, userLocation.lng];
    if (!userRef.current) {
      const marker = L.marker(latlng, { icon: youPin(L), keyboard: false, zIndexOffset: 600 })
        .addTo(map)
        .bindTooltip("You", { direction: "top", offset: [0, -10] });
      const circle = L.circle(latlng, {
        radius: userLocation.accuracy ?? 60,
        color: "#16A34A",
        weight: 1,
        fillColor: "#16A34A",
        fillOpacity: 0.12,
      }).addTo(map);
      userRef.current = { marker, circle };
    } else {
      userRef.current.marker.setLatLng(latlng);
      userRef.current.circle.setLatLng(latlng);
      userRef.current.circle.setRadius(userLocation.accuracy ?? 60);
    }
  }, [userLocation]);

  // Fit bounds to results once (or when the set of stations changes meaningfully).
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map || selectedId) return;
    const pts = stations.filter(finitePoint).map((s) => [s.lat, s.lng] as [number, number]);
    if (pts.length === 0) return;
    if (userLocation && finitePoint(userLocation)) pts.push([userLocation.lat, userLocation.lng]);
    if (pts.length === 1) {
      map.setView(pts[0], 15, { animate: true });
      return;
    }
    map.fitBounds(L.latLngBounds(pts).pad(0.2), { animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stations.map((s) => s.id).join(","), userLocation?.lat, userLocation?.lng]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden bg-muted ${bare ? "" : "rounded-2xl border border-border"} ${className}`}
      role="application"
      aria-label="Map of refill stations"
    />
  );
}
