"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { ProfilePhoto } from "@/components/profile-photo";
import { profile } from "@/lib/data";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Connexion impossible.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card mx-auto max-w-md p-8">
      <div className="flex flex-col items-center text-center">
        <ProfilePhoto avatar className="admin-profile-photo size-20" sizes="80px" priority />
        <p className="admin-eyebrow mt-5">Tableau de bord contact</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Connexion admin</h1>
        <p className="mt-2 text-sm text-stone-400">{profile.name}</p>
      </div>
      <p className="mt-4 text-center text-sm text-stone-400">
        API et tableau de bord 100% intégrés au portfolio — gratuit, sans abonnement.
      </p>

      <label className="mt-8 grid gap-2">
        <span className="text-sm text-stone-300">Mot de passe admin</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="admin-input"
          required
        />
      </label>

      <button type="submit" disabled={loading} className="admin-button mt-6 w-full">
        {loading ? "Connexion…" : "Accéder au tableau de bord"}
      </button>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
    </form>
  );
}
