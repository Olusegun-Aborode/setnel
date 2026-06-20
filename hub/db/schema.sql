-- Setnel Hub schema. Internal-only alert store.
-- Run via `npm run db:push` (reads DATABASE_URL).

-- Registered dashboards. Curated by hand — one row per dashboard we monitor.
CREATE TABLE IF NOT EXISTS dashboards (
  id            TEXT PRIMARY KEY,            -- e.g. 'aave'
  name          TEXT NOT NULL,               -- e.g. 'Aave V3'
  protocol_slug TEXT NOT NULL,               -- e.g. 'aave-v3' (for filtering)
  base_url      TEXT NOT NULL,               -- for building deep links
  enabled       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Every event a detector emits. Dedup happens at the incident layer below.
CREATE TABLE IF NOT EXISTS events (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dashboard_id TEXT NOT NULL REFERENCES dashboards(id),
  detector_id  TEXT NOT NULL,                -- e.g. 'aave.utilization-cliff'
  category     TEXT NOT NULL,                -- liquidity | liquidations | flows | ...
  severity     TEXT NOT NULL,                -- info | warning | critical | emergency
  message      TEXT NOT NULL,
  payload      JSONB NOT NULL DEFAULT '{}',
  link_path    TEXT,                         -- e.g. '/markets/USDT'
  fingerprint  TEXT NOT NULL,                -- dedup key (detector_id + key fields)
  incident_id  BIGINT,
  fired_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_dashboard_fired_idx ON events (dashboard_id, fired_at DESC);
CREATE INDEX IF NOT EXISTS events_category_fired_idx  ON events (category, fired_at DESC);
CREATE INDEX IF NOT EXISTS events_fingerprint_idx     ON events (fingerprint);

-- Stateful aggregation: same fingerprint while active collapses into one incident.
CREATE TABLE IF NOT EXISTS incidents (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dashboard_id  TEXT NOT NULL REFERENCES dashboards(id),
  detector_id   TEXT NOT NULL,
  fingerprint   TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active',   -- active | resolved
  severity      TEXT NOT NULL,                    -- highest seen across the incident
  message       TEXT NOT NULL,                    -- latest message
  link_path     TEXT,
  opened_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at   TIMESTAMPTZ,
  last_event_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_count   INTEGER NOT NULL DEFAULT 1,
  notified_at   TIMESTAMPTZ                       -- last time we pinged Telegram
);
CREATE INDEX IF NOT EXISTS incidents_active_idx ON incidents (status, dashboard_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS incidents_fingerprint_idx ON incidents (fingerprint);
CREATE INDEX IF NOT EXISTS incidents_opened_idx ON incidents (opened_at DESC);

-- Daily collection heartbeat per dashboard. One row per (dashboard, day),
-- incremented on every authenticated cron check-in — even when zero alerts fire.
-- This is how we know a dashboard is still alive and collecting data daily.
CREATE TABLE IF NOT EXISTS dashboard_health (
  dashboard_id  TEXT NOT NULL REFERENCES dashboards(id),
  day           DATE NOT NULL,
  checks        INTEGER NOT NULL DEFAULT 0,
  last_check_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (dashboard_id, day)
);
CREATE INDEX IF NOT EXISTS dashboard_health_day_idx ON dashboard_health (day);

-- Metric time-series. The keystone for adaptive thresholds, drill-down charts,
-- exposure weighting, cross-source verification, and backtesting. The detector
-- runtime emits samples every run (even when no alert fires).
CREATE TABLE IF NOT EXISTS metric_samples (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dashboard_id TEXT NOT NULL REFERENCES dashboards(id),
  metric_key   TEXT NOT NULL,                     -- e.g. 'aave.tvl', 'sui.navi.tvl'
  value        DOUBLE PRECISION NOT NULL,
  source       TEXT NOT NULL DEFAULT 'dashboard', -- 'dashboard' | 'defillama' | 'chain'
  ts           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS metric_samples_key_ts ON metric_samples (dashboard_id, metric_key, ts DESC);

-- Dead-letter for notifications that failed every retry. Surfaced on the
-- console so a delivery failure is never silently lost.
CREATE TABLE IF NOT EXISTS failed_notifications (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  channel      TEXT NOT NULL,                     -- 'telegram' | 'email'
  incident_id  BIGINT,
  message      TEXT NOT NULL,
  error        TEXT,
  attempts     INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at  TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS failed_notifications_open_idx ON failed_notifications (created_at DESC) WHERE resolved_at IS NULL;
