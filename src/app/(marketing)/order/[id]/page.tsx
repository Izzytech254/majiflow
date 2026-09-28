import { TrackOrderPage } from "@/components/order/track-order";

export const metadata = { title: "Track your order" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderTrack({ params }: PageProps) {
  const { id } = await params;
  return <TrackOrderPage id={id} />;
}