import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getSummary, getHealthMatrix, getChartBundle, getSla } from '@/lib/queries';
import { getSloTargets } from '@/lib/admin';
import { TrendChart } from './trend-chart';

export const dynamic = 'force-dynamic';

export default async function SetnelConsole() {
  if (!(await isAuthed())) redirect('/login');

  const [summary, health, bundle, sla, slo] = await Promise.all([
    getSummary(),
    getHealthMatrix(),
    getChartBundle(30),
    getSla(30),
    getSloTargets(),
  ]);

  const healthy = health.filter((h) => h.status === 'healthy').length;
  const collectingToday = health.filter((h) => h.checksToday > 0).length;

  const ackTone = sla.ackRatePct >= slo.ackRateTarget ? 'good' : 'bad';
  const ttaTone = sla.avgTimeToAckMin == null ? '' : sla.avgTimeToAckMin <= slo.mttaTargetMin ? 'good' : 'bad';
  const ttrTone = sla.avgTimeToResolveMin == null ? '' : sla.avgTimeToResolveMin <= slo.mttrTargetMin ? 'good' : 'bad';
  const fpTone = sla.falsePositivePct <= slo.fpRateTarget ? 'good' : 'bad';

  return (
    <>
      {/* KPI strip — the at-a-glance. Detail lives in Dashboards / Incidents. */}
      <section className="kpis">
        <Kpi label="Dashboards" value={String(health.length)} sub="monitored" href="/setnel/dashboards" />
        <Kpi
          label="Collecting today"
          value={`${collectingToday}/${health.length}`}
          sub="checked in"
          tone={collectingToday === health.length ? 'good' : collectingToday === 0 ? 'bad' : 'warn'}
          href="/setnel/dashboards"
        />
        <Kpi label="Healthy" value={`${healthy}/${health.length}`} sub="< 24h since last check" tone={healthy === health.length ? 'good' : 'warn'} href="/setnel/dashboards" />
        <Kpi label="Active incidents" value={String(summary.activeCount)} sub="open now" tone={summary.activeCount === 0 ? 'good' : 'warn'} href="/setnel/incidents" />
        {summary.failedNotifications > 0 ? (
          <Kpi label="Delivery failures" value={String(summary.failedNotifications)} sub="undelivered alerts" tone="bad" href="/setnel/settings" />
        ) : (
          <Kpi label="Critical" value={String(summary.criticalActive)} sub="active" tone={summary.criticalActive === 0 ? 'good' : 'bad'} href="/setnel/incidents?severity=critical" />
        )}
      </section>

      {/* SLA / response metrics vs. targets */}
      <section className="sla">
        <span className={`sla-item ${ackTone === 'bad' ? 'sla-bad' : ''}`}><b>{sla.ackRatePct}%</b> acknowledged</span>
        <span className={`sla-item ${ttaTone === 'bad' ? 'sla-bad' : ''}`}><b>{sla.avgTimeToAckMin == null ? '—' : sla.avgTimeToAckMin + 'm'}</b> avg time to ack</span>
        <span className={`sla-item ${ttrTone === 'bad' ? 'sla-bad' : ''}`}><b>{sla.avgTimeToResolveMin == null ? '—' : sla.avgTimeToResolveMin + 'm'}</b> avg time to resolve</span>
        <span className={`sla-item ${fpTone === 'bad' ? 'sla-bad' : ''}`}><b>{sla.falsePositivePct}%</b> false positives</span>
        <span className="sla-note">last 30 days · {sla.total} incidents · <a className="card-detail" href="/setnel/reports">reports →</a></span>
      </section>

      {/* Trend — the one rich visual that belongs on the overview */}
      <section className="panel">
        <div className="panel-head">
          <h2>Trends</h2>
          <span className="panel-note">Last 30 days · switch the breakdown, click the legend to toggle lines</span>
        </div>
        <TrendChart bundle={bundle} />
      </section>
    </>
  );
}

function Kpi({ label, value, sub, tone, href }: { label: string; value: string; sub: string; tone?: 'good' | 'warn' | 'bad'; href?: string }) {
  const inner = (
    <>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">{sub}</div>
    </>
  );
  const cls = `kpi ${tone ? `kpi-${tone}` : ''}${href ? ' kpi-link' : ''}`;
  return href ? <a className={cls} href={href}>{inner}</a> : <div className={cls}>{inner}</div>;
}
