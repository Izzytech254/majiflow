import { cn } from "@/lib/utils";

interface DropLoaderProps {
  className?: string;
  /** Announced to assistive tech; omit to stay silent inside buttons. */
  label?: string;
}

/**
 * The inline busy indicator that replaces every generic spinner. A drop falls,
 * lands and sends a ripple across the surface it rests on.
 */
export function DropLoader({ className, label }: DropLoaderProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("relative inline-flex items-center justify-center", className)}
    >
      <span
        className="absolute bottom-[6%] h-[10%] w-[80%] rounded-[50%] bg-[var(--brand)]/25"
        style={{ animation: "ripple-out 1.25s ease-out infinite" }}
      />
      <svg viewBox="0 0 24 24" className="relative size-[68%] text-[var(--brand)]">
        <path
          d="M12 2.5c3.4 4.6 5.6 7.7 5.6 10.4a5.6 5.6 0 1 1-11.2 0C6.4 10.2 8.6 7.1 12 2.5z"
          fill="currentColor"
          style={{ animation: "drop-bounce 1.25s cubic-bezier(0.34, 1.56, 0.64, 1) infinite", transformOrigin: "12px 22px" }}
        />
      </svg>
    </span>
  );
}
