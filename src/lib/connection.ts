import { LOADER_FALLBACK_RULES } from "@/config/loader";

/**
 * `navigator.connection` is not in the standard TypeScript DOM lib yet, so we
 * describe only the bits we read.
 */
interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

interface NavigatorLike extends Navigator {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
}

export interface ConnectionProfile {
  /** The user asked the browser to save data. */
  saveData: boolean;
  /** `slow-2g` / `2g` / `3g` / `4g`, when the browser reports it. */
  effectiveType: string;
  /** Data saver is on, or the connection is 2g/3g. */
  slowConnection: boolean;
  /** The device looks underpowered for a background video. */
  lowEndDevice: boolean;
  /** Either of the above means we should skip the footage. */
  shouldFallback: boolean;
}

function readNavigator(): NavigatorLike | null {
  if (typeof navigator === "undefined") return null;
  return navigator as NavigatorLike;
}

/**
 * Inspects the connection and the device. Client only, so call it from an
 * effect (or an event handler), never during render.
 */
export function detectConnectionProfile(): ConnectionProfile {
  const nav = readNavigator();
  const connection = nav?.connection;
  const saveData = connection?.saveData === true;
  const effectiveType = connection?.effectiveType ?? "";
  const slowConnection =
    saveData ||
    (LOADER_FALLBACK_RULES.slowEffectiveTypes as readonly string[]).includes(effectiveType);

  const cores = typeof nav?.hardwareConcurrency === "number" ? nav.hardwareConcurrency : 0;
  const memory = typeof nav?.deviceMemory === "number" ? nav.deviceMemory : 0;
  const lowEndDevice =
    (cores > 0 && cores < LOADER_FALLBACK_RULES.minCpuCores) ||
    (memory > 0 && memory < LOADER_FALLBACK_RULES.minDeviceMemoryGb);

  return {
    saveData,
    effectiveType,
    slowConnection,
    lowEndDevice,
    shouldFallback: slowConnection || lowEndDevice,
  };
}

/** True when the user asked the system to reduce motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
