import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MarketingTabBar } from "@/components/layout/marketing-tab-bar";
import { PageTransition } from "@/components/layout/page-transition";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-20 lg:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <MarketingTabBar />
    </div>
  );
}