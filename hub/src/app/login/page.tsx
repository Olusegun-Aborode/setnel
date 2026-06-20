import { login } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="login-wrap">
      <form action={login} className="login-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Datum Labs" className="login-logo" width={48} height={48} />
        <div className="login-brand">Setnel</div>
        <div className="login-sub">A Datum Labs product · risk monitoring</div>
        <input
          type="password"
          name="password"
          placeholder="Team password"
          autoFocus
          className="login-input"
        />
        {error ? <div className="login-error">Wrong password.</div> : null}
        <button type="submit" className="login-btn">
          Enter
        </button>
      </form>
    </main>
  );
}
