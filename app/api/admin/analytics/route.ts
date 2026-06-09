import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { getAnalyticsStats, resetAnalyticsData } from "@/lib/analytics/store";

export async function GET() {
  try {
    await requireAdmin();
    const stats = await getAnalyticsStats();
    return NextResponse.json(
      { stats },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    await requireAdmin();
    await resetAnalyticsData();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
}
