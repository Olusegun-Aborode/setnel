import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import {
  getIncidents,
  getSummary,
  getHealthMatrix,
  getChartBundle,
  HEALTH_EXPECTED_PER_DAY,
  type Filters,
  type DashboardHealth,
} from '@/lib/queries';
import { buildDeepLink } from '@/lib/ingest';
import { TrendChart } from './trend-chart';

export const dynamic = 'force-dynamic';

const SEVERITY_CLASS: Record<string, string> = {
  info: 'sev-info',
  warning: 'sev-warning',
  critical: 'sev-critical',
  emergency: 'sev-emergency',
};

function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function SetnelConsole({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await isAuthed())) redirect('/login');

  const sp = await searchParams;
  const filters: Filters = {
    status: (sp.status as Filters['status']) ?? 'all',
    dashboardId: sp.dashboard || undefined,
    category: sp.category || undefined,
    severity: sp.severity || undefined,
    sinceHours: sp.since ? Number(sp.since) : undefined,
  };

  const [incidents, summary, health, bundle] = await Promise.all([
    getIncidents(filters),
    getSummary(),
    getHealthMatrix(),
    getChartBundle(30),
  ]);

  const healthy = health.filter((h) => h.status === 'healthy').length;
  const collectingToday = health.filter((h) => h.checksToday > 0).length;

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Datum Labs" className="brand-logo" width={28} height={28} />
          <span className="brand-name">Setnel</span>
          <span className="brand-sub">by Datum Labs · Risk Monitoring</span>
        </div>
        <form action="/login/logout" method="post">
          <button className="ghost-btn" type="submit">Sign out</button>
        </form>
      </header>

      {/* KPI strip */}
      <section className="kpis">
        <Kpi label="Dashboards" value={String(health.length)} sub="monitored" />
        <Kpi
          label="Collecting today"
          value={`${collectingToday}/${health.length}`}
          sub="checked in"
          tone={collectingToday === health.length ? 'good' : collectingToday === 0 ? 'bad' : 'warn'}
        />
        <Kpi label="Healthy" value={`${healthy}/${health.length}`} sub="< 24h since last check" tone={healthy === health.length ? 'good' : 'warn'} />
        <Kpi label="Active incidents" value={String(summary.activeCount)} sub="open now" tone={summary.activeCount === 0 ? 'good' : 'warn'} />
        {summary.failedNotifications > 0 ? (
          <Kpi label="Delivery failures" value={String(summary.failedNotifications)} sub="undelivered alerts" tone="bad" />
        ) : (
          <Kpi label="Critical" value={String(summary.criticalActive)} sub="active" tone={summary.criticalActive === 0 ? 'good' : 'bad'} />
        )}
      </section>

      {/* Trend — filterable by dashboard / category / protocol */}
      <section className="panel">
        <div className="panel-head">
          <h2>Trends</h2>
          <span className="panel-note">Last 30 days · switch the breakdown, click the legend to toggle lines</span>
        </div>
        <TrendChart bundle={bundle} />
      </section>

      {/* Per-dashboard health matrix */}
      <section className="panel">
        <div className="panel-head">
          <h2>Dashboard health</h2>
          <span className="panel-note">Daily collection over the last 14 days · target ~{HEALTH_EXPECTED_PER_DAY}/day</span>
        </div>
        <div className="matrix">
          <div className="matrix-row matrix-head">
            <div className="m-name">Dashboard</div>
            <div className="m-cells m-cells-head">
              {health[0]?.cells.map((c, i) => (
                <span key={c.day} className="m-daylabel">{i % 2 === 0 ? dayNum(c.day) : ''}</span>
              ))}
            </div>
            <div className="m-last">Last check</div>
            <div className="m-today">Today</div>
          </div>
          {health.map((h) => (
            <HealthRow key={h.id} h={h} />
          ))}
        </div>
        <div className="legend">
          <span className="legend-item"><i className="cell lvl-3" /> full</span>
          <span className="legend-item"><i className="cell lvl-2" /> partial</span>
          <span className="legend-item"><i className="cell lvl-1" /> low</span>
          <span className="legend-item"><i className="cell lvl-0" /> none</span>
        </div>
      </section>

      {/* Incidents */}
      <section className="panel">
        <div className="panel-head">
          <h2>Incidents</h2>
          <span className="panel-note">{summary.last24h} opened in the last 24h</span>
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

        <ul className="feed">
          {incidents.length === 0 ? (
            <li className="empty">No incidents match these filters.</li>
          ) : (
            incidents.map((i) => {
              const deepLink = buildDeepLink(i.base_url, i.link_path, String(i.id));
              return (
                <li key={i.id} className={`card ${SEVERITY_CLASS[i.severity] ?? ''}`}>
                  <div className="card-main">
                    <div className="card-top">
                      <span className="card-dash">{i.dashboard_name}</span>
                      <span className={`badge ${SEVERITY_CLASS[i.severity] ?? ''}`}>{i.severity}</span>
                      {i.status === 'resolved' ? <span className="badge badge-resolved">resolved</span> : null}
                      {i.event_count > 1 ? <span className="badge badge-count">×{i.event_count}</span> : null}
                    </div>
                    <div className="card-msg">{i.message}</div>
                    <div className="card-meta">
                      <span>{i.detector_id}</span>
                      <span>·</span>
                      <span>{timeAgo(i.last_event_at)}</span>
                    </div>
                  </div>
                  <a className="card-open" href={deepLink} target="_blank" rel="noreferrer">Open ↗</a>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: 'good' | 'warn' | 'bad' }) {
  return (
    <div className={`kpi ${tone ? `kpi-${tone}` : ''}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  );
}

function HealthRow({ h }: { h: DashboardHealth }) {
  return (
    <div className="matrix-row">
      <div className="m-name">
        <span className={`status-dot status-${h.status}`} />
        {h.name}
      </div>
      <div className="m-cells">
        {h.cells.map((c) => (
          <span key={c.day} className={`cell lvl-${level(c.checks)}`} title={`${c.day}: ${c.checks} checks`} />
        ))}
      </div>
      <div className="m-last">{timeAgo(h.lastCheckAt)}</div>
      <div className="m-today">{h.checksToday}</div>
    </div>
  );
}

// 0 = none, 1 = low, 2 = partial, 3 = full (relative to ~288/day target).
function level(checks: number): 0 | 1 | 2 | 3 {
  if (checks <= 0) return 0;
  if (checks < 60) return 1;
  if (checks < 200) return 2;
  return 3;
}

function dayNum(iso: string): string {
  return String(new Date(iso + 'T00:00:00Z').getUTCDate());
}

function FilterLink({ sp, k, v, label }: { sp: Record<string, string | undefined>; k: string; v: string; label: string }) {
  const active = sp[k] === v;
  const next = new URLSearchParams(Object.entries(sp).filter(([, val]) => val) as [string, string][]);
  if (active) next.delete(k);
  else next.set(k, v);
  const qs = next.toString();
  return (
    <a className={`chip ${active ? 'chip-on' : ''}`} href={`/setnel${qs ? `?${qs}` : ''}`}>
      {label}
    </a>
  );
}
