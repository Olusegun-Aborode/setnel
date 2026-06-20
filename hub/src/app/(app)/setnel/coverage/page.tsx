import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { RISK_TYPES, COVERAGE_DASHBOARDS, COVERAGE, BLOCKED_REASON, type Cover } from '@/lib/coverage';

export const dynamic = 'force-dynamic';

const MARK: Record<Cover, { ch: string; cls: string }> = {
  covered: { ch: '✓', cls: 'cov-yes' },
  blocked: { ch: '✕', cls: 'cov-blocked' },
  planned: { ch: '◷', cls: 'cov-planned' },
  na: { ch: '–', cls: 'cov-na' },
};

export default async function CoveragePage() {
  if (!(await isAuthed())) redirect('/login');
  return (
    <div className="page">
      <header className="topbar">
        <div className="brand"><a href="/setnel" className="back">← Setnel</a><span className="brand-sub">Coverage map</span></div>
      </header>
      <section className="panel">
        <div className="panel-head"><h2>Detector coverage</h2><span className="panel-note">what each dashboard is — and isn’t — watched for</span></div>
        <div className="cov-wrap">
          <table className="cov-table">
            <thead>
              <tr>
                <th align="left">Risk type</th>
                {COVERAGE_DASHBOARDS.map((d) => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {RISK_TYPES.map((rt) => (
                <tr key={rt}>
                  <td align="left" className="cov-risk">{rt}</td>
                  {COVERAGE_DASHBOARDS.map((d) => {
                    const c = (COVERAGE[d]?.[rt] ?? 'na') as Cover;
                    const m = MARK[c];
                    const title = c === 'blocked' ? `Blocked: ${BLOCKED_REASON[rt] ?? 'data not exposed'}` : c;
                    return <td key={d} className={m.cls} title={title}>{m.ch}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="legend">
          <span className="legend-item"><i className="cov-key cov-yes">✓</i> covered</span>
          <span className="legend-item"><i className="cov-key cov-blocked">✕</i> blocked (data gap)</span>
          <span className="legend-item"><i className="cov-key cov-planned">◷</i> planned (not wired)</span>
          <span className="legend-item"><i className="cov-key cov-na">–</i> n/a</span>
        </div>
        <p className="panel-note" style={{ marginTop: 14 }}>
          Blocked cells need the dashboard to expose specific data (per-wallet health factors, per-asset oracle prices).
          See <code>docs/ONBOARD_A_DASHBOARD.md</code>. Planned dashboards are pending onboarding by their owner.
        </p>
      </section>
    </div>
  );
}
