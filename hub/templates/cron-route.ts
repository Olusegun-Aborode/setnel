// Copy to: app/api/setnel/cron/route.ts   (or src/app/api/setnel/cron/route.ts)
//
// Adjust the import depth to your repo and set DASHBOARD_ID to the id the Setnel
// maintainer gave you. That's the only line you change here.

import { NextResponse } from 'next/server';
import '../../../../lib/setnel/detectors'; // registers detectors (side-effect import)
import { runDetectors } from '@/lib/setnel/runtime';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DASHBOARD_ID = 'CHANGE_ME'; // e.g. 'sparklend' — must match the Hub registration

export async function GET() {
  const hubUrl = process.env.SETNEL_HUB_URL;
  const secret = process.env.SETNEL_SECRET;
  if (!hubUrl || !secret) {
    return NextResponse.json({ error: 'SETNEL_HUB_URL / SETNEL_SECRET not set' }, { status: 500 });
  }
  const report = await runDetectors({ dashboardId: DASHBOARD_ID, hubUrl, secret });
  return NextResponse.json(report);
}
