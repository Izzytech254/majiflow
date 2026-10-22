import { cn } from "@/lib/utils";

/**
 * A static, brand-tinted map texture shown while Leaflet and its tiles load.
 * It is never a blank grey box: the street grid and the shimmer hint at what
 * is about to appear.
 */
export function MapPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 overflow-hidden bg-[var(--surface-2)] transition-opacity duration-500 ease-out",
        className
      )}
      role="status"
      aria-label="Loading map"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(0,87,230,0.07) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(0,87,230,0.07) 1px, transparent 1px)",
            "radial-gradient(58% 58% at 28% 26%, rgba(0,194,214,0.18), transparent 72%)",
            "radial-gradient(52% 52% at 76% 72%, rgba(0,87,230,0.14), transparent 72%)",
          ].join(","),
          backgroundSize: "56px 56px, 56px 56px, 100% 100%, 100% 100%",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.75) 50%, transparent 58%)",
        }}
      />
      <span className="skeleton-sheen" />
    </div>
  );
}
