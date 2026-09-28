import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Droplets } from "lucide-react";
import nightWater from "@/assets/images/backdrops/night-water.webp";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Stagger, StaggerItem } from "@/components/ui/animated-section";

const stats = [
  { value: "2.8M+", label: "Cans delivered through the platform", delta: true, up: true },
  { value: "34%", label: "Average revenue growth for online stations", delta: true, up: true },
  { value: "68%", label: "Repeat rate from subscribed customers", delta: true, up: true },
  { value: "98.2%", label: "Orders delivered within the service window", delta: true, up: true },
];

export function DarkStats() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-32">
      <Image
        src={nightWater}
        alt=""
        fill
        sizes="100vw"
        aria-hidden
        className="pointer-events-none scale-110 object-cover opacity-25 blur-3xl"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 size-[30rem] -translate-y-1/2 rounded-full bg-[#0052FF]/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 size-[26rem] rounded-full bg-[#4D7CFF]/15 blur-[110px]"
      />

      <Container className="relative">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel tone="dark" pulse>
              The network in numbers
            </SectionLabel>
            <h2 className="mt-4 font-display text-3xl leading-[1.12] sm:text-4xl md:text-[2.75rem]">
              Water is local. <span className="text-gradient">We're everywhere it matters.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            Metrics across the station network — from Kasarani's refill shops to Nyali's office
            water plans. Updated monthly, shared openly.
          </p>
        </div>

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <div className="flex h-full flex-col justify-between gap-10 bg-ink p-7 transition-colors duration-300 hover:bg-ink-soft">
                <Droplets className="size-6 text-[#4D7CFF]/60" aria-hidden />
                <div>
                  <p className="font-display text-4xl tracking-tight text-white">{s.value}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-sm text-slate-400">{s.label}</p>
                    {s.delta && (
                      <span className={`inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold ${s.up ? "text-success" : "text-danger"}`}>
                        {s.up ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}
                        2026 YTD
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}