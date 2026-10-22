"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/components/order/cart-provider";
import { CartUiProvider } from "@/components/order/cart-ui-provider";
import { CartDrawer } from "@/components/order/cart-drawer";
import { FloatingCartBar, SwitchStationDialog } from "@/components/order/cart-entry";
import { CustomerProvider } from "@/components/order/customer-provider";
import { OrderSessionProvider } from "@/components/order/order-session-provider";
import { FlyToCartProvider } from "@/components/order/fly-to-cart";
import { GeoShareEngine } from "@/components/order/geo-share-engine";
import { ToastProvider } from "@/components/ui/toast";
import { RefillPrompt } from "@/components/shared/refill-prompt";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        <CartUiProvider>
          <FlyToCartProvider>
            <CustomerProvider>
              <OrderSessionProvider>
                <GeoShareEngine />
                {children}
                <FloatingCartBar />
                <CartDrawer />
                <SwitchStationDialog />
                <RefillPrompt />
              </OrderSessionProvider>
            </CustomerProvider>
          </FlyToCartProvider>
        </CartUiProvider>
      </CartProvider>
    </ToastProvider>
  );
}