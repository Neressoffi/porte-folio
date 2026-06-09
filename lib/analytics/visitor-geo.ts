export type LocationSource = "edge" | "ip";

export type VisitorGeo = {
  ip: string;
  city: string;
  company: string;
  source: LocationSource;
};

export const VISITOR_GEO_SESSION_KEY = "folio-visitor-geo-v3";

export function readVisitorGeoFromSession(): VisitorGeo | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(VISITOR_GEO_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<VisitorGeo>;
    if (!parsed.ip || !parsed.city || !parsed.company || !parsed.source) return null;
    return {
      ip: parsed.ip,
      city: parsed.city,
      company: parsed.company,
      source: parsed.source,
    };
  } catch {
    return null;
  }
}

/** Géolocalisation silencieuse — aucune permission navigateur requise. */
export async function resolveVisitorGeoFromBrowser(): Promise<VisitorGeo | null> {
  const cached = readVisitorGeoFromSession();
  if (cached) return cached;

  try {
    const response = await fetch("/api/analytics/geo", { cache: "no-store" });
    if (!response.ok) return null;

    const data = (await response.json()) as Partial<VisitorGeo>;
    if (!data.ip || !data.city || !data.company || !data.source) return null;

    const geo: VisitorGeo = {
      ip: data.ip,
      city: data.city,
      company: data.company,
      source: data.source,
    };

    sessionStorage.setItem(VISITOR_GEO_SESSION_KEY, JSON.stringify(geo));
    return geo;
  } catch {
    return null;
  }
}
