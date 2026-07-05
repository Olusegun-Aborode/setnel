// Settings — dashboards registry, integrations, members/roles.
function Settings({ dense, onDense }) {
  const { Panel, Badge, Switch, Button, StatusDot, Input } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--panel-gap)' }}>
      <Panel title="Preferences" divided>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SetRow label="Dense mode" hint="Tighter spacing across the console"><Switch checked={dense} onChange={onDense} /></SetRow>
          <SetRow label="Default time range" hint="Applied on load"><span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink)' }}>24h</span></SetRow>
          <SetRow label="Colorblind-safe status" hint="Shape + color on status dots"><Switch checked onChange={() => {}} /></SetRow>
        </div>
      </Panel>

      <Panel title="Dashboards registry" note={`${D.DASHBOARDS.length} sources`} divided flush
        aside={<Button size="sm" iconLeft={<window.Icon name="plus" size={13} />}>Add dashboard</Button>}>
        <div style={{ padding: '4px 0' }}>
          {D.DASHBOARDS.slice(0, 6).map((d) => (
            <div key={d.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 90px 70px', gap: 12, alignItems: 'center', padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--ink)' }}><StatusDot status={d.status} />{d.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)' }}>{d.id}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)' }}>~288/day</span>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Switch checked onChange={() => {}} /></div>
            </div>
          ))}
        </div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--panel-gap)' }}>
        <Panel title="Integrations" divided flush>
          <div style={{ padding: '4px 0' }}>
            {D.CHANNELS.map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{c.name}</span>
                {c.on ? <Badge variant="resolved">connected</Badge> : <Badge variant="neutral">off</Badge>}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Members & roles" divided flush aside={<Button size="sm" variant="ghost">Invite</Button>}>
          <div style={{ padding: '4px 0' }}>
            {D.MEMBERS.map((m) => (
              <div key={m.handle} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 18px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ width: 28, height: 28, borderRadius: 999, background: m.role === 'System' ? 'var(--panel-3)' : 'var(--ink)', color: m.role === 'System' ? 'var(--ink)' : '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.avatar}</span>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{m.name}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>@{m.handle}</div></div>
                <Badge variant="neutral">{m.role}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function SetRow({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{hint}</div>
      </div>
      {children}
    </div>
  );
}

Object.assign(window, { Settings });
