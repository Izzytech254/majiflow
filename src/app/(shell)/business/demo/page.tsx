import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { DashboardOverview } from "@/components/business/dashboard-overview";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Dashboard demo" };

export default function BusinessDemo() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#0052FF]/25 bg-[#0052FF]/5 p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-accent">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-display text-lg text-foreground">You're viewing the live demo</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              This is real sample data for BioWater Refill Station, Kasarani. Click around — accepting
              orders, hiding products and pausing promotions all work.
            </p>
          </div>
        </div>
        <Link href="/business/register">
          <Button className="group">
            Create my station
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </Link>
      </div>
      <DashboardOverview />
    </div>
  );
}