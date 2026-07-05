// Incident feed + card. Bulk select, mute-with-reason, keyboard ops (j/k/a/m/e), empty states.
const SEV_COLOR = { info: 'var(--info)', warning: 'var(--warning)', critical: 'var(--critical)', emergency: 'var(--emergency)' };

function IncidentCard({ i, onOpen, onAck, onMute, onFp, selectable, selected, onSelect, focused }) {
  const { Badge, Button, Checkbox, Menu, MenuItem, MenuLabel, MenuSeparator } = window.SetnelDesignSystem_525d6e;
  const D = window.SETNEL_DATA;
  return (
    <li style={{ display: 'flex', gap: 12, alignItems: 'stretch', justifyContent: 'space-between',
      background: focused ? 'var(--panel-2)' : 'var(--panel)', border: '1px solid ' + (focused ? 'var(--border-strong)' : 'var(--border)'),
      borderLeft: `3px solid ${SEV_COLOR[i.severity]}`, borderRadius: 'var(--radius)', padding: '12px 14px' }}>
      {selectable ? <div style={{ display: 'flex', alignItems: 'center', flex: 'none' }}><Checkbox checked={selected} onChange={() => onSelect(i.id)} /></div> : null}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{i.dashboard}</span>
          <Badge variant={i.severity}>{i.severity}</Badge>
          {i.status === 'resolved' ? <Badge variant="resolved">resolved</Badge> : null}
          {i.ackedBy ? <Badge variant="resolved">ack {i.ackedBy}</Badge> : null}
          {i.muted ? <Badge>muted{i.muteReason ? ' · ' + i.muteReason : ''}</Badge> : null}
          {i.fp ? <Badge>false positive</Badge> : null}
          {i.count > 1 ? <Badge variant="count">×{i.count}</Badge> : null}
          {i.exposure ? <Badge variant="exposure">{D.fmtExposure(i.exposure)} at risk</Badge> : null}
        </div>
        <a onClick={(e) => { e.preventDefault(); onOpen(i); }} href="#" style={{ display: 'block', fontSize: 14, lineHeight: 1.45, color: 'var(--ink-2)', textDecoration: 'none', maxWidth: 660 }}>{i.message}</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--faint)', marginTop: 6 }}>
          <span>{i.detector}</span><span>·</span><span>{i.last}</span><span>·</span>
          <a onClick={(e) => { e.preventDefault(); onOpen(i); }} href="#" style={{ color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>details →</a>
        </div>
      </div>
      {i.status === 'active' ? (
        <div style={{ display: 'flex', gap: 6, flex: 'none', alignSelf: 'center' }}>
          {!i.ackedBy ? <Button variant="primary" size="sm" onClick={() => onAck(i)}>Ack</Button> : null}
          <Menu align="right" trigger={<Button size="sm">Mute ▾</Button>}>
            <MenuLabel>Mute · pick a reason</MenuLabel>
            <MenuItem onSelect={() => onMute(i, '1h')}>1 hour</MenuItem>
            <MenuItem onSelect={() => onMute(i, '24h · indexer reorg')}>24h · indexer reorg</MenuItem>
            <MenuItem onSelect={() => onMute(i, 'until resolved')}>Until resolved</MenuItem>
            <MenuSeparator />
            <MenuItem danger onSelect={() => onFp(i)}>Mark false positive</MenuItem>
          </Menu>
        </div>
      ) : null}
    </li>
  );
}

function IncidentFeed({ incidents, onOpen, onAck, onMute, onFp, compact = false }) {
  const { Chip, Checkbox, Menu, MenuItem, MenuLabel, Button, Badge } = window.SetnelDesignSystem_525d6e;
  const [filter, setFilter] = React.useState('active');
  const [dash, setDash] = React.useState(null);
  const [sel, setSel] = React.useState(new Set());
  const [focus, setFocus] = React.useState(0);

  let rows = incidents;
  if (!compact) {
    if (filter === 'active') rows = rows.filter((i) => i.status === 'active');
    if (['critical', 'emergency'].includes(filter)) rows = rows.filter((i) => i.severity === filter);
    if (dash) rows = rows.filter((i) => i.dashboardId === dash);
  }
  const active = rows.filter((i) => i.status === 'active');
  const resolved = rows.filter((i) => i.status === 'resolved');
  const dashes = [...new Map(incidents.map((i) => [i.dashboardId, i.dashboard])).entries()];

  // keyboard ops: j/k move, a ack, m mute, e (open/expand)
  React.useEffect(() => {
    if (compact) return;
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      const cur = active[focus];
      if (e.key === 'j') { e.preventDefault(); setFocus((f) => Math.min(active.length - 1, f + 1)); }
      else if (e.key === 'k') { e.preventDefault(); setFocus((f) => Math.max(0, f - 1)); }
      else if (e.key === 'a' && cur && !cur.ackedBy) { e.preventDefault(); onAck(cur); }
      else if (e.key === 'm' && cur) { e.preventDefault(); onMute(cur, '1h'); }
      else if (e.key === 'x' && cur) { e.preventDefault(); toggle(cur.id); }
      else if (e.key === 'Enter' && cur) { e.preventDefault(); onOpen(cur); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, focus, compact]);

  const toggle = (id) => setSel((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allSel = active.length > 0 && active.every((i) => sel.has(i.id));
  const someSel = active.some((i) => sel.has(i.id));
  const selectAll = () => setSel(allSel ? new Set() : new Set(active.map((i) => i.id)));
  const bulk = (fn, ...args) => { active.filter((i) => sel.has(i.id)).forEach((i) => fn(i, ...args)); setSel(new Set()); };

  return (
    <div>
      {!compact ? (
        <nav style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
          <Chip active={filter === 'active'} onClick={() => setFilter('active')}>Active</Chip>
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
          <span style={{ width: 1, height: 16, background: 'var(--border-strong)', margin: '0 3px' }} />
          <Chip active={filter === 'critical'} onClick={() => setFilter(filter === 'critical' ? 'all' : 'critical')}>Critical</Chip>
          <Chip active={filter === 'emergency'} onClick={() => setFilter(filter === 'emergency' ? 'all' : 'emergency')}>Emergency</Chip>
          <span style={{ width: 1, height: 16, background: 'var(--border-strong)', margin: '0 3px' }} />
          {dashes.map(([id, name]) => <Chip key={id} active={dash === id} onClick={() => setDash(dash === id ? null : id)}>{name}</Chip>)}
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--faint)' }}>j/k move · a ack · m mute · ↵ open</span>
        </nav>
      ) : null}

      {/* bulk action bar */}
      {!compact && active.length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', marginBottom: 10, background: someSel ? 'var(--panel-2)' : 'transparent', border: '1px solid ' + (someSel ? 'var(--border-strong)' : 'transparent'), borderRadius: 8 }}>
          <Checkbox checked={allSel} indeterminate={someSel && !allSel} onChange={selectAll} />
          <span style={{ fontSize: 12.5, color: someSel ? 'var(--ink)' : 'var(--muted)' }}>{someSel ? `${sel.size} selected` : 'Select all'}</span>
          {someSel ? (
            <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
              <Button size="sm" variant="primary" onClick={() => bulk(onAck)}>Ack selected</Button>
              <Menu align="left" trigger={<Button size="sm">Mute selected ▾</Button>}>
                <MenuLabel>Mute {sel.size}</MenuLabel>
                <MenuItem onSelect={() => bulk(onMute, '1h')}>1 hour</MenuItem>
                <MenuItem onSelect={() => bulk(onMute, '24h · indexer reorg')}>24h · indexer reorg</MenuItem>
              </Menu>
              <Button size="sm" variant="danger" onClick={() => bulk(onFp)}>False positive</Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {active.length === 0 ? <window.EmptyState kind={filter === 'active' ? 'calm' : 'nofilter'} /> :
          active.map((i, idx) => <IncidentCard key={i.id} i={i} onOpen={onOpen} onAck={onAck} onMute={onMute} onFp={onFp}
            selectable={!compact} selected={sel.has(i.id)} onSelect={toggle} focused={!compact && idx === focus} />)}
      </ul>

      {!compact && resolved.length > 0 ? (
        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--muted)', padding: '6px 0' }}>Resolved ({resolved.length})</summary>
          <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.85 }}>
            {resolved.map((i) => <IncidentCard key={i.id} i={i} onOpen={onOpen} onAck={onAck} onMute={onMute} onFp={onFp} />)}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

Object.assign(window, { IncidentCard, IncidentFeed, SEV_COLOR });
