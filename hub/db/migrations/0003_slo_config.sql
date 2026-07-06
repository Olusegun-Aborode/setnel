-- Service-level targets, so the numbers on Reports/Console have goals to beat.
-- Single row (id = 1).
CREATE TABLE IF NOT EXISTS slo_config (
  id             INTEGER PRIMARY KEY DEFAULT 1,
  mtta_target_min  INTEGER NOT NULL DEFAULT 15,   -- ack within
  mttr_target_min  INTEGER NOT NULL DEFAULT 120,  -- resolve within
  ack_rate_target  INTEGER NOT NULL DEFAULT 90,   -- % acknowledged
  fp_rate_target   INTEGER NOT NULL DEFAULT 20,   -- % false positives (ceiling)
  updated_by     TEXT,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO slo_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
