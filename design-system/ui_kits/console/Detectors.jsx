// Detectors — list + config surface. Tune thresholds, enable/disable, mute, wired to backtest.
function Detectors({ onOpen }) {
  const { Panel, Badge, Switch } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const [dets, setDets] = React.useState(D.DETECTORS);
  const toggle = (id) => setDets((xs) => xs.map((d) => d.id === id ? { ...d, enabled: !d.enabled } : d));
  const live = dets.filter((d) => d.enabled).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--panel-gap)' }}>
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', padding: '12px 18px', background: 'var(--panel-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-panel)', fontSize: 13, color: 'var(--muted)' }}>
        <span><b style={{ color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 15 }}>{dets.length}</b> detectors</span>
        <span><b style={{ color: 'var(--good)', fontFamily: 'var(--font-mono)', fontSize: 15 }}>{live}</b> enabled</span>
        <span><b style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 15 }}>{dets.length - live}</b> disabled</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--faint)' }}>thresholds live here — no more env-var edits</span>
      </div>
      <Panel title="Detectors" note="click a rule to view or tune" divided flush>
        <div style={{ padding: '4px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 120px 90px 54px', gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
            <span className="eyebrow">Detector</span><span className="eyebrow">Rule</span>
            <span className="eyebrow">30d fires / FP</span><span className="eyebrow">Severity</span>
            <span className="eyebrow" style={{ textAlign: 'right' }}>On</span>
          </div>
          {dets.map((d) => (
            <div key={d.id} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 120px 90px 54px', gap: 12, alignItems: 'center', padding: '11px 18px', borderBottom: '1px solid var(--border)', opacity: d.enabled ? 1 : 0.55 }}>
              <button onClick={() => onOpen(d)} style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink)', fontWeight: 500 }}>{d.id}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.dashboard} · {d.desc}</div>
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-2)' }}>{d.z != null ? `z>${d.z} · ${d.minPct}%` : 'no-data ' + d.cadence}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}><b style={{ color: 'var(--ink)' }}>{d.fires30d}</b> <span style={{ color: 'var(--faint)' }}>/ {d.fp30d} fp</span></span>
              <Badge variant={d.severity}>{d.severity}</Badge>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Switch checked={d.enabled} onChange={() => toggle(d.id)} /></div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// Single detector config — the biggest gap the audit named.
function DetectorConfig({ det, onBack }) {
  const { Panel, Badge, Button, Input, Switch, MetricChart } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const metric = D.METRICS.find((m) => m.key === det.metric);
  const [z, setZ] = React.useState(det.z ?? 3);
  const [pct, setPct] = React.useState(det.minPct ?? 8);
  const [win, setWin] = React.useState(det.window ?? 40);
  const [enabled, setEnabled] = React.useState(det.enabled);

  // recompute would-fire count from the current threshold (tune-from-backtest loop)
  const fires = React.useMemo(() => {
    if (!metric) return [];
    const vals = metric.points; const out = [];
    for (let i = win; i < vals.length; i++) {
      const hist = vals.slice(i - win, i);
      const m = hist.reduce((a, b) => a + b, 0) / hist.length;
      const sd = Math.sqrt(hist.reduce((a, b) => a + (b - m) ** 2, 0) / hist.length) || 1;
      const zz = Math.abs((vals[i] - m) / sd);
      const pp = Math.abs((vals[i] - m) / Math.abs(m)) * 100;
      if (zz > z && pp > pct) out.push(i);
    }
    return out;
  }, [metric, z, pct, win]);

  const mean = metric ? metric.mean : 0;
  const trigger = metric ? mean + z * metric.sd : 0;
  const field = (label, val, set, min, max, step, suffix) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ font: 'var(--font-label)', color: 'var(--ink-2)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--ink)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', width: 56, textAlign: 'right' }}>{val}{suffix}</span>
      </div>
    </label>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--panel-gap)' }}>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', padding: '2px 0', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        <window.Icon name="arrow-left" size={14} /> Detectors
      </button>

      <Panel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{det.id}</span>
          <Badge variant={det.severity}>{det.severity}</Badge>
          <Badge variant={enabled ? 'resolved' : 'neutral'}>{enabled ? 'enabled' : 'disabled'}</Badge>
          <div style={{ marginLeft: 'auto' }}><Switch checked={enabled} onChange={setEnabled} label="Enabled" /></div>
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-2)', marginBottom: 4 }}>{det.desc}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>{det.dashboard} · metric {det.metric} · cadence {det.cadence}</div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 'var(--panel-gap)' }}>
        <Panel title="Threshold" note="tune the rule" divided>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {field('z-score >', z, setZ, 1, 5, 0.1, 'σ')}
            {field('min move >', pct, setPct, 1, 30, 1, '%')}
            {field('baseline window', win, setWin, 10, 60, 5, ' smp')}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <Button variant="primary">Save threshold</Button>
              <Button onClick={() => { setZ(det.z ?? 3); setPct(det.minPct ?? 8); setWin(det.window ?? 40); }}>Reset</Button>
            </div>
          </div>
        </Panel>

        <Panel title="Backtest preview" note="replaying the current threshold over stored history · red = would fire" divided
          aside={<Badge variant={fires.length > 4 ? 'critical' : fires.length > 0 ? 'warning' : 'resolved'}>{fires.length} would fire</Badge>}>
          {metric ? (
            <MetricChart points={metric.ts} unit={metric.unit === '%' ? '%' : ''} mean={mean}
              band={{ lo: mean - 2 * metric.sd, hi: mean + 2 * metric.sd }}
              threshold={{ value: trigger, label: `trigger ${trigger.toFixed(1)}${metric.unit === '%' ? '%' : ''}` }}
              fired={fires} height={220} />
          ) : <div style={{ color: 'var(--muted)', fontSize: 13, padding: 20 }}>No metric bound (no-data detector).</div>}
          <p style={{ marginTop: 12, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
            Drag the sliders and watch the fire count change — <b>this is the tune-from-backtest loop the audit called for.</b>
            {fires.length > 4 ? ' Too sensitive: raise z or the min move.' : fires.length === 0 ? ' Nothing fires — this may be too loose.' : ' Looks balanced.'}
          </p>
        </Panel>
      </div>
    </div>
  );
}

Object.assign(window, { Detectors, DetectorConfig });
