import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/v1/status — lightweight health summary for the dead-man's-switch
// watchdog. Public read (no secret) so the watchdog can detect Hub problems
// without depending on auth. Returns the most recent check-in overall and
// per enabled dashboard, plus open dead-letter count.
export async function GET() {
  try {
    const overall = (await sql`
      SELECT max(last_check_at) AS last_check_at FROM dashboard_health
    `) as { last_check_at: string | null }[];

    const perDash = (await sql`
      SELECT d.id, d.name, max(h.last_check_at) AS last_check_at
      FROM dashboards d
      LEFT JOIN dashboard_health h ON h.dashboard_id = d.id
      WHERE d.enabled = true
      GROUP BY d.id, d.name
      ORDER BY d.name
    `) as { id: string; name: string; last_check_at: string | null }[];

    const dl = (await sql`
      SELECT count(*)::int AS n FROM failed_notifications WHERE resolved_at IS NULL
    `) as { n: number }[];

    const last = overall[0]?.last_check_at ?? null;
    const ageMin = last ? Math.round((Date.now() - new Date(last).getTime()) / 60000) : null;

    return NextResponse.json({
      ok: true,
      lastCheckAt: last,
      lastCheckAgeMin: ageMin,
      failedNotifications: dl[0]?.n ?? 0,
      dashboards: perDash.map((d) => ({
        id: d.id,
        name: d.name,
        lastCheckAt: d.last_check_at,
        ageMin: d.last_check_at
          ? Math.round((Date.now() - new Date(d.last_check_at).getTime()) / 60000)
          : null,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
