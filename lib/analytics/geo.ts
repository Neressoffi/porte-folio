import { buildCityLabel, sanitizeText } from "./geocode";

export type LocationSource = "edge" | "ip";

export type IpLocation = {
  city: string;
  company: string;
};

export type ClientLocation = IpLocation & {
  effectiveIp: string;
  source: LocationSource;
};

export type ClientGeoHint = {
  ip?: string;
  city?: string;
  company?: string;
};

const locationCache = new Map<string, IpLocation>();

type NetworkInfo = {
  effectiveIp: string;
  company: string;
  ipCity?: string;
};

function sanitizeCompany(raw: string | null | undefined) {
  const value = sanitizeText(raw, 120);
  if (!value) return "";

  return value
    .replace(/^AS\d+\s+/i, "")
    .replace(/\s*AS\d+\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function isValidNetworkInfo(location: NetworkInfo | null | undefined) {
  return Boolean(location?.effectiveIp && location?.company);
}

function parseIpApiNetwork(
  data: {
    status?: string;
    query?: string;
    city?: string;
    regionName?: string;
    country?: string;
    org?: string;
    isp?: string;
  },
  fallbackIp: string,
): NetworkInfo | null {
  if (data.status !== "success" || !data.query) return null;

  return {
    effectiveIp: sanitizeText(data.query, 45) || fallbackIp,
    company: sanitizeCompany(data.org || data.isp),
    ipCity: buildCityLabel([data.city, data.regionName, data.country]),
  };
}

function expandCountry(code: string | undefined) {
  if (!code || code.length !== 2) return code;
  try {
    const region = new Intl.DisplayNames(["fr"], { type: "region" });
    return region.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function parseIpInfoNetwork(
  data: {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    org?: string;
  },
  fallbackIp: string,
): NetworkInfo | null {
  if (!data.ip) return null;

  const country = data.country?.length === 2 ? expandCountry(data.country) : data.country;

  return {
    effectiveIp: sanitizeText(data.ip, 45) || fallbackIp,
    company: sanitizeCompany(data.org),
    ipCity: buildCityLabel([data.city, data.region, country]),
  };
}

function mergeNetworkResults(
  ipApi: NetworkInfo | null,
  ipInfo: NetworkInfo | null,
): NetworkInfo | null {
  if (!ipApi && !ipInfo) return null;

  return {
    effectiveIp: ipApi?.effectiveIp ?? ipInfo!.effectiveIp,
    company: ipApi?.company || ipInfo?.company || "",
    ipCity: ipInfo?.ipCity || ipApi?.ipCity,
  };
}

function getCityFromHeaders(request: Request) {
  const candidates = [
    request.headers.get("x-vercel-ip-city"),
    request.headers.get("cf-ipcity"),
    request.headers.get("x-real-ip-city"),
  ];

  for (const candidate of candidates) {
    const city = sanitizeText(candidate);
    if (!city) continue;

    const country =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry");

    if (country && country.length <= 3) {
      return `${city}, ${country.toUpperCase()}`;
    }

    return city;
  }

  return null;
}

export function isLocalOrUnknownIp(ip: string) {
  return ip === "Localhost" || ip === "Inconnue";
}

export function seedLocationCache(entries: Record<string, IpLocation>) {
  for (const [ip, location] of Object.entries(entries)) {
    if (location.city && location.company) {
      locationCache.set(ip, location);
    }
  }
}

async function fetchIpApiNetwork(ip?: string) {
  const path = ip
    ? `${encodeURIComponent(ip)}?fields=status,query,city,regionName,country,org,isp`
    : `?fields=status,query,city,regionName,country,org,isp`;

  try {
    const response = await fetch(`http://ip-api.com/json/${path}`, {
      signal: AbortSignal.timeout(4500),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      status?: string;
      query?: string;
      city?: string;
      regionName?: string;
      country?: string;
      org?: string;
      isp?: string;
    };

    return parseIpApiNetwork(data, ip ?? "Inconnue");
  } catch {
    return null;
  }
}

async function fetchIpInfoNetwork(ip: string) {
  try {
    const response = await fetch(`https://ipinfo.io/${encodeURIComponent(ip)}/json`, {
      signal: AbortSignal.timeout(4500),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      ip?: string;
      city?: string;
      region?: string;
      country?: string;
      org?: string;
    };

    return parseIpInfoNetwork(data, ip);
  } catch {
    return null;
  }
}

async function fetchPublicIp() {
  try {
    const response = await fetch("https://api.ipify.org?format=json", {
      signal: AbortSignal.timeout(3500),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { ip?: string };
    return sanitizeText(data.ip, 45) || null;
  } catch {
    return null;
  }
}

async function resolveNetworkInfo(requestIp: string) {
  if (isLocalOrUnknownIp(requestIp)) {
    const ipApi = await fetchIpApiNetwork();
    const ip = ipApi?.effectiveIp ?? (await fetchPublicIp()) ?? "Inconnue";
    const ipInfo = await fetchIpInfoNetwork(ip);
    return mergeNetworkResults(ipApi, ipInfo);
  }

  const cached = locationCache.get(requestIp);
  if (cached?.company) {
    return {
      effectiveIp: requestIp,
      company: cached.company,
      ipCity: cached.city,
    };
  }

  const [ipApi, ipInfo] = await Promise.all([
    fetchIpApiNetwork(requestIp),
    fetchIpInfoNetwork(requestIp),
  ]);

  return mergeNetworkResults(ipApi, ipInfo);
}

export async function getClientLocation(
  request: Request,
  ip: string,
): Promise<ClientLocation | null> {
  const network = await resolveNetworkInfo(ip);
  if (!isValidNetworkInfo(network)) return null;

  const headerCity = getCityFromHeaders(request);
  const city = headerCity || network.ipCity;
  if (!city) return null;

  const location: ClientLocation = {
    effectiveIp: network.effectiveIp,
    city,
    company: network.company,
    source: headerCity ? "edge" : "ip",
  };

  locationCache.set(location.effectiveIp, {
    city: location.city,
    company: location.company,
  });

  return location;
}
