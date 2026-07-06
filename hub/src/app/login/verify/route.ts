import { NextResponse } from 'next/server';
import { setUserSession } from '@/lib/session';
import { consumeLoginToken } from '@/lib/users';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /login/verify?token=... — consume a magic link and set the per-user
// session. Public: possession of a valid, unexpired, single-use token (only ever
// emailed to a whitelisted address) is the proof of identity.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  const userId = await consumeLoginToken(token);
  if (!userId) return NextResponse.redirect(new URL('/login?error=expired', req.url));
  await setUserSession(userId);
  return NextResponse.redirect(new URL('/setnel', req.url));
}
