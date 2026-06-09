"use client";

import {
  BarChart3,
  Inbox,
  LogOut,
  Mail,
  MousePointerClick,
  Settings,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { AdminActivityChart } from "@/components/admin/admin-activity-chart";
import { AdminZonesPanel } from "@/components/admin/admin-zones-panel";
import { ProfilePhoto } from "@/components/profile-photo";
import { profile } from "@/lib/data";
import type { AnalyticsStats } from "@/lib/analytics/types";
import type { DashboardStats, FormSettings, Submission } from "@/lib/submissions/types";

type Tab = "overview" | "zones" | "submissions" | "settings";

const ANALYTICS_POLL_MS = 2500;

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [settings, setSettings] = useState<FormSettings | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
  const [analyticsUpdatedAt, setAnalyticsUpdatedAt] = useState<Date | null>(null);
  const [analyticsSyncing, setAnalyticsSyncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resettingAnalytics, setResettingAnalytics] = useState(false);
  const [message, setMessage] = useState("");
  const analyticsPollLock = useRef(false);

  const loadAnalytics = useCallback(async () => {
    if (analyticsPollLock.current) return false;

    analyticsPollLock.current = true;
    setAnalyticsSyncing(true);

    try {
      const response = await fetch("/api/admin/analytics", { cache: "no-store" });

      if (response.status === 401) {
        router.push("/admin/login");
        return false;
      }

      if (!response.ok) return false;

      const data = (await response.json()) as { stats: AnalyticsStats };
      setAnalytics(data.stats);
      setAnalyticsUpdatedAt(new Date());
      return true;
    } finally {
      analyticsPollLock.current = false;
      setAnalyticsSyncing(false);
    }
  }, [router]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setMessage("");

    const [statsRes, submissionsRes, settingsRes, analyticsRes] = await Promise.all([
      fetch("/api/admin/stats"),
      fetch("/api/admin/submissions"),
      fetch("/api/admin/settings"),
      fetch("/api/admin/analytics", { cache: "no-store" }),
    ]);

    if ([statsRes, submissionsRes, settingsRes, analyticsRes].some((res) => res.status === 401)) {
      router.push("/admin/login");
      return;
    }

    const statsData = (await statsRes.json()) as { stats: DashboardStats };
    const submissionsData = (await submissionsRes.json()) as {
      submissions: Submission[];
    };
    const settingsData = (await settingsRes.json()) as { settings: FormSettings };
    const analyticsData = (await analyticsRes.json()) as { stats: AnalyticsStats };

    setStats(statsData.stats);
    setSubmissions(submissionsData.submissions);
    setSettings(settingsData.settings);
    setAnalytics(analyticsData.stats);
    setAnalyticsUpdatedAt(new Date());
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (loading || tab !== "zones") return;

    void loadAnalytics();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void loadAnalytics();
    }, ANALYTICS_POLL_MS);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void loadAnalytics();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [loading, tab, loadAnalytics]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function toggleRead(submission: Submission) {
    const response = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: submission.id, read: !submission.read }),
    });

    if (response.ok) await loadAll();
  }

  async function removeSubmission(id: string) {
    const response = await fetch("/api/admin/submissions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setMessage("Message supprimé.");
      await loadAll();
    }
  }

  async function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    if (!settings) return;

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (response.ok) {
      setMessage("Paramètres enregistrés.");
      await loadAll();
    }
  }

  async function resetAnalytics() {
    setResettingAnalytics(true);
    const response = await fetch("/api/admin/analytics", { method: "DELETE" });
    setResettingAnalytics(false);

    if (response.ok) {
      setMessage("Statistiques de parcours réinitialisées.");
      await loadAll();
    }
  }

  if (loading || !stats || !settings || !analytics) {
    return <div className="admin-shell p-8 text-stone-400">Chargement du tableau de bord…</div>;
  }

  return (
    <div className="admin-shell min-h-screen">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <ProfilePhoto avatar className="admin-profile-photo size-14" sizes="56px" priority />
            <div>
              <p className="admin-eyebrow">API du portfolio</p>
              <h1 className="text-xl font-semibold text-white">{settings.formName}</h1>
              <p className="mt-0.5 text-sm text-stone-400">{profile.name}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={tab === "overview" ? "admin-tab admin-tab-active" : "admin-tab"}
              onClick={() => setTab("overview")}
            >
              <BarChart3 className="size-4" />
              Vue d&apos;ensemble
            </button>
            <button
              type="button"
              className={tab === "zones" ? "admin-tab admin-tab-active" : "admin-tab"}
              onClick={() => setTab("zones")}
            >
              <MousePointerClick className="size-4" />
              Parcours visiteur
            </button>
            <button
              type="button"
              className={tab === "submissions" ? "admin-tab admin-tab-active" : "admin-tab"}
              onClick={() => setTab("submissions")}
            >
              <Inbox className="size-4" />
              Messages
            </button>
            <button
              type="button"
              className={tab === "settings" ? "admin-tab admin-tab-active" : "admin-tab"}
              onClick={() => setTab("settings")}
            >
              <Settings className="size-4" />
              Paramètres
            </button>
            <button type="button" className="admin-tab" onClick={handleLogout}>
              <LogOut className="size-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {message ? <p className="mb-6 text-sm text-emerald-400">{message}</p> : null}

        {tab === "overview" ? (
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total des messages" value={stats.total} />
              <StatCard label="Non lus" value={stats.unread} accent="text-cyan-300" />
              <StatCard label="Aujourd'hui" value={stats.today} accent="text-amber-300" />
              <StatCard label="Cette semaine" value={stats.thisWeek} accent="text-red-300" />
            </div>

            <div className="admin-card p-6">
              <AdminActivityChart
                data={stats.last7Days}
                summaryPrefix="message reçu"
              />
            </div>

            <section className="admin-card p-6">
              <h2 className="text-lg font-semibold text-white">Configuration e-mail</h2>
              <p className="mt-2 text-sm text-stone-400">
                Les messages arrivent dans ce tableau de bord. Adresse e-mail de notification :
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-200">
                <Mail className="size-4 text-primary" />
                {settings.notificationEmail}
              </p>
            </section>
          </div>
        ) : null}

        {tab === "zones" ? (
          <AdminZonesPanel
            stats={analytics}
            onReset={resetAnalytics}
            resetting={resettingAnalytics}
            live
            syncing={analyticsSyncing}
            updatedAt={analyticsUpdatedAt}
          />
        ) : null}

        {tab === "submissions" ? (
          <section className="admin-card overflow-hidden">
            <div className="border-b border-white/10 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Messages reçus</h2>
              <p className="text-sm text-stone-400">{submissions.length} message(s)</p>
            </div>
            <div className="divide-y divide-white/10">
              {submissions.length === 0 ? (
                <p className="p-6 text-sm text-stone-400">Aucun message pour le moment.</p>
              ) : (
                submissions.map((submission) => (
                  <article key={submission.id} className="px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-semibold text-white">{submission.name}</h3>
                          {!submission.read ? (
                            <span className="rounded-full bg-cyan/20 px-2 py-0.5 text-xs text-cyan-200">
                              Nouveau
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-stone-400">{submission.email}</p>
                        <p className="mt-1 text-xs text-stone-500">
                          {new Date(submission.createdAt).toLocaleString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="admin-tab"
                          onClick={() => toggleRead(submission)}
                        >
                          {submission.read ? "Marquer non lu" : "Marquer lu"}
                        </button>
                        <button
                          type="button"
                          className="admin-tab text-red-300"
                          onClick={() => removeSubmission(submission.id)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-300">
                      {submission.message}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        ) : null}

        {tab === "settings" ? (
          <form onSubmit={saveSettings} className="admin-card grid gap-5 p-6">
            <h2 className="text-lg font-semibold text-white">Formulaire et options avancées</h2>

            <label className="grid gap-2">
              <span className="text-sm text-stone-300">Nom du formulaire</span>
              <input
                className="admin-input"
                value={settings.formName}
                onChange={(event) =>
                  setSettings({ ...settings, formName: event.target.value })
                }
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-stone-300">Adresse e-mail de notification</span>
              <input
                className="admin-input"
                value={settings.notificationEmail}
                onChange={(event) =>
                  setSettings({ ...settings, notificationEmail: event.target.value })
                }
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-stone-300">Texte d&apos;intro (tableau de bord)</span>
              <textarea
                className="admin-input min-h-24"
                value={settings.introText}
                onChange={(event) =>
                  setSettings({ ...settings, introText: event.target.value })
                }
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-stone-300">Message de confirmation visiteur</span>
              <textarea
                className="admin-input min-h-24"
                value={settings.autoReplyText}
                onChange={(event) =>
                  setSettings({ ...settings, autoReplyText: event.target.value })
                }
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-stone-300">Message de succès formulaire</span>
              <textarea
                className="admin-input min-h-20"
                value={settings.thankYouMessage}
                onChange={(event) =>
                  setSettings({ ...settings, thankYouMessage: event.target.value })
                }
              />
            </label>

            <button type="submit" className="admin-button w-fit">
              Enregistrer les paramètres
            </button>
          </form>
        ) : null}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = "text-white",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="admin-card p-5">
      <p className="text-sm text-stone-400">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
