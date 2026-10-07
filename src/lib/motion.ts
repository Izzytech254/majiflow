import { useReducedMotion } from "framer-motion";
import { easeOut } from "./constants";
import type { Transition } from "framer-motion";

export type MotionSafe = {
  reduce: boolean;
  duration: number | undefined;
  transition: Transition | undefined;
};

export function useMotionSafe(): MotionSafe {
  const reduce = useReducedMotion() ?? false;
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