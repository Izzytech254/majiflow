import type { Metadata } from "next";
import { Calistoga, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const calistoga = Calistoga({
  variable: "--font-calistoga",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "MajiFlow — Clean water, delivered simply",
    template: "%s · MajiFlow",
  },
  description:
    "Order clean, affordable drinking water from trusted refill stations near you — or run your refill business on Kenya's water-commerce platform.",
  keywords: [
    "water delivery Kenya",
    "refill water Nairobi",
    "M-Pesa water order",
    "SaaS water business",
  ],
  openGraph: {
    title: "MajiFlow — Clean water, delivered simply",
    description:
      "Order clean, affordable drinking water from trusted refill stations near you.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${calistoga.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}