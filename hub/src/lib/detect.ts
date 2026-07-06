// Single source of truth for the adaptive-baseline math. Previously copy-pasted
// three ways (the runner in baseline.ts, the backtest page, the live tuner) with
// subtly different window handling. Now they all call these.

export function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

export function stddev(xs: number[], m = mean(xs)): number {
  if (!xs.length) return 0;
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
}

export type BaselineParams = { z: number; minPct: number; window: number; minSamples: number };

export type BaselineEval = { fired: boolean; z: number; pct: number; mean: number; stddev: number; latest: number };

/**
 * Evaluate whether the latest value in `values` (oldest → newest) is anomalous
 * versus the trailing window that precedes it. Returns null when there isn't
 * enough history. Fires when |z| exceeds the threshold AND the percent move
 * exceeds the floor — the floor stops tiny, statistically-large wiggles paging.
 */
export function evaluateLatest(values: number[], p: BaselineParams): BaselineEval | null {
  if (values.length < p.minSamples) return null;
  const latest = values[values.length - 1];
  const hist = values.slice(Math.max(0, values.length - 1 - p.window), values.length - 1);
  const m = mean(hist);
  const sd = stddev(hist, m);
  if (sd <= 0 || m === 0) return { fired: false, z: 0, pct: 0, mean: m, stddev: sd, latest };
  const z = (latest - m) / sd;
  const pct = ((latest - m) / Math.abs(m)) * 100;
  return { fired: Math.abs(z) > p.z && Math.abs(pct) > p.minPct, z, pct, mean: m, stddev: sd, latest };
}

/**
 * The largest |z| among history points that also clear the percent floor — i.e.
 * the strongest signal the rule has seen. A z threshold just above this would
 * suppress every past fire.
 */
export function maxHistoricalZ(values: number[], p: Omit<BaselineParams, 'z'>): number {
  let mx = 0;
  for (let i = p.minSamples; i < values.length; i++) {
    const hist = values.slice(Math.max(0, i - p.window), i);
    const m = mean(hist);
    const sd = stddev(hist, m);
    if (sd <= 0 || m === 0) continue;
    const z = Math.abs((values[i] - m) / sd);
    const pct = Math.abs(((values[i] - m) / Math.abs(m)) * 100);
    if (pct > p.minPct) mx = Math.max(mx, z);
  }
  return mx;
}

/** A z threshold that would have silenced every past fire (for FP suppression). */
export function suggestZ(values: number[], p: Omit<BaselineParams, 'z'>): number {
  return Math.round((maxHistoricalZ(values, p) + 0.2) * 10) / 10;
}

/** Replay the rule over history: the indices that would have fired. */
export function backtestFires(values: number[], p: BaselineParams): number[] {
  const fired: number[] = [];
  for (let i = p.minSamples; i < values.length; i++) {
    const hist = values.slice(Math.max(0, i - p.window), i);
    const m = mean(hist);
    const sd = stddev(hist, m);
    if (sd <= 0 || m === 0) continue;
    const v = values[i];
    const z = (v - m) / sd;
    const pct = ((v - m) / Math.abs(m)) * 100;
    if (Math.abs(z) > p.z && Math.abs(pct) > p.minPct) fired.push(i);
  }
  return fired;
}
