// Setnel console — demo dataset. Mirrors Datum Labs' real DeFi dashboards
// (Aave v3, Sui Lending, Stablecoin Wars, Multichain TVL, …) and the app's
// incident / detector / metric / health vocabulary. Assigned to window.
(function () {
  const DASHBOARDS = [
    { id: 'aave-v3', name: 'Aave v3', status: 'healthy', lastCheck: '3m ago', checksToday: 271 },
    { id: 'sui-lending', name: 'Sui Lending', status: 'stale', lastCheck: '31h ago', checksToday: 44 },
    { id: 'stablecoin-wars', name: 'Stablecoin Wars', status: 'down', lastCheck: '2d ago', checksToday: 0 },
    { id: 'multichain-tvl', name: 'Multichain TVL', status: 'healthy', lastCheck: '5m ago', checksToday: 268 },
    { id: 'navi', name: 'Navi', status: 'healthy', lastCheck: '2m ago', checksToday: 284 },
    { id: 'sparklend', name: 'SparkLend', status: 'healthy', lastCheck: '4m ago', checksToday: 279 },
    { id: 'fast-pair', name: 'Fast Pair', status: 'healthy', lastCheck: '6m ago', checksToday: 262 },
    { id: 'curators', name: 'Curators Comparison', status: 'stale', lastCheck: '27h ago', checksToday: 51 },
  ];

  // 14-day collection heat per dashboard (0–3).
  function heat(seed) {
    const out = [];
    let v = seed;
    for (let i = 0; i < 14; i++) { v = (v * 9301 + 49297) % 233280; out.push(Math.min(3, Math.floor((v / 233280) * 4))); }
    return out;
  }
  DASHBOARDS.forEach((d, i) => {
    if (d.status === 'down') d.heat = [1,1,0,0,1,0,0,0,1,0,0,0,0,0];
    else if (d.status === 'stale') d.heat = [2,2,1,2,2,1,1,2,2,1,2,1,1,0];
    else d.heat = heat(i * 37 + 11).map((x) => Math.max(2, x));
  });

  const INCIDENTS = [
    { id: 4821, dashboard: 'Aave v3', dashboardId: 'aave-v3', severity: 'critical', status: 'active',
      message: 'USDC utilization spiked to 94.2% — 8.1pt above its 30-day mean in under 20 minutes.',
      detector: 'aave.v3.utilization_spike', count: 6, exposure: 1_240_000_000, ackedBy: null,
      last: '4m ago', muted: false, fp: false },
    { id: 4820, dashboard: 'Stablecoin Wars', dashboardId: 'stablecoin-wars', severity: 'emergency', status: 'active',
      message: 'Collection stalled — no samples ingested in 2d 4h against a ~5-min cadence.',
      detector: 'ingest.collection_stalled', count: 1, exposure: null, ackedBy: null,
      last: '11m ago', muted: false, fp: false },
    { id: 4818, dashboard: 'Sui Lending', dashboardId: 'sui-lending', severity: 'warning', status: 'active',
      message: 'suiUSDT supply concentration (HHI) drifted to 3,140 — top wallet now 38% of supply.',
      detector: 'sui.concentration_hhi', count: 3, exposure: 42_700_000, ackedBy: 'olusegun',
      last: '52m ago', muted: false, fp: false },
    { id: 4805, dashboard: 'Navi', dashboardId: 'navi', severity: 'info', status: 'active',
      message: 'New market listed: haSUI — baseline will calibrate over the next ~40 samples.',
      detector: 'navi.market_added', count: 1, exposure: null, ackedBy: null,
      last: '3h ago', muted: true, fp: false },
    { id: 4790, dashboard: 'Aave v3', dashboardId: 'aave-v3', severity: 'critical', status: 'resolved',
      message: 'WETH borrow rate jumped to 11.4% APR — resolved after utilization normalized.',
      detector: 'aave.v3.rate_spike', count: 9, exposure: 380_000_000, ackedBy: 'joel',
      last: '6h ago', muted: false, fp: false, resolvedBy: 'joel', resolvedAt: 'Jul 05 · 08:12' },
    { id: 4781, dashboard: 'Multichain TVL', dashboardId: 'multichain-tvl', severity: 'warning', status: 'resolved',
      message: 'Base TVL dropped 6.2% in one interval — traced to an indexer reorg, not real outflow.',
      detector: 'tvl.step_drop', count: 2, exposure: null, ackedBy: 'olusegun',
      last: '1d ago', muted: false, fp: true, resolvedBy: 'olusegun', resolvedAt: 'Jul 04 · 19:40' },
  ];

  // Multi-line trend data — 30 days.
  const DAYS = Array.from({ length: 30 }, (_, i) => {
    const d = new Date('2026-06-06T00:00:00Z'); d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
  function series(seed, base, amp) {
    let v = seed; const out = [];
    for (let i = 0; i < 30; i++) { v = (v * 1103515245 + 12345) % 2147483648; out.push(Math.max(0, Math.round(base + Math.sin(i / 4 + seed) * amp + (v / 2147483648) * amp * 0.6))); }
    return out;
  }
  const TREND = {
    collectionByDashboard: [
      { key: 'aave-v3', label: 'Aave v3', values: series(3, 280, 12) },
      { key: 'navi', label: 'Navi', values: series(7, 275, 14) },
      { key: 'sparklend', label: 'SparkLend', values: series(11, 270, 16) },
      { key: 'sui-lending', label: 'Sui Lending', values: series(15, 120, 60) },
    ],
    alertsByCategory: [
      { key: 'utilization', label: 'Utilization', values: series(2, 4, 3) },
      { key: 'concentration', label: 'Concentration', values: series(5, 2, 2) },
      { key: 'collection', label: 'Collection', values: series(9, 1, 2) },
      { key: 'rates', label: 'Rates', values: series(13, 3, 3) },
    ],
  };

  // Per-metric samples for Metrics / Backtest / spark.
  function samples(seed, base, amp, spikeAt) {
    let v = seed; const out = [];
    for (let i = 0; i < 60; i++) {
      v = (v * 1103515245 + 12345) % 2147483648;
      let val = base + Math.sin(i / 5) * amp + (v / 2147483648 - 0.5) * amp;
      if (spikeAt != null && i >= spikeAt) val += (i - spikeAt) * amp * 0.5;
      out.push(Math.max(0, val));
    }
    return out;
  }
  const METRICS = [
    { dashboard: 'Aave v3', key: 'aave.v3.usdc_utilization', unit: '%', latest: 94.2, mean: 82, sd: 4.5, points: samples(3, 82, 5, 50) },
    { dashboard: 'Aave v3', key: 'aave.v3.weth_borrow_apr', unit: '%', latest: 5.8, mean: 6.1, sd: 1.1, points: samples(7, 6, 1.2) },
    { dashboard: 'Sui Lending', key: 'sui.tvl_total', unit: '$M', latest: 42.7, mean: 45, sd: 3.2, points: samples(11, 45, 4) },
    { dashboard: 'Sui Lending', key: 'sui.suiusdt_hhi', unit: '', latest: 3140, mean: 2600, sd: 220, points: samples(15, 2600, 260, 44) },
    { dashboard: 'Navi', key: 'navi.util_weighted', unit: '%', latest: 61.4, mean: 60, sd: 3.0, points: samples(19, 60, 3.4) },
    { dashboard: 'Multichain TVL', key: 'tvl.base_total', unit: '$B', latest: 3.12, mean: 3.2, sd: 0.14, points: samples(23, 3.2, 0.15) },
  ];

  const NOTES = [
    { time: 'Jul 05 · 14:32', author: 'olusegun', body: 'Watching — if util crosses 96% we page the on-call.' },
    { time: 'Jul 05 · 14:20', author: 'setnel', body: 'Acknowledged' },
  ];
  const EVENTS = [
    { time: 'Jul 05 · 14:18', body: 'USDC utilization 94.2% (z=+3.4, +8.1pt vs mean)' },
    { time: 'Jul 05 · 14:03', body: 'USDC utilization 91.0% (z=+2.1)' },
    { time: 'Jul 05 · 13:41', body: 'USDC utilization 88.4% — first breach of warning band' },
  ];

  const RUNBOOK = {
    title: 'Utilization spike',
    when: 'Fires when a market\u2019s utilization moves >2σ and >8% above its rolling mean.',
    steps: [
      'Open the dashboard and confirm the move is real (not an indexer reorg).',
      'Check whether a single wallet is driving the borrow — cross-reference concentration.',
      'If organic and sustained, notify the protocol channel; else mute the detector 24h and note why.',
      'Log the resolution so the backtest can re-tune the threshold.',
    ],
  };

  const RUNBOOKS = [
    RUNBOOK,
    { title: 'Collection stalled', when: 'No samples ingested within 3× the expected cadence.',
      steps: ['Check the GitHub Actions run log for the dashboard\u2019s ping workflow.', 'Confirm the source API is reachable and not rate-limiting.', 'If the source is down, mute the detector and note the upstream incident.', 'Re-run the workflow; verify samples resume on the next tick.'] },
    { title: 'Data integrity divergence', when: 'Dashboard value diverges >5% from an independent source (DeFiLlama / chain).',
      steps: ['Read both values on the incident card — dashboard vs cross-source.', 'Determine which is stale: check each source\u2019s last-updated time.', 'If the dashboard is wrong, file a bug against the dashboard repo.', 'Mark false-positive only if the divergence is a known reporting difference.'] },
    { title: 'Oracle deviation', when: 'Oracle price deviates from market price beyond N bps.',
      steps: ['Confirm the deviation against a second price source.', 'Check whether liquidations are pending on the affected market.', 'Escalate to emergency if deviation persists >10 min with open exposure.'] },
  ];

  const COVERAGE = {
    protocols: ['Aave v3', 'Sui Lending', 'SparkLend', 'Navi', 'Multichain'],
    rows: [
      { risk: 'Utilization spike',        cells: ['yes', 'yes', 'planned', 'yes', 'na'] },
      { risk: 'Borrow-rate spike',        cells: ['yes', 'planned', 'planned', 'yes', 'na'] },
      { risk: 'Collection stalled',       cells: ['yes', 'yes', 'yes', 'yes', 'yes'] },
      { risk: 'Data integrity (x-source)',cells: ['yes', 'planned', 'yes', 'planned', 'yes'] },
      { risk: 'Wallet concentration',     cells: ['planned', 'yes', 'blocked', 'planned', 'na'] },
      { risk: 'Oracle deviation',         cells: ['blocked', 'blocked', 'na', 'blocked', 'na'] },
      { risk: 'Bad debt / underwater',    cells: ['blocked', 'na', 'blocked', 'blocked', 'na'] },
      { risk: 'Stablecoin depeg',         cells: ['planned', 'na', 'na', 'na', 'yes'] },
    ],
  };

  const SLA = { ackRate: 86, timeToAck: 7, timeToResolve: 34, falsePositive: 12, total: 41 };

  // Simple backtest: mark indices where a rolling z-score would have fired.
  function backtestFires(points) {
    const vals = points.map((p) => (typeof p === 'number' ? p : p.value));
    const fired = [];
    for (let i = 20; i < vals.length; i++) {
      const hist = vals.slice(Math.max(0, i - 40), i);
      const m = hist.reduce((a, b) => a + b, 0) / hist.length;
      const sd = Math.sqrt(hist.reduce((a, b) => a + (b - m) ** 2, 0) / hist.length);
      if (sd <= 0) continue;
      const z = (vals[i] - m) / sd;
      const pct = ((vals[i] - m) / Math.abs(m)) * 100;
      if (Math.abs(z) > 3 && Math.abs(pct) > 8) fired.push(i);
    }
    return fired;
  }

  // Per-metric time-series with timestamps (for MetricChart hover).
  function tseries(m) {
    const start = new Date('2026-07-05T02:00:00Z');
    return m.points.map((v, i) => {
      const d = new Date(start.getTime() + i * 20 * 60000);
      return { t: d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }), value: Number(v.toFixed(2)) };
    });
  }
  METRICS.forEach((m) => { m.ts = tseries(m); });

  // Detectors — the rules that fire incidents. Thresholds tunable here (today: env vars).
  const DETECTORS = [
    { id: 'aave.v3.utilization_spike', dashboard: 'Aave v3', metric: 'aave.v3.usdc_utilization', enabled: true,
      z: 3.0, minPct: 8, window: 40, cadence: '5m', severity: 'critical', fires30d: 6, fp30d: 1,
      desc: 'Utilization moves >z and >min% above rolling mean.', muted: null },
    { id: 'aave.v3.rate_spike', dashboard: 'Aave v3', metric: 'aave.v3.weth_borrow_apr', enabled: true,
      z: 3.5, minPct: 12, window: 40, cadence: '5m', severity: 'critical', fires30d: 9, fp30d: 0,
      desc: 'Borrow APR jumps beyond threshold.', muted: null },
    { id: 'sui.concentration_hhi', dashboard: 'Sui Lending', metric: 'sui.suiusdt_hhi', enabled: true,
      z: 2.5, minPct: 15, window: 30, cadence: '10m', severity: 'warning', fires30d: 3, fp30d: 0,
      desc: 'Supply concentration (HHI) drifts up.', muted: null },
    { id: 'ingest.collection_stalled', dashboard: 'All', metric: '—', enabled: true,
      z: null, minPct: null, window: null, cadence: '5m', severity: 'emergency', fires30d: 4, fp30d: 0,
      desc: 'No samples ingested within 3× the expected cadence.', muted: null },
    { id: 'tvl.step_drop', dashboard: 'Multichain TVL', metric: 'tvl.base_total', enabled: true,
      z: 3.0, minPct: 6, window: 40, cadence: '5m', severity: 'warning', fires30d: 2, fp30d: 1,
      desc: 'TVL drops sharply in one interval.', muted: null },
    { id: 'navi.util_drift', dashboard: 'Navi', metric: 'navi.util_weighted', enabled: false,
      z: 3.0, minPct: 8, window: 40, cadence: '5m', severity: 'warning', fires30d: 0, fp30d: 0,
      desc: 'Weighted utilization drift.', muted: 'disabled — too noisy, retuning' },
  ];

  // Cross-source provenance for incident "why it fired" — the two numbers side by side.
  const PROVENANCE = {
    4821: { rule: 'z > 3.0 AND move > 8% vs 40-sample mean', window: '40 samples · ~3h 20m', z: 3.4, movePct: 8.1,
      sources: [
        { name: 'Setnel dashboard', value: '94.2%', at: 'Jul 05 · 14:18', kind: 'primary' },
        { name: 'On-chain (RPC)', value: '94.0%', at: 'Jul 05 · 14:18', kind: 'confirm' },
        { name: 'DeFiLlama', value: '93.8%', at: 'Jul 05 · 14:15', kind: 'confirm' },
      ], baseline: '82.0% mean · σ 3.6 · trigger 90.8%' },
    4820: { rule: 'no samples within 3× cadence (15m)', window: 'since Jul 03 · 10:02', z: null, movePct: null,
      sources: [
        { name: 'Setnel dashboard', value: 'no data 2d 4h', at: 'Jul 03 · 10:02', kind: 'primary' },
        { name: 'GitHub Actions', value: 'workflow failing', at: 'Jul 03 · 10:05', kind: 'confirm' },
      ], baseline: 'expected 1 sample / 5m' },
  };

  // On-call & escalation policy (Phase 5).
  const ONCALL = {
    now: { name: 'Olusegun A.', handle: 'olusegun', until: 'Mon 09:00', avatar: 'OA' },
    next: { name: 'Joel M.', handle: 'joel', from: 'Mon 09:00', avatar: 'JM' },
    schedule: [
      { day: 'Fri Jul 04', who: 'Olusegun A.' }, { day: 'Sat Jul 05', who: 'Olusegun A.' },
      { day: 'Sun Jul 06', who: 'Olusegun A.' }, { day: 'Mon Jul 07', who: 'Joel M.' },
      { day: 'Tue Jul 08', who: 'Joel M.' },
    ],
  };
  const ESCALATION = [
    { sev: 'warning', steps: [{ after: '0m', to: '#setnel-alerts (Slack)' }, { after: '30m', to: 'on-call — email' }] },
    { sev: 'critical', steps: [{ after: '0m', to: '#setnel-alerts (Slack)' }, { after: '5m', to: 'on-call — PagerDuty' }, { after: '20m', to: 'secondary + #incidents' }] },
    { sev: 'emergency', steps: [{ after: '0m', to: 'on-call — PagerDuty (page)' }, { after: '0m', to: '#incidents + @here' }, { after: '10m', to: 'escalate to lead' }] },
  ];
  const CHANNELS = [
    { name: 'Slack · #setnel-alerts', kind: 'slack', on: true },
    { name: 'PagerDuty · Setnel service', kind: 'pagerduty', on: true },
    { name: 'Email · risk@datumlab.xyz', kind: 'email', on: true },
    { name: 'Webhook · ops-bridge', kind: 'webhook', on: false },
  ];

  // Audit log / inbox feed.
  const AUDIT = [
    { time: 'Jul 05 · 14:22', actor: 'olusegun', action: 'acknowledged', target: '#4818 · Sui concentration', kind: 'ack' },
    { time: 'Jul 05 · 14:03', actor: 'setnel', action: 'opened', target: '#4821 · Aave USDC utilization', kind: 'open' },
    { time: 'Jul 05 · 13:20', actor: 'joel', action: 'resolved', target: '#4790 · WETH borrow rate', kind: 'resolve' },
    { time: 'Jul 05 · 11:48', actor: 'olusegun', action: 'muted 24h', target: 'navi.util_drift · too noisy', kind: 'mute' },
    { time: 'Jul 04 · 19:40', actor: 'olusegun', action: 'marked false positive', target: '#4781 · Base TVL drop', kind: 'fp' },
    { time: 'Jul 04 · 16:12', actor: 'joel', action: 'edited threshold', target: 'aave.v3.rate_spike z 3.2 → 3.5', kind: 'config' },
    { time: 'Jul 04 · 09:00', actor: 'setnel', action: 'on-call handoff', target: 'joel → olusegun', kind: 'oncall' },
  ];

  // Reporting — 8-week incident history + per-detector stats.
  const WEEKS = ['May 12','May 19','May 26','Jun 02','Jun 09','Jun 16','Jun 23','Jun 30'];
  const REPORT = {
    weeks: WEEKS,
    opened: [9, 12, 7, 14, 8, 11, 6, 41 / 4 | 0].map((v, i) => [9,12,7,14,8,11,6,10][i]),
    mtta: [12, 9, 14, 8, 11, 7, 9, 7],       // minutes
    mttr: [48, 41, 55, 38, 44, 34, 39, 34],  // minutes
    fpRate: [18, 14, 22, 12, 16, 11, 13, 12],// percent
    noisiest: [
      { detector: 'aave.v3.rate_spike', fires: 9, fp: 0 },
      { detector: 'aave.v3.utilization_spike', fires: 6, fp: 1 },
      { detector: 'ingest.collection_stalled', fires: 4, fp: 0 },
      { detector: 'sui.concentration_hhi', fires: 3, fp: 0 },
      { detector: 'tvl.step_drop', fires: 2, fp: 1 },
    ],
  };

  const MEMBERS = [
    { name: 'Olusegun A.', handle: 'olusegun', role: 'Owner', avatar: 'OA' },
    { name: 'Joel M.', handle: 'joel', role: 'Responder', avatar: 'JM' },
    { name: 'Data bot', handle: 'setnel', role: 'System', avatar: 'S' },
  ];

  window.SETNEL_DATA = { DASHBOARDS, INCIDENTS, DAYS, TREND, METRICS, NOTES, EVENTS, RUNBOOK, RUNBOOKS, COVERAGE, SLA, backtestFires,
    DETECTORS, PROVENANCE, ONCALL, ESCALATION, CHANNELS, AUDIT, REPORT, MEMBERS,
    fmtExposure(n) {
      if (n == null) return '—';
      const a = Math.abs(n);
      if (a >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
      if (a >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
      if (a >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
      return `$${n.toFixed(0)}`;
    } };
})();
