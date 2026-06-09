import { promises as fs } from "fs";
import path from "path";

import {
  ANALYTICS_ZONE_IDS,
  ANALYTICS_ZONES,
  isAnalyticsZoneId,
  type AnalyticsZoneId,
} from "./zones";
import { seedLocationCache } from "./geo";

import type {
  AnalyticsData,
  AnalyticsEventType,
  AnalyticsStats,
  LiveVisitorEntry,
  StoredAnalyticsEvent,
  VisitorHourBucket,
  VisitorMovement,
  ZoneMetrics,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");
const MAX_EVENTS = 4000;
const MAX_VISITOR_HOURS = 72;
const LIVE_WINDOW_MS = 30 * 60 * 1000;
const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

function emptyZoneMetrics() {
  return ANALYTICS_ZONE_IDS.reduce(
    (acc, zoneId) => {
      acc[zoneId] = { views: 0, clicks: 0 };
      return acc;
    },
    {} as AnalyticsData["zones"],
  );
}

function defaultAnalyticsData(): AnalyticsData {
  return {
    zones: emptyZoneMetrics(),
    clickLabels: {},
    dailyViews: {},
    events: [],
    visitors: {},
    ipLocations: {},
    updatedAt: new Date().toISOString(),
  };
}

async function readAnalyticsFile(): Promise<AnalyticsData> {
  try {
    const raw = await fs.readFile(ANALYTICS_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<AnalyticsData>;
    const data = defaultAnalyticsData();

    for (const zoneId of ANALYTICS_ZONE_IDS) {
      const existing = parsed.zones?.[zoneId];
      if (existing) {
        data.zones[zoneId] = {
          views: existing.views ?? 0,
          clicks: existing.clicks ?? 0,
          lastViewAt: existing.lastViewAt,
          lastClickAt: existing.lastClickAt,
        };
      }
    }

    data.clickLabels = parsed.clickLabels ?? {};
    data.dailyViews = parsed.dailyViews ?? {};
    data.events = Array.isArray(parsed.events)
      ? parsed.events.map((event) => ({
          ...event,
          ip: event.ip ?? "Inconnue",
          city: event.city ?? "Inconnue",
          company: event.company ?? "Inconnue",
        }))
      : [];
    data.visitors = Object.fromEntries(
      Object.entries(parsed.visitors ?? {}).map(([id, visitor]) => [
        id,
        {
          firstSeen: visitor.firstSeen,
          lastSeen: visitor.lastSeen,
          ip: visitor.ip ?? "Inconnue",
          city: visitor.city ?? "Inconnue",
          company: visitor.company ?? "Inconnue",
          movements: visitor.movements ?? 0,
        },
      ]),
    );
    data.ipLocations = parsed.ipLocations ?? {};
    if (Object.keys(data.ipLocations).length === 0 && parsed.ipCities) {
      for (const [ip, city] of Object.entries(parsed.ipCities)) {
        data.ipLocations[ip] = { city, company: "Inconnue" };
      }
    }
    seedLocationCache(data.ipLocations);
    data.updatedAt = parsed.updatedAt ?? data.updatedAt;

    return data;
  } catch {
    return defaultAnalyticsData();
  }
}

async function writeAnalyticsFile(data: AnalyticsData) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  data.updatedAt = new Date().toISOString();
  await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function sanitizeClickLabel(label?: string) {
  const cleaned = label?.replace(/\s+/g, " ").trim().slice(0, 80);
  return cleaned || "Interaction";
}

export function isValidVisitorId(visitorId: string) {
  return /^[0-9a-f-]{8,64}$/i.test(visitorId);
}

export function formatVisitorLabel(visitorId: string, city?: string) {
  const short = visitorId.replace(/-/g, "").slice(0, 4).toUpperCase();
  if (city) {
    const cityName = city.split(",")[0]?.trim();
    if (cityName) return `${cityName} · ${short}`;
  }
  return `Session ${short}`;
}

function resolveStoredGeo(
  ip: string,
  city: string | undefined,
  company: string | undefined,
  ipLocations: AnalyticsData["ipLocations"],
) {
  const cached = ipLocations[ip];
  return {
    city: city && city !== "Inconnue" ? city : cached?.city ?? city ?? "—",
    company:
      company && company !== "Inconnue" ? company : cached?.company ?? company ?? "—",
  };
}

function formatHourLabel(hourKey: string) {
  const date = new Date(`${hourKey}:00:00.000Z`);
  return date.toLocaleString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
  });
}

function formatTimeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function trimEvents(events: StoredAnalyticsEvent[]) {
  if (events.length <= MAX_EVENTS) return events;
  return events.slice(events.length - MAX_EVENTS);
}

function buildVisitorHours(
  events: StoredAnalyticsEvent[],
  visitorRegistry: AnalyticsData["visitors"],
  ipLocations: AnalyticsData["ipLocations"],
): VisitorHourBucket[] {
  const buckets = new Map<string, Map<string, StoredAnalyticsEvent[]>>();

  for (const event of events) {
    const hourKey = event.createdAt.slice(0, 13);
    if (!buckets.has(hourKey)) {
      buckets.set(hourKey, new Map());
    }

    const visitorsInHour = buckets.get(hourKey)!;
    if (!visitorsInHour.has(event.visitorId)) {
      visitorsInHour.set(event.visitorId, []);
    }

    visitorsInHour.get(event.visitorId)!.push(event);
  }

  return Array.from(buckets.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, MAX_VISITOR_HOURS)
    .map(([hourKey, visitorsInHour]) => {
      const visitors = Array.from(visitorsInHour.entries())
        .map(([visitorId, visitorEvents]) => {
          const sorted = [...visitorEvents].sort((a, b) =>
            a.createdAt.localeCompare(b.createdAt),
          );

          const eventIp = visitorRegistry[visitorId]?.ip ?? sorted[0]?.ip ?? "Inconnue";
          const geo = resolveStoredGeo(
            eventIp,
            sorted[0]?.city ?? visitorRegistry[visitorId]?.city,
            sorted[0]?.company ?? visitorRegistry[visitorId]?.company,
            ipLocations,
          );

          const movements: VisitorMovement[] = sorted.map((event) => {
            const movementGeo = resolveStoredGeo(
              event.ip,
              event.city,
              event.company,
              ipLocations,
            );

            return {
              at: event.createdAt,
              timeLabel: formatTimeLabel(event.createdAt),
              type: event.type,
              actionLabel: event.type === "view" ? "Consultation" : "Clic",
              zoneLabel: ANALYTICS_ZONES[event.zoneId].label,
              city: movementGeo.city,
              company: movementGeo.company,
              detail: event.type === "click" ? event.label : undefined,
            };
          });

          return {
            visitorId,
            visitorLabel: formatVisitorLabel(visitorId, geo.city),
            ip: eventIp,
            city: geo.city,
            company: geo.company,
            firstSeen: sorted[0].createdAt,
            lastSeen: sorted[sorted.length - 1].createdAt,
            movements,
          };
        })
        .sort((a, b) => a.firstSeen.localeCompare(b.firstSeen));

      const movementCount = visitors.reduce(
        (sum, visitor) => sum + visitor.movements.length,
        0,
      );

      return {
        hourKey,
        hourLabel: formatHourLabel(hourKey),
        visitorCount: visitors.length,
        movementCount,
        visitors,
      };
    });
}

function buildLiveVisitors(
  events: StoredAnalyticsEvent[],
  visitors: AnalyticsData["visitors"],
  ipLocations: AnalyticsData["ipLocations"],
): LiveVisitorEntry[] {
  const cutoff = Date.now() - LIVE_WINDOW_MS;
  const recentEvents = events.filter(
    (event) => new Date(event.createdAt).getTime() >= cutoff,
  );

  const grouped = new Map<string, StoredAnalyticsEvent[]>();

  for (const event of recentEvents) {
    const list = grouped.get(event.visitorId) ?? [];
    list.push(event);
    grouped.set(event.visitorId, list);
  }

  return Array.from(grouped.entries())
    .map(([visitorId, visitorEvents]) => {
      const sorted = [...visitorEvents].sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt),
      );
      const lastEvent = sorted[sorted.length - 1];
      const lastSeenMs = new Date(lastEvent.createdAt).getTime();

      const eventIp = visitors[visitorId]?.ip ?? lastEvent.ip ?? "Inconnue";
      const geo = resolveStoredGeo(
        eventIp,
        visitors[visitorId]?.city ?? lastEvent.city,
        visitors[visitorId]?.company ?? lastEvent.company,
        ipLocations,
      );

      return {
        visitorId,
        visitorLabel: formatVisitorLabel(visitorId, geo.city),
        ip: eventIp,
        city: geo.city,
        company: geo.company,
        lastSeen: lastEvent.createdAt,
        lastSeenLabel: formatTimeLabel(lastEvent.createdAt),
        movementsCount: sorted.length,
        lastZoneLabel: ANALYTICS_ZONES[lastEvent.zoneId].label,
        isActive: Date.now() - lastSeenMs <= ACTIVE_WINDOW_MS,
      };
    })
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));
}

function countUniqueIps(visitors: AnalyticsData["visitors"]) {
  const ips = new Set(
    Object.values(visitors)
      .map((visitor) => visitor.ip)
      .filter((ip) => ip !== "Inconnue" && ip !== "Localhost"),
  );

  return ips.size;
}

export async function trackAnalyticsEvent(input: {
  visitorId: string;
  zoneId: string;
  type: AnalyticsEventType;
  label?: string;
  ip: string;
  city: string;
  company: string;
}) {
  if (!isValidVisitorId(input.visitorId) || !isAnalyticsZoneId(input.zoneId)) {
    return false;
  }

  const data = await readAnalyticsFile();
  const now = new Date().toISOString();
  const zone = data.zones[input.zoneId];

  const event: StoredAnalyticsEvent = {
    id: crypto.randomUUID(),
    visitorId: input.visitorId,
    zoneId: input.zoneId,
    type: input.type,
    label: input.type === "click" ? sanitizeClickLabel(input.label) : undefined,
    ip: input.ip,
    city: input.city,
    company: input.company,
    createdAt: now,
  };

  data.events = trimEvents([...data.events, event]);

  if (input.ip !== "Inconnue") {
    data.ipLocations[input.ip] = {
      city: input.city,
      company: input.company,
    };
  }

  const visitor = data.visitors[input.visitorId];
  if (visitor) {
    visitor.lastSeen = now;
    visitor.ip = input.ip;
    visitor.city = input.city;
    visitor.company = input.company;
    visitor.movements += 1;
  } else {
    data.visitors[input.visitorId] = {
      firstSeen: now,
      lastSeen: now,
      ip: input.ip,
      city: input.city,
      company: input.company,
      movements: 1,
    };
  }

  if (input.type === "view") {
    zone.views += 1;
    zone.lastViewAt = now;
    const day = todayKey();
    data.dailyViews[day] = (data.dailyViews[day] ?? 0) + 1;
  } else {
    zone.clicks += 1;
    zone.lastClickAt = now;
    const clickLabel = sanitizeClickLabel(input.label);
    const key = `${input.zoneId}::${clickLabel}`;
    data.clickLabels[key] = (data.clickLabels[key] ?? 0) + 1;
  }

  await writeAnalyticsFile(data);
  return true;
}

function toZoneMetrics(zoneId: AnalyticsZoneId, data: AnalyticsData): ZoneMetrics {
  const zone = data.zones[zoneId];
  return {
    zoneId,
    label: ANALYTICS_ZONES[zoneId].label,
    views: zone.views,
    clicks: zone.clicks,
    lastViewAt: zone.lastViewAt,
    lastClickAt: zone.lastClickAt,
  };
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const data = await readAnalyticsFile();
  const allZones = ANALYTICS_ZONE_IDS.map((zoneId) => toZoneMetrics(zoneId, data));

  const totalViews = allZones.reduce((sum, zone) => sum + zone.views, 0);
  const totalClicks = allZones.reduce((sum, zone) => sum + zone.clicks, 0);
  const totalVisitors = Object.keys(data.visitors).length;

  const topViewed = [...allZones].sort((a, b) => b.views - a.views);
  const topClicked = [...allZones].sort((a, b) => b.clicks - a.clicks);
  const topEngagement = [...allZones].sort(
    (a, b) => b.views + b.clicks * 2 - (a.views + a.clicks * 2),
  );

  const clickBreakdown = Object.entries(data.clickLabels)
    .map(([key, count]) => {
      const [zoneId, ...labelParts] = key.split("::");
      if (!isAnalyticsZoneId(zoneId)) return null;

      return {
        zoneId,
        zoneLabel: ANALYTICS_ZONES[zoneId].label,
        label: labelParts.join("::"),
        count,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);

  const last7DaysViews = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    const key = day.toISOString().slice(0, 10);
    const label = day.toLocaleDateString("fr-FR", { weekday: "short" });
    return { label, count: data.dailyViews[key] ?? 0 };
  });

  const visitorHours = buildVisitorHours(data.events, data.visitors, data.ipLocations);
  const liveVisitors = buildLiveVisitors(data.events, data.visitors, data.ipLocations);
  const uniqueIps = countUniqueIps(data.visitors);

  return {
    totalViews,
    totalClicks,
    totalVisitors,
    topViewed,
    topClicked,
    topEngagement,
    clickBreakdown,
    last7DaysViews,
    visitorHours,
    liveVisitors,
    uniqueIps,
  };
}

export async function resetAnalyticsData() {
  await writeAnalyticsFile(defaultAnalyticsData());
}
