"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { businesses } from "@/lib/data/businesses";
import type { Business } from "@/lib/types";

/**
 * Which station the business dashboard is currently acting as. Persisted to
 * localStorage so the sidebar picker, the orders list and the order detail
 * pages all agree, exposed via useSyncExternalStore (SSR-safe, cross-tab
 * aware through the `storage` event).
 */

const STORAGE_KEY = "mf:business";
const DEFAULT_BUSINESS_ID = businesses[1].id;

interface BusinessContextValue {
  business: Business;
  setBusinessId: (id: string) => void;
}

const BusinessContext = createContext<BusinessContextValue | null>(null);

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = () => emit();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readBusinessId() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && businesses.some((b) => b.id === saved)) return saved;
  } catch {
    /* noop */
  }
  return DEFAULT_BUSINESS_ID;
}

const getServerSnapshot = () => DEFAULT_BUSINESS_ID;

export function BusinessProvider({ children }: { children: ReactNode }) {
  const businessId = useSyncExternalStore(subscribe, readBusinessId, getServerSnapshot);

  const setBusinessId = useCallback((id: string) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* noop */
    }
    emit();
  }, []);

  const business = businesses.find((b) => b.id === businessId) ?? businesses[1];

  return (
    <BusinessContext.Provider value={{ business, setBusinessId }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness(): BusinessContextValue {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider");
  return ctx;
}
