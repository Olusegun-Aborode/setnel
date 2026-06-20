-- Seed the dashboards we monitor. Edit base_url to the real deployed URLs.
-- Safe to re-run (upserts).

INSERT INTO dashboards (id, name, protocol_slug, base_url, enabled) VALUES
  ('aave',          'Aave V3',                      'aave-v3',     'https://aave-dashboard.vercel.app',              true),
  ('centrifuge',    'Centrifuge RWA',               'centrifuge',  'https://datumlabs-centrifuge.vercel.app',        true),
  ('navi',          'Navi Lending',                 'navi',        'https://datumlabs-defi-dashboard.vercel.app/navi', true),
  ('defi_tvl',      'DeFi TVL Benchmark',           'defi-tvl',    'https://defi-tvl-dashboard.vercel.app',          true),
  ('liquidator',    'Liquidator Economy',           'liquidator',  'https://liquidator-economy-dashboard.vercel.app', true),
  ('lending_intel', 'Lending Intelligence Terminal','lending-intel','https://lending-intelligence-terminal.vercel.app', true),
  ('sparklend',     'Spark Lend',                   'sparklend',   'https://sparklend-dashboard.vercel.app',         true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  protocol_slug = EXCLUDED.protocol_slug,
  base_url = EXCLUDED.base_url,
  enabled = EXCLUDED.enabled;
