'use client';

import { useState } from 'react';
import { setBaselineThreshold } from '../../../config-actions';

type Metric = { metricKey: string; values: number[]; savedZ: number | null; savedMinPct: number | null };

const MIN_SAMPLES = 20;

// Replay the adaptive rule over history at the chosen thresholds — the same
// algorithm the live runner uses, run in the browser so the fire count updates
// as you drag. Window bounds how much prior history each point sees.
function fireCount(values: number[], z: number, minPct: number, window: number): number {
  let fired = 0;
  for (let i = MIN_SAMPLES; i < values.length; i++) {
    const hist = values.slice(Math.max(0, i - window), i);
    const mean = hist.reduce((a, b) => a + b, 0) / hist.length;
    const sd = Math.sqrt(hist.reduce((a, b) => a + (b - mean) ** 2, 0) / hist.length);
    if (sd <= 0 || mean === 0) continue;
    const v = values[i];
    const zz = (v - mean) / sd;
    const pct = ((v - mean) / Math.abs(mean)) * 100;
    if (Math.abs(zz) > z && Math.abs(pct) > minPct) fired++;
  }
  return fired;
}

export function BacktestTuner({ metrics }: { metrics: Metric[] }) {
  const [z, setZ] = useState(3);
  const [minPct, setMinPct] = useState(8);
  const [window, setWindow] = useState(400);

  const rows = metrics.map((m) => ({ ...m, fires: fireCount(m.values, z, minPct, window) }));
  const totalFires = rows.reduce((a, r) => a + r.fires, 0);

  return (
    <div>
      <div className="tuner-controls">
        <Slider label="z-score threshold" value={z} min={1} max={6} step={0.1} onChange={setZ} display={z.toFixed(1)} />
        <Slider label="min move %" value={minPct} min={0} max={40} step={0.5} onChange={setMinPct} display={`${minPct.toFixed(1)}%`} />
        <Slider label="window (samples)" value={window} min={50} max={800} step={10} onChange={setWindow} display={String(window)} />
        <div className="tuner-total">
          <div className="kpi-label">Would fire</div>
          <div className="kpi-value" style={{ color: totalFires > 20 ? '#dc2626' : totalFires > 5 ? '#b45309' : '#15803d' }}>{totalFires}</div>
          <div className="kpi-sub">across {metrics.length} metrics</div>
        </div>
      </div>

      <div className="cov-wrap" style={{ marginTop: 14 }}>
        <table className="cov-table">
          <thead><tr><th align="left">Metric</th><th>Samples</th><th>Would fire</th><th>Saved override</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.metricKey}>
                <td align="left" className="cov-risk">{r.metricKey}</td>
                <td>{r.values.length}</td>
                <td className={r.fires > 10 ? 'cov-blocked' : r.fires > 0 ? '' : 'cov-yes'} style={{ verticalAlign: 'middle' }}>{r.values.length <= MIN_SAMPLES ? 'low data' : r.fires}</td>
                <td style={{ verticalAlign: 'middle' }}>{r.savedZ != null || r.savedMinPct != null ? `z=${r.savedZ ?? 'def'} · ${r.savedMinPct ?? 'def'}%` : <span className="kpi-sub">defaults</span>}</td>
                <td align="left">
                  <form action={setBaselineThreshold}>
                    <input type="hidden" name="metricKey" value={r.metricKey} />
                    <input type="hidden" name="z" value={z} />
                    <input type="hidden" name="minPct" value={minPct} />
                    <input type="hidden" name="enabled" value="true" />
                    <button className="act" type="submit" title={`Save z=${z.toFixed(1)}, min=${minPct.toFixed(1)}% for this metric`}>Apply</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="panel-note" style={{ marginTop: 10 }}>
        Drag to preview; <b>Apply</b> saves that metric&rsquo;s z / min-move override (window is a preview control — the live runner uses its configured window). Saved overrides take effect on the next analyze run.
      </p>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, display }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  return (
    <label className="tuner-slider">
      <div className="kpi-label">{label} <b>{display}</b></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
