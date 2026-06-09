import { NextResponse } from "next/server";

import { getClientLocation } from "@/lib/analytics/geo";
import { getClientIp } from "@/lib/analytics/ip";
import { isValidVisitorId, trackAnalyticsEvent } from "@/lib/analytics/store";
import { isAnalyticsZoneId } from "@/lib/analytics/zones";

import type { AnalyticsEventType } from "@/lib/analytics/types";

type TrackPayload = {
  visitorId?: string;
  zoneId?: string;
  type?: AnalyticsEventType;
  label?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TrackPayload;
    const visitorId = body.visitorId ?? "";
    const zoneId = body.zoneId ?? "";
    const type = body.type;

    if (
      !isValidVisitorId(visitorId) ||
      !isAnalyticsZoneId(zoneId) ||
      (type !== "view" && type !== "click")
    ) {
      return NextResponse.json({ error: "Événement invalide." }, { status: 400 });
    }

    const ip = getClientIp(request);
    const location = await getClientLocation(request, ip);

    if (!location) {
      return NextResponse.json(
        { error: "Géolocalisation indisponible — événement non enregistré." },
        { status: 503 },
      );
    }

    await trackAnalyticsEvent({
      visitorId,
      zoneId,
      type,
      label: body.label,
      ip: location.effectiveIp,
      city: location.city,
      company: location.company,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[analytics/track]", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer l'événement." },
      { status: 500 },
    );
  }
}
