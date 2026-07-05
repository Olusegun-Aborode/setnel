// Coverage map — risk × protocol matrix. Actionable: click a blind spot → propose a detector.
function Coverage({ onOpenDetector }) {
  const { Panel, Badge, Button, Menu, MenuItem, MenuLabel } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const [sel, setSel] = React.useState(null); // { risk, protocol, state }
  const cells = D.COVERAGE.rows.flatMap((r) => r.cells);
  const covered = cells.filter((c) => c === 'yes').length;
  const blind = cells.filter((c) => c === 'blocked').length;
  const planned = cells.filter((c) => c === 'planned').length;

  const GLYPH = { yes: '●', blocked: '✕', planned: '○', na: '·' };
  const COLOR = { yes: 'var(--good)', blocked: 'var(--critical)', planned: 'var(--warning)', na: 'var(--faint)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--panel-gap)' }}>
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', padding: '12px 18px', background: 'var(--panel-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-panel)', fontSize: 13, color: 'var(--muted)' }}>
        <span><b style={{ color: 'var(--good)', fontFamily: 'var(--font-mono)', fontSize: 15 }}>{covered}</b> detectors live</span>
        <span><b style={{ color: 'var(--warning)', fontFamily: 'var(--font-mono)', fontSize: 15 }}>{planned}</b> planned</span>
        <span><b style={{ color: 'var(--critical)', fontFamily: 'var(--font-mono)', fontSize: 15 }}>{blind}</b> blind spots</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--faint)' }}>click a cell to act</span>
      </div>

      <Panel title="Detector coverage" note="know your gaps before an exploit finds them for you" divided>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '7px 10px', borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12 }}>Risk type</th>
                {D.COVERAGE.protocols.map((p) => <th key={p} style={{ padding: '7px 10px', borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, fontWeight: 600 }}>{p}</th>)}
              </tr>
            </thead>
            <tbody>
              {D.COVERAGE.rows.map((r) => (
                <tr key={r.risk}>
                  <td style={{ textAlign: 'left', padding: '7px 10px', borderBottom: '1px solid var(--border)', fontWeight: 550, whiteSpace: 'nowrap', color: 'var(--ink)' }}>{r.risk}</td>
                  {r.cells.map((c, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '4px', borderBottom: '1px solid var(--border)' }}>
                      <button onClick={() => setSel({ risk: r.risk, protocol: D.COVERAGE.protocols[i], state: c })}
                        title={`${c} — click to act`}
                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid ' + (sel && sel.risk === r.risk && sel.protocol === D.COVERAGE.protocols[i] ? 'var(--ink)' : 'transparent'), background: c === 'blocked' ? 'var(--critical-bg)' : 'transparent', cursor: 'pointer', color: COLOR[c], fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {GLYPH[c]}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
          {[['yes','covered'],['blocked','blind spot'],['planned','planned'],['na','n/a']].map(([k, l]) => (
            <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ color: COLOR[k], fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{GLYPH[k]}</span>{l}</span>
          ))}
        </div>
      </Panel>

      {/* Action drawer for the selected cell */}
      {sel ? (
        <Panel divided title={`${sel.risk} · ${sel.protocol}`} note={sel.state === 'blocked' ? 'blind spot — no detector watches this' : sel.state === 'planned' ? 'planned — not yet live' : sel.state === 'yes' ? 'covered' : 'not applicable'}
          aside={<Button size="sm" variant="ghost" onClick={() => setSel(null)}>Close</Button>}>
          {sel.state === 'blocked' ? (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant="critical">blind spot</Badge>
              <span style={{ fontSize: 13, color: 'var(--ink-2)', flex: 1, minWidth: 200 }}>Nothing fires if <b>{sel.risk.toLowerCase()}</b> happens on <b>{sel.protocol}</b>. Propose a detector to close the gap.</span>
              <Button variant="primary" iconLeft={<window.Icon name="plus" size={14} color="#fff" />} onClick={() => onOpenDetector && onOpenDetector(D.DETECTORS[0])}>Propose detector</Button>
            </div>
          ) : sel.state === 'yes' ? (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant="resolved">covered</Badge>
              <span style={{ fontSize: 13, color: 'var(--ink-2)', flex: 1 }}>A live detector watches this. Open its config to tune the threshold.</span>
              <Button onClick={() => onOpenDetector && onOpenDetector(D.DETECTORS[0])}>Open detector</Button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Badge variant={sel.state === 'planned' ? 'warning' : 'neutral'}>{sel.state === 'planned' ? 'planned' : 'n/a'}</Badge>
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{sel.state === 'planned' ? 'On the roadmap — not yet collecting.' : 'This risk doesn’t apply to this protocol.'}</span>
            </div>
          )}
        </Panel>
      ) : null}
    </div>
  );
}

Object.assign(window, { Coverage });
