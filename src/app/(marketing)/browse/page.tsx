import { BrowsePage } from "@/components/marketing/browse-page";

export const metadata = {
  title: "Browse stations",
  description:
    "Search and compare water refill stations across Kenya by city, estate, price and delivery fee.",
};

interface PageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function Browse({ searchParams }: PageProps) {
  const { city } = await searchParams;
  return <BrowsePage initialCity={city ?? ""} />;
}