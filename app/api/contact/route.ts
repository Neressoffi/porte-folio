import { NextResponse } from "next/server";

import { addSubmission, getSettings } from "@/lib/submissions/store";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    if (body.website?.trim()) {
      return NextResponse.json({ ok: true });
    }

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nom, email et message sont obligatoires." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }

    if (name.length > 120 || message.length > 5000) {
      return NextResponse.json({ error: "Message trop long." }, { status: 400 });
    }

    const settings = await getSettings();
    const submission = await addSubmission({ name, email, message });

    return NextResponse.json({
      ok: true,
      id: submission.id,
      confirmation: settings.autoReplyText,
      thankYou: settings.thankYouMessage,
    });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer le message pour le moment." },
      { status: 500 },
    );
  }
}
