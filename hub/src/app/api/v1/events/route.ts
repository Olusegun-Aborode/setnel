import { NextResponse } from 'next/server';
import { sql, type DashboardRow } from '@/lib/db';
import { dashboardSecret, verifySignature } from '@/lib/auth-hmac';
import { ingestBatch, recordCheckin, recordSamples } from '@/lib/ingest';
import { recordHeartbeat } from '@/lib/admin';
import { EventBatchSchema } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/v1/events
// Body: { dashboardId, events: [...] }
// Header: x-setnel-signature = hex HMAC-SHA256(rawBody, dashboardSecret)
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get('x-setnel-signature') ?? '';

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }

  const result = EventBatchSchema.safeParse(parsed);
  if (!result.success) {
    return NextResponse.json(
      { error: 'invalid payload', detail: result.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }
  const { dashboardId, events, samples } = result.data;

  // Auth: verify the signature with the dashboard's shared secret.
  const secret = dashboardSecret(dashboardId);
  if (!secret) {
    return NextResponse.json({ error: 'unknown dashboard' }, { status: 401 });
  }
  if (!verifySignature(raw, signature, secret)) {
    return NextResponse.json({ error: 'bad signature' }, { status: 401 });
  }

  // Dashboard must be registered + enabled.
  const rows = (await sql`
    SELECT * FROM dashboards WHERE id = ${dashboardId} AND enabled = true LIMIT 1
  `) as DashboardRow[];
  if (rows.length === 0) {
    return NextResponse.json({ error: 'dashboard not registered or disabled' }, { status: 404 });
  }

  // Heartbeat on every authenticated check-in — even with zero alerts.
  await recordCheckin(dashboardId);
  await recordHeartbeat('ingest', dashboardId); // self-monitoring: ingest pipeline alive

  // Persist metric samples (time-series) regardless of whether alerts fired.
  const sampled = await recordSamples(dashboardId, samples ?? []);

  if (events.length === 0) {
    return NextResponse.json({ ok: true, stored: 0, incidentsOpened: 0, notified: 0, sampled });
  }

  const out = await ingestBatch(rows[0], events);
  return NextResponse.json({ ok: true, ...out, sampled });
}
