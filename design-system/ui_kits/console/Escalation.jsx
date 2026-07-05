// Escalation & on-call — policy per severity + on-call schedule + notification channels.
function Escalation() {
  const { Panel, Badge, Switch, Button } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  const [channels, setChannels] = React.useState(D.CHANNELS);
  const toggle = (n) => setChannels((xs) => xs.map((c) => c.name === n ? { ...c, on: !c.on } : c));
  const CHIC = { slack: 'message-square', pagerduty: 'phone', email: 'mail', webhook: 'webhook' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--panel-gap)' }}>
      {/* On-call now */}
      <Panel title="On-call" note="who gets paged right now" divided>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--ink)', color: '#fff', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{D.ONCALL.now.avatar}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{D.ONCALL.now.name} <Badge variant="resolved">on-call</Badge></div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>@{D.ONCALL.now.handle} · until {D.ONCALL.now.until}</div>
            </div>
          </div>
          <window.Icon name="arrow-right" size={16} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.7 }}>
            <span style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--panel-3)', color: 'var(--ink)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{D.ONCALL.next.avatar}</span>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{D.ONCALL.next.name}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)' }}>next · from {D.ONCALL.next.from}</div></div>
          </div>
          <Button size="sm" style={{ marginLeft: 'auto' }} iconLeft={<window.Icon name="repeat" size={13} />}>Override</Button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
          {D.ONCALL.schedule.map((s) => (
            <div key={s.day} style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 8, padding: '9px 10px', background: s.who === D.ONCALL.now.name ? 'var(--panel-2)' : 'var(--panel)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--faint)' }}>{s.day}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink)', marginTop: 3, fontWeight: 500 }}>{s.who.split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Escalation policy */}
      <Panel title="Escalation policy" note="who is notified, when, per severity" divided>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {D.ESCALATION.map((e) => (
            <div key={e.sev} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 96, flex: 'none', paddingTop: 2 }}><Badge variant={e.sev}>{e.sev}</Badge></div>
              <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                {e.steps.map((s, k) => (
                  <React.Fragment key={k}>
                    {k > 0 ? <window.Icon name="chevron-right" size={13} color="var(--faint)" /> : null}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--border)', borderRadius: 999, padding: '5px 11px', fontSize: 12.5, color: 'var(--ink-2)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{s.after}</span>{s.to}
                    </span>
                  </React.Fragment>
                ))}
                <Button size="sm" variant="ghost" iconLeft={<window.Icon name="plus" size={13} />}>Step</Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Channels */}
      <Panel title="Notification channels" note="where alerts are delivered" divided flush>
        <div style={{ padding: '4px 0' }}>
          {channels.map((c) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--panel-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><window.Icon name={CHIC[c.kind]} size={15} /></span>
              <span style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)' }}>{c.name}</span>
              <Switch checked={c.on} onChange={() => toggle(c.name)} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, { Escalation });
