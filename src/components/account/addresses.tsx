"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { useCustomer } from "@/components/order/customer-provider";
import { useToast } from "@/components/ui/toast";
import { ESTATES } from "@/lib/constants";

export function AddressesPage() {
  const { profile, addAddress, removeAddress, setDefaultAddress } = useCustomer();
  const { toast } = useToast();
  const [estate, setEstate] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estate.trim()) return;
    addAddress({ label: "Home", estate: estate.trim(), building: building.trim() || undefined, floor: floor.trim() || undefined, phone: profile.phone });
    toast({ kind: "success", title: "Address saved", message: `${estate.trim()} is now available at checkout.` });
    setEstate("");
    setBuilding("");
    setFloor("");
  };

  return (
    <Container className="py-6 lg:py-8">
      <div className="mb-6">
        <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <MapPin className="size-3.5 text-[#0052FF]" aria-hidden /> Saved addresses
        </p>
        <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">Delivery locations</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={submit} className="h-fit rounded-2xl border border-border bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
            <Plus className="size-5 text-[#0052FF]" aria-hidden /> Add an address
          </h2>
          <div className="mt-5 space-y-5">
            <Field label="Estate / area" required>
              <Input
                required
                list="estate-options"
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
                placeholder="e.g. South B, Nyali, Milimani…"
              />
            </Field>
            <datalist id="estate-options">
              {ESTATES.map((e) => (
                <option key={e} value={e} />
              ))}
            </datalist>
            <Field label="Building / apartment">
              <Input value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="e.g. Singa Court, Block B" />
            </Field>
            <Field label="Floor / apt no.">
              <Input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="e.g. 3rd floor, Unit 12" />
            </Field>
            <Button type="submit" size="lg" className="w-full group">
              Save address
              <Plus className="size-4" aria-hidden />
            </Button>
          </div>
        </form>

        <div>
          <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
            Your saved places
          </h2>
          {profile.addresses.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={<MapPin className="size-7" aria-hidden />}
                title="No saved addresses"
                description="Add your estate and building to make checkout a two-tap job."
              />
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {profile.addresses.map((a, i) => (
                <li key={i} className="rounded-2xl border border-border bg-white p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-[#0052FF]" aria-hidden />
                        <p className="font-semibold text-foreground">
                          {a.estate}
                          {a.label !== "Home" && (
                            <span className="ml-1 font-mono text-[10px] uppercase text-muted-foreground">· {a.label}</span>
                          )}
                        </p>
                      </div>
                      {(a.building || a.floor) && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {[a.building, a.floor].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeAddress(i)}
                      aria-label={`Remove address in ${a.estate}`}
                      className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger-soft hover:text-danger"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                  {i !== profile.defaultAddressIndex && (
                    <button
                      onClick={() => {
                        setDefaultAddress(i);
                        toast({ kind: "info", title: "Default changed", message: `${a.estate} is now your default delivery address.` });
                      }}
                      className="mt-3 text-xs font-semibold text-[#0052FF] hover:underline"
                    >
                      Make default
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}