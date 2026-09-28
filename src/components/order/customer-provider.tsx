"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { DeliveryAddress } from "@/lib/types";

export interface CustomerProfile {
  name: string;
  phone: string;
  email?: string;
  addresses: DeliveryAddress[];
  defaultAddressIndex: number;
}

interface CustomerContextValue {
  profile: CustomerProfile;
  saveCustomer: (p: Partial<CustomerProfile>) => void;
  addAddress: (a: DeliveryAddress) => void;
  removeAddress: (index: number) => void;
  setDefaultAddress: (index: number) => void;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

const STORAGE_KEY = "mf:customer";
const EMPTY: CustomerProfile = { name: "", phone: "", addresses: [], defaultAddressIndex: 0 };

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile({ ...EMPTY, ...(JSON.parse(raw) as Partial<CustomerProfile>) });
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* noop */
    }
  }, [profile, hydrated]);

  const saveCustomer = useCallback((p: Partial<CustomerProfile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
  }, []);

  const addAddress = useCallback((a: DeliveryAddress) => {
    setProfile((prev) => ({
      ...prev,
      addresses: [a, ...prev.addresses],
      defaultAddressIndex: 0,
    }));
  }, []);

  const removeAddress = useCallback((index: number) => {
    setProfile((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
      defaultAddressIndex: 0,
    }));
  }, []);

  const setDefaultAddress = useCallback((index: number) => {
    setProfile((prev) => ({ ...prev, defaultAddressIndex: index }));
  }, []);

  return (
    <CustomerContext.Provider
      value={{ profile, saveCustomer, addAddress, removeAddress, setDefaultAddress }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer(): CustomerContextValue {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within CustomerProvider");
  return ctx;
}