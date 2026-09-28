"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/components/order/cart-provider";
import { CustomerProvider } from "@/components/order/customer-provider";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        <CustomerProvider>{children}</CustomerProvider>
      </CartProvider>
    </ToastProvider>
  );
}