import { BrowsePage } from "@/components/marketing/browse-page";

interface PageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function Browse({ searchParams }: PageProps) {
  const { city } = await searchParams;
  return <BrowsePage initialCity={city ?? ""} />;
}