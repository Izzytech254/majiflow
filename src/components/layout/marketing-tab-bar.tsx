"use client";

import { Droplets, Home, ShoppingCart, User } from "lucide-react";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { useCart } from "@/components/order/cart-provider";

/** Bottom navigation for the customer-facing marketing pages. */
export function MarketingTabBar() {
  const { count } = useCart();
  return (
    <MobileTabBar
      items={[
        { href: "/", label: "Home", icon: Home },
        { href: "/browse", label: "Browse", icon: Droplets },
        { href: "/cart", label: "Cart", icon: ShoppingCart, badge: count || undefined },
        { href: "/account", label: "Account", icon: User },
      ]}
    />
  );
}
