// Phase 7 — runbooks. "What do I do when this fires?" Each maps to a detector
// kind (matched by substring on detector id, then category). Shown on the
// incident drill-down and on /setnel/runbooks.

export type Runbook = { title: string; when: string; steps: string[] };

// Ordered: first id/category substring match wins.
const RUNBOOKS: { match: string; book: Runbook }[] = [
  {
    match: 'depeg',
    book: {
      title: 'Stablecoin depeg',
      when: 'A stablecoin the protocol holds/accepts drifts from $1.',
      steps: [
        'Confirm it’s real: check the asset on the dashboard + an independent source (DeFiLlama/CoinGecko). Cross-check incidents catch dashboard-data bugs — rule that out first.',
        'Size the exposure: how much of the protocol’s collateral/borrows is in this asset (see "$ at risk").',
        'If real and >2%: flag to the protocol/risk owner; consider whether borrow against it should be paused or LTV cut.',
        'Watch for cascade: a depegged collateral can trigger liquidations — check the liquidations feed.',
      ],
    },
  },
  {
    match: 'oracle',
    book: {
      title: 'Oracle deviation',
      when: 'The price the protocol reads diverges from the market price.',
      steps: [
        'Check direction + size: is the oracle stale (lagging) or wrong (manipulation)?',
        'Confirm against a second source. Small gaps (<2%) are usually latency; large/sudden gaps are the concern.',
        'If large: this is a liquidation/bad-debt risk — escalate immediately, the protocol may be pricing collateral wrong.',
        'Note the asset + chain; check whether dependent markets should be paused.',
      ],
    },
  },
  {
    match: 'liquidation',
    book: {
      title: 'Liquidation spike',
      when: 'Liquidation volume/count jumps above normal.',
      steps: [
        'Identify the collateral asset(s) driving it and the price move behind it.',
        'Check available liquidity — cascading liquidations can drain it (see liquidity detector).',
        'Watch for bad debt: positions liquidated below water leave protocol losses.',
        'If sustained: alert the protocol team; this is often the visible symptom of a depeg/oracle/price event.',
      ],
    },
  },
  {
    match: 'liquidity',
    book: {
      title: 'Liquidity crunch / high utilization',
      when: 'Available liquidity is low or utilization is near 100%.',
      steps: [
        'Confirm suppliers can still withdraw — near-100% utilization blocks withdrawals.',
        'Check if it’s organic (demand) or a single large borrower (see concentration).',
        'High utilization pushes borrow rates up sharply — usually self-corrects, but watch the trend.',
        'If a major reserve is fully utilized for a sustained period, flag to the protocol.',
      ],
    },
  },
  {
    match: 'concentration',
    book: {
      title: 'Concentration (HHI)',
      when: 'Borrows/supply concentrated in one asset or wallet.',
      steps: [
        'Identify the dominant asset/wallet. One-asset dominance makes a depeg/shock systemic.',
        'Assess: is this structural (the protocol’s main market) or a new concentration?',
        'For wallet concentration: a single large position unwinding can move the whole market.',
        'Document; concentration is a standing risk to track, not usually an immediate page.',
      ],
    },
  },
  {
    match: 'revenue',
    book: {
      title: 'Revenue anomaly',
      when: 'Protocol revenue drops well below its baseline.',
      steps: [
        'Check if borrows/utilization dropped (less interest) — usually the cause.',
        'Rule out a data-collection gap (cross-check the source freshness).',
        'Sustained revenue collapse is a business signal more than a risk one — note for the protocol.',
      ],
    },
  },
  {
    match: 'tvl',
    book: {
      title: 'TVL / flow anomaly',
      when: 'TVL or borrows move sharply vs baseline.',
      steps: [
        'Direction matters: a sharp drop = outflows (confidence/risk); a sharp rise = inflows (often fine).',
        'Check whether it’s one asset or protocol-wide.',
        'Correlate with liquidations/oracle/depeg — a TVL drop alongside those is the dangerous combination (compound rules catch this).',
        'If a large unexplained outflow: ask the protocol team.',
      ],
    },
  },
  {
    match: 'data-source',
    book: {
      title: 'Data source stale/broken',
      when: 'A dashboard’s upstream data source is stale or down.',
      steps: [
        'This is a monitoring-integrity issue: the numbers on the dashboard may be wrong/old.',
        'Check which source (e.g. DefillamaTvl/<protocol>) and how old.',
        'Tell the dashboard owner — the indexer/feed likely needs attention.',
        'Treat downstream metric alerts from that dashboard with caution until it clears.',
      ],
    },
  },
  {
    match: 'data-integrity',
    book: {
      title: 'Data integrity',
      when: 'A core metric returned zero/garbage — the data source is likely broken.',
      steps: [
        'The dashboard is serving bad data. Don’t act on its other metrics until fixed.',
        'Check the dashboard’s API directly; tell the owner.',
        'This is a code/infra issue, not a market event.',
      ],
    },
  },
  {
    match: 'crosscheck',
    book: {
      title: 'Cross-source divergence',
      when: 'A dashboard’s reported value disagrees with an independent source.',
      steps: [
        'The dashboard may be serving wrong/stale data (the SparkLend bug class).',
        'Compare the two values in the alert; check the dashboard’s API + the independent source.',
        'If the dashboard is wrong: tell the owner, and don’t trust that metric until reconciled.',
      ],
    },
  },
  {
    match: 'baseline',
    book: {
      title: 'Statistical anomaly',
      when: 'A metric moved beyond its learned normal range (z-score).',
      steps: [
        'Open the metric in /setnel/metrics — is the current point clearly outside the band?',
        'Identify what changed; cross-reference category-specific runbooks (TVL, oracle, etc.).',
        'If it’s a known/explained move, acknowledge; if unexplained, investigate the underlying metric.',
      ],
    },
  },
  {
    match: 'compound',
    book: {
      title: 'Compound / correlated alert',
      when: 'Multiple risk conditions are co-occurring.',
      steps: [
        'This is the highest-priority shape — several things wrong at once.',
        'Read the listed conditions; handle each via its own runbook, but treat the cluster as urgent.',
        'Escalate to the protocol/risk owner — correlated failures precede most incidents.',
      ],
    },
  },
];

export function getRunbook(detectorId: string, category: string): Runbook | null {
  const hay = `${detectorId} ${category}`.toLowerCase();
  for (const r of RUNBOOKS) if (hay.includes(r.match)) return r.book;
  return null;
}

export function allRunbooks(): Runbook[] {
  return RUNBOOKS.map((r) => r.book);
}
