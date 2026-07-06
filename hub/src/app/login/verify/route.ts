import { NextResponse } from 'next/server';
import { isAuthed, setUserSession } from '@/lib/session';
import { consumeLoginToken } from '@/lib/users';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /login/verify?token=... — consume a magic link, set the per-user session.
// Still requires the team gate (defense in depth).
export async function GET(req: Request) {
  if (!(await isAuthed())) return NextResponse.redirect(new URL('/login', req.url));
  const token = new URL(req.url).searchParams.get('token') ?? '';
  const userId = await consumeLoginToken(token);
  if (!userId) return NextResponse.redirect(new URL('/login/identify?error=expired', req.url));
  await setUserSession(userId);
  return NextResponse.redirect(new URL('/setnel', req.url));
}
