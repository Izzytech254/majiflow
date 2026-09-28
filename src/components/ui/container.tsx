import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Max width of the container (default: 72rem). */
  size?: "sm" | "md" | "lg" | "full";
}

const sizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-[72rem]",
  full: "max-w-none",
};

export function Container({ className, size = "lg", ...props }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8", sizes[size], className)} {...props} />
  );
}