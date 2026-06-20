import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Each dashboard signs its event batch with a shared secret. The secret is
 * stored per-dashboard as an env var: SETNEL_DASHBOARD_SECRET_<ID_UPPER>.
 * The dashboard sends the signature in the `x-setnel-signature` header as the
 * hex HMAC-SHA256 of the raw request body.
 */
export function dashboardSecret(dashboardId: string): string | null {
  const key = `SETNEL_DASHBOARD_SECRET_${dashboardId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
  return process.env[key] ?? null;
}

export function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(expected, 'hex');
  let b: Buffer;
  try {
    b = Buffer.from(signature, 'hex');
  } catch {
    return false;
  }
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Helper a dashboard's cron route uses to sign before POSTing. Exported here so
// the per-dashboard detector kit can import the same implementation.
export function sign(rawBody: string, secret: string): string {
  return createHmac('sha256', secret).update(rawBody).digest('hex');
}
