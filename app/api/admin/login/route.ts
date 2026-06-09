import { NextResponse } from "next/server";

import { createAdminSession, isAdminPasswordValid } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const password = body.password ?? "";

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD manquant dans .env.local" },
      { status: 503 },
    );
  }

  if (!isAdminPasswordValid(password)) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
