import React from 'react';

const STYLE_ID = 'sds-cmdk';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-cmdk__scrim { position: fixed; inset: 0; z-index: 100; background: rgba(10,10,10,0.35); display: flex; align-items: flex-start; justify-content: center; padding-top: 12vh; }
  .sds-cmdk {
    width: 560px; max-width: 92vw; background: var(--panel); border: 1px solid var(--border);
    border-radius: var(--radius-card); box-shadow: var(--shadow-pop); overflow: hidden;
  }
  .sds-cmdk__input {
    width: 100%; border: none; outline: none; padding: 15px 18px; font-family: var(--font-sans);
    font-size: 15px; color: var(--ink); border-bottom: 1px solid var(--border);
  }
  .sds-cmdk__input::placeholder { color: var(--faint); }
  .sds-cmdk__list { max-height: 360px; overflow-y: auto; padding: 6px; }
  .sds-cmdk__group { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--faint); padding: 8px 10px 4px; font-weight: 600; }
  .sds-cmdk__item {
    display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; cursor: pointer;
    background: transparent; border: none; padding: 9px 10px; border-radius: 7px;
    font-family: var(--font-sans); font-size: var(--text-base); color: var(--ink-2);
  }
  .sds-cmdk__item--active { background: var(--panel-3); color: var(--ink); }
  .sds-cmdk__item kbd { margin-left: auto; font-family: var(--font-mono); font-size: 10.5px; color: var(--faint); background: var(--panel-2); border: 1px solid var(--border); border-radius: 4px; padding: 1px 5px; }
  .sds-cmdk__hint { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
  .sds-cmdk__empty { padding: 26px; text-align: center; color: var(--muted); font-size: 13px; }
  .sds-cmdk__foot { display: flex; gap: 14px; padding: 8px 14px; border-top: 1px solid var(--border); font-family: var(--font-mono); font-size: 10.5px; color: var(--faint); }
  `;
  document.head.appendChild(el);
}

/**
 * CommandPalette — ⌘K/Ctrl-K navigator. Fuzzy-filters a flat command list
 * (dashboards, detectors, incidents, metrics, actions) and runs the selected one.
 * Controlled via `open`/`onOpenChange`, or self-manages the ⌘K shortcut if you
 * pass `bindHotkey`.
 */
export function CommandPalette({ commands = [], open, onOpenChange, bindHotkey = true, placeholder = 'Search dashboards, detectors, incidents, metrics…' }) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open != null ? open : internalOpen;
  const setOpen = (v) => { onOpenChange ? onOpenChange(v) : setInternalOpen(v); };
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (!bindHotkey) return;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(!isOpen); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, bindHotkey]);

  React.useEffect(() => { if (isOpen) { setQ(''); setActive(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 20); } }, [isOpen]);

  if (!isOpen) return null;
  const ql = q.trim().toLowerCase();
  const filtered = ql ? commands.filter((c) => (c.label + ' ' + (c.group || '') + ' ' + (c.hint || '')).toLowerCase().includes(ql)) : commands;
  const groups = [...new Set(filtered.map((c) => c.group || 'Results'))];

  const run = (c) => { setOpen(false); c && c.run && c.run(); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    if (e.key === 'Enter') { e.preventDefault(); run(filtered[active]); }
  };

  let idx = -1;
  return (
    <div className="sds-cmdk__scrim" onClick={() => setOpen(false)}>
      <div className="sds-cmdk" onClick={(e) => e.stopPropagation()}>
        <input ref={inputRef} className="sds-cmdk__input" placeholder={placeholder}
          value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey} />
        <div className="sds-cmdk__list">
          {filtered.length === 0 ? <div className="sds-cmdk__empty">No matches for “{q}”.</div> : null}
          {groups.map((g) => (
            <div key={g}>
              <div className="sds-cmdk__group">{g}</div>
              {filtered.filter((c) => (c.group || 'Results') === g).map((c) => {
                idx++; const me = idx;
                return (
                  <button key={c.id || c.label} className={`sds-cmdk__item ${me === active ? 'sds-cmdk__item--active' : ''}`}
                    onMouseEnter={() => setActive(me)} onClick={() => run(c)}>
                    {c.icon ? <span style={{ display: 'inline-flex', width: 16, color: 'var(--muted)' }}>{c.icon}</span> : null}
                    <span>{c.label}</span>
                    {c.hint ? <span className="sds-cmdk__hint">{c.hint}</span> : null}
                    {c.kbd ? <kbd>{c.kbd}</kbd> : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="sds-cmdk__foot"><span>↑↓ navigate</span><span>↵ select</span><span>esc close</span></div>
      </div>
    </div>
  );
}
