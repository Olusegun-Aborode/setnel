// Independent data source: DeFiLlama. Used for cross-source verification —
// comparing a dashboard's reported value against an independent read so we catch
// when a dashboard serves wrong/stale data (the SparkLend 96%-vs-79% class).

const BASE = 'https://api.llama.fi';

/** Current protocol TVL in raw USD. Returns null on any failure (best-effort). */
export async function getProtocolTvlUsd(slug: string): Promise<number | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(`${BASE}/tvl/${slug}`, { signal: ctrl.signal, cache: 'no-store' });
    clearTimeout(t);
    if (!res.ok) return null;
    const text = await res.text();
    const n = Number(text);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}
