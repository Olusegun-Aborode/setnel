// Phase 7 — detector coverage map. Risk type × dashboard, so the blind spots
// are explicit. 'covered' = a detector exists; 'blocked' = the dashboard doesn't
// expose the data yet; 'planned' = dashboard not wired into Setnel yet; 'n/a'.

export type Cover = 'covered' | 'blocked' | 'planned' | 'na';

export const RISK_TYPES = [
  'TVL / flows',
  'Liquidity / utilization',
  'Liquidations',
  'Bad debt',
  'At-risk liquidations',
  'Oracle deviation',
  'Stablecoin depeg',
  'Concentration (HHI)',
  'Revenue',
  'Data integrity',
  'Statistical anomaly',
] as const;
export type RiskType = (typeof RISK_TYPES)[number];

export const COVERAGE_DASHBOARDS = ['Aave V3', 'State of SUI', 'SparkLend', 'Lending Intel', 'Liquidator'] as const;
export type CoverageDash = (typeof COVERAGE_DASHBOARDS)[number];

// blocked notes explain WHY (used as cell tooltip).
export const BLOCKED_REASON: Partial<Record<RiskType, string>> = {
  'Bad debt': 'needs per-wallet health-factor data',
  'At-risk liquidations': 'needs per-position collateral + HF',
  'Oracle deviation': 'needs per-asset oracle price + token address',
  'Stablecoin depeg': 'needs per-asset price',
};

// 'covered' where a detector exists today; 'blocked' where the data isn't
// exposed; 'planned' for dashboards not yet wired (colleague's three).
export const COVERAGE: Record<CoverageDash, Partial<Record<RiskType, Cover>>> = {
  'Aave V3': {
    'TVL / flows': 'covered',
    'Liquidity / utilization': 'covered',
    'Liquidations': 'covered',
    'Bad debt': 'blocked',
    'At-risk liquidations': 'blocked',
    'Oracle deviation': 'covered',
    'Stablecoin depeg': 'covered',
    'Concentration (HHI)': 'covered',
    'Revenue': 'covered',
    'Data integrity': 'covered',
    'Statistical anomaly': 'covered',
  },
  'State of SUI': {
    'TVL / flows': 'covered',
    'Liquidity / utilization': 'covered',
    'Liquidations': 'na',
    'Bad debt': 'blocked',
    'At-risk liquidations': 'blocked',
    'Oracle deviation': 'blocked',
    'Stablecoin depeg': 'blocked',
    'Concentration (HHI)': 'covered',
    'Revenue': 'na',
    'Data integrity': 'covered',
    'Statistical anomaly': 'covered',
  },
  // Not yet wired into Setnel — colleague to onboard (see ONBOARD_A_DASHBOARD.md).
  SparkLend: planned(),
  'Lending Intel': planned(),
  Liquidator: planned(),
};

function planned(): Partial<Record<RiskType, Cover>> {
  return Object.fromEntries(RISK_TYPES.map((r) => [r, 'planned'])) as Partial<Record<RiskType, Cover>>;
}
