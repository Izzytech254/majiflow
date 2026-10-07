"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchOrder, postLocation } from "@/lib/orders";
import { isActiveStatus } from "@/lib/order-status";

/**
 * Invisible live-location sharing.
 *
 * While a customer has an active order open at `/order/[id]`, this engine
 * asks the browser for its native geolocation permission and streams GPS
 * fixes to the order so the vendor and the platform admin can watch the
 * delivery live. It renders nothing — the only UI is the browser's own
 * permission prompt. Sharing stops automatically when the order reaches a
 * terminal state or the customer leaves the page. Denied permission falls
 * back silently to address-only tracking.
 */

const POST_INTERVAL_MS = 5000;
const POST_DISTANCE_M = 15;
const STATUS_POLL_MS = 10000;

function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function GeoShareEngine() {
  const pathname = usePathname();
  const match = /^\/order\/([^/]+)$/.exec(pathname);
  const orderId = match ? match[1] : null;

  useEffect(() => {
    if (!orderId) return;
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return;

    let alive = true;
    let stopped = false;
    let watchId: number | null = null;
    let poll: number | null = null;
    let lastSent = 0;
    let lastFix: { lat: number; lng: number } | null = null;

    const stop = () => {
      stopped = true;
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      if (poll !== null) {
        window.clearInterval(poll);
        poll = null;
      }
    };

    const checkStatus = async () => {
      const order = await fetchOrder(orderId);
      if (!alive) return false;
      if (!order || !isActiveStatus(order.status)) {
        stop();
        return false;
      }
      return true;
    };

    (async () => {
      if (!(await checkStatus())) return;
      if (!alive || stopped) return;

      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (!alive || stopped) return;
          const fix = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const now = Date.now();
          const moved = lastFix ? haversineMeters(lastFix, fix) : Infinity;
          const due = now - lastSent >= POST_INTERVAL_MS || moved >= POST_DISTANCE_M;
          lastFix = fix;
          if (!due) return;
          lastSent = now;
          void postLocation(orderId, {
            ...fix,
            accuracy: pos.coords.accuracy ?? undefined,
            at: new Date().toISOString(),
          });
        },
        () => stop(),
        { enableHighAccuracy: true, maximumAge: 4000, timeout: 15000 }
      );

      poll = window.setInterval(() => {
        void checkStatus();
      }, STATUS_POLL_MS);
    })();

    return () => {
      alive = false;
      stop();
    };
  }, [orderId]);

  return null;
}
