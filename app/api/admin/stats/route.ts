import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { getDashboardStats } from "@/lib/submissions/store";

export async function GET() {
  try {
    await requireAdmin();
    const stats = await getDashboardStats();
    return NextResponse.json({ stats });
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
}
