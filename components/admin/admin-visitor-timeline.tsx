"use client";

import { Building2, Clock3, MapPin, Route, Users } from "lucide-react";

import type { VisitorHourBucket } from "@/lib/analytics/types";

type AdminVisitorTimelineProps = {
  visitorHours: VisitorHourBucket[];
};

export function AdminVisitorTimeline({ visitorHours }: AdminVisitorTimelineProps) {
  const hasData = visitorHours.length > 0;

  return (
    <section className="admin-card overflow-hidden">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <Route className="size-5 text-cyan" />
          <h2 className="text-lg font-semibold text-white">Parcours par visiteur et par heure</h2>
        </div>
        <p className="mt-1 text-sm text-stone-400">
          Chaque visiteur anonyme et ses déplacements (consultations et clics), regroupés par heure.
        </p>
      </div>

      {!hasData ? (
        <p className="p-6 text-sm text-stone-400">
          Aucun déplacement enregistré pour le moment. Navigue sur le portfolio pour générer des
          parcours visiteurs.
        </p>
      ) : (
        <div className="divide-y divide-white/10">
          {visitorHours.map((hour) => (
            <article key={hour.hourKey} className="px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Clock3 className="size-4 text-gold" />
                  <h3 className="font-semibold text-white">{hour.hourLabel}</h3>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-cyan-100">
                    {hour.visitorCount} visiteur{hour.visitorCount > 1 ? "s" : ""}
                  </span>
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-amber-100">
                    {hour.movementCount} déplacement{hour.movementCount > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {hour.visitors.map((visitor) => (
                  <div key={`${hour.hourKey}-${visitor.visitorId}`} className="admin-visitor-card">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Users className="size-4 text-stone-400" />
                        <p className="font-medium text-white">{visitor.visitorLabel}</p>
                        <span className="admin-city-badge admin-city-badge-sm">
                          <MapPin className="size-3 shrink-0" aria-hidden />
                          {visitor.city}
                        </span>
                        <span className="admin-company-badge admin-company-badge-sm">
                          <Building2 className="size-3 shrink-0" aria-hidden />
                          {visitor.company}
                        </span>
                        <code className="admin-ip-badge admin-ip-badge-sm">{visitor.ip}</code>
                      </div>
                      <p className="text-xs text-stone-500">
                        {new Date(visitor.firstSeen).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                        {" → "}
                        {new Date(visitor.lastSeen).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </div>

                    <ol className="admin-visitor-timeline mt-4">
                      {visitor.movements.map((movement, index) => (
                        <li key={`${visitor.visitorId}-${movement.at}-${index}`}>
                          <div className="admin-visitor-timeline-dot" aria-hidden />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold text-gold">
                                {movement.timeLabel}
                              </span>
                              <span
                                className={
                                  movement.type === "view"
                                    ? "admin-visitor-pill admin-visitor-pill-view"
                                    : "admin-visitor-pill admin-visitor-pill-click"
                                }
                              >
                                {movement.actionLabel}
                              </span>
                              <span className="text-sm text-white">{movement.zoneLabel}</span>
                              {movement.type === "click" ? (
                                <>
                                  <span className="admin-city-badge admin-city-badge-sm">
                                    <MapPin className="size-3 shrink-0" aria-hidden />
                                    {movement.city}
                                  </span>
                                  <span className="admin-company-badge admin-company-badge-sm">
                                    <Building2 className="size-3 shrink-0" aria-hidden />
                                    {movement.company}
                                  </span>
                                </>
                              ) : null}
                            </div>
                            {movement.detail ? (
                              <p className="mt-1 text-xs text-stone-400">{movement.detail}</p>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
