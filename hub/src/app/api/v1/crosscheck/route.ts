import { NextResponse } from 'next/server';
import { runCrossChecks } from '@/lib/crosscheck';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/v1/crosscheck?key=<SETNEL_CRON_SECRET>
// Compares dashboard-reported metrics against independent sources (DeFiLlama)
// and raises data-integrity incidents on divergence. Triggered hourly by the
// setnel-crosscheck GitHub Actions workflow.
export async function GET(req: Request) {
  const secret = process.env.SETNEL_CRON_SECRET;
  if (secret) {
    const key = new URL(req.url).searchParams.get('key');
    if (key !== secret) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }
  const out = await runCrossChecks();
  return NextResponse.json({ ok: true, ...out });
}
