"use client";

import { useEffect } from "react";

import {
  ANALYTICS_ZONES,
  ANALYTICS_ZONE_IDS,
  isAnalyticsZoneId,
  resolveZoneFromElement,
  type AnalyticsZoneId,
} from "@/lib/analytics/zones";

import type { AnalyticsEventType } from "@/lib/analytics/types";

const VISITOR_ID_KEY = "folio-visitor-id";
const VIEW_DEDUP_PREFIX = "folio-analytics-view-";
const CLICK_DEDUP_MS = 1200;

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], [data-door-transition], input, textarea, label";

function getVisitorId() {
  const existing = localStorage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(VISITOR_ID_KEY, id);
  return id;
}

function getVisibleText(element: Element) {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("svg, img, script, style").forEach((node) => node.remove());
  return clone.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function getClickLabel(element: Element, zoneId: AnalyticsZoneId) {
  const explicit = element.getAttribute("data-analytics-label");
  if (explicit?.trim()) return explicit.trim().slice(0, 80);

  const doorLabel = element.getAttribute("data-door-label");
  if (doorLabel?.trim()) return doorLabel.trim().slice(0, 80);

  const aria = element.getAttribute("aria-label");
  if (aria?.trim()) return aria.trim().slice(0, 80);

  const title = element.getAttribute("title");
  if (title?.trim()) return title.trim().slice(0, 80);

  const text = getVisibleText(element);
  if (text) return text.slice(0, 80);

  if (element instanceof HTMLAnchorElement) {
    if (element.hash && isAnalyticsZoneId(element.hash.slice(1))) {
      return ANALYTICS_ZONES[element.hash.slice(1) as AnalyticsZoneId].label;
    }

    if (element.href) {
      try {
        const url = new URL(element.href);
        if (url.hostname !== window.location.hostname) {
          return url.hostname.replace(/^www\./, "");
        }
        return `${url.pathname}${url.hash}` || element.href.slice(0, 80);
      } catch {
        return element.href.slice(0, 80);
      }
    }
  }

  return ANALYTICS_ZONES[zoneId].label;
}

async function sendTrack(
  visitorId: string,
  payload: {
    zoneId: AnalyticsZoneId;
    type: AnalyticsEventType;
    label?: string;
  },
) {
  try {
    const response = await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId, ...payload }),
      keepalive: true,
    });

    return response.ok;
  } catch {
    return false;
  }
}

export function AnalyticsTracker() {
  useEffect(() => {
    const visitorId = getVisitorId();
    const seenViews = new Set<AnalyticsZoneId>();
    const lastClickAt = new Map<string, number>();

    const trackView = async (zoneId: AnalyticsZoneId) => {
      if (seenViews.has(zoneId)) return;

      const key = `${VIEW_DEDUP_PREFIX}${zoneId}`;
      if (sessionStorage.getItem(key)) return;

      const ok = await sendTrack(visitorId, { zoneId, type: "view" });
      if (!ok) return;

      seenViews.add(zoneId);
      sessionStorage.setItem(key, "1");
    };

    const flushVisibleViews = () => {
      for (const zoneId of ANALYTICS_ZONE_IDS) {
        if (zoneId === "navbar") continue;

        const element = document.querySelector(ANALYTICS_ZONES[zoneId].selector);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const visible =
          rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.05;

        if (visible) void trackView(zoneId);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.25) continue;

          const id = entry.target.id;
          if (!isAnalyticsZoneId(id)) continue;

          void trackView(id);
        }
      },
      { threshold: [0.25, 0.4, 0.55] },
    );

    for (const zoneId of ANALYTICS_ZONE_IDS) {
      if (zoneId === "navbar") continue;
      const element = document.querySelector(ANALYTICS_ZONES[zoneId].selector);
      if (element) observer.observe(element);
    }

    requestAnimationFrame(() => {
      flushVisibleViews();
    });

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-analytics-ignore]")) return;

      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (!interactive) return;

      const zoneId = resolveZoneFromElement(interactive);
      if (!zoneId) return;

      const label = getClickLabel(interactive, zoneId);
      const dedupeKey = `${zoneId}:${label}`;
      const now = Date.now();
      const previous = lastClickAt.get(dedupeKey) ?? 0;
      if (now - previous < CLICK_DEDUP_MS) return;

      lastClickAt.set(dedupeKey, now);
      void sendTrack(visitorId, { zoneId, type: "click", label });
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      observer.disconnect();
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  return null;
}
