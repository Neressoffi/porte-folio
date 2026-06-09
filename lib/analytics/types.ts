import type { AnalyticsZoneId } from "./zones";

export type AnalyticsEventType = "view" | "click";

export type StoredAnalyticsEvent = {
  id: string;
  visitorId: string;
  zoneId: AnalyticsZoneId;
  type: AnalyticsEventType;
  label?: string;
  ip: string;
  city: string;
  company: string;
  createdAt: string;
};

export type ZoneMetrics = {
  zoneId: AnalyticsZoneId;
  label: string;
  views: number;
  clicks: number;
  lastViewAt?: string;
  lastClickAt?: string;
};

export type ClickBreakdownItem = {
  zoneId: AnalyticsZoneId;
  zoneLabel: string;
  label: string;
  count: number;
};

export type VisitorMovement = {
  at: string;
  timeLabel: string;
  type: AnalyticsEventType;
  actionLabel: string;
  zoneLabel: string;
  city: string;
  company: string;
  detail?: string;
};

export type VisitorSessionSummary = {
  visitorId: string;
  visitorLabel: string;
  ip: string;
  city: string;
  company: string;
  firstSeen: string;
  lastSeen: string;
  movements: VisitorMovement[];
};

export type LiveVisitorEntry = {
  visitorId: string;
  visitorLabel: string;
  ip: string;
  city: string;
  company: string;
  lastSeen: string;
  lastSeenLabel: string;
  movementsCount: number;
  lastZoneLabel: string;
  isActive: boolean;
};

export type VisitorHourBucket = {
  hourKey: string;
  hourLabel: string;
  visitorCount: number;
  movementCount: number;
  visitors: VisitorSessionSummary[];
};

export type AnalyticsStats = {
  totalViews: number;
  totalClicks: number;
  totalVisitors: number;
  topViewed: ZoneMetrics[];
  topClicked: ZoneMetrics[];
  topEngagement: ZoneMetrics[];
  clickBreakdown: ClickBreakdownItem[];
  last7DaysViews: { label: string; count: number }[];
  visitorHours: VisitorHourBucket[];
  liveVisitors: LiveVisitorEntry[];
  uniqueIps: number;
};

export type AnalyticsData = {
  zones: Record<
    AnalyticsZoneId,
    { views: number; clicks: number; lastViewAt?: string; lastClickAt?: string }
  >;
  clickLabels: Record<string, number>;
  dailyViews: Record<string, number>;
  events: StoredAnalyticsEvent[];
  visitors: Record<
    string,
    {
      firstSeen: string;
      lastSeen: string;
      ip: string;
      city: string;
      company: string;
      movements: number;
    }
  >;
  ipLocations: Record<string, { city: string; company: string }>;
  /** @deprecated Migré vers ipLocations */
  ipCities?: Record<string, string>;
  updatedAt: string;
};
