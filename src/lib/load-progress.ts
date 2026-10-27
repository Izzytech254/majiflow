"use client";

import { useSyncExternalStore } from "react";

/**
 * The three things that actually have to happen before the app is usable.
 * The splash progress line reads from this store, so it reports genuine
 * progress instead of running a fake timer.
 */
export type LoadMilestone = "fonts" | "hero" | "data";

export const LOAD_MILESTONES: readonly LoadMilestone[] = ["fonts", "hero", "data"] as const;

const loaded = new Set<LoadMilestone>();
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/** Marks a milestone as finished. Safe to call more than once. */
export function markLoaded(milestone: LoadMilestone): void {
  if (loaded.has(milestone)) return;
  loaded.add(milestone);
  emit();
}

/** Test seam: clears every milestone. */
export function resetLoaded(): void {
  loaded.clear();
  emit();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): number {
  let count = 0;
  for (const milestone of LOAD_MILESTONES) if (loaded.has(milestone)) count += 1;
  return count;
}

/** Server snapshot: nothing is loaded yet, so the splash starts empty. */
function getServerSnapshot(): number {
  return 0;
}

export interface LoadProgress {
  /** How many milestones are done. */
  completed: number;
  /** How many milestones there are in total. */
  total: number;
  /** completed / total, 0 to 1. */
  ratio: number;
  /** True once every milestone is done. */
  done: boolean;
}

/**
 * Subscribes to real loading progress. Uses `useSyncExternalStore` so the
 * server and the first client render always agree.
 */
export function useLoadProgress(): LoadProgress {
  const completed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const total = LOAD_MILESTONES.length;
  return {
    completed,
    total,
    ratio: total === 0 ? 1 : completed / total,
    done: completed >= total,
  };
}
