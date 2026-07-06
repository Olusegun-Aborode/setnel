import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getIncidents, getSummary, type Filters } from '@/lib/queries';
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

  const [incidents, summary] = await Promise.all([getIncidents(filters), getSummary()]);
  const active = incidents.filter((i) => i.status === 'active');
  const resolved = incidents.filter((i) => i.status === 'resolved');
  const triage: TriageIncident[] = active.map((i) => ({
    id: String(i.id), dashboardName: i.dashboard_name, severity: i.severity, message: i.message,
    detectorId: i.detector_id, acked: Boolean(i.acknowledged_at),
    muted: Boolean(i.muted_until && new Date(i.muted_until).getTime() > Date.now()), exposureUsd: i.exposure_usd,
  }));

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Incidents</h2>
        <span className="panel-note">{summary.activeCount} active · {summary.last24h} opened in the last 24h</span>
      </div>

      <nav className="filters">
        <FilterLink sp={sp} k="status" v="active" label="Active" />
        <FilterLink sp={sp} k="status" v="all" label="All" />
        <span className="filter-sep" />
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
