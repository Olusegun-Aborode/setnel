import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { RISK_TYPES, COVERAGE_DASHBOARDS, COVERAGE, BLOCKED_REASON, type Cover } from '@/lib/coverage';
import { getProposals } from '@/lib/admin';
import { proposeDetector, resolveProposal } from '../config-actions';

export const dynamic = 'force-dynamic';

const MARK: Record<Cover, { ch: string; cls: string }> = {
  covered: { ch: '✓', cls: 'cov-yes' },
  blocked: { ch: '✕', cls: 'cov-blocked' },
  planned: { ch: '◷', cls: 'cov-planned' },
  na: { ch: '–', cls: 'cov-na' },
};

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default async function CoveragePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (!(await isAuthed())) redirect('/login');
  const sp = await searchParams;
  const proposals = (await getProposals()).filter((p) => p.status === 'open');

  return (
    <>
      <section className="panel">
        <div className="panel-head"><h2>Detector coverage</h2><span className="panel-note">what each dashboard is — and isn’t — watched for · click a gap to propose a detector</span></div>
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
                    const isGap = c === 'blocked' || c === 'planned';
                    const title = c === 'blocked' ? `Blocked: ${BLOCKED_REASON[rt] ?? 'data not exposed'} — click to propose` : isGap ? 'Click to propose a detector' : c;
                    if (isGap) {
                      return (
                        <td key={d} className={m.cls} title={title}>
                          <a href={`?d=${encodeURIComponent(d)}&r=${encodeURIComponent(rt)}#propose`} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>{m.ch}</a>
                        </td>
                      );
                    }
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
      </section>

      <section className="panel" id="propose">
        <div className="panel-head"><h2>Propose a detector</h2><span className="panel-note">turn a blind spot into a tracked request</span></div>
        <form action={proposeDetector} className="actor-form" style={{ flexWrap: 'wrap' }}>
          <select className="actor-input" style={{ width: 200 }} name="dashboardId" defaultValue={sp.d ?? ''}>
            <option value="">— dashboard —</option>
            {COVERAGE_DASHBOARDS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="actor-input" style={{ width: 220 }} name="riskType" defaultValue={sp.r ?? ''} required>
            <option value="">— risk type —</option>
            {RISK_TYPES.map((rt) => <option key={rt} value={rt}>{rt}</option>)}
          </select>
          <input className="actor-input" style={{ width: 280 }} name="note" placeholder="what should it detect? (optional)" maxLength={500} />
          <button className="act act-primary" type="submit">Propose</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Open proposals</h2><span className="panel-note">{proposals.length} pending</span></div>
        {proposals.length === 0 ? (
          <p className="panel-note">None yet. Proposed detectors also show up in the <a className="card-detail" href="/setnel/inbox">Inbox</a>.</p>
        ) : (
          <ul className="timeline">
            {proposals.map((p) => (
              <li key={p.id} className="tl-note">
                <span className="tl-time">{fmtTime(p.created_at)}</span>
                <b>{p.dashboardId ?? 'any'}</b> · {p.riskType}
                {p.note ? <span className="panel-note"> — {p.note}</span> : null}
                {p.proposedBy ? <span className="panel-note"> · by {p.proposedBy}</span> : null}
                <form action={resolveProposal} style={{ display: 'inline', marginLeft: 8 }}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="ghost-btn" type="submit">Close</button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <p className="panel-note" style={{ marginTop: 12 }}>
          Blocked cells need the dashboard to expose specific data (per-wallet health factors, per-asset oracle prices). See <code>docs/ONBOARD_A_DASHBOARD.md</code>.
        </p>
      </section>
    </>
  );
}
