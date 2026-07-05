import { isAuthed } from '@/lib/session';
import { getWeeklyReport } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/v1/report — weekly report as CSV. Session-guarded (same cookie as the
// console); used by the "Export CSV" button on the Reports page.
export async function GET() {
  if (!(await isAuthed())) return new Response('unauthorized', { status: 401 });
  const weeks = await getWeeklyReport(26);
  const header = 'week,incidents,false_positives,acked_pct,mtta_min,mttr_min';
  const lines = weeks.map((w) =>
    [w.week, w.incidents, w.falsePositives, w.ackedPct, w.mttaMin ?? '', w.mttrMin ?? ''].join(','),
  );
  const csv = [header, ...lines].join('\n');
  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="setnel-weekly-report.csv"',
    },
  });
}
