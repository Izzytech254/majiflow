"use client";

import { Clock4, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STAFF = [
  { id: "s1", name: "Grace Mwangi", role: "Owner", phone: "+254 712 000 001", access: "Everything", online: true },
  { id: "s2", name: "Kevin Baraka", role: "Rider", phone: "+254 712 000 002", access: "Orders + delivery", online: true },
  { id: "s3", name: "Esther Wambui", role: "Assistant", phone: "+254 712 000 003", access: "Orders only", online: false },
];

export function BusinessStaff() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-foreground sm:text-3xl">Staff & access</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Riders and assistants get limited logins — you stay in control.
          </p>
        </div>
        <Button className="group">Invite staff</Button>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
        <ul className="divide-y divide-border">
          {STAFF.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-muted/30">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted font-display text-sm text-foreground">
                {s.name.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{s.name}</p>
                  <Badge variant={s.access === "Everything" ? "accent" : "softAccent"}>{s.role}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {s.phone} · {s.access}
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={s.online ? "size-1.5 rounded-full bg-success" : "size-1.5 rounded-full bg-muted-foreground/40"} />
                {s.online ? "Online" : "Offline"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 font-display text-lg text-foreground">
            <Lock className="size-5 text-[#0052FF]" aria-hidden /> Role permissions
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex justify-between"><span>Rider</span><span className="font-mono text-xs">accept, deliver, update status</span></li>
            <li className="flex justify-between"><span>Assistant</span><span className="font-mono text-xs">orders, products, customers</span></li>
            <li className="flex justify-between"><span>Owner</span><span className="font-mono text-xs">everything incl. billing</span></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-warning/25 bg-warning-soft/50 p-5">
          <div className="flex items-start gap-3">
            <Clock4 className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
            <div className="text-sm leading-relaxed text-foreground/85">
              <strong className="font-semibold text-foreground">Staff management is out of scope for this build.</strong>{" "}
              This page previews the data model and UX. In production, invites land as SMS PINs so no
              passwords to remember.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}