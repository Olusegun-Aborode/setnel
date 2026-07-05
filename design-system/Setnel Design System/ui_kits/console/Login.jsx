// Login gate — matches the real product: white card, logo, ink button.
function Login({ onEnter }) {
  const { Button } = window.SetnelDesignSystem_525d6e;
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--white)' }}>
      <form onSubmit={(e) => { e.preventDefault(); onEnter(); }}
        style={{ width: 340, padding: '32px 28px', background: 'var(--panel)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <img src="./logo.png" width="48" height="48" style={{ borderRadius: 10, display: 'block' }} alt="Datum Labs" />
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>Setnel</div>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>A Datum Labs product · risk monitoring</div>
        <input type="password" placeholder="Team password" defaultValue="setnel-demo" autoFocus
          style={{ padding: '11px 13px', background: 'var(--white)', border: '1px solid var(--border-strong)', borderRadius: 8, color: 'var(--ink)', fontSize: 14, outline: 'none', fontFamily: 'var(--font-sans)' }} />
        <Button variant="primary" size="lg" type="submit" style={{ width: '100%' }}>Enter</Button>
      </form>
    </div>
  );
}

Object.assign(window, { Login });
