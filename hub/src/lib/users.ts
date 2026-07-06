import { createHash, randomBytes } from 'node:crypto';
import { sql } from './db';
import { getSessionUserId } from './session';

// Per-user identity. The shared team password still gates the app; this layer
// gives verifiable attribution: a user proves their email via a magic link, and
// the session then carries an HMAC-signed user id. Unverified sessions attribute
// to 'team' rather than a forgeable free-text name.

export const USER_ROLES = ['Owner', 'Responder', 'Viewer', 'System'] as const;
export type UserRole = (typeof USER_ROLES)[number];
export type User = { id: string; email: string; name: string; role: string; lastLogin: string | null };

function idFromEmail(email: string): string {
  return email.trim().toLowerCase().split('@')[0].replace(/[^a-z0-9._-]/g, '').slice(0, 40) || 'user';
}

export async function listUsers(): Promise<User[]> {
  return (await sql`SELECT id, email, name, role, last_login AS "lastLogin" FROM users ORDER BY name`) as User[];
}

export async function getUser(id: string): Promise<User | null> {
  const r = (await sql`SELECT id, email, name, role, last_login AS "lastLogin" FROM users WHERE id = ${id} LIMIT 1`) as User[];
  return r[0] ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const r = (await sql`SELECT id, email, name, role, last_login AS "lastLogin" FROM users WHERE lower(email) = lower(${email}) LIMIT 1`) as User[];
  return r[0] ?? null;
}

export async function upsertUser(input: { email: string; name: string; role?: string }): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim().slice(0, 80) || email;
  const role = USER_ROLES.includes((input.role ?? '') as UserRole) ? input.role! : 'Responder';
  const id = idFromEmail(email);
  const r = (await sql`
    INSERT INTO users (id, email, name, role) VALUES (${id}, ${email}, ${name}, ${role})
    ON CONFLICT (email) DO UPDATE SET name = ${name}, role = ${role}
    RETURNING id, email, name, role, last_login AS "lastLogin"
  `) as User[];
  return r[0];
}

export async function setUserRole(id: string, role: string): Promise<void> {
  if (!USER_ROLES.includes(role as UserRole)) return;
  await sql`UPDATE users SET role = ${role} WHERE id = ${id}`;
}

export async function deleteUser(id: string): Promise<void> {
  await sql`DELETE FROM users WHERE id = ${id}`;
}

const hashToken = (t: string): string => createHash('sha256').update(t).digest('hex');

/** Mint a single-use magic-link token for a user. Returns the raw token (emailed). */
export async function createLoginToken(userId: string, ttlMin = 20): Promise<string> {
  const raw = randomBytes(24).toString('hex');
  await sql`
    INSERT INTO login_tokens (token_hash, user_id, expires_at)
    VALUES (${hashToken(raw)}, ${userId}, now() + (${ttlMin} || ' minutes')::interval)
  `;
  return raw;
}

/** Consume a magic-link token: valid, unexpired, unused → returns the user id once. */
export async function consumeLoginToken(raw: string): Promise<string | null> {
  const rows = (await sql`
    UPDATE login_tokens SET used_at = now()
    WHERE token_hash = ${hashToken(raw)} AND used_at IS NULL AND expires_at > now()
    RETURNING user_id
  `) as { user_id: string }[];
  const userId = rows[0]?.user_id ?? null;
  if (userId) await sql`UPDATE users SET last_login = now() WHERE id = ${userId}`;
  return userId;
}

/** The verified operator for the current request, for audit/attribution. */
export async function currentActor(): Promise<string> {
  const uid = await getSessionUserId();
  if (!uid) return 'team';
  const u = await getUser(uid);
  return u?.name ?? 'team';
}

export async function currentUser(): Promise<User | null> {
  const uid = await getSessionUserId();
  return uid ? getUser(uid) : null;
}

/** Users joined with their action counts from the audit log. */
export async function getUsersWithActivity(): Promise<(User & { actions: number })[]> {
  const users = await listUsers();
  const counts = (await sql`SELECT actor, count(*)::int AS n FROM audit_log GROUP BY actor`) as { actor: string; n: number }[];
  const byName = new Map(counts.map((c) => [c.actor, c.n]));
  return users.map((u) => ({ ...u, actions: byName.get(u.name) ?? 0 }));
}
