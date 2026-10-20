import Link from "next/link";
import { MapPin, Navigation, Star, Truck } from "lucide-react";
import type { Business } from "@/lib/types";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BusinessAvailability } from "@/components/shared/business-availability";
import { StationBadge } from "@/components/shared/station-badge";

interface StationRowProps {
  business: Business;
  distanceKm?: number;
  selected?: boolean;
  onSelect?: () => void;
}

function formatDistanceKm(distanceKm: number): string {
  if (distanceKm < 1) return "<1 km";
  if (distanceKm < 10) return `${distanceKm.toFixed(1)} km`;
  return `${Math.round(distanceKm)} km`;
}

function directionsHref(business: Business): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`;
}

export function StationRow({ business, distanceKm, selected, onSelect }: StationRowProps) {
  const address = [business.estates[0], business.city].filter(Boolean).join(", ");

  return (
    <article
      onMouseEnter={onSelect}
      onFocus={onSelect}
      className={cn(
        "rounded-2xl border bg-white p-4 shadow-soft transition-all",
        selected
          ? "border-[#0052FF] ring-2 ring-[#0052FF]/20"
          : "border-border hover:border-[#0052FF]/40 hover:shadow-card"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/browse/${business.slug}`}
              className="truncate font-display text-base leading-snug text-foreground transition-colors hover:text-[#0052FF]"
            >
              {business.name}
            </Link>
            <StationBadge verified={business.verified} paid={business.paid} />
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{address}</span>
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted/60 px-2 py-1 text-xs font-semibold text-foreground">
          <Star className="size-3.5 fill-warning text-warning" aria-hidden />
          {business.rating}
          <span className="font-normal text-muted-foreground">({business.reviewCount})</span>
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        {typeof distanceKm === "number" && Number.isFinite(distanceKm) && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#0052FF]">
            <Navigation className="size-3.5" aria-hidden />
            {formatDistanceKm(distanceKm)} away
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Truck className="size-3.5" aria-hidden />
          {business.deliveryFee === 0 ? "Free delivery" : `${formatKES(business.deliveryFee)} delivery`}
        </span>
      </div>

      <BusinessAvailability hours={business.openingHours} compact plain className="mt-2" />

      <div className="mt-3 flex gap-2">
        <Link
          href={`/browse/${business.slug}`}
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-[#0052FF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0043d1]"
        >
          View menu
        </Link>
        <a
          href={directionsHref(business)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Directions to ${business.name}`}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground transition-colors hover:border-[#0052FF]/40 hover:text-[#0052FF]"
        >
          <Navigation className="size-4" aria-hidden />
          Directions
        </a>
      </div>
    </article>
  );
}
