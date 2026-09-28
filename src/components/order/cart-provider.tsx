"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartLine {
  businessId: string;
  productId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartLine[];
  count: number;
  addItem: (line: CartLine) => void;
  updateQuantity: (businessId: string, productId: string, quantity: number) => void;
  removeItem: (businessId: string, productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mf:cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartLine[]);
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* noop */
    }
  }, [items, hydrated]);

  const addItem = useCallback((line: CartLine) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.businessId === line.businessId && i.productId === line.productId
      );
      if (existing) {
        return prev.map((i) =>
          i.businessId === line.businessId && i.productId === line.productId
            ? { ...i, quantity: i.quantity + line.quantity }
            : i
        );
      }
      return [...prev, line];
    });
  }, []);

  const updateQuantity = useCallback(
    (businessId: string, productId: string, quantity: number) => {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => !(i.businessId === businessId && i.productId === productId))
          : prev.map((i) =>
              i.businessId === businessId && i.productId === productId ? { ...i, quantity } : i
            )
      );
    },
    []
  );

  const removeItem = useCallback((businessId: string, productId: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.businessId === businessId && i.productId === productId))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, count, addItem, updateQuantity, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}