import { NextResponse } from 'next/server';
import { resolveStale } from '@/lib/ingest';
import { recordHeartbeat } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Flips active incidents with no recent events to resolved.
// Call on a schedule (Vercel cron or external pinger).
export async function GET() {
  const resolved = await resolveStale();
  await recordHeartbeat('resolve', `${resolved} resolved`);
  return NextResponse.json({ ok: true, resolved });
}
