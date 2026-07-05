// Dashboard health matrix — per-dashboard collection heat over 14 days.
function HealthMatrix({ dashboards }) {
  const { HeatStrip, StatusDot } = window.SetnelDesignSystem_525d6e;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 92px 56px', gap: 14, alignItems: 'center',
        padding: '0 0 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
        <span className="eyebrow">Dashboard</span>
        <span className="eyebrow">Last 14 days</span>
        <span className="eyebrow" style={{ textAlign: 'right' }}>Last check</span>
        <span className="eyebrow" style={{ textAlign: 'right' }}>Today</span>
      </div>
      {dashboards.map((d) => (
        <div key={d.id} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 92px 56px', gap: 14, alignItems: 'center', padding: '7px 0', borderTop: '1px solid var(--border)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, fontWeight: 550, color: 'var(--ink)' }}>
            <StatusDot status={d.status} />{d.name}
          </span>
          <HeatStrip levels={d.heat} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: d.status === 'down' ? 'var(--critical)' : 'var(--muted)', textAlign: 'right' }}>{d.lastCheck}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{d.checksToday}</span>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 12, color: 'var(--muted)' }}>
        {[['lvl3','full'],['lvl2','partial'],['lvl1','low'],['lvl0','none']].map(([v, l]) => (
          <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <i style={{ width: 12, height: 12, borderRadius: 3, background: `var(--${v})` }} />{l}
          </span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HealthMatrix });
