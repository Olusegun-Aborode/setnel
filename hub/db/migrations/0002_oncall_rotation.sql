-- Weekly on-call rotation. The person on call is computed from the current ISO
-- week modulo the roster size, so handoff is automatic. Empty roster → the code
-- falls back to escalation_config's static on-call.
CREATE TABLE IF NOT EXISTS oncall_rotation (
  position   INTEGER PRIMARY KEY,   -- 0-based order in the rotation
  member     TEXT NOT NULL,
  contact    TEXT,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
