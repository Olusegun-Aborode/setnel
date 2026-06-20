import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

// Dead-simple shared-password auth for an internal tool. One password for the
// whole team. On login we set a signed cookie; middleware/pages check it.
//
// The cookie value is `<issuedAtMs>.<hmac>` where hmac signs the issuedAt with
// SETNEL_SESSION_SECRET. No per-user identity — this is a team gate, not a
// user system.

const COOKIE = 'setnel_session';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function sessionSecret(): string {
  const s = process.env.SETNEL_SESSION_SECRET;
  if (!s) throw new Error('SETNEL_SESSION_SECRET not set');
  return s;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.SETNEL_PASSWORD ?? '';
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function sign(issuedAt: string): string {
  return createHmac('sha256', sessionSecret()).update(issuedAt).digest('hex');
}

export async function createSession(): Promise<void> {
  const issuedAt = String(Date.now());
  const value = `${issuedAt}.${sign(issuedAt)}`;
  const jar = await cookies();
  jar.set(COOKIE, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(MAX_AGE_MS / 1000),
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const [issuedAt, mac] = raw.split('.');
  if (!issuedAt || !mac) return false;
  // Verify signature.
  const expected = sign(issuedAt);
  const a = Buffer.from(expected, 'hex');
  let b: Buffer;
  try {
    b = Buffer.from(mac, 'hex');
  } catch {
    return false;
  }
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  // Check age.
  const age = Date.now() - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 && age < MAX_AGE_MS;
}
