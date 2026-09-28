import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Star, Truck } from "lucide-react";
import type { Business } from "@/lib/types";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WaterIcon } from "@/components/shared/water-icon";

interface BusinessCardProps {
  business: Business;
  className?: string;
  layout?: "vertical" | "horizontal";
}

export function BusinessCard({ business, className, layout = "vertical" }: BusinessCardProps) {
  return (
    <Link href={`/browse/${business.slug}`} className={cn("group block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052FF] rounded-2xl", className)}>
      <Card
        className={cn(
          "flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-layered",
          layout === "horizontal" && "sm:flex-row"
        )}
      >
        <div
          className={cn(
            "relative flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50",
            layout === "horizontal" ? "min-h-40 sm:w-52 sm:min-h-0" : "h-36"
          )}
          style={{ backgroundImage: `radial-gradient(ellipse at 20% 20%, ${business.accent}14, transparent 60%)` }}
          aria-hidden
        >
          <WaterIcon kind="can" className={cn("text-[#0052FF]/50 transition-transform duration-500 group-hover:scale-110", layout === "horizontal" ? "size-14" : "size-16")} />
          {business.verified && (
            <Badge variant="softAccent" className="absolute left-3 top-3">
              <BadgeCheck className="size-3.5" aria-hidden /> Verified
            </Badge>
          )}
        </div>

        <div className={cn("flex flex-1 flex-col p-5", layout === "horizontal" && "sm:p-6")}>
          <h3 className="font-display text-xl leading-snug text-foreground transition-colors group-hover:text-[#0052FF]">
            {business.name}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">{business.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden /> {business.city}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <Star className="size-3.5 fill-warning text-warning" aria-hidden />
              {business.rating} ({business.reviewCount})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="size-3.5" aria-hidden /> {formatKES(business.deliveryFee)}
              {business.freeDeliveryAbove > 0 && (
                <span className="text-success">free over {formatKES(business.freeDeliveryAbove)}</span>
              )}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {business.estates.slice(0, 3).map((e) => (
              <span key={e} className="rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                {e}
              </span>
            ))}
          </div>

          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0052FF]">
            View menu
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </Card>
    </Link>
  );
}