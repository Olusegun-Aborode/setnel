import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { currentUser } from '@/lib/users';
import { emailConfigured } from '@/lib/notify';
import { requestMagicLink } from '../actions';

export const dynamic = 'force-dynamic';

export default async function IdentifyPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (!(await isAuthed())) redirect('/login');
  const sp = await searchParams;
  const me = await currentUser();

  return (
    <main className="login-wrap">
      <div className="login-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Datum Labs" className="login-logo" width={48} height={48} />
        <div className="login-brand">Who are you?</div>
        <div className="login-sub">
          {me ? <>Signed in as <b>{me.name}</b>. Switch identity below.</> : 'Verify your identity so your actions are attributed to you.'}
        </div>

        {sp.error === 'unknown' ? <div className="login-error">No user with that email. An Owner can add you in Settings → Team.</div> : null}
        {sp.error === 'expired' ? <div className="login-error">That link expired or was already used. Request a new one.</div> : null}
        {sp.sent ? <div className="login-sub" style={{ color: 'var(--good)' }}>Check your email for a sign-in link (expires in 20 min).</div> : null}
        {sp.link ? (
          <div className="login-sub" style={{ wordBreak: 'break-all', textAlign: 'left', background: 'var(--panel-2)', padding: 10, borderRadius: 8 }}>
            Email isn’t configured, so here’s your one-time sign-in link:<br />
            <a className="card-detail" href={sp.link}>{sp.link}</a>
          </div>
        ) : null}

        <form action={requestMagicLink} style={{ width: '100%', display: 'contents' }}>
          <input type="email" name="email" placeholder="you@datumlab.xyz" className="login-input" required autoFocus />
          <button type="submit" className="login-btn">{emailConfigured() ? 'Email me a sign-in link' : 'Get sign-in link'}</button>
        </form>
        <a className="card-detail" href="/setnel" style={{ marginTop: 12 }}>Skip for now (actions log as “team”)</a>
      </div>
    </main>
  );
}
