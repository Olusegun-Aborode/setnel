import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getSummary, getIncidents } from '@/lib/queries';
import { LiveRefresh } from '../(app)/setnel/live';

export const dynamic = 'force-dynamic';

function fmtUsd(n: number | null): string {
  if (!n) return '';
  const a = Math.abs(n);
  if (a >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (a >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${(n / 1e3).toFixed(0)}K`;
}

export default async function Wallboard() {
  if (!(await isAuthed())) redirect('/login');
  const [summary, active] = await Promise.all([getSummary(), getIncidents({ status: 'active' })]);
  const crit = active.filter((i) => i.severity === 'critical' || i.severity === 'emergency');
  const level = summary.criticalActive > 0 ? 'crit' : summary.activeCount > 0 ? 'warn' : 'ok';

  return (
    <div className={`wallboard wb-${level}`}>
      <div className="wb-top">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" width={30} height={30} alt="" style={{ borderRadius: 7 }} />
        <span className="wb-brand">Setnel</span>
        <span className="wb-status">{level === 'ok' ? 'ALL CLEAR' : level === 'warn' ? 'ACTIVE INCIDENTS' : 'CRITICAL'}</span>
        <div style={{ marginLeft: 'auto' }}><LiveRefresh intervalMs={20000} /></div>
      </div>

      <div className="wb-kpis">
        <div className="wb-kpi"><b>{summary.criticalActive}</b><span>critical</span></div>
        <div className="wb-kpi"><b>{summary.activeCount}</b><span>active</span></div>
        <div className="wb-kpi"><b>{summary.last24h}</b><span>opened 24h</span></div>
        <div className="wb-kpi"><b>{summary.failedNotifications}</b><span>delivery fails</span></div>
      </div>

      <div className="wb-list">
        {crit.length === 0 ? (
          <div className="wb-clear">No critical incidents. 🟢</div>
        ) : (
          crit.map((i) => (
            <div key={i.id} className="wb-row">
              <span className="wb-sev">{i.severity}</span>
              <span className="wb-dash">{i.dashboard_name}</span>
              <span className="wb-msg">{i.message}</span>
              {i.exposure_usd ? <span className="wb-exp">{fmtUsd(i.exposure_usd)}</span> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
