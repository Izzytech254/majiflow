import { Hero } from "@/components/home/hero";
import { OrderTypeBar } from "@/components/home/order-type-bar";
import { PromotionsStrip } from "@/components/home/promotions-strip";
import { BrowseCategories } from "@/components/home/browse-categories";
import { GiftBanner } from "@/components/home/gift-banner";
import { AppDownload } from "@/components/home/app-download";
import { VendorBanner } from "@/components/home/vendor-banner";
import { SiteFooter } from "@/components/layout/site-footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <OrderTypeBar />
      <PromotionsStrip />
      <BrowseCategories />
      <GiftBanner />
      <AppDownload />
      <VendorBanner />
      <SiteFooter />
    </>
  );
}
