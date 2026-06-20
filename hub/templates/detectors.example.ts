// Copy to: lib/setnel/detectors.ts   (or src/lib/setnel/detectors.ts)
//
// These are YOUR dashboard's alert rules. Each detector fetches data from your
// own API routes and returns zero or more events. Write one per thing you want
// to be alerted about. Delete these examples and write your own.

import { defineDetector } from './runtime';

// Where to call your own API from the cron runtime. Set SETNEL_SELF_URL to your
// dashboard's public URL (e.g. https://my-dash.vercel.app). If your app uses a
// Next.js basePath, include it (e.g. https://my-dash.vercel.app/foo).
function baseUrl(): string {
  if (process.env.SETNEL_SELF_URL) return process.env.SETNEL_SELF_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

type Overview = { totalSupplyUsd: number; totalBorrowsUsd: number; tvl: number };

// EXAMPLE 1 — absolute threshold. Available liquidity below 5% of supply.
defineDetector<Overview>({
  id: 'myprotocol.liquidity-crunch',     // unique within your dashboard
  label: 'Available liquidity below 5% of supply',
  category: 'liquidity',                 // see categories in the guide
  severity: 'critical',                  // info | warning | critical | emergency
  source: async () => {
    const r = await fetch(`${baseUrl()}/api/overview`, { cache: 'no-store' });
    return r.json();
  },
  detect: (o) => {
    if (!o.totalSupplyUsd) return [];
    const ratio = o.tvl / o.totalSupplyUsd;
    if (ratio < 0.05) {
      return [{
        message: `Available liquidity is ${(ratio * 100).toFixed(1)}% of supply`,
        fingerprint: 'myprotocol.liquidity-crunch', // stable dedup key
        linkPath: '/',                              // deep-link within your dashboard
        payload: { ratio },
      }];
    }
    return [];
  },
});

// EXAMPLE 2 — per-item loop. Alert per pool above 90% utilization. Put the
// pool symbol in the fingerprint so each pool is its own incident.
type Pools = { pools: { symbol: string; utilization: number; totalSupplyUsd: number }[] };
defineDetector<Pools>({
  id: 'myprotocol.pool-utilization',
  label: 'Pool utilization above 90%',
  category: 'liquidity',
  severity: 'critical',
  source: async () => {
    const r = await fetch(`${baseUrl()}/api/pools`, { cache: 'no-store' });
    return r.json();
  },
  detect: (d) =>
    (d.pools ?? [])
      .filter((p) => p.utilization > 90 && p.totalSupplyUsd > 50_000)
      .map((p) => ({
        message: `${p.symbol} utilization at ${p.utilization.toFixed(1)}%`,
        fingerprint: `myprotocol.pool-utilization:${p.symbol}`,
        linkPath: `/pools/${p.symbol}`,
        payload: { symbol: p.symbol, utilization: p.utilization },
      })),
});

// EXAMPLE 3 — change over time. Compare a daily series to N days ago.
type History = { history: { date: string; tvl: number }[] };
defineDetector<History>({
  id: 'myprotocol.tvl-drop-24h',
  label: 'TVL dropped more than 10% in 24h',
  category: 'flows',
  severity: 'critical',
  source: async () => {
    const r = await fetch(`${baseUrl()}/api/history`, { cache: 'no-store' });
    return r.json();
  },
  detect: (h) => {
    const s = h.history ?? [];
    if (s.length < 2) return [];
    const latest = s[s.length - 1].tvl;
    const prior = s[s.length - 2].tvl;
    if (!latest || !prior) return [];
    const pct = ((latest - prior) / prior) * 100;
    if (pct <= -10) {
      return [{
        message: `TVL dropped ${pct.toFixed(1)}% in 24h`,
        fingerprint: 'myprotocol.tvl-drop-24h',
        linkPath: '/',
        payload: { pct, from: prior, to: latest },
      }];
    }
    return [];
  },
});
