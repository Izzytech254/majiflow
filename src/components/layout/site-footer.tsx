import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-white text-foreground">
      <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <BrandMark />
          </div>

          <p className="text-sm text-foreground/70">
            Prices, availability and delivery areas vary by station
          </p>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link href="/browse" className="hover:underline">Menu</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
          </nav>

          <p className="text-sm text-foreground/60">© {year} Majiflow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
