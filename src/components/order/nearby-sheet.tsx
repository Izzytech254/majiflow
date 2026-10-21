"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronUp, Clock, MapPin, Star, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatKES } from "@/lib/format";
import { useBusinessAvailability } from "@/components/shared/business-availability";
import { useMotionSafe } from "@/lib/motion";
import type { DiscoveredStation } from "@/lib/station-discovery";
import type { Business } from "@/lib/types";

type Snap = "peek" | "half" | "full";
const SNAP_ORDER: Snap[] = ["peek", "half", "full"];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function NearbyStationCard({
  business,
  distanceKm,
  open,
}: {
  business: Business;
  distanceKm?: number;
  open: boolean;
}) {
  const availability = useBusinessAvailability(business.openingHours);
  return (
    <Link
      href={`/browse/${business.slug}`}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border bg-white p-3 transition-colors hover:border-[var(--brand)]/50",
        !open && "opacity-70"
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-3 text-[var(--brand)]">
        <Store className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">{business.name}</span>
          {open ? (
            <Badge variant="success" className="shrink-0">
              Open
            </Badge>
          ) : (
            <Badge variant="mono" className="shrink-0">
              Closed
            </Badge>
          )}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {distanceKm !== undefined && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden /> {distanceKm.toFixed(1)} km
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden />{" "}
            {open ? `~${business.avgDeliveryMinutes} min` : availability.hoursLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3 fill-warning text-warning" aria-hidden /> {business.rating}
          </span>
          <span>{formatKES(business.deliveryFee)} delivery</span>
        </span>
      </span>
    </Link>
  );
}

/**
 * The nearby-station list. Rendered inline on wide screens and inside the
 * draggable sheet on phones.
 */
export function NearbyStationList({
  stations,
  onNotify,
  emptyTitle = "No station delivers here yet",
  emptyBody = "Try a nearby estate, or tell us where to expand next.",
}: {
  stations: DiscoveredStation[];
  onNotify: () => void;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  const anyOpen = stations.some((s) => s.open);

  if (stations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface-2/60 p-4 text-center">
        <p className="text-sm font-semibold text-foreground">{emptyTitle}</p>
        <p className="mt-1 text-xs text-muted-foreground">{emptyBody}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={onNotify}>
          Notify me when available
        </Button>
      </div>
    );
  }

  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {anyOpen ? "Stations that deliver here" : "Stations near you - all closed right now"}
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {stations.map(({ business, distanceKm, open }) => (
          <li key={business.id}>
            <NearbyStationCard business={business} distanceKm={distanceKm} open={open} />
          </li>
        ))}
      </ul>
      {!anyOpen && (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface-2/60 p-4 text-center">
          <p className="text-sm font-semibold text-foreground">
            Nothing is open for delivery here yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            These stations open later today. We&apos;ll let you know the moment one is open.
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={onNotify}>
            Notify me when available
          </Button>
        </div>
      )}
    </>
  );
}

interface DragState {
  startY: number;
  startHeight: number;
  height: number;
  lastY: number;
  lastT: number;
  velocity: number;
  moved: boolean;
}

/**
 * Uber/Glovo-style bottom sheet that floats over the map. It snaps between
 * three heights - peek (just the handle), half and full - and can be dragged
 * with a pointer or a finger.
 */
export function NearbySheet({
  stations,
  onNotify,
  containerRef,
}: {
  stations: DiscoveredStation[];
  onNotify: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { reduce } = useMotionSafe();
  const [snap, setSnap] = useState<Snap>("half");
  const [liveHeight, setLiveHeight] = useState<number | null>(null);
  const [containerH, setContainerH] = useState(0);
  const drag = useRef<DragState | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerH(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const heights = useMemo(() => {
    if (!containerH) return { peek: 0, half: 0, full: 0 };
    return {
      peek: clamp(containerH * 0.2, 92, 124),
      half: Math.round(containerH * 0.5),
      full: Math.round(containerH * 0.92),
    };
  }, [containerH]);

  const height = liveHeight ?? heights[snap];
  const dragging = liveHeight !== null;

  const nearest = useCallback(
    (h: number): Snap => {
      let best: Snap = "half";
      let bestDiff = Infinity;
      for (const s of SNAP_ORDER) {
        const diff = Math.abs(heights[s] - h);
        if (diff < bestDiff) {
          bestDiff = diff;
          best = s;
        }
      }
      return best;
    },
    [heights]
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerH) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const startHeight = liveHeight ?? heights[snap];
    drag.current = {
      startY: e.clientY,
      startHeight,
      height: startHeight,
      lastY: e.clientY,
      lastT: e.timeStamp,
      velocity: 0,
      moved: false,
    };
    setLiveHeight(startHeight);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const delta = d.startY - e.clientY;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.velocity = (e.clientY - d.lastY) / dt;
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
    if (Math.abs(delta) > 4) d.moved = true;
    const next = clamp(d.startHeight + delta, heights.peek, heights.full);
    d.height = next;
    setLiveHeight(next);
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const h = d.height;

    if (!d.moved) {
      // A tap cycles peek -> half -> full -> half.
      const next: Snap = snap === "peek" ? "half" : snap === "half" ? "full" : "half";
      setSnap(next);
      setLiveHeight(null);
      return;
    }

    if (Math.abs(d.velocity) > 0.4) {
      const idx = SNAP_ORDER.indexOf(nearest(h));
      const target = d.velocity < 0 ? idx + 1 : idx - 1;
      setSnap(SNAP_ORDER[clamp(target, 0, SNAP_ORDER.length - 1)]);
    } else {
      setSnap(nearest(h));
    }
    setLiveHeight(null);
  };

  if (!stations.length) return null;

  const chevronRotation = snap === "full" ? 180 : snap === "half" ? 0 : 180;

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-[500] flex flex-col overflow-hidden rounded-t-3xl border-t border-border bg-white shadow-layered"
      style={{ height: height || undefined }}
      animate={{ height: height || undefined }}
      transition={reduce || dragging ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }}
      aria-label="Nearby stations"
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={
          snap === "full" ? "Collapse nearby stations" : "Expand nearby stations"
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") setSnap("full");
          if (e.key === "ArrowDown") setSnap("peek");
        }}
        className="shrink-0 cursor-grab touch-none select-none px-4 pb-2 pt-2.5 active:cursor-grabbing"
      >
        <span className="mx-auto block h-1.5 w-10 rounded-full bg-border" />
        <span className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">
            {stations.length} station{stations.length === 1 ? "" : "s"} nearby
          </span>
          <ChevronUp
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
            style={{ transform: `rotate(${chevronRotation}deg)` }}
            aria-hidden
          />
        </span>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4"
        style={{ display: snap === "peek" && !dragging ? "none" : undefined }}
      >
        <NearbyStationList stations={stations} onNotify={onNotify} />
      </div>
    </motion.div>
  );
}
