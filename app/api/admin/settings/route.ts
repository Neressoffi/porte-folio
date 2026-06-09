import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { getSettings, saveSettings } from "@/lib/submissions/store";
import type { FormSettings } from "@/lib/submissions/types";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getSettings();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as Partial<FormSettings>;
    const current = await getSettings();

    const settings: FormSettings = {
      formName: body.formName?.trim() || current.formName,
      notificationEmail: body.notificationEmail?.trim() || current.notificationEmail,
      introText: body.introText?.trim() || current.introText,
      autoReplyText: body.autoReplyText?.trim() || current.autoReplyText,
      thankYouMessage: body.thankYouMessage?.trim() || current.thankYouMessage,
    };

    await saveSettings(settings);
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
}
