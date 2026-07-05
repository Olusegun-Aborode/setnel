// Console overview — KPI strip, SLA row, trends, health matrix, incident preview.
function Console({ incidents, onOpen, onAck, onMute, onFp, onSeeAll }) {
  const { StatCard, Panel, Button } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const healthy = D.DASHBOARDS.filter((d) => d.status === 'healthy').length;
  const collecting = D.DASHBOARDS.filter((d) => d.checksToday > 0).length;
  const total = D.DASHBOARDS.length;
  const activeCount = incidents.filter((i) => i.status === 'active').length;
  const critical = incidents.filter((i) => i.status === 'active' && ['critical', 'emergency'].includes(i.severity)).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--panel-gap)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        <StatCard label="Dashboards" value={String(total)} sub="monitored" />
        <StatCard label="Collecting today" value={`${collecting}/${total}`} sub="checked in" tone={collecting === total ? 'good' : 'warn'} />
        <StatCard label="Healthy" value={`${healthy}/${total}`} sub="< 24h since last check" tone={healthy === total ? 'good' : 'warn'} />
        <StatCard label="Active incidents" value={String(activeCount)} sub="open now" tone={activeCount === 0 ? 'good' : 'warn'} />
        <StatCard label="Critical" value={String(critical)} sub="active" tone={critical === 0 ? 'good' : 'bad'} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap', padding: '12px 18px',
        background: 'var(--panel-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-panel)', fontSize: 13, color: 'var(--muted)' }}>
        {[[`${D.SLA.ackRate}%`, 'acknowledged'], [`${D.SLA.timeToAck}m`, 'avg time to ack'], [`${D.SLA.timeToResolve}m`, 'avg time to resolve'], [`${D.SLA.falsePositive}%`, 'false positives']].map(([v, l]) => (
          <span key={l} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
            <b style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)', fontSize: 15 }}>{v}</b>{l}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--faint)' }}>last 30 days · {D.SLA.total} incidents</span>
      </div>

      <Panel title="Trends" note="Last 30 days · click the legend to toggle lines" divided>
        <window.TrendChart bundle={D.TREND} days={D.DAYS} />
      </Panel>

      <Panel title="Dashboard health" note="Daily collection over 14 days · target ~288/day" divided flush>
        <div style={{ padding: '14px 18px 16px' }}>
          <window.HealthMatrix dashboards={D.DASHBOARDS} />
        </div>
      </Panel>

      <Panel title="Incidents" note={`${activeCount} active`} flush divided
        aside={<Button size="sm" variant="ghost" onClick={onSeeAll}>See all →</Button>}>
        <div style={{ padding: '16px 18px 18px' }}>
          <window.IncidentFeed incidents={incidents.filter((i) => i.status === 'active').slice(0, 4)} onOpen={onOpen} onAck={onAck} onMute={onMute} onFp={onFp} compact />
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, { Console });
