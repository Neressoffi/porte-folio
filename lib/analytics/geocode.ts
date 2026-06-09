const geocodeCache = new Map<string, string>();

function sanitizeText(raw: string | null | undefined, max = 80) {
  const value = raw?.replace(/\s+/g, " ").trim().slice(0, max) ?? "";
  return value || "";
}

function pickCityFromAddress(address: Record<string, string | undefined>) {
  const locality =
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.suburb ??
    address.county;

  return buildCityLabel([locality, address.state, address.country]);
}

function buildCityLabel(parts: Array<string | undefined>) {
  return sanitizeText(parts.filter(Boolean).join(", "));
}

function cacheKey(latitude: number, longitude: number) {
  return `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
}

export async function reverseGeocodeCity(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }

  const key = cacheKey(latitude, longitude);
  const cached = geocodeCache.get(key);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      format: "json",
      "accept-language": "fr",
      zoom: "10",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        signal: AbortSignal.timeout(6000),
        cache: "no-store",
        headers: {
          "User-Agent": "Folio2026-Portfolio-Analytics/1.0 (contact@portfolio.local)",
        },
      },
    );

    if (!response.ok) return null;

    const data = (await response.json()) as {
      address?: Record<string, string | undefined>;
    };

    const city = data.address ? pickCityFromAddress(data.address) : "";
    if (!city) return null;

    geocodeCache.set(key, city);
    return city;
  } catch {
    return null;
  }
}

export { buildCityLabel, sanitizeText };
