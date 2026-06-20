import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

export const dynamic = 'force-dynamic';

// POST /login/logout — clears the session cookie and returns to /login.
export async function POST(req: Request) {
  await destroySession();
  return NextResponse.redirect(new URL('/login', req.url), { status: 303 });
}
