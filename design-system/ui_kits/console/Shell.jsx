// App shell — sidebar + topbar (now-state, time range, ⌘K, wallboard, density) + content.
function Icon({ name, size = 16, color = 'currentColor' }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const host = ref.current;
    if (!host || !window.lucide) return;
    host.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    host.appendChild(i);
    window.lucide.createIcons({ attrs: { width: size, height: size, stroke: color } });
  }, [name, size, color]);
  return <span ref={ref} style={{ display: 'inline-flex', width: size, height: size }} />;
}

const NAV = [
  { section: 'Monitor', items: [
    { id: 'console', icon: 'layout-dashboard', label: 'Console' },
    { id: 'incidents', icon: 'siren', label: 'Incidents' },
    { id: 'dashboards', icon: 'layout-grid', label: 'Dashboards' },
  ] },
  { section: 'Analyze', items: [
    { id: 'metrics', icon: 'activity', label: 'Metrics' },
    { id: 'coverage', icon: 'grid-3x3', label: 'Coverage' },
    { id: 'backtest', icon: 'history', label: 'Backtest' },
    { id: 'reports', icon: 'bar-chart-3', label: 'Reports' },
  ] },
  { section: 'Configure', items: [
    { id: 'detectors', icon: 'radar', label: 'Detectors' },
    { id: 'escalation', icon: 'bell-ring', label: 'Escalation' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ] },
];

const TITLES = {
  console: ['Console', 'Live risk overview across all monitored dashboards'],
  incidents: ['Incidents', 'Every alert — filter, triage, act'],
  detail: ['Incident', 'Evidence, runbook, and workflow'],
  dashboards: ['Dashboards', 'All monitored surfaces and their health'],
  dashboard: ['Dashboard', 'Metrics, incidents, detectors, and collection'],
  metrics: ['Metrics explorer', 'Per-metric values against their learned baseline'],
  coverage: ['Coverage map', 'Which risks are watched per protocol — and the blind spots'],
  backtest: ['Threshold backtest', 'Replay detector rules over stored history'],
  reports: ['Reports', 'Incident trends, response times, and detector quality'],
  detectors: ['Detectors', 'The rules that fire incidents — view, tune, enable'],
  detector: ['Detector', 'Rule, baseline, threshold, and history'],
  escalation: ['Escalation & on-call', 'Who gets paged, when, and how'],
  settings: ['Settings', 'Dashboards registry, integrations, and members'],
  inbox: ['Inbox', 'Everything that changed, and who changed it'],
};

function Shell({ active, onNav, live, seconds, onToggleLive, onSignOut, actor, onActor, activeCount,
  nowLevel, range, onRange, dense, onDense, onWallboard, onOpenPalette, onInbox, children }) {
  const { Sidebar, SidebarSection, NavItem, LiveIndicator, NowPill, TimeRange } = window.SetnelDesignSystem_525d6e;
  const key = ['detail','dashboard','detector','inbox'].includes(active)
    ? ({ detail: 'incidents', dashboard: 'dashboards', detector: 'detectors', inbox: 'console' })[active]
    : active;
  const [title, subtitle] = TITLES[active] || TITLES.console;

  const brand = (
    <>
      <img src="./logo.png" width="26" height="26" style={{ borderRadius: 6, display: 'block' }} alt="Datum Labs" />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>Setnel</div>
        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 3 }}>Datum Labs</div>
      </div>
    </>
  );
  const footer = (
    <>
      <button onClick={onInbox} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'none', border: 'none', cursor: 'pointer', font: '13px var(--font-sans)', color: 'var(--ink-2)', padding: '6px 9px', borderRadius: 7 }}>
        <Icon name="inbox" size={15} /> Inbox <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--muted)', background: 'var(--panel-2)', border: '1px solid var(--border)', borderRadius: 999, padding: '1px 6px' }}>7</span>
      </button>
      <LiveIndicator live={live} seconds={seconds} onToggle={onToggleLive} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 24, height: 24, borderRadius: 999, background: 'var(--ink)', color: '#fff', fontSize: 10.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>OA</span>
        <input value={actor} onChange={(e) => onActor(e.target.value)}
          style={{ flex: 1, minWidth: 0, font: '12px var(--font-sans)', color: 'var(--ink)', background: 'var(--white)', border: '1px solid var(--border-strong)', borderRadius: 6, padding: '5px 8px', outline: 'none' }} />
      </div>
    </>
  );

  const iconBtn = (icon, label, onClick, extra) => (
    <button onClick={onClick} title={label} aria-label={label}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '13px var(--font-sans)', color: 'var(--muted)', background: 'none', border: '1px solid var(--border-strong)', borderRadius: 7, padding: '6px 9px', cursor: 'pointer', ...(extra || {}) }}>
      <Icon name={icon} size={14} />{label ? <span>{label}</span> : null}
    </button>
  );

  const pad = dense ? '14px 18px 48px' : '20px 22px 60px';
  const gap = dense ? 12 : 16;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--white)' }}>
      <Sidebar brand={brand} footer={footer}>
        {NAV.map((sec) => (
          <SidebarSection key={sec.section} label={sec.section}>
            {sec.items.map((it) => (
              <NavItem key={it.id} icon={<Icon name={it.icon} />} label={it.label}
                active={key === it.id} onClick={() => onNav(it.id)}
                count={it.id === 'incidents' && activeCount ? activeCount : undefined} />
            ))}
          </SidebarSection>
        ))}
      </Sidebar>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, minHeight: 'var(--topbar-h)', padding: '8px 22px', borderBottom: '1px solid var(--border)', flex: 'none', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: 'var(--font-page-title)', letterSpacing: '-0.01em', color: 'var(--ink)', lineHeight: 1.1 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none', flexWrap: 'wrap' }}>
            <NowPill level={nowLevel} count={activeCount} onClick={() => onNav('incidents')} />
            <TimeRange value={range} onChange={onRange} />
            <button onClick={onOpenPalette} title="Search (⌘K)"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: '13px var(--font-sans)', color: 'var(--muted)', background: 'var(--panel-2)', border: '1px solid var(--border-strong)', borderRadius: 7, padding: '6px 10px', cursor: 'pointer' }}>
              <Icon name="search" size={14} /> Search <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 4, padding: '0 4px' }}>⌘K</kbd>
            </button>
            {iconBtn('tv', '', onWallboard, { padding: '7px 8px' })}
            <button onClick={() => onDense(!dense)} title="Toggle density"
              style={{ display: 'inline-flex', alignItems: 'center', background: dense ? 'var(--ink)' : 'none', color: dense ? '#fff' : 'var(--muted)', border: '1px solid ' + (dense ? 'var(--ink)' : 'var(--border-strong)'), borderRadius: 7, padding: '7px 8px', cursor: 'pointer' }}>
              <Icon name="rows-3" size={14} color={dense ? '#fff' : 'currentColor'} />
            </button>
            {iconBtn('log-out', '', onSignOut, { padding: '7px 8px' })}
          </div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--white)' }}>
          <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: pad, display: 'flex', flexDirection: 'column', gap }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Shell });
