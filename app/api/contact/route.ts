import { NextResponse } from "next/server";

const PROFILE_NAME = "Ariel Ngoualem";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      return NextResponse.json(
        {
          error:
            "Clé Web3Forms manquante. Ajoute WEB3FORMS_ACCESS_KEY dans .env.local et sur Vercel.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as ContactPayload;
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

    const response = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        message,
        subject: `[Portfolio] Message de ${name}`,
        from_name: `Portfolio ${PROFILE_NAME}`,
        replyto: email,
        botcheck: false,
        autoresponse: {
          from_name: PROFILE_NAME,
          subject: `Confirmation — message bien envoyé à ${PROFILE_NAME}`,
          intro: [
            `Bonjour ${name},`,
            "",
            `Merci pour votre message. Je confirme qu'il a bien été transmis à ${PROFILE_NAME}.`,
            "Je vous répondrai dans les meilleurs délais.",
            "",
            "Cordialement,",
            PROFILE_NAME,
            "Développeur Full Stack",
          ].join("\n"),
        },
      }),
    });

    const result = (await response.json()) as { success?: boolean; message?: string };

    if (!response.ok || !result.success) {
      console.error("[contact] Web3Forms:", result);
      return NextResponse.json(
        { error: result.message ?? "Impossible d'envoyer le message." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer le message pour le moment. Réessayez plus tard." },
      { status: 500 },
    );
  }
}
