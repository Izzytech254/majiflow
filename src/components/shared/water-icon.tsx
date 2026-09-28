import { Droplets, CupSoda, Refrigerator, GlassWater } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaterIconProps {
  kind: string;
  className?: string;
}

const mapping: Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  can: Droplets,
  bottle: GlassWater,
  dispenser: Refrigerator,
};

export function WaterIcon({ kind, className }: WaterIconProps) {
  const Icon = mapping[kind] ?? CupSoda;
  return <Icon aria-hidden className={cn(className)} />;
}