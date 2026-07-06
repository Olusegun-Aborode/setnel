import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getIncidents, getSummary, getSla, type Filters } from '@/lib/queries';
import { getSloTargets } from '@/lib/admin';
import { IncidentCard } from '../incident-card';
import { IncidentTriage, type TriageIncident } from './triage';

export const dynamic = 'force-dynamic';

export default async function IncidentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await isAuthed())) redirect('/login');
  const sp = await searchParams;
  const filters: Filters = {
    status: (sp.status as Filters['status']) ?? 'active',
    dashboardId: sp.dashboard || undefined,
    category: sp.category || undefined,
    severity: sp.severity || undefined,
    sinceHours: sp.since ? Number(sp.since) : undefined,
  };

  const [incidents, summary, sla, slo] = await Promise.all([getIncidents(filters), getSummary(), getSla(30), getSloTargets()]);
  const active = incidents.filter((i) => i.status === 'active');
  const resolved = incidents.filter((i) => i.status === 'resolved');
  const now = Date.now();
  const triage: TriageIncident[] = active.map((i) => ({
    id: String(i.id), dashboardName: i.dashboard_name, severity: i.severity, message: i.message,
    detectorId: i.detector_id, acked: Boolean(i.acknowledged_at), ackedBy: i.acknowledged_by,
    muted: Boolean(i.muted_until && new Date(i.muted_until).getTime() > now), exposureUsd: i.exposure_usd,
    openedAt: i.opened_at, eventCount: i.event_count,
  }));

  const unacked = active.filter((i) => !i.acknowledged_at).length;
  const exposure = active.reduce((a, i) => a + (i.exposure_usd ?? 0), 0);
  const fmtUsd = (n: number) => (n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(0)}K` : `$${n.toFixed(0)}`);

  return (
    <>
      <section className="kpis">
        <div className={`kpi ${summary.activeCount ? 'kpi-warn' : 'kpi-good'}`}><div className="kpi-label">Active</div><div className="kpi-value">{summary.activeCount}</div><div className="kpi-sub">{unacked} unacked</div></div>
        <div className={`kpi ${summary.criticalActive ? 'kpi-bad' : 'kpi-good'}`}><div className="kpi-label">Critical</div><div className="kpi-value">{summary.criticalActive}</div><div className="kpi-sub">need attention</div></div>
        <div className="kpi"><div className="kpi-label">Opened 24h</div><div className="kpi-value">{summary.last24h}</div><div className="kpi-sub">new incidents</div></div>
        <div className={`kpi ${sla.ackRatePct >= slo.ackRateTarget ? 'kpi-good' : 'kpi-bad'}`}><div className="kpi-label">Ack rate</div><div className="kpi-value">{sla.ackRatePct}%</div><div className="kpi-sub">target ≥ {slo.ackRateTarget}% · MTTA {sla.avgTimeToAckMin == null ? '—' : sla.avgTimeToAckMin + 'm'}</div></div>
        <div className="kpi"><div className="kpi-label">Exposure at risk</div><div className="kpi-value" style={{ fontSize: 22 }}>{exposure > 0 ? fmtUsd(exposure) : '—'}</div><div className="kpi-sub">across active incidents</div></div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Incidents</h2>
          <span className="panel-note">{summary.activeCount} active · {summary.last24h} opened in the last 24h</span>
        </div>

        <nav className="filters">
          <FilterLink sp={sp} k="status" v="active" label="Active" />
          <FilterLink sp={sp} k="status" v="all" label="All" />
          <span className="filter-sep" />
          <FilterLink sp={sp} k="severity" v="warning" label="Warning" />
          <FilterLink sp={sp} k="severity" v="critical" label="Critical" />
          <FilterLink sp={sp} k="severity" v="emergency" label="Emergency" />
          <span className="filter-sep" />
          {summary.dashboards.map((d) => (
            <FilterLink key={d.id} sp={sp} k="dashboard" v={d.id} label={d.name} />
          ))}
        </nav>

        <IncidentTriage incidents={triage} />

        {resolved.length > 0 ? (
          <details className="resolved-disclosure">
            <summary>Resolved ({resolved.length})</summary>
            <ul className="feed" style={{ marginTop: 10 }}>
              {resolved.map((i) => <IncidentCard key={i.id} i={i} />)}
            </ul>
          </details>
        ) : null}
      </section>
    </>
  );
}

function FilterLink({ sp, k, v, label }: { sp: Record<string, string | undefined>; k: string; v: string; label: string }) {
  const active = sp[k] === v;
  const next = new URLSearchParams(Object.entries(sp).filter(([, val]) => val) as [string, string][]);
  if (active) next.delete(k);
  else next.set(k, v);
  const qs = next.toString();
  return (
    <a className={`chip ${active ? 'chip-on' : ''}`} href={`/setnel/incidents${qs ? `?${qs}` : ''}`}>{label}</a>
  );
}
