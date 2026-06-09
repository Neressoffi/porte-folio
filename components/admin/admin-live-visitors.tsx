"use client";

import { Building2, Globe, MapPin, Wifi } from "lucide-react";

import type { LiveVisitorEntry } from "@/lib/analytics/types";

type AdminLiveVisitorsProps = {
  liveVisitors: LiveVisitorEntry[];
  uniqueIps: number;
  live?: boolean;
};

export function AdminLiveVisitors({
  liveVisitors,
  uniqueIps,
  live = false,
}: AdminLiveVisitorsProps) {
  const activeCount = liveVisitors.filter((visitor) => visitor.isActive).length;

  return (
    <section className="admin-card overflow-hidden">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="size-5 text-cyan" />
              <h2 className="text-lg font-semibold text-white">
                Visiteurs en temps réel (IP, ville & entreprise)
              </h2>
            </div>
            <p className="mt-1 text-sm text-stone-400">
              Origine géographique et entreprise/FAI détectés pour chaque visiteur
              {live ? " toutes les 2,5 s" : ""}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-cyan-100">
              {uniqueIps} IP distincte{uniqueIps > 1 ? "s" : ""}
            </span>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-100">
              {activeCount} en ligne
            </span>
          </div>
        </div>
      </div>

      {liveVisitors.length === 0 ? (
        <p className="p-6 text-sm text-stone-400">
          Aucun visiteur récent. Ouvrez le portfolio dans un autre onglet pour voir les adresses IP
          apparaître ici.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-live-ip-table w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-stone-500">
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium">Entreprise</th>
                <th className="px-6 py-3 font-medium">Ville</th>
                <th className="px-6 py-3 font-medium">Adresse IP</th>
                <th className="px-6 py-3 font-medium">Visiteur</th>
                <th className="px-6 py-3 font-medium">Dernière zone</th>
                <th className="px-6 py-3 font-medium">Dernière activité</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {liveVisitors.map((visitor) => (
                <tr key={visitor.visitorId} className="admin-live-ip-row">
                  <td className="px-6 py-4">
                    <span
                      className={
                        visitor.isActive
                          ? "admin-live-status admin-live-status-active"
                          : "admin-live-status admin-live-status-idle"
                      }
                    >
                      <span className="admin-live-status-dot" aria-hidden />
                      {visitor.isActive ? "En ligne" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="admin-company-badge">
                      <Building2 className="size-3.5 shrink-0" aria-hidden />
                      {visitor.company}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="admin-city-badge">
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      {visitor.city}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="admin-ip-badge">{visitor.ip}</code>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {visitor.visitorLabel}
                  </td>
                  <td className="px-6 py-4 text-stone-300">{visitor.lastZoneLabel}</td>
                  <td className="px-6 py-4 text-stone-400">{visitor.lastSeenLabel}</td>
                  <td className="px-6 py-4 text-stone-300">
                    {visitor.movementsCount} action
                    {visitor.movementsCount > 1 ? "s" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {liveVisitors.length > 0 ? (
        <div className="flex items-center gap-2 border-t border-white/10 px-6 py-3 text-xs text-stone-500">
          <Wifi className="size-3.5" />
          Détection silencieuse via IP et réseau — aucune demande affichée au visiteur.
        </div>
      ) : null}
    </section>
  );
}
