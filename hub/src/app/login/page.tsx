import { currentUser } from '@/lib/users';
import { emailConfigured } from '@/lib/notify';
import { login, requestMagicLink } from './actions';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const me = await currentUser();

  return (
    <main className="signin-wrap">
      <div className="signin-card">
        <div className="signin-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Datum Labs" className="signin-logo" width={44} height={44} />
          <div>
            <div className="signin-brand">Setnel</div>
            <div className="signin-tag">Risk monitoring · by Datum Labs</div>
          </div>
        </div>

        <p className="signin-lede">
          The console watches every Datum Labs dashboard for anomalies, data gaps, and correlated risk — and pages the on-call before it becomes an incident.
        </p>

        {me ? (
          <div className="signin-known">
            Signed in as <b>{me.name}</b>. <a className="signin-primary-link" href="/setnel">Go to the console →</a>
            <div className="signin-note" style={{ marginTop: 6 }}>Not you? Sign in with a different email below.</div>
          </div>
        ) : null}

        {sp.sent ? <div className="signin-ok">Check your inbox — a sign-in link is on its way (expires in 20 min).</div> : null}
        {sp.denied ? <div className="signin-error">That email isn’t on the allow-list. Ask an Owner to add you in Settings → Team.</div> : null}
        {sp.error === 'expired' ? <div className="signin-error">That link expired or was already used. Request a fresh one.</div> : null}
        {sp.link ? (
          <div className="signin-boot">
            Email isn’t configured yet, so here’s your one-time sign-in link:
            <a className="signin-primary-link" href={sp.link} style={{ display: 'block', marginTop: 6, wordBreak: 'break-all' }}>{sp.link}</a>
          </div>
        ) : null}

        <form action={requestMagicLink} className="signin-form">
          <label className="signin-label">Sign in with your work email</label>
          <div className="signin-row">
            <input type="email" name="email" placeholder="you@datumlab.xyz" className="login-input" required autoFocus />
            <button type="submit" className="login-btn signin-btn">{emailConfigured() ? 'Email me a link' : 'Get link'}</button>
          </div>
          <div className="signin-note">Only whitelisted teammates can enter. You’ll get a magic link — no password.</div>
        </form>

        <details className="signin-break">
          <summary>Team access (admin)</summary>
          {sp.error === '1' ? <div className="signin-error" style={{ marginTop: 8 }}>Wrong password.</div> : null}
          <form action={login} className="signin-row" style={{ marginTop: 8 }}>
            <input type="password" name="password" placeholder="Shared team password" className="login-input" />
            <button type="submit" className="login-btn signin-btn-ghost">Enter</button>
          </form>
          <div className="signin-note">Break-glass fallback. Actions taken this way are attributed to “team”, not a person.</div>
        </details>
      </div>
      <div className="signin-foot">Setnel — internal. © Datum Labs.</div>
    </main>
  );
}
