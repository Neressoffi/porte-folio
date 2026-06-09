import { NextResponse } from "next/server";

import { getClientLocation } from "@/lib/analytics/geo";
import { getClientIp } from "@/lib/analytics/ip";

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const location = await getClientLocation(request, ip);

    if (!location) {
      return NextResponse.json(
        { error: "Géolocalisation indisponible." },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ip: location.effectiveIp,
      city: location.city,
      company: location.company,
      source: location.source,
    });
  } catch (error) {
    console.error("[analytics/geo]", error);
    return NextResponse.json(
      { error: "Impossible de récupérer la géolocalisation." },
      { status: 500 },
    );
  }
}
