import { cookies } from "next/headers";

const SESSION_COOKIE = "portfolio_admin_session";

function sessionToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return Buffer.from(`portfolio-admin:${password}`).toString("base64url");
}

export function isAdminPasswordValid(password: string) {
  return Boolean(process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD);
}

export async function createAdminSession() {
  const token = sessionToken();
  if (!token) return false;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return true;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAdminAuthenticated() {
  const token = sessionToken();
  if (!token) return false;

  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === token;
}

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    throw new Error("UNAUTHORIZED");
  }
}
