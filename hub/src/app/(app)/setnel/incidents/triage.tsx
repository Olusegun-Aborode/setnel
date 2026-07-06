'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { timeAgo } from '@/lib/format';
import { bulkAck, bulkMute, bulkResolve } from '../actions';

export type TriageIncident = {
  id: string; dashboardName: string; severity: string; message: string;
  detectorId: string; acked: boolean; ackedBy: string | null; muted: boolean;
  exposureUsd: number | null; openedAt: string; eventCount: number;
};

const SEV: Record<string, string> = { info: 'sev-info', warning: 'sev-warning', critical: 'sev-critical', emergency: 'sev-emergency' };

function fmtUsd(n: number | null): string {
  if (n == null) return '';
  const a = Math.abs(n);
  if (a >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (a >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function IncidentTriage({ incidents }: { incidents: TriageIncident[] }) {
  const router = useRouter();
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [focus, setFocus] = useState(0);
  const [minutes, setMinutes] = useState(60);
  const [reason, setReason] = useState('');
  const [pending, start] = useTransition();
  const reasonRef = useRef<HTMLInputElement>(null);

  // Targets = the selection, or the focused row if nothing is selected.
  const targets = (): string[] => (sel.size ? [...sel] : incidents[focus] ? [incidents[focus].id] : []);

  const run = (fn: (fd: FormData) => Promise<void>, withMute = false) => {
    const ids = targets();
    if (!ids.length) return;
    start(async () => {
      const fd = new FormData();
      fd.set('ids', ids.join(','));
      if (withMute) { fd.set('minutes', String(minutes)); fd.set('reason', reason); }
      await fn(fd);
      setSel(new Set());
      setReason('');
      router.refresh();
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) return;
      if (!incidents.length) return;
      const k = e.key.toLowerCase();
      if (k === 'j') { e.preventDefault(); setFocus((f) => Math.min(f + 1, incidents.length - 1)); }
      else if (k === 'k') { e.preventDefault(); setFocus((f) => Math.max(f - 1, 0)); }
      else if (k === 'x') { e.preventDefault(); toggle(incidents[focus].id); }
      else if (k === 'a') { e.preventDefault(); run(bulkAck); }
      else if (k === 'r') { e.preventDefault(); run(bulkResolve); }
      else if (k === 'm') { e.preventDefault(); reasonRef.current?.focus(); }
      else if (k === 'escape') { setSel(new Set()); }
      else if (k === 'enter') { e.preventDefault(); router.push(`/setnel/incident/${incidents[focus].id}`); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidents, focus, sel, minutes, reason]);

  const toggle = (id: string) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allSelected = sel.size === incidents.length && incidents.length > 0;

  if (!incidents.length) return <ul className="feed"><li className="empty">No active incidents. 🟢</li></ul>;

  return (
    <div className={pending ? 'triage triage-pending' : 'triage'}>
      <div className="triage-bar">
        <label className="chan-check">
          <input type="checkbox" checked={allSelected} onChange={() => setSel(allSelected ? new Set() : new Set(incidents.map((i) => i.id)))} />
          {sel.size ? `${sel.size} selected` : 'select all'}
        </label>
        <span className="triage-sep" />
        <button className="act act-primary" disabled={pending} onClick={() => run(bulkAck)}>Ack</button>
        <button className="act" disabled={pending} onClick={() => run(bulkMute, true)}>Mute</button>
        <select className="actor-input" style={{ width: 78 }} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
          <option value={60}>1h</option><option value={240}>4h</option><option value={1440}>24h</option>
        </select>
        <input ref={reasonRef} className="actor-input" style={{ width: 200 }} placeholder="mute reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} />
        <button className="act act-danger" disabled={pending} onClick={() => run(bulkResolve)}>Resolve</button>
        <span className="triage-hint">j/k move · x select · a ack · m mute · r resolve · ↵ open</span>
      </div>

      <ul className="feed triage-list">
        {incidents.map((i, idx) => (
          <li
            key={i.id}
            className={`card ${SEV[i.severity] ?? ''} ${idx === focus ? 'triage-focus' : ''} ${sel.has(i.id) ? 'triage-sel' : ''}`}
            onMouseEnter={() => setFocus(idx)}
          >
            <input type="checkbox" className="triage-check" checked={sel.has(i.id)} onChange={() => toggle(i.id)} />
            <div className="card-main">
              <div className="card-top">
                <span className="card-dash">{i.dashboardName}</span>
                <span className={`badge ${SEV[i.severity] ?? ''}`}>{i.severity}</span>
                {i.acked ? <span className="badge badge-resolved">ack{i.ackedBy ? ` ${i.ackedBy}` : ''}</span> : null}
                {i.muted ? <span className="badge badge-count">muted</span> : null}
                {i.eventCount > 1 ? <span className="badge badge-count">×{i.eventCount}</span> : null}
                {i.exposureUsd ? <span className="badge badge-exp">{fmtUsd(i.exposureUsd)} at risk</span> : null}
              </div>
              <a className="card-msg card-link" href={`/setnel/incident/${i.id}`}>{i.message}</a>
              <div className="card-meta"><span>{i.detectorId}</span><span>·</span><span>opened {timeAgo(i.openedAt)}</span><span>·</span><a href={`/setnel/incident/${i.id}`} className="card-detail">details →</a></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
