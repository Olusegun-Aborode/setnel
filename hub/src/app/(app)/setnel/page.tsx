import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import {
  getIncidents,
  getSummary,
  getHealthMatrix,
  getChartBundle,
  getSla,
  HEALTH_EXPECTED_PER_DAY,
  type DashboardHealth,
} from '@/lib/queries';
import { TrendChart } from './trend-chart';
import { IncidentCard, timeAgo } from './incident-card';

export const dynamic = 'force-dynamic';

export default async function SetnelConsole() {
  if (!(await isAuthed())) redirect('/login');

  const [active, summary, health, bundle, sla] = await Promise.all([
    getIncidents({ status: 'active' }),
    getSummary(),
    getHealthMatrix(),
    getChartBundle(30),
    getSla(30),
  ]);

  const healthy = health.filter((h) => h.status === 'healthy').length;
  const collectingToday = health.filter((h) => h.checksToday > 0).length;
  const preview = active.slice(0, 4);

  return (
    <>
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

      {/* SLA / response metrics */}
      <section className="sla">
        <span className="sla-item"><b>{sla.ackRatePct}%</b> acknowledged</span>
        <span className="sla-item"><b>{sla.avgTimeToAckMin == null ? '—' : sla.avgTimeToAckMin + 'm'}</b> avg time to ack</span>
        <span className="sla-item"><b>{sla.avgTimeToResolveMin == null ? '—' : sla.avgTimeToResolveMin + 'm'}</b> avg time to resolve</span>
        <span className="sla-item"><b>{sla.falsePositivePct}%</b> false positives</span>
        <span className="sla-note">last 30 days · {sla.total} incidents · <a className="card-detail" href="/setnel/reports">reports →</a></span>
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
          <span className="panel-note">Daily collection over the last 14 days · target ~{HEALTH_EXPECTED_PER_DAY}/day · <a className="card-detail" href="/setnel/dashboards">all dashboards →</a></span>
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

      {/* Active incidents — top-4 preview, full list on the Incidents tab */}
      <section className="panel">
        <div className="panel-head">
          <h2>Active incidents</h2>
          <a className="card-detail" href="/setnel/incidents">See all {summary.activeCount > 0 ? `(${summary.activeCount})` : ''} →</a>
        </div>
        <ul className="feed">
          {preview.length === 0 ? (
            <li className="empty">No active incidents. 🟢</li>
          ) : (
            preview.map((i) => <IncidentCard key={i.id} i={i} />)
          )}
        </ul>
        {active.length > preview.length ? (
          <p className="panel-note" style={{ marginTop: 10 }}>
            Showing 4 of {active.length} active. <a className="card-detail" href="/setnel/incidents">Open the full triage view →</a>
          </p>
        ) : null}
      </section>
    </>
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
    <a className="matrix-row dash-row" href={`/setnel/dashboards/${h.id}`}>
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
    </a>
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
