"use client";

import { Eye, MousePointerClick, TrendingUp } from "lucide-react";

import { AdminActivityChart } from "@/components/admin/admin-activity-chart";
import { AdminLiveVisitors } from "@/components/admin/admin-live-visitors";
import { AdminVisitorTimeline } from "@/components/admin/admin-visitor-timeline";
import type { AnalyticsStats, ZoneMetrics } from "@/lib/analytics/types";

type AdminZonesPanelProps = {
  stats: AnalyticsStats;
  onReset?: () => void;
  resetting?: boolean;
  live?: boolean;
  syncing?: boolean;
  updatedAt?: Date | null;
};

export function AdminZonesPanel({
  stats,
  onReset,
  resetting,
  live = false,
  syncing = false,
  updatedAt,
}: AdminZonesPanelProps) {
  const topZone = stats.topEngagement[0];
  const hasData = stats.totalViews > 0 || stats.totalClicks > 0;
  const maxEngagement = Math.max(
    1,
    ...stats.topEngagement.map((zone) => zone.views + zone.clicks * 2),
  );

  return (
    <div className="grid gap-6">
      {live ? (
        <div className="admin-live-banner">
          <span className="admin-live-dot" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-white">Suivi en temps réel</p>
            <p className="text-xs text-stone-400">
              {syncing
                ? "Actualisation…"
                : updatedAt
                  ? `Dernière mise à jour : ${updatedAt.toLocaleTimeString("fr-FR")}`
                  : "En attente de données…"}
            </p>
          </div>
        </div>
      ) : null}

      <AdminLiveVisitors
        liveVisitors={stats.liveVisitors}
        uniqueIps={stats.uniqueIps}
        live={live}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Consultations" value={stats.totalViews} accent="text-cyan-300" />
        <StatCard label="Clics enregistrés" value={stats.totalClicks} accent="text-amber-300" />
        <StatCard
          label="Zone la plus active"
          value={topZone && hasData ? topZone.label : "—"}
          accent="text-white"
          compact
        />
        <StatCard label="Visiteurs uniques" value={stats.totalVisitors} accent="text-red-300" />
      </div>

      <div className="admin-card p-6">
        <AdminActivityChart
          data={stats.last7DaysViews}
          title="Consultations — 7 derniers jours"
          summaryPrefix="consultation"
          emptyMessage="Aucune consultation enregistrée — les vues apparaîtront dès que des visiteurs parcourent le portfolio."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ZoneRanking
          title="Zones les plus consultées"
          subtitle="Sections visibles à l'écran par les visiteurs"
          icon={Eye}
          items={stats.topViewed}
          metric="views"
          emptyLabel="Aucune consultation pour le moment."
        />
        <ZoneRanking
          title="Zones les plus cliquées"
          subtitle="Sections où les visiteurs interagissent le plus"
          icon={MousePointerClick}
          items={stats.topClicked}
          metric="clicks"
          emptyLabel="Aucun clic enregistré pour le moment."
        />
      </div>

      <AdminVisitorTimeline visitorHours={stats.visitorHours} />

      <section className="admin-card overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-gold" />
              <h2 className="text-lg font-semibold text-white">Classement global des zones</h2>
            </div>
            <p className="mt-1 text-sm text-stone-400">
              Score = consultations + (clics × 2)
            </p>
          </div>
          {onReset ? (
            <button
              type="button"
              className="admin-tab text-red-300"
              disabled={resetting || !hasData}
              onClick={onReset}
            >
              {resetting ? "Réinitialisation…" : "Réinitialiser les stats"}
            </button>
          ) : null}
        </div>

        <div className="divide-y divide-white/10">
          {!hasData ? (
            <p className="p-6 text-sm text-stone-400">
              Parcourez le portfolio en navigation privée pour tester le suivi, puis revenez ici.
            </p>
          ) : (
            stats.topEngagement.map((zone, index) => (
              <ZoneRow
                key={zone.zoneId}
                zone={zone}
                rank={index + 1}
                mode="engagement"
                max={maxEngagement}
              />
            ))
          )}
        </div>
      </section>

      {stats.clickBreakdown.length > 0 ? (
        <section className="admin-card overflow-hidden">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Détail des clics</h2>
            <p className="text-sm text-stone-400">Boutons et liens les plus utilisés</p>
          </div>
          <div className="divide-y divide-white/10">
            {stats.clickBreakdown.map((item) => (
              <article
                key={`${item.zoneId}-${item.label}`}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div>
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="text-sm text-stone-400">{item.zoneLabel}</p>
                </div>
                <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-semibold text-amber-100">
                  {item.count} clic{item.count > 1 ? "s" : ""}
                </span>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ZoneRanking({
  title,
  subtitle,
  icon: Icon,
  items,
  metric,
  emptyLabel,
}: {
  title: string;
  subtitle: string;
  icon: typeof Eye;
  items: ZoneMetrics[];
  metric: "views" | "clicks";
  emptyLabel: string;
}) {
  const max = Math.max(1, ...items.map((item) => item[metric]));
  const hasValues = items.some((item) => item[metric] > 0);

  return (
    <section className="admin-card p-6">
      <div className="flex items-start gap-3">
        <div className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-gold">
          <Icon className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-stone-400">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {!hasValues ? (
          <p className="text-sm text-stone-400">{emptyLabel}</p>
        ) : (
          items.map((zone) => (
            <ZoneRow key={zone.zoneId} zone={zone} metric={metric} max={max} />
          ))
        )}
      </div>
    </section>
  );
}

function ZoneRow({
  zone,
  rank,
  metric = "views",
  max = 1,
  mode,
}: {
  zone: ZoneMetrics;
  rank?: number;
  metric?: "views" | "clicks";
  max?: number;
  mode?: "engagement";
}) {
  const value =
    mode === "engagement" ? zone.views + zone.clicks * 2 : zone[metric];
  const width = `${(value / max) * 100}%`;

  return (
    <div className={rank ? "flex flex-wrap items-center gap-4 px-6 py-4" : "grid gap-2"}>
      {rank ? (
        <span className="font-display text-2xl font-bold text-gold/30">{String(rank).padStart(2, "0")}</span>
      ) : null}

      <div className={rank ? "min-w-0 flex-1" : undefined}>
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-white">{zone.label}</p>
          <span className="text-sm font-semibold text-stone-300">
            {mode === "engagement" ? (
              <>
                {zone.views} vue{zone.views > 1 ? "s" : ""} · {zone.clicks} clic
                {zone.clicks > 1 ? "s" : ""}
              </>
            ) : metric === "views" ? (
              <>
                {zone.views} vue{zone.views > 1 ? "s" : ""}
              </>
            ) : (
              <>
                {zone.clicks} clic{zone.clicks > 1 ? "s" : ""}
              </>
            )}
          </span>
        </div>

        <div className="admin-zone-bar-track mt-2">
          <div className="admin-zone-bar-fill" style={{ width }} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = "text-white",
  compact = false,
}: {
  label: string;
  value: number | string;
  accent?: string;
  compact?: boolean;
}) {
  return (
    <div className="admin-card p-5">
      <p className="text-sm text-stone-400">{label}</p>
      <p
        className={`mt-3 font-semibold ${accent} ${
          compact ? "text-lg leading-snug" : "text-3xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
