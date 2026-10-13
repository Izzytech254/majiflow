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

export interface ProfileDetails {
  name: string;
  phone: string;
  email?: string;
  address?: DeliveryAddress;
}

export interface ProfileUpdate extends ProfileDetails {
  email: string;
  address: DeliveryAddress;
}

interface CustomerContextValue {
  profile: CustomerProfile;
  /** True once the persisted profile has been read from localStorage. */
  hydrated: boolean;
  /** True once the user has signed in (MajiFlow uses a lightweight session flag). */
  loggedIn: boolean;
  saveCustomer: (p: Partial<CustomerProfile>) => void;
  /** Persist reusable checkout details; upserts (never duplicates) the address. */
  saveProfileDetails: (details: ProfileDetails) => void;
  /** Persist the complete, validated profile (contact + primary delivery address). */
  updateProfile: (details: ProfileUpdate) => void;
  addAddress: (a: DeliveryAddress) => void;
  removeAddress: (index: number) => void;
  setDefaultAddress: (index: number) => void;
  login: (seed?: Partial<CustomerProfile>) => void;
  logout: () => void;
  deleteAccount: () => void;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

const STORAGE_KEY = "mf:customer";
const AUTH_KEY = "mf:auth";
const CONSENT_KEY = "mf:profileConsent";
const CART_KEY = "mf:cart";
const EMPTY: CustomerProfile = { name: "", phone: "", addresses: [], defaultAddressIndex: 0 };

function addressKey(a: DeliveryAddress): string {
  return [a.estate.trim(), a.building?.trim() ?? "", a.floor?.trim() ?? ""]
    .join("|")
    .toLowerCase();
}

function normalizeAddress(a: DeliveryAddress, fallbackPhone: string): DeliveryAddress {
  return {
    label: a.label?.trim() || "Home",
    estate: a.estate.trim(),
    street: a.street?.trim() || undefined,
    building: a.building?.trim() || undefined,
    floor: a.floor?.trim() || undefined,
    city: a.city?.trim() || undefined,
    landmark: a.landmark?.trim() || undefined,
    notes: a.notes?.trim() || undefined,
    phone: a.phone?.trim() || fallbackPhone,
    lat: typeof a.lat === "number" && Number.isFinite(a.lat) ? a.lat : undefined,
    lng: typeof a.lng === "number" && Number.isFinite(a.lng) ? a.lng : undefined,
    accuracy:
      typeof a.accuracy === "number" && Number.isFinite(a.accuracy) ? a.accuracy : undefined,
    locationAt: a.locationAt?.trim() || undefined,
  };
}

function readLocal(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* noop */
  }
}

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate the profile from localStorage after mount */
    let next = EMPTY;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) next = { ...EMPTY, ...(JSON.parse(raw) as Partial<CustomerProfile>) };
    } catch {
      /* noop */
    }
    setProfile(next);
    setLoggedIn((typeof window !== "undefined" && readLocal(AUTH_KEY) === "1") || Boolean(next.name));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    writeLocal(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, hydrated]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    writeLocal(AUTH_KEY, loggedIn ? "1" : "0");
  }, [loggedIn, hydrated]);

  const saveCustomer = useCallback((p: Partial<CustomerProfile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
  }, []);

  const saveProfileDetails = useCallback((details: ProfileDetails) => {
    const name = details.name.trim();
    const phone = details.phone.trim();
    setProfile((prev) => {
      let addresses = prev.addresses;
      let defaultIndex = prev.defaultAddressIndex;
      if (details.address) {
        const next = normalizeAddress(details.address, phone);
        if (addresses.length === 0) {
          addresses = [next];
          defaultIndex = 0;
        } else {
          const existingIdx = addresses.findIndex((a) => addressKey(a) === addressKey(next));
          if (existingIdx >= 0) {
            addresses = addresses.map((a, i) => (i === existingIdx ? { ...a, ...next } : a));
          } else {
            addresses = [next, ...addresses];
          }
        }
      }
      return {
        ...prev,
        name: name || prev.name,
        phone: phone || prev.phone,
        email: details.email?.trim() || prev.email,
        defaultAddressIndex: defaultIndex,
        addresses,
      };
    });
  }, []);

  const updateProfile = useCallback((details: ProfileUpdate) => {
    setProfile((prev) => {
      const next = normalizeAddress(details.address, details.phone.trim());
      let addresses: DeliveryAddress[];
      let defaultIndex: number;
      if (prev.addresses.length === 0) {
        addresses = [next];
        defaultIndex = 0;
      } else {
        const existingIdx = prev.addresses.findIndex((a) => addressKey(a) === addressKey(next));
        defaultIndex = existingIdx >= 0 ? existingIdx : Math.min(prev.defaultAddressIndex, prev.addresses.length - 1);
        addresses = prev.addresses.map((a, i) => (i === defaultIndex ? { ...a, ...next } : a));
      }
      return {
        ...prev,
        name: details.name.trim(),
        phone: details.phone.trim(),
        email: details.email.trim(),
        defaultAddressIndex: defaultIndex,
        addresses,
      };
    });
  }, []);

  const addAddress = useCallback((a: DeliveryAddress) => {
    setProfile((prev) => ({
      ...prev,
      addresses: [normalizeAddress(a, prev.phone), ...prev.addresses],
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

  const login = useCallback((seed?: Partial<CustomerProfile>) => {
    if (seed) setProfile((prev) => ({ ...prev, ...seed, phone: seed.phone?.trim() || prev.phone }));
    setLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setLoggedIn(false);
  }, []);

  const deleteAccount = useCallback(() => {
    setProfile(EMPTY);
    setLoggedIn(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(AUTH_KEY);
      window.localStorage.removeItem(CONSENT_KEY);
      window.localStorage.removeItem(CART_KEY);
    } catch {
      /* noop */
    }
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        profile,
        hydrated,
        loggedIn,
        saveCustomer,
        saveProfileDetails,
        updateProfile,
        addAddress,
        removeAddress,
        setDefaultAddress,
        login,
        logout,
        deleteAccount,
      }}
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