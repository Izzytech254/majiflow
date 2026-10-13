import { describe, expect, it } from "vitest";
import {
  filterCustomers,
  isRevenueOrder,
  normalizePhone,
  percentChange,
  resolveDateRange,
  stockAlertsFor,
  summarizeStation,
} from "@/lib/analytics";
import { businesses } from "@/lib/data/businesses";
import { makeOrder } from "@/lib/testing/factories";
import type { Order } from "@/lib/types";

const BIO = businesses.find((b) => b.id === "bio-water-kasarani")!;
// Mon 21 Sep 2026, 15:00 Nairobi.
const NOW = new Date("2026-09-21T12:00:00Z");

describe("resolveDateRange", () => {
  it("charts today by the hour and starts at the local midnight", () => {
    const range = resolveDateRange("today", NOW);
    expect(range.grain).toBe("hour");
    // 21 Sep 00:00 Nairobi is 20 Sep 21:00 UTC.
    expect(new Date(range.from).toISOString()).toBe("2026-09-20T21:00:00.000Z");
    expect(range.to).toBe(NOW.getTime());
  });

  it("covers seven local days for the 7d preset", () => {
    const range = resolveDateRange("7d", NOW);
    expect(range.grain).toBe("day");
    // 15 Sep 00:00 Nairobi.
    expect(new Date(range.from).toISOString()).toBe("2026-09-14T21:00:00.000Z");
    expect(range.span).toBe(range.to - range.from);
  });

  it("starts this month at the local first of the month", () => {
    const range = resolveDateRange("month", NOW);
    expect(new Date(range.from).toISOString()).toBe("2026-08-31T21:00:00.000Z");
  });

  it("has no lower bound and no comparison window for all time", () => {
    const range = resolveDateRange("all", NOW);
    expect(range.from).toBe(0);
    expect(range.span).toBeNull();
    expect(summarizeStation(BIO, [], range, NOW).previous).toBeNull();
  });
});

describe("normalizePhone", () => {
  it("collapses the same Kenyan number written different ways", () => {
    for (const spelling of ["+254 712 345 678", "254712345678", "0712345678", "0712-345-678"]) {
      expect(normalizePhone(spelling)).toBe("0712345678");
    }
  });

  it("returns short or non-Kenyan input unchanged for the caller to reject", () => {
    expect(normalizePhone("12345")).toBe("12345");
  });
});

describe("isRevenueOrder", () => {
  it("does not count rejected, cancelled or failed-payment orders", () => {
    expect(isRevenueOrder(makeOrder({ status: "rejected" }))).toBe(false);
    expect(isRevenueOrder(makeOrder({ status: "cancelled" }))).toBe(false);
    expect(isRevenueOrder(makeOrder({ paymentState: "failed" }))).toBe(false);
    expect(isRevenueOrder(makeOrder({ status: "pending" }))).toBe(true);
  });
});

describe("summarizeStation", () => {
  const range = resolveDateRange("7d", NOW);

  it("counts only the orders in the window", () => {
    const orders = [
      makeOrder({ id: "in-1", placedAt: "2026-09-21T10:00:00Z" }),
      makeOrder({ id: "in-2", placedAt: "2026-09-19T10:00:00Z" }),
      makeOrder({ id: "before", placedAt: "2026-08-01T10:00:00Z" }),
    ];
    const stats = summarizeStation(BIO, orders, range, NOW);
    expect(stats.orderCount).toBe(2);
    expect(stats.revenue).toBe(1400);
    expect(stats.deliveryRevenue).toBe(240);
    expect(stats.gross).toBe(1640);
    expect(stats.avgOrderValue).toBe(700);
  });

  it("keeps a status count across all orders, not just the window", () => {
    const orders = [
      makeOrder({ id: "a", status: "delivered", placedAt: "2026-09-21T10:00:00Z" }),
      makeOrder({ id: "b", status: "delivered", placedAt: "2026-01-01T10:00:00Z" }),
      makeOrder({ id: "c", status: "pending", placedAt: "2026-01-01T10:00:00Z" }),
    ];
    const stats = summarizeStation(BIO, orders, range, NOW);
    expect(stats.statusCounts.delivered).toBe(2);
    expect(stats.statusCounts.pending).toBe(1);
    expect(stats.activeCount).toBe(1);
  });

  it("compares against the immediately preceding window", () => {
    const orders = [
      makeOrder({ id: "now", placedAt: "2026-09-21T10:00:00Z" }), // inside 7d
      makeOrder({ id: "prev", placedAt: "2026-09-10T10:00:00Z" }), // inside the prior 7d
    ];
    const stats = summarizeStation(BIO, orders, range, NOW);
    expect(stats.previous?.orders).toBeGreaterThanOrEqual(1);
    expect(stats.previous?.revenue).toBeGreaterThanOrEqual(700);
  });

  it("collapses two spellings of one phone into a single customer", () => {
    const orders = [
      makeOrder({ id: "one", customerPhone: "+254 712 345 678", placedAt: "2026-09-21T10:00:00Z" }),
      makeOrder({ id: "two", customerPhone: "0712345678", placedAt: "2026-09-20T10:00:00Z" }),
    ];
    const stats = summarizeStation(BIO, orders, range, NOW);
    expect(stats.customers).toHaveLength(1);
    expect(stats.customers[0].orders).toBe(2);
    expect(stats.repeatRate).toBe(100);
  });

  it("marks a long-silent customer dormant", () => {
    const orders = [makeOrder({ id: "old", placedAt: "2026-06-01T10:00:00Z" })];
    const stats = summarizeStation(BIO, orders, range, NOW);
    expect(stats.customers[0].status).toBe("dormant");
  });

  it("reports the same comparison fields whatever the window", () => {
    const stats = summarizeStation(BIO, [], range, NOW);
    expect(stats.revenue).toBe(0);
    expect(stats.avgOrderValue).toBe(0);
    expect(stats.repeatRate).toBe(0);
    expect(stats.topProducts).toEqual([]);
    expect(Array.isArray(stats.stockAlerts)).toBe(true);
  });
});

describe("percentChange", () => {
  it("rounds to one decimal place", () => {
    expect(percentChange(150, 100)).toBe(50);
    expect(percentChange(110, 100)).toBe(10);
    expect(percentChange(100, 333)).toBe(-70);
  });

  it("has no answer without a baseline", () => {
    expect(percentChange(50, 0)).toBeNull();
    expect(percentChange(0, -5)).toBeNull();
  });
});

describe("stockAlertsFor", () => {
  it("lists only products at or below their reorder point", () => {
    const business = {
      ...BIO,
      products: [
        { ...BIO.products[0], id: "low", stock: 1, stockLow: 5 },
        { ...BIO.products[0], id: "ok", stock: 400, stockLow: 30 },
      ],
    };
    const alerts = stockAlertsFor(business);
    expect(alerts.map((a) => a.id)).toEqual(["low"]);
  });
});

describe("filterCustomers", () => {
  const customers = summarizeStation(
    BIO,
    [
      makeOrder({ id: "1", customerName: "Jane Wanjiku", customerPhone: "0712345678", placedAt: "2026-09-21T10:00:00Z" }),
      makeOrder({ id: "2", customerName: "Omondi Ochieng", customerPhone: "0722111222", placedAt: "2026-01-05T10:00:00Z" }),
    ],
    resolveDateRange("all", NOW),
    NOW
  ).customers;

  it("filters by name, phone and area", () => {
    expect(filterCustomers(customers, { query: "jane" })).toHaveLength(1);
    expect(filterCustomers(customers, { query: "0722 111 222" })).toHaveLength(1);
    expect(filterCustomers(customers, { query: "kasarani" })).toHaveLength(2);
  });

  it("filters by segment", () => {
    expect(filterCustomers(customers, { segment: "dormant" })).toHaveLength(1);
    expect(filterCustomers(customers, { segment: "all" })).toHaveLength(2);
  });

  it("matches nothing for an unrelated search", () => {
    expect(filterCustomers(customers, { query: "zzzz" })).toHaveLength(0);
  });
});

describe("summarizeStation order input", () => {
  it("ignores an order with an unparseable placedAt", () => {
    const orders: Order[] = [makeOrder({ id: "bad", placedAt: "not-a-date" })];
    const stats = summarizeStation(BIO, orders, resolveDateRange("30d", NOW), NOW);
    expect(stats.orderCount).toBe(0);
  });
});
