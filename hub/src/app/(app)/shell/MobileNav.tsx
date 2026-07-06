'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, Flame, LayoutGrid, SlidersHorizontal, Settings } from 'lucide-react';

// Bottom tab bar for phones (the sidebar is hidden under 820px). Alerts land in
// Telegram and open here on a phone, so the primary destinations get a
// thumb-reachable bar instead of a hidden desktop sidebar.
const ITEMS = [
  { href: '/setnel', icon: LayoutDashboard, label: 'Console', exact: true },
  { href: '/setnel/incidents', icon: Flame, label: 'Incidents' },
  { href: '/setnel/dashboards', icon: LayoutGrid, label: 'Boards' },
  { href: '/setnel/detectors', icon: SlidersHorizontal, label: 'Detectors' },
  { href: '/setnel/settings', icon: Settings, label: 'Settings' },
];

export function MobileNav({ activeCount }: { activeCount: number }) {
  const path = usePathname();
  return (
    <nav className="mobilenav">
      {ITEMS.map((it) => {
        const on = it.exact ? path === it.href : path.startsWith(it.href) || (it.href === '/setnel/incidents' && path.startsWith('/setnel/incident/'));
        const Icon = it.icon;
        return (
          <a key={it.href} href={it.href} className={`mnav-item ${on ? 'mnav-on' : ''}`}>
            <span className="mnav-icon"><Icon size={18} strokeWidth={1.7} />{it.href === '/setnel/incidents' && activeCount > 0 ? <i className="mnav-badge">{activeCount}</i> : null}</span>
            <span>{it.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
