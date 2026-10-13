/**
 * Cart pricing, shared by the cart and checkout screens.
 *
 * Delivery is charged per station: every station becomes its own order, so each
 * one applies its free-delivery threshold to the subtotal of the items coming
 * from that station alone. Computing it per station is what keeps the fee shown
 * in the cart identical to the fee the order is created with at checkout.
 */

export interface CartLineLike {
  businessId: string;
  quantity: number;
  unitPrice: number;
}

export interface StationFeeInfo {
  id: string;
  deliveryFee: number;
  freeDeliveryAbove: number;
}

export interface StationGroup {
  businessId: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface CartTotals {
  subtotal: number;
  deliveryFee: number;
  total: number;
  /** Per-station breakdown, in the order the stations first appear. */
  groups: StationGroup[];
}

/** Money is compared to the cent, so totals do not drift on floats. */
const rands = (value: number) => Math.round(value * 100) / 100;

export function lineSubtotal(unitPrice: number, quantity: number): number {
  return rands(unitPrice * quantity);
}

/**
 * Fee for one station's own subtotal. Free once the subtotal reaches the
 * station's threshold; an empty group is never charged.
 */
export function deliveryFeeForStation(
  stationSubtotal: number,
  station: Pick<StationFeeInfo, "deliveryFee" | "freeDeliveryAbove">
): number {
  if (stationSubtotal <= 0) return 0;
  return stationSubtotal >= station.freeDeliveryAbove ? 0 : station.deliveryFee;
}

export function computeCartTotals(
  lines: CartLineLike[],
  stations: readonly StationFeeInfo[]
): CartTotals {
  const stationById = new Map(stations.map((station) => [station.id, station]));

  const byStation = new Map<string, number>();
  for (const line of lines) {
    const running = byStation.get(line.businessId) ?? 0;
    byStation.set(line.businessId, rands(running + lineSubtotal(line.unitPrice, line.quantity)));
  }

  const groups: StationGroup[] = [];
  let subtotal = 0;
  let deliveryFee = 0;

  for (const [businessId, stationSubtotal] of byStation) {
    const station = stationById.get(businessId);
    const fee = station ? deliveryFeeForStation(stationSubtotal, station) : 0;
    groups.push({
      businessId,
      subtotal: stationSubtotal,
      deliveryFee: fee,
      total: rands(stationSubtotal + fee),
    });
    subtotal = rands(subtotal + stationSubtotal);
    deliveryFee = rands(deliveryFee + fee);
  }

  return { subtotal, deliveryFee, total: rands(subtotal + deliveryFee), groups };
}
