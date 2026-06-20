import { NextResponse } from 'next/server';
import { resolveStale } from '@/lib/ingest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Flips active incidents with no recent events to resolved.
// Call on a schedule (Vercel cron or external pinger).
export async function GET() {
  const resolved = await resolveStale();
  return NextResponse.json({ ok: true, resolved });
}
