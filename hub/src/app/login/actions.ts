'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { checkPassword, createSession, isAuthed } from '@/lib/session';
import { getUserByEmail, createLoginToken } from '@/lib/users';
import { emailConfigured, sendMail } from '@/lib/notify';

export async function login(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  if (!checkPassword(password)) {
    redirect('/login?error=1');
  }
  await createSession();
  redirect('/setnel');
}

// Request a magic link to sign in as a specific (already-registered) user.
// Behind the team gate. If email isn't configured, the link is shown on-page as
// a bootstrap fallback (the app is already password-protected).
export async function requestMagicLink(formData: FormData) {
  if (!(await isAuthed())) redirect('/login');
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const user = await getUserByEmail(email);
  if (!user) redirect('/login/identify?error=unknown');

  const token = await createLoginToken(user.id);
  const h = await headers();
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'setnel.datumlab.xyz';
  const link = `${proto}://${host}/login/verify?token=${token}`;

  if (emailConfigured()) {
    await sendMail('Sign in to Setnel', `Click to sign in as ${user.name}:\n\n${link}\n\nThis link expires in 20 minutes.`, [user.email]);
    redirect('/login/identify?sent=1');
  }
  // Bootstrap: no email provider — surface the link directly.
  redirect(`/login/identify?link=${encodeURIComponent(link)}`);
}
