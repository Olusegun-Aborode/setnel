// Backtest — replay the adaptive rule over stored history; red = would have fired.
function Backtest() {
  const { Panel, Sparkline } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const results = D.METRICS.map((m) => ({ m, fired: D.backtestFires(m.points) }));
  const fmt = (n) => n === 0 ? 'clean' : `${n} fire${n === 1 ? '' : 's'}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--panel-gap)' }}>
      <Panel title="Threshold backtest" note="replaying |z|>3 & move>8% over stored history · red = would have fired" divided>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {results.map(({ m, fired }) => {
            const tone = fired.length > 3 ? 'var(--critical)' : fired.length > 0 ? 'var(--warning)' : 'var(--good)';
            return (
              <div key={m.key} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 12px', background: 'var(--panel)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>{m.key}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 600, color: tone }}>{fmt(fired.length)}</span>
                </div>
                <Sparkline points={m.points} fired={fired} showLast={false} width={300} height={84} />
                <div style={{ fontSize: 10.5, color: 'var(--faint)', marginTop: 4 }}>{m.dashboard} · {m.points.length} samples</div>
              </div>
            );
          })}
        </div>
        <p style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
          Many fires on one metric ⇒ the threshold is too sensitive for its volatility; zero across a known event ⇒ too loose.
          Tune <code style={{ fontFamily: 'var(--font-mono)' }}>SETNEL_BASELINE_Z</code> / <code style={{ fontFamily: 'var(--font-mono)' }}>SETNEL_BASELINE_MIN_PCT</code> and re-check.
        </p>
      </Panel>
    </div>
  );
}

Object.assign(window, { Backtest });
