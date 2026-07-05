// Inbox — the audit log / activity feed: everything that changed, and who changed it.
function Inbox({ onOpenIncident }) {
  const { Panel, Chip } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const [filter, setFilter] = React.useState('all');
  const ICON = { ack: 'check', open: 'siren', resolve: 'circle-check', mute: 'bell-off', fp: 'x', config: 'sliders-horizontal', oncall: 'user-round' };
  const TONE = { ack: 'var(--good)', open: 'var(--critical)', resolve: 'var(--good)', mute: 'var(--muted)', fp: 'var(--muted)', config: 'var(--info)', oncall: 'var(--ink-2)' };
  const rows = filter === 'all' ? D.AUDIT : D.AUDIT.filter((a) => (filter === 'incidents' ? ['ack','open','resolve','fp'].includes(a.kind) : a.kind === filter));
  return (
    <Panel title="Activity & audit log" note="every change, attributed" divided flush
      aside={<div style={{ display: 'flex', gap: 6 }}>
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
        <Chip active={filter === 'incidents'} onClick={() => setFilter('incidents')}>Incidents</Chip>
        <Chip active={filter === 'config'} onClick={() => setFilter('config')}>Config</Chip>
      </div>}>
      <ul style={{ listStyle: 'none', margin: 0, padding: '4px 0' }}>
        {rows.map((a, k) => (
          <li key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--panel-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', color: TONE[a.kind] }}>
              <window.Icon name={ICON[a.kind] || 'dot'} size={14} color={TONE[a.kind]} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: 'var(--ink)' }}><b>{a.actor}</b> <span style={{ color: 'var(--ink-2)' }}>{a.action}</span> <span style={{ color: 'var(--muted)' }}>{a.target}</span></div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--faint)', flex: 'none' }}>{a.time}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

Object.assign(window, { Inbox });
