// Empty / loading / error states — meaningful in a monitoring tool.
function EmptyState({ kind = 'calm' }) {
  const MAP = {
    calm:     { icon: 'shield-check', tone: 'var(--good)', bg: 'var(--good-bg)', title: 'No active incidents', body: 'Every monitored dashboard is inside its normal range.' },
    nofilter: { icon: 'search-x', tone: 'var(--muted)', bg: 'var(--panel-2)', title: 'Nothing matches this filter', body: 'Try clearing a filter or widening the time range.' },
    loading:  { icon: 'loader', tone: 'var(--muted)', bg: 'var(--panel-2)', title: 'Loading…', body: 'Fetching the latest samples.' },
    sourcedown:{ icon: 'plug-zap', tone: 'var(--critical)', bg: 'var(--critical-bg)', title: 'Source unreachable', body: 'The dashboard’s data source isn’t responding — collection is paused.' },
    muted:    { icon: 'bell-off', tone: 'var(--warning)', bg: 'var(--warning-bg)', title: 'Detector muted', body: 'Alerts are suppressed here until the mute expires.' },
  };
  const s = MAP[kind] || MAP.calm;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8, padding: '34px 20px', background: s.bg, borderRadius: 'var(--radius)', color: 'var(--ink-2)' }}>
      <span style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--panel)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <window.Icon name={s.icon} size={19} color={s.tone} />
      </span>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{s.title}</div>
      <div style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 320 }}>{s.body}</div>
    </div>
  );
}

Object.assign(window, { EmptyState });
