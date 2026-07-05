'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const DESTS = [
  { label: 'Console', href: '/setnel' },
  { label: 'Incidents', href: '/setnel/incidents' },
  { label: 'Dashboards', href: '/setnel/dashboards' },
  { label: 'Metrics explorer', href: '/setnel/metrics' },
  { label: 'Coverage map', href: '/setnel/coverage' },
  { label: 'Threshold backtest', href: '/setnel/backtest' },
  { label: 'Reports', href: '/setnel/reports' },
  { label: 'Runbooks', href: '/setnel/runbooks' },
  { label: 'Inbox', href: '/setnel/inbox' },
  { label: 'Detectors', href: '/setnel/detectors' },
  { label: 'Escalation & on-call', href: '/setnel/escalation' },
  { label: 'Settings', href: '/setnel/settings' },
  { label: 'Wallboard', href: '/wallboard' },
  { label: 'Active incidents', href: '/setnel?status=active' },
  { label: 'Critical only', href: '/setnel?severity=critical' },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    (window as unknown as { __setnelPalette?: () => void }).__setnelPalette = () => setOpen(true);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) { setQ(''); setSel(0); setTimeout(() => inputRef.current?.focus(), 0); }
  }, [open]);

  if (!open) return null;
  const results = DESTS.filter((d) => d.label.toLowerCase().includes(q.toLowerCase()));
  const go = (href: string) => { setOpen(false); router.push(href); };

  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input">
          <Search size={16} strokeWidth={1.6} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Go to…"
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              if (e.key === 'Enter' && results[sel]) go(results[sel].href);
            }}
          />
          <kbd>esc</kbd>
        </div>
        <ul className="cmdk-list">
          {results.length === 0 ? <li className="cmdk-empty">No matches</li> :
            results.map((d, i) => (
              <li key={d.href} className={`cmdk-item ${i === sel ? 'cmdk-sel' : ''}`}
                onMouseEnter={() => setSel(i)} onClick={() => go(d.href)}>{d.label}</li>
            ))}
        </ul>
      </div>
    </div>
  );
}
