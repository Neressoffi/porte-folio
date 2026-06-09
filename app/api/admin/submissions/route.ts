import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import {
  deleteSubmission,
  listSubmissions,
  markSubmissionRead,
} from "@/lib/submissions/store";

export async function GET() {
  try {
    await requireAdmin();
    const submissions = await listSubmissions();
    return NextResponse.json({ submissions });
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as { id?: string; read?: boolean };
    if (!body.id || typeof body.read !== "boolean") {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    const updated = await markSubmissionRead(body.id, body.read);
    if (!updated) {
      return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
    }

    return NextResponse.json({ submission: updated });
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "ID manquant." }, { status: 400 });
    }

    const deleted = await deleteSubmission(body.id);
    if (!deleted) {
      return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
}
