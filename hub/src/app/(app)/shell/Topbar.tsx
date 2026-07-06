'use client';

import { usePathname } from 'next/navigation';
import { Search, Tv, UserCircle2 } from 'lucide-react';
import { LiveRefresh } from '../setnel/live';

const TITLES: { match: (p: string) => boolean; title: string; sub: string }[] = [
  { match: (p) => p.startsWith('/setnel/incidents'), title: 'Incidents', sub: 'Full triage — filter, acknowledge, mute, resolve' },
  { match: (p) => p.startsWith('/setnel/incident/'), title: 'Incident', sub: 'Evidence, runbook, and workflow' },
  { match: (p) => p.startsWith('/setnel/metrics'), title: 'Metrics explorer', sub: 'Per-metric values against their learned baseline' },
  { match: (p) => p.startsWith('/setnel/coverage'), title: 'Coverage map', sub: 'Which risks are watched per protocol — and the blind spots' },
  { match: (p) => p.startsWith('/setnel/backtest'), title: 'Threshold backtest', sub: 'Replay detector rules over stored history' },
  { match: (p) => p.startsWith('/setnel/runbooks'), title: 'Runbooks', sub: 'What to do when each kind of alert fires' },
  { match: (p) => p.startsWith('/setnel/dashboards'), title: 'Dashboards', sub: 'All monitored surfaces and their collection health' },
  { match: (p) => p.startsWith('/setnel/reports'), title: 'Reports', sub: 'Response times, false-positive rate, noisiest detectors' },
  { match: (p) => p.startsWith('/setnel/detectors'), title: 'Detectors', sub: 'View, tune, enable, and disable every detection rule' },
  { match: (p) => p.startsWith('/setnel/escalation'), title: 'Escalation & on-call', sub: 'Who gets paged when an incident goes unacknowledged' },
  { match: (p) => p.startsWith('/setnel/settings'), title: 'Settings', sub: 'Dashboards registry, integrations, and members' },
  { match: (p) => p.startsWith('/setnel/inbox'), title: 'Inbox', sub: 'Everything that changed, and who changed it' },
  { match: (p) => p.startsWith('/wallboard'), title: 'Wallboard', sub: 'Read-only status board' },
  { match: () => true, title: 'Console', sub: 'Live risk overview across all monitored dashboards' },
];

export function Topbar({ criticalActive, activeCount, userName }: { criticalActive: number; activeCount: number; userName: string | null }) {
  const path = usePathname();
  const t = TITLES.find((x) => x.match(path))!;
  const level = criticalActive > 0 ? 'crit' : activeCount > 0 ? 'warn' : 'ok';
  const nowText = criticalActive > 0 ? `${criticalActive} critical` : activeCount > 0 ? `${activeCount} active` : 'all clear';

  return (
    <header className="topbar-shell">
      <div className="tb-title">
        <div className="tb-title-main">{t.title}</div>
        <div className="tb-title-sub">{t.sub}</div>
      </div>
      <div className="tb-right">
        <a href="/setnel?status=active" className={`nowpill now-${level}`}>
          <span className="now-dot" />{nowText}
        </a>
        <button className="tb-search" onClick={() => (window as unknown as { __setnelPalette?: () => void }).__setnelPalette?.()}>
          <Search size={14} strokeWidth={1.6} /> Search <kbd>⌘K</kbd>
        </button>
        <a className="tb-icon" href="/wallboard" title="Wallboard"><Tv size={15} strokeWidth={1.6} /></a>
        <LiveRefresh intervalMs={30000} />
        {userName ? (
          <a className="tb-identity" href="/login/identify" title="Switch identity">
            <UserCircle2 size={16} strokeWidth={1.6} /> {userName}
          </a>
        ) : (
          <a className="tb-identity tb-identity-anon" href="/login/identify" title="Sign in to attribute your actions">
            <UserCircle2 size={16} strokeWidth={1.6} /> Sign in
          </a>
        )}
      </div>
    </header>
  );
}
