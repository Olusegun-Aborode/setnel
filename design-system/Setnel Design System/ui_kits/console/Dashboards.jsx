// Dashboards — list + per-dashboard drill-down (metrics, incidents, detectors, collection).
function Dashboards({ onOpen }) {
  const { Panel, StatusDot, HeatStrip, Badge } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  return (
    <Panel title="Dashboards" note={`${D.DASHBOARDS.length} monitored · click one to drill in`} divided flush>
      <div style={{ padding: '4px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr 90px 70px 70px', gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
          <span className="eyebrow">Dashboard</span><span className="eyebrow">14-day collection</span>
          <span className="eyebrow" style={{ textAlign: 'right' }}>Last</span>
          <span className="eyebrow" style={{ textAlign: 'right' }}>Today</span>
          <span className="eyebrow" style={{ textAlign: 'right' }}>Incidents</span>
        </div>
        {D.DASHBOARDS.map((d) => {
          const inc = D.INCIDENTS.filter((i) => i.dashboardId === d.id && i.status === 'active').length;
          return (
            <button key={d.id} onClick={() => onOpen(d)} style={{ display: 'grid', gridTemplateColumns: '210px 1fr 90px 70px 70px', gap: 12, alignItems: 'center', padding: '11px 18px', borderBottom: '1px solid var(--border)', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, fontWeight: 550, color: 'var(--ink)' }}><StatusDot status={d.status} />{d.name}</span>
              <HeatStrip levels={d.heat} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: d.status === 'down' ? 'var(--critical)' : 'var(--muted)', textAlign: 'right' }}>{d.lastCheck}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink)', textAlign: 'right' }}>{d.checksToday}</span>
              <span style={{ textAlign: 'right' }}>{inc ? <Badge variant="critical">{inc} active</Badge> : <span style={{ color: 'var(--faint)', fontSize: 12 }}>—</span>}</span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

function DashboardDetail({ dash, onBack, onOpenIncident, onOpenDetector }) {
  const { Panel, Badge, StatCard, HeatStrip, MetricChart, Button } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const metrics = D.METRICS.filter((m) => m.dashboard === dash.name);
  const incidents = D.INCIDENTS.filter((i) => i.dashboardId === dash.id);
  const detectors = D.DETECTORS.filter((d) => d.dashboard === dash.name);
  const activeInc = incidents.filter((i) => i.status === 'active');
  const fmt = (m) => m.unit === '%' ? m.latest.toFixed(1) + '%' : m.unit === '$M' ? '$' + m.latest.toFixed(1) + 'M' : m.unit === '$B' ? '$' + m.latest.toFixed(2) + 'B' : String(m.latest);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--panel-gap)' }}>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', padding: '2px 0', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        <window.Icon name="arrow-left" size={14} /> Dashboards
      </button>

      <Panel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <window.StatusFull status={dash.status} />
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{dash.name}</span>
          {activeInc.length ? <Badge variant="critical">{activeInc.length} active</Badge> : <Badge variant="resolved">all clear</Badge>}
          <Button as="a" href="#" variant="ghost" onClick={(e) => e.preventDefault()} style={{ marginLeft: 'auto' }}>Open source ↗</Button>
        </div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Checks today" value={String(dash.checksToday)} sub="target ~288" tone={dash.checksToday > 200 ? 'good' : dash.checksToday > 0 ? 'warn' : 'bad'} />
        <StatCard label="Last check" value={dash.lastCheck} tone={dash.status === 'down' ? 'bad' : dash.status === 'stale' ? 'warn' : 'good'} />
        <StatCard label="Metrics" value={String(metrics.length)} sub="tracked" />
        <StatCard label="Detectors" value={String(detectors.length)} sub={detectors.filter((d) => d.enabled).length + ' enabled'} />
      </div>

      <Panel title="Collection" note="14 days · target ~288/day" divided>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <HeatStrip levels={dash.heat} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>last check {dash.lastCheck}</span>
        </div>
      </Panel>

      {metrics.length ? (
        <Panel title="Metrics" note="against learned baseline" divided>
          <div style={{ display: 'grid', gridTemplateColumns: metrics.length > 1 ? '1fr 1fr' : '1fr', gap: 16 }}>
            {metrics.map((m) => (
              <div key={m.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>{m.key}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{fmt(m)}</span>
                </div>
                <MetricChart points={m.ts} unit={m.unit === '%' ? '%' : ''} mean={m.mean} band={{ lo: m.mean - 2 * m.sd, hi: m.mean + 2 * m.sd }} height={150} />
              </div>
            ))}
          </div>
        </Panel>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--panel-gap)' }}>
        <Panel title="Incidents" note={`${activeInc.length} active`} divided flush>
          <div style={{ padding: '6px 0' }}>
            {incidents.length === 0 ? <div style={{ padding: 20, color: 'var(--good)', fontSize: 13 }}>No incidents on this dashboard.</div> :
              incidents.map((i) => (
                <button key={i.id} onClick={() => onOpenIncident(i)} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', padding: '10px 18px' }}>
                  <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 3 }}><Badge variant={i.severity}>{i.severity}</Badge>{i.status === 'resolved' ? <Badge variant="resolved">resolved</Badge> : null}<span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--faint)', marginLeft: 'auto' }}>{i.last}</span></div>
                  <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.4 }}>{i.message}</div>
                </button>
              ))}
          </div>
        </Panel>
        <Panel title="Detectors" note={`${detectors.length} on this dashboard`} divided flush>
          <div style={{ padding: '6px 0' }}>
            {detectors.map((d) => (
              <button key={d.id} onClick={() => onOpenDetector(d)} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 10, textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', padding: '10px 18px', opacity: d.enabled ? 1 : 0.55 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink)', flex: 1 }}>{d.id}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{d.z != null ? `z>${d.z}` : d.cadence}</span>
                <Badge variant={d.severity}>{d.severity}</Badge>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// tiny helper: big status label with the shape glyph
function StatusFull({ status }) {
  const { StatusDot } = window.SetnelDesignSystem_525d6e;
  const c = { healthy: 'var(--good)', stale: 'var(--warning)', down: 'var(--critical)', idle: 'var(--faint)' }[status];
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: c, fontSize: 13, fontWeight: 600 }}><StatusDot status={status} />{status}</span>;
}

Object.assign(window, { Dashboards, DashboardDetail, StatusFull });
