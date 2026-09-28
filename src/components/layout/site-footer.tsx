import Link from "next/link";
import { MessageCircle, Mail, MapPin, Phone, Send, AtSign, Globe } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { Container } from "@/components/ui/container";

const customerLinks = [
  { href: "/how-it-works", label: "How ordering works" },
  { href: "/browse", label: "Browse businesses" },
  { href: "/register", label: "Create an account" },
  { href: "/cart", label: "Your cart" },
  { href: "/faqs", label: "Customer FAQs" },
];

const businessLinks = [
  { href: "/for-business", label: "Why MajiFlow" },
  { href: "/business/register", label: "Register your business" },
  { href: "/pricing", label: "Plans & pricing" },
  { href: "/business/demo", label: "Live dashboard demo" },
  { href: "/faqs#businesses", label: "Business FAQs" },
];

const companyLinks = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms of service" },
  { href: "/privacy", label: "Privacy policy" },
];

const cities = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Machakos"];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-ink text-slate-300">
      <Container className="pb-24 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <BrandMark dark />
            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              The platform connecting Kenyan homes to trustworthy water refill stations — and
              equipping those businesses with everything they need to grow online.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { icon: MessageCircle, label: "WhatsApp support" },
                { icon: Send, label: "Telegram" },
                { icon: AtSign, label: "Instagram" },
                { icon: Globe, label: "Website" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all duration-200 hover:border-[#4D7CFF]/50 hover:bg-[#0052FF]/20 hover:text-white"
                >
                  <s.icon className="size-4.5" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Customers" links={customerLinks} />
          <FooterCol title="Businesses" links={businessLinks} />
          <FooterCol title="Company" links={companyLinks} />
        </div>

        <div className="mt-14 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Serving these towns
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link
                  key={c}
                  href="/browse"
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-slate-400 transition-colors hover:border-[#4D7CFF]/50 hover:text-white"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-[#4D7CFF]" aria-hidden /> Bishop Magua Centre, Nairobi
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-[#4D7CFF]" aria-hidden /> +254 700 123 456
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-[#4D7CFF]" aria-hidden /> hello@majiflow.co.ke
              </li>
            </ul>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Built for Kenya
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              M-Pesa-ready payments, Kiswahili-friendly UX and delivery everywhere from Kasarani to
              Nyali. Each refill station operates independently — MajiFlow is their storefront and
              back office, never their water.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {year} MajiFlow Kenya. Clean water, delivered simply.</p>
          <p className="font-mono uppercase tracking-widest">
            M-Pesa · SMS · WhatsApp · Maps ready
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}