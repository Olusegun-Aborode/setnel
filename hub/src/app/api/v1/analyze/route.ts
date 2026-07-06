import { NextResponse } from 'next/server';
import { runBaselines } from '@/lib/baseline';
import { runCompound } from '@/lib/compound';
import { runEscalations } from '@/lib/escalate';
import { recordHeartbeat } from '@/lib/admin';
import { checkAndPageStaleCrons } from '@/lib/selfcheck';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/v1/analyze?key=<SETNEL_CRON_SECRET>
// Phase 3 analysis pass: adaptive baseline anomaly detection over the metric
// store, then compound/correlated rules over active incidents. Also records its
// heartbeat and runs the self-check (pages if any Setnel cron is stale).
export async function GET(req: Request) {
  const secret = process.env.SETNEL_CRON_SECRET;
  if (secret) {
    const key = new URL(req.url).searchParams.get('key');
    if (key !== secret) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const baseline = await runBaselines();
  const compound = await runCompound();
  const escalation = await runEscalations();
  await recordHeartbeat('analyze', `baseline ${baseline.anomalies} anomalies`);
  const selfcheck = await checkAndPageStaleCrons();
  return NextResponse.json({ ok: true, baseline, compound, escalation, selfcheck });
}
