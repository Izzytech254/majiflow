import { Container } from "@/components/ui/container";
import { WaterLoader } from "@/components/ui/water-loader";

export default function Loading() {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-24">
      <WaterLoader label="Loading" />
    </Container>
  );
}
