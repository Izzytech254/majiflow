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
  const map = L.map(el, {
    attributionControl: true,
    zoomControl: false,
    // KFC's locator map is gesture-heavy but does not hijack the page scroll.
    scrollWheelZoom: false,
  }).setView(center, zoom);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 20,
    subdomains: "abcd",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(map);
  return map;
}

/**
 * A KFC-style teardrop map marker: a white-rimmed coloured pin with a pointed
 * tail, matching the Google maps pins the KFC store locator uses. `label`
 * renders a short initial inside the head; `selected` grows it and adds a halo.
 */
function pin(
  color: string,
  { selected = false, label = "" }: { selected?: boolean; label?: string } = {}
) {
  const head = selected ? 38 : 30;
  const height = Math.round(head * 1.35);
  const rim = selected ? 3 : 2.5;
  const font = selected ? 14 : 12;
  return `
    <span style="position:relative;display:block;width:${head}px;height:${height}px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35));${selected ? "transform:scale(1.04);" : ""}">
      ${
        selected
          ? `<span style="position:absolute;left:50%;top:50%;width:${head + 18}px;height:${head + 18}px;transform:translate(-50%,-50%);border-radius:9999px;background:${color};opacity:.18"></span>`
          : ""
      }
      <span style="position:absolute;left:50%;top:0;transform:translateX(-50%);width:${head}px;height:${head}px;border-radius:9999px;background:${color};border:${rim}px solid #fff;box-sizing:border-box;display:flex;align-items:center;justify-content:center;color:#fff;font:700 ${font}px/1 system-ui,sans-serif">${label}</span>
      <span style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:0;height:0;border-left:${Math.round(head / 3)}px solid transparent;border-right:${Math.round(head / 3)}px solid transparent;border-top:${Math.round(height - head + 2)}px solid ${color}"></span>
    </span>`;
}

export function stationPin(L: LeafletNS, label = "") {
  return L.divIcon({
    className: "",
    html: pin("#0052FF", { label }),
    iconSize: [30, 41],
    iconAnchor: [15, 41],
    popupAnchor: [0, -38],
  });
}

export function selectedPin(L: LeafletNS, label = "") {
  return L.divIcon({
    className: "",
    html: pin("#0052FF", { selected: true, label }),
    iconSize: [38, 51],
    iconAnchor: [19, 51],
    popupAnchor: [0, -46],
  });
}

export function userPin(L: LeafletNS) {
  return L.divIcon({
    className: "",
    html: `<span style="position:relative;display:block;width:22px;height:22px">
      <span style="position:absolute;inset:0;border-radius:9999px;background:#16A34A;opacity:.25;animation:mf-ping 1.8s cubic-bezier(0,0,.2,1) infinite"></span>
      <span style="position:absolute;inset:5px;border-radius:9999px;background:#16A34A;border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>
    </span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

/** Kept for callers that place a plain "you are here" dot. */
export function youPin(L: LeafletNS) {
  return userPin(L);
}

export function addressPin(L: LeafletNS) {
  return L.divIcon({
    className: "",
    html: `<span style="position:relative;display:block;width:14px;height:14px"><span style="position:absolute;inset:0;border-radius:9999px;background:#64748b;border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export function finitePoint(p: { lat?: number; lng?: number } | null | undefined): boolean {
  return (
    !!p && typeof p.lat === "number" && typeof p.lng === "number" && Number.isFinite(p.lat) && Number.isFinite(p.lng)
  );
}
