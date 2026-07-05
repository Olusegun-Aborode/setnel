// Metrics explorer — per-dashboard band charts via MetricCard.
function Metrics() {
  const { Panel, MetricCard } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const byDash = [...new Map(D.METRICS.map((m) => [m.dashboard, D.METRICS.filter((x) => x.dashboard === m.dashboard)])).entries()];
  const fmt = (m) => {
    if (m.unit === '%') return m.latest.toFixed(1) + '%';
    if (m.unit === '$M') return '$' + m.latest.toFixed(1) + 'M';
    if (m.unit === '$B') return '$' + m.latest.toFixed(2) + 'B';
    return String(m.latest);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--panel-gap)' }}>
      {byDash.map(([name, list]) => (
        <Panel key={name} title={name} note={`${list.length} metrics · grey band = normal range (mean ±2σ)`} divided>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {list.map((m) => (
              <MetricCard key={m.key} metricKey={m.key} value={fmt(m)} points={m.points}
                mean={m.mean} sd={m.sd} foot={`${m.dashboard} · ${m.points.length} samples`} />
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}

Object.assign(window, { Metrics });
