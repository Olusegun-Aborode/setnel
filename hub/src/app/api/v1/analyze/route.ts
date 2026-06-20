import { NextResponse } from 'next/server';
import { runBaselines } from '@/lib/baseline';
import { runCompound } from '@/lib/compound';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/v1/analyze?key=<SETNEL_CRON_SECRET>
// Phase 3 analysis pass: adaptive baseline anomaly detection over the metric
// store, then compound/correlated rules over active incidents. Scheduled by the
// setnel-analyze workflow.
export async function GET(req: Request) {
  const secret = process.env.SETNEL_CRON_SECRET;
  if (secret) {
    const key = new URL(req.url).searchParams.get('key');
    if (key !== secret) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const baseline = await runBaselines();
  const compound = await runCompound();
  return NextResponse.json({ ok: true, baseline, compound });
}
