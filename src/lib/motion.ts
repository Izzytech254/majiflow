import { useSyncExternalStore } from "react";
import { easeOut } from "./constants";
import type { Transition } from "framer-motion";

export type MotionSafe = {
  reduce: boolean;
  duration: number | undefined;
  transition: Transition | undefined;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function getSnapshot(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * The server has no way to know the user's motion preference, so it always
 * reports "no preference" and the client re-checks once hydration is done.
 * Reading it during render would desync the server and client markup.
 */
function getServerSnapshot(): boolean {
  return false;
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * SSR-safe replacement for framer-motion's `useReducedMotion`, which resolves
 * the preference during the first client render and therefore mismatches the
 * server-rendered markup for anyone who has reduced motion switched on.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useMotionSafe(): MotionSafe {
  const reduce = usePrefersReducedMotion();
  return {
    reduce,
    duration: reduce ? 0 : undefined,
    transition: reduce ? { duration: 0 } : { ease: easeOut },
  };
}

export function motionSafe<T extends Record<string, unknown>>(
  reduce: boolean,
  normal: T,
  reduced?: Partial<T>
): T {
  if (reduce) {
    return { ...normal, ...reduced } as T;
  }
  return normal;
}
