import { NextResponse } from "next/server";
import { getPublicStationBySlug } from "@/lib/server/station-publication";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const station = await getPublicStationBySlug(slug);
  if (!station) {
    return NextResponse.json({ error: "Station not found" }, { status: 404 });
  }
  return NextResponse.json(station);
}
