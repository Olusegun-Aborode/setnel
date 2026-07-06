-- Self-monitoring: every Setnel cron records a heartbeat here on each run. The
-- watchdog checks these and pages if a job goes stale (the monitor monitoring
-- itself — the "who watches the watchmen" gap).
CREATE TABLE IF NOT EXISTS cron_heartbeats (
  job          TEXT PRIMARY KEY,   -- 'ingest' | 'analyze' | 'crosscheck' | 'watchdog' | ...
  last_run_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_detail  TEXT,
  runs         BIGINT NOT NULL DEFAULT 0
);
