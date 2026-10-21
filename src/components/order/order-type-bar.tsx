"use client";

import { useState } from "react";
import { MapPin, Pencil, Store, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrderSession, orderSessionLabel } from "@/components/order/order-session-provider";
import { LocationModal } from "@/components/order/location-modal";

/**
 * Always-visible context bar: delivery/pickup, the chosen address, and an Edit
 * affordance that reopens the location modal. Sits sticky under the header.
 */
export function OrderTypeBar({ className }: { className?: string }) {
  const session = useOrderSession();
  const [open, setOpen] = useState(false);

  if (!session.hydrated) return null;

  const pickup = session.fulfilment === "pickup";
  const label = orderSessionLabel(session);

  return (
    <>
      <div className={cn("sticky top-16 z-40 border-b border-border bg-white/95 backdrop-blur-md", className)}>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-2.5">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              pickup ? "bg-surface-3 text-foreground" : "bg-cta-soft text-[#0052FF]"
            )}
            aria-hidden
          >
            {pickup ? <Store className="size-4.5" /> : <Truck className="size-4.5" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {pickup ? "Pickup" : "Delivery"}
              {!pickup && session.address && <MapPin className="size-3 text-[#0052FF]" aria-hidden />}
            </p>
            <p className="truncate text-sm font-medium text-foreground">{label}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-[#0052FF]/50 hover:text-[#0052FF]"
          >
            <Pencil className="size-3.5" aria-hidden /> Edit
          </button>
        </div>
      </div>
      <LocationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
