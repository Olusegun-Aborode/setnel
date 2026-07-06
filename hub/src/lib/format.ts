// Canonical formatting helpers. Previously duplicated across ~6 page files.

export function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Compact USD. One decimal for B/M so a feed of exposures stays scannable.
export function fmtUsd(n: number | null): string {
  if (n == null) return '—';
  const a = Math.abs(n);
  if (a >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (a >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

// Format a metric value by interpreting its key (%, HHI, $M TVL, raw USD).
export function fmtMetric(key: string, v: number): string {
  if (key.endsWith('_hhi')) return v.toFixed(0);
  if (key.includes('utilization') || key.endsWith('_pct')) return `${v.toFixed(1)}%`;
  if (key.startsWith('sui.') && (key.endsWith('.tvl') || key === 'sui.tvl_total')) return `$${v.toFixed(1)}M`;
  if (key.startsWith('aave.')) {
    const a = Math.abs(v);
    if (a >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (a >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    return `$${v.toFixed(0)}`;
  }
  return String(Math.round(v * 100) / 100);
}
