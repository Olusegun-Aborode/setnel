-- Real per-user identity. The shared team password still gates the app; this
-- adds verifiable "who did it": each operator signs in as a specific user and
-- the session cookie carries an HMAC-signed user id (not a free-text name).
CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,              -- slug/email-local, stable
  email      TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'Responder',  -- Owner | Responder | Viewer | System
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- Short-lived magic-link tokens (hashed). Consumed on first use.
CREATE TABLE IF NOT EXISTS login_tokens (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS login_tokens_user_idx ON login_tokens (user_id);
