"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Clock, MapPin, PackageCheck, Plus, Recycle, Wallet } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { EmptyState } from "@/components/ui/feedback";
import { useCustomer } from "@/components/order/customer-provider";
import { fetchOrders } from "@/lib/orders";
import { formatKES } from "@/lib/format";
import type { Order } from "@/lib/types";

export function AccountPage() {
  const { profile } = useCustomer();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchOrders(profile.phone ? { phone: profile.phone } : {}).then((o) => {
      if (!alive) return;
      setOrders(o);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [profile.phone]);

  const name = profile.name || "Customer";
  const firstName = name.split(" ")[0];
  const inFlight = orders.filter((o) => ["pending", "accepted", "out_for_delivery"].includes(o.status));
  const delivered = orders.filter((o) => o.status === "delivered");
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <Container className="py-14 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success animate-pulse-dot" /> Signed in
          </p>
          <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
            Habari, {firstName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile.phone && <span className="font-medium text-foreground">{profile.phone}</span>}
            {" · "}Manage your refills from one place.
          </p>
        </div>
        <Link href="/browse">
          <Button className="group">
            Order water
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: PackageCheck, label: "Active orders", value: String(inFlight.length) },
          { icon: Recycle, label: "Cans delivered", value: String(delivered.reduce((s, o) => s + o.items.reduce((x, i) => x + i.quantity, 0), 0)) },
          { icon: Wallet, label: "Total spent", value: formatKES(totalSpent) },
          { icon: Clock, label: "Orders placed", value: String(orders.length) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#0052FF]/10 text-[#0052FF]">
              <s.icon className="size-4.5" aria-hidden />
            </span>
            <p className="mt-3 font-display text-2xl text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground">Recent orders</h2>
            <Link href="/account/orders" className="text-sm font-semibold text-[#0052FF] hover:underline">
              View all →
            </Link>
          </div>
          {!loaded ? (
            <div className="mt-4 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={<PackageCheck className="size-7" aria-hidden />}
                title="No orders yet"
                description="Once you place your first order it shows up here with live tracking."
                action={
                  <Link href="/browse">
                    <Button>Find your station</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {orders.slice(0, 4).map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/order/${o.id}`}
                    className="block rounded-2xl border border-border bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-layered"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                          {o.orderNumber} · {o.businessName}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {o.items.map((i) => `${i.quantity} × ${i.name}`).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg text-foreground">{formatKES(o.total)}</p>
                        <OrderStatusBadge status={o.status} className="mt-1" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Saved addresses */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground">Saved addresses</h2>
            <Link href="/account/addresses" className="text-sm font-semibold text-[#0052FF] hover:underline">
              Manage →
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {profile.addresses.length === 0 ? (
              <Link
                href="/account/addresses"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-white p-8 text-center transition-colors hover:border-[#0052FF]/40"
              >
                <Plus className="size-6 text-muted-foreground" aria-hidden />
                <p className="text-sm font-medium text-muted-foreground">
                  No saved addresses yet
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Save your estate and building for one-tap reordering.
                </p>
              </Link>
            ) : (
              profile.addresses.slice(0, 3).map((a, i) => (
                <div key={i} className="rounded-2xl border border-border bg-white p-5 shadow-card">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-[#0052FF]" aria-hidden />
                    <p className="text-sm font-semibold text-foreground">
                      {a.estate}
                      {a.building && <span className="font-normal text-muted-foreground"> · {a.building}</span>}
                    </p>
                  </div>
                  {a.floor && <p className="mt-1 text-xs text-muted-foreground">{a.floor}</p>}
                </div>
              ))
            )}
          </div>

          {/* Reorder shortcut */}
          {orders.length > 0 && (
            <div className="mt-6 rounded-2xl border border-[#0052FF]/20 bg-[#0052FF]/5 p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#0052FF]">
                Quick reorder
              </p>
              <p className="mt-1.5 text-sm text-foreground/85">
                Your last order was{" "}
                <strong className="font-semibold">{orders[0].items.map((i) => `${i.quantity} × ${i.name}`).join(", ")}</strong>{" "}
                from {orders[0].businessName}.
              </p>
              <Link href={`/order/${orders[0].id}`} className="mt-3 inline-flex">
                <Button variant="outline" size="sm" className="group">
                  Reorder — {formatKES(orders[0].total)}
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}