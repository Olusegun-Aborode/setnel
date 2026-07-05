// Mobile at-a-glance status — phone-width surface for off-hours checks.
function Mobile({ incidents, onOpen }) {
  const { Badge, StatusDot, HeatStrip } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const active = incidents.filter((i) => i.status === 'active');
  const critical = active.filter((i) => ['critical', 'emergency'].includes(i.severity)).length;
  const healthy = D.DASHBOARDS.filter((d) => d.status === 'healthy').length;
  const worst = critical > 0 ? 'bad' : active.length > 0 ? 'warn' : 'good';
  const bannerBg = worst === 'bad' ? 'var(--critical-bg)' : worst === 'warn' ? 'var(--warning-bg)' : 'var(--good-bg)';
  const bannerFg = worst === 'bad' ? 'var(--critical)' : worst === 'warn' ? 'var(--warning)' : 'var(--good)';

  return (
    <div style={{ background: 'var(--white)', height: '100%', overflowY: 'auto', fontFamily: 'var(--font-sans)' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 16px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--white)' }}>
        <img src="./logo.png" width="24" height="24" style={{ borderRadius: 6 }} alt="" />
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>Setnel</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink)' }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--good)', animation: 'setnel-pulse var(--pulse-period) var(--ease-in-out) infinite' }} />live
        </span>
      </header>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: bannerBg, borderRadius: 'var(--radius-panel)', padding: '16px 18px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: bannerFg, fontVariantNumeric: 'tabular-nums' }}>
            {active.length} active
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 2 }}>
            {critical} critical · {healthy}/{D.DASHBOARDS.length} dashboards healthy
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Active incidents</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {active.map((i) => (
              <button key={i.id} onClick={() => onOpen && onOpen(i)} style={{ textAlign: 'left', cursor: 'pointer',
                background: 'var(--panel)', border: '1px solid var(--border)', borderLeft: `3px solid ${window.SEV_COLOR[i.severity]}`,
                borderRadius: 'var(--radius)', padding: '11px 12px' }}>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{i.dashboard}</span>
                  <Badge variant={i.severity}>{i.severity}</Badge>
                  {i.exposure ? <Badge variant="exposure">{D.fmtExposure(i.exposure)}</Badge> : null}
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.4 }}>{i.message}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--faint)', marginTop: 6 }}>{i.detector} · {i.last}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Dashboard health</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {D.DASHBOARDS.slice(0, 6).map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <StatusDot status={d.status} />
                <span style={{ fontSize: 13, color: 'var(--ink)', flex: 1 }}>{d.name}</span>
                <HeatStrip levels={d.heat.slice(-7)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Mobile });
