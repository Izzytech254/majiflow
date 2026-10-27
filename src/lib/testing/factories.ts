import type { Order } from "@/lib/types";

/** Test-only order factory. Not imported by application code. */
export function makeOrder(partial: Partial<Order> = {}): Order {
  const base: Order = {
    id: "order-1",
    businessId: "bio-water-kasarani",
    items: [{ id: "bw-refill-20", productId: "bw-refill-20", storeId: "bio-water-kasarani", name: "Refill - 20L can", quantity: 2, price: 350, unit: "20L can", image: "/images/products/refill-20l.jpg" }],
    subtotal: 700,
    deliveryFee: 120,
    total: 820,
    payment: "mpesa",
    paymentState: "paid",
    status: "delivered",
    fulfillment: "delivery",
    address: { label: "Home", estate: "Kasarani", phone: "0712345678", lat: -1.2, lng: 36.9 },
    location: null,
    locationHistory: [],
    createdAt: "2026-09-21T10:42:00.000Z",
    updatedAt: "2026-09-21T10:42:00.000Z",
  };
  return { ...base, ...partial } as Order;
}
