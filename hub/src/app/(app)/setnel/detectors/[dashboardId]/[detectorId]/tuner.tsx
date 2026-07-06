'use client';

import { useState } from 'react';
import { setBaselineThreshold } from '../../../config-actions';
import { backtestFires, suggestZ } from '@/lib/detect';

type Metric = { metricKey: string; values: number[]; savedZ: number | null; savedMinPct: number | null; fpCount: number };

const MIN_SAMPLES = 20;

export function BacktestTuner({ metrics }: { metrics: Metric[] }) {
  const [z, setZ] = useState(3);
  const [minPct, setMinPct] = useState(8);
  const [window, setWindow] = useState(400);

  const rows = metrics.map((m) => ({
    ...m,
    fires: backtestFires(m.values, { z, minPct, window, minSamples: MIN_SAMPLES }).length,
    // For metrics that produced false positives, a z that would have silenced
    // every past fire — the "learn from your dismissals" suggestion.
    suggested: m.fpCount > 0 && m.values.length > MIN_SAMPLES ? suggestZ(m.values, { minPct, window, minSamples: MIN_SAMPLES }) : null,
  }));
  const totalFires = rows.reduce((a, r) => a + r.fires, 0);
  const withFps = rows.filter((r) => r.suggested != null);

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

      {withFps.length > 0 ? (
        <div className="suggest-banner">
          <b>Learn from dismissals:</b> {withFps.length} metric{withFps.length > 1 ? 's have' : ' has'} produced false positives.
          Applying the suggested z below would silence those past fires.
        </div>
      ) : null}

      <div className="cov-wrap" style={{ marginTop: 14 }}>
        <table className="cov-table">
          <thead><tr><th align="left">Metric</th><th>Samples</th><th>Would fire</th><th>FPs</th><th>Saved override</th><th>Suggestion</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.metricKey}>
                <td align="left" className="cov-risk">{r.metricKey}</td>
                <td>{r.values.length}</td>
                <td className={r.fires > 10 ? 'cov-blocked' : r.fires > 0 ? '' : 'cov-yes'} style={{ verticalAlign: 'middle' }}>{r.values.length <= MIN_SAMPLES ? 'low data' : r.fires}</td>
                <td className={r.fpCount > 0 ? 'cov-blocked' : ''} style={{ verticalAlign: 'middle' }}>{r.fpCount || '—'}</td>
                <td style={{ verticalAlign: 'middle' }}>{r.savedZ != null || r.savedMinPct != null ? `z=${r.savedZ ?? 'def'} · ${r.savedMinPct ?? 'def'}%` : <span className="kpi-sub">defaults</span>}</td>
                <td align="left" style={{ verticalAlign: 'middle' }}>
                  {r.suggested != null ? (
                    <form action={setBaselineThreshold}>
                      <input type="hidden" name="metricKey" value={r.metricKey} />
                      <input type="hidden" name="z" value={r.suggested} />
                      <input type="hidden" name="minPct" value={minPct} />
                      <input type="hidden" name="enabled" value="true" />
                      <button className="act act-primary" type="submit" title={`Raise z to ${r.suggested} to suppress the ${r.fpCount} false positive(s)`}>Apply z={r.suggested}</button>
                    </form>
                  ) : <span className="kpi-sub">—</span>}
                </td>
                <td align="left">
                  <form action={setBaselineThreshold}>
                    <input type="hidden" name="metricKey" value={r.metricKey} />
                    <input type="hidden" name="z" value={z} />
                    <input type="hidden" name="minPct" value={minPct} />
                    <input type="hidden" name="enabled" value="true" />
                    <button className="act" type="submit" title={`Save z=${z.toFixed(1)}, min=${minPct.toFixed(1)}% for this metric`}>Apply slider</button>
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
