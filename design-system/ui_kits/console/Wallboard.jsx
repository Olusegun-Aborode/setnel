// Wallboard — read-only, big-screen NOC view. Auto-rotates through panels, dark canvas.
function Wallboard({ incidents, onClose }) {
  const { HeatStrip } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const [tick, setTick] = React.useState(0);
  const [clock, setClock] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 6000);
    const c = setInterval(() => setClock(new Date()), 1000);
    return () => { clearInterval(t); clearInterval(c); };
  }, []);
  const active = incidents.filter((i) => i.status === 'active');
  const critical = active.filter((i) => ['critical', 'emergency'].includes(i.severity)).length;
  const healthy = D.DASHBOARDS.filter((d) => d.status === 'healthy').length;
  const worst = critical > 0 ? '#dc2626' : active.length > 0 ? '#d97706' : '#16a34a';
  const worstLabel = critical > 0 ? 'CRITICAL' : active.length > 0 ? 'DEGRADED' : 'ALL CLEAR';
  const SEV = { info: '#3b82f6', warning: '#d97706', critical: '#dc2626', emergency: '#f43f5e' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#0a0a0a', color: '#fff', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', padding: '28px 34px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src="./logo.png" width="34" height="34" style={{ borderRadius: 8 }} alt="" />
        <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Setnel</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#9aa3af' }}>risk wallboard</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '7px 16px', borderRadius: 999, background: worst, fontSize: 15, fontWeight: 700, letterSpacing: '0.04em' }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: '#fff', animation: 'setnel-pulse 2s ease-in-out infinite' }} />{worstLabel}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600 }}>{clock.toLocaleTimeString('en-US', { hour12: false })}</span>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 14 }}>Exit</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 28 }}>
        {[[String(D.DASHBOARDS.length), 'DASHBOARDS', '#fff'], [`${healthy}/${D.DASHBOARDS.length}`, 'HEALTHY', '#22c55e'], [String(active.length), 'ACTIVE INCIDENTS', active.length ? '#f59e0b' : '#22c55e'], [String(critical), 'CRITICAL', critical ? '#f43f5e' : '#22c55e']].map(([v, l, c]) => (
          <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', color: c, lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 12, letterSpacing: '0.08em', color: '#9aa3af', marginTop: 10 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginTop: 20, flex: 1, minHeight: 0 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px', overflow: 'hidden' }}>
          <div style={{ fontSize: 13, letterSpacing: '0.08em', color: '#9aa3af', marginBottom: 16 }}>ACTIVE INCIDENTS</div>
          {active.length === 0 ? <div style={{ color: '#22c55e', fontSize: 20, paddingTop: 20 }}>No active incidents. All systems nominal.</div> :
            active.map((i) => (
              <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: SEV[i.severity], flex: 'none' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 600 }}>{i.dashboard} <span style={{ color: SEV[i.severity], fontSize: 12, letterSpacing: '0.05em', marginLeft: 6 }}>{i.severity.toUpperCase()}</span></div>
                  <div style={{ fontSize: 14, color: '#c4cad3', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.message}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#9aa3af' }}>{i.last}</span>
              </div>
            ))}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ fontSize: 13, letterSpacing: '0.08em', color: '#9aa3af', marginBottom: 16 }}>DASHBOARD HEALTH</div>
          {D.DASHBOARDS.slice(0, 8).map((d) => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0' }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: { healthy: '#22c55e', stale: '#f59e0b', down: '#f43f5e', idle: '#6b7280' }[d.status], flex: 'none' }} />
              <span style={{ fontSize: 15, flex: 1, color: '#e5e7eb' }}>{d.name}</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {d.heat.slice(-10).map((lv, k) => <span key={k} style={{ width: 11, height: 11, borderRadius: 2, background: ['rgba(255,255,255,0.08)', '#166534', '#22c55e', '#4ade80'][lv] }} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 16, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#4b5563' }}>auto-refresh · read-only · cycle {tick % 3 + 1}/3</div>
    </div>
  );
}

Object.assign(window, { Wallboard });
