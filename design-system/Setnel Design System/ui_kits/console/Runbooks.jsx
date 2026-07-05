// Runbooks — what to do when each alert fires.
function Runbooks() {
  const { Panel } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  return (
    <Panel title="Runbooks" note="every detector links to what to do when it fires" divided flush>
      <div style={{ padding: '4px 18px 8px' }}>
        {D.RUNBOOKS.map((b, k) => (
          <div key={b.title} style={{ padding: '16px 0', borderTop: k === 0 ? 'none' : '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 650, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{b.title}</h3>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 10 }}>{b.when}</div>
            <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              {b.steps.map((s, n) => <li key={n}>{s}</li>)}
            </ol>
          </div>
        ))}
      </div>
    </Panel>
  );
}

Object.assign(window, { Runbooks });
