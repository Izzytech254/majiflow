"use client";

import { useMemo, useState } from "react";
import Image, { getImageProps, type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brand-tinted stand-in for images we cannot blur ahead of time (remote
 * covers with no pre-computed placeholder).
 */
const BRAND_BLUR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='6'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23dff6fa'/%3E%3Cstop offset='1' stop-color='%23b9dcf7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='8' height='6' fill='url(%23g)'/%3E%3C/svg%3E";

export interface BlurImageProps extends Omit<ImageProps, "placeholder" | "blurDataURL" | "onLoad"> {
  /** The image must fill a positioned parent, like `next/image` does. */
  fill: true;
  /** Overrides the automatically derived placeholder. */
  blurDataURL?: string;
  onLoad?: ImageProps["onLoad"];
}

/**
 * `next/image` with a tiny blurred placeholder that fades into the sharp
 * image. The placeholder is a sibling layer, so the swap animates opacity
 * only and never shifts the layout.
 */
export function BlurImage({ className, blurDataURL, onLoad, alt, ...props }: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);

  const placeholder = useMemo(() => {
    if (blurDataURL) return blurDataURL;
    const src = props.src;
    if (typeof src === "object" && src !== null) {
      try {
        const { props: derived } = getImageProps({ src, alt: "", placeholder: "blur" });
        if (derived.blurDataURL) return derived.blurDataURL;
      } catch {
        // Fall through to the brand placeholder.
      }
    }
    return BRAND_BLUR;
  }, [props.src, blurDataURL]);

  return (
    <>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-out",
          loaded ? "opacity-0" : "opacity-100"
        )}
        style={{ backgroundImage: `url("${placeholder}")` }}
      />
      <Image
        {...props}
        alt={alt}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        className={cn(
          "transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </>
  );
}
