import Link from "next/link";
import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="MajiFlow home"
      className={cn("group inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052FF] rounded-lg", className)}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-accent transition-transform duration-300 group-hover:scale-105">
        <Droplets className="size-5" aria-hidden />
      </span>
      <span className={cn("font-display text-lg leading-none tracking-tight", dark ? "text-white" : "text-foreground")}>
        Maji<span className="text-gradient">Flow</span>
      </span>
    </Link>
  );
}