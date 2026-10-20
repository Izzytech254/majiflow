import type * as Leaflet from "leaflet";

export type LeafletNS = typeof import("leaflet");

export interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
}

export const NAIROBI_CENTER: [number, number] = [-1.2921, 36.8219];

let leafletPromise: Promise<LeafletNS> | null = null;

export function loadLeaflet(): Promise<LeafletNS> {
  if (!leafletPromise) {
    leafletPromise = (
      // @ts-expect-error - the ESM build ships without type declarations for this path
      import("leaflet/dist/leaflet-src.esm.js")
        .catch(() => import("leaflet"))
    ).then((mod) => {
      const m = mod as { default?: LeafletNS };
      return m.default ?? (mod as LeafletNS);
    });
  }
  return leafletPromise;
}

export function createBaseMap(
  L: LeafletNS,
  el: HTMLElement,
  center: [number, number] = NAIROBI_CENTER,
  zoom = 13
): Leaflet.Map {
  const map = L.map(el, { attributionControl: true }).setView(center, zoom);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  return map;
}

function dot(color: string, size: number, glow?: string) {
  return `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:${glow ?? "0 1px 5px rgba(0,0,0,.45)"}"></span>`;
}

export function stationPin(L: LeafletNS, size = 18) {
  return L.divIcon({
    className: "",
    html: dot("#0052FF", size),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function selectedPin(L: LeafletNS, size = 26) {
  return L.divIcon({
    className: "",
    html: dot("#0052FF", size, "0 0 0 6px rgba(0,82,255,.22),0 2px 8px rgba(0,0,0,.5)"),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function youPin(L: LeafletNS, size = 16) {
  return L.divIcon({
    className: "",
    html: dot("#16A34A", size, "0 0 0 4px rgba(22,163,74,.25),0 1px 6px rgba(0,0,0,.45)"),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function addressPin(L: LeafletNS, size = 14) {
  return L.divIcon({
    className: "",
    html: dot("#64748b", size, "0 1px 4px rgba(0,0,0,.4)"),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function finitePoint(p: { lat?: number; lng?: number } | null | undefined): boolean {
  return (
    !!p && typeof p.lat === "number" && typeof p.lng === "number" && Number.isFinite(p.lat) && Number.isFinite(p.lng)
  );
}
