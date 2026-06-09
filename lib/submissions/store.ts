import { promises as fs } from "fs";
import path from "path";

import { contact } from "@/lib/data";

import type { DashboardStats, FormSettings, Submission } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

const DEFAULT_SETTINGS: FormSettings = {
  formName: "Contact portfolio",
  notificationEmail: contact.email,
  introText:
    "Bonjour,\n\nUn nouveau message a été envoyé depuis votre site. Détails ci-dessous.",
  autoReplyText:
    "Merci pour votre message. Je confirme qu'il a bien été transmis à Ariel Ngoualem. Je vous répondrai dans les meilleurs délais.",
  thankYouMessage:
    "Message envoyé. Vous recevrez une confirmation à l'écran ; Ariel a été notifié dans le tableau de bord.",
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function getSettings(): Promise<FormSettings> {
  return readJsonFile(SETTINGS_FILE, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: FormSettings) {
  await writeJsonFile(SETTINGS_FILE, settings);
}

export async function listSubmissions(): Promise<Submission[]> {
  const items = await readJsonFile<Submission[]>(SUBMISSIONS_FILE, []);
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addSubmission(input: {
  name: string;
  email: string;
  message: string;
}): Promise<Submission> {
  const items = await readJsonFile<Submission[]>(SUBMISSIONS_FILE, []);
  const submission: Submission = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    message: input.message,
    createdAt: new Date().toISOString(),
    read: false,
  };

  items.unshift(submission);
  await writeJsonFile(SUBMISSIONS_FILE, items);
  return submission;
}

export async function markSubmissionRead(id: string, read: boolean) {
  const items = await listSubmissions();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  items[index] = { ...items[index], read };
  await writeJsonFile(SUBMISSIONS_FILE, items);
  return items[index];
}

export async function deleteSubmission(id: string) {
  const items = await listSubmissions();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;

  await writeJsonFile(SUBMISSIONS_FILE, next);
  return true;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const items = await listSubmissions();
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    const label = day.toLocaleDateString("fr-FR", { weekday: "short" });
    const count = items.filter((item) => {
      const created = new Date(item.createdAt);
      return (
        created.getFullYear() === day.getFullYear() &&
        created.getMonth() === day.getMonth() &&
        created.getDate() === day.getDate()
      );
    }).length;

    return { label, count };
  });

  return {
    total: items.length,
    unread: items.filter((item) => !item.read).length,
    today: items.filter((item) => new Date(item.createdAt) >= startOfToday).length,
    thisWeek: items.filter((item) => new Date(item.createdAt) >= startOfWeek).length,
    last7Days,
  };
}
