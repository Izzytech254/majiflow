"use client";

import { WaterBottle } from "@/components/motion/water-bottle";
import { cn } from "@/lib/utils";

export function WaterLoader({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <WaterBottle loop className="w-20" />
      <p className="text-sm font-medium text-muted-foreground">{label}…</p>
    </div>
  );
}
