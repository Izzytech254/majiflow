import { useEffect, useMemo, useState } from "react";
import { fetchOrder, fetchOrdersResult } from "@/lib/orders";
import { resolveDateRange, summarizeStation, type DateRange, type DateRangeId, type StationStats } from "@/lib/analytics";
import type { Business, Order } from "@/lib/types";

/**
 * Live station data for the vendor screens.
 *
 * One hook owns polling so the overview, analytics and customers screens stay
 * consistent instead of each running its own fetch. The hook also owns the
 * date range so it is created once per preset rather than on every render.
 *
 * `orders === null` means "not loaded yet". A failed fetch is reported through
 * `error` rather than as an empty list, so a slow or unreachable store never
 * looks like a station with no orders.
 */

const DEFAULT_POLL_MS = 5000;

/** A request still in flight after this long is called out as delayed. */
export const SLOW_FETCH_MS = 2500;

export interface StationData {
  /** Resolved window for the requested preset. */
  range: DateRange;
  orders: Order[] | null;
  stats: StationStats | null;
  loading: boolean;
  /** True while the in-flight request has taken longer than SLOW_FETCH_MS. */
  delayed: boolean;
  error: boolean;
  refresh: () => void;
}

export function useStationOrders(
  business: Business,
  rangeId: DateRangeId = "30d",
  pollMs: number = DEFAULT_POLL_MS
): StationData {
  const range = useMemo(() => resolveDateRange(rangeId), [rangeId]);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    let alive = true;

    const tick = async () => {
      // Skip background polls while the tab is hidden to save work.
      if (typeof document !== "undefined" && document.hidden) return;
      const slowTimer = window.setTimeout(() => {
        if (alive) setDelayed(true);
      }, SLOW_FETCH_MS);
      try {
        const result = await fetchOrdersResult({ businessId: business.id });
        if (!alive) return;
        setError(!result.ok);
        // Keep the last good list visible while a later poll fails.
        if (result.ok) setOrders(result.orders);
      } finally {
        window.clearTimeout(slowTimer);
      }
      if (alive) setDelayed(false);
    };

    void tick();
    const poll = window.setInterval(() => void tick(), pollMs);
    return () => {
      alive = false;
      window.clearInterval(poll);
    };
  }, [business.id, pollMs, nonce]);

  const stats = useMemo(
    () => (orders ? summarizeStation(business, orders, range) : null),
    [business, orders, range]
  );

  return {
    range,
    orders,
    stats,
    loading: orders === null && !error,
    delayed,
    error,
    refresh: () => setNonce((n) => n + 1),
  };
}

/** Live poll of a single order (tracking screens). */
export function useOrder(id: string, pollMs: number = 4000) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const result = await fetchOrder(id);
      if (!alive) return;
      setOrder(result);
      setNotFound(!result);
      setLoading(false);
    };
    void tick();
    const poll = window.setInterval(() => void tick(), pollMs);
    return () => {
      alive = false;
      window.clearInterval(poll);
    };
  }, [id, pollMs]);

  return { order, loading, notFound };
}
