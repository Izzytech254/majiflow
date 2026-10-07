"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/components/order/cart-provider";
import { CustomerProvider } from "@/components/order/customer-provider";
import { GeoShareEngine } from "@/components/order/geo-share-engine";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        <CustomerProvider>
          <GeoShareEngine />
          {children}
        </CustomerProvider>
      </CartProvider>
    </ToastProvider>
  );
}