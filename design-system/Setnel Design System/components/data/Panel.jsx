import React from 'react';

const STYLE_ID = 'sds-panel';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-panel { background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius-panel); }
  .sds-panel__head {
    display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
    padding: 14px 18px 0;
  }
  .sds-panel__head--divided { padding-bottom: 12px; border-bottom: 1px solid var(--border); }
  .sds-panel__titles { display: flex; align-items: baseline; gap: 12px; min-width: 0; flex-wrap: wrap; }
  .sds-panel__title { font: var(--font-heading); font-weight: 650; letter-spacing: var(--tracking-tight); color: var(--ink); }
  .sds-panel__note { font-size: var(--text-xs); color: var(--muted); }
  .sds-panel__aside { flex: none; font-size: var(--text-13); }
  .sds-panel__body { padding: 14px 18px 16px; }
  .sds-panel__body--flush { padding: 0; }
  `;
  document.head.appendChild(el);
}

/** Panel — the section container for every console view. */
export function Panel({ title, note, aside, children, flush = false, divided = false, className = '', ...rest }) {
  const hasHead = title || note || aside;
  return (
    <section className={`sds-panel ${className}`.trim()} {...rest}>
      {hasHead ? (
        <div className={`sds-panel__head ${divided ? 'sds-panel__head--divided' : ''}`}>
          <div className="sds-panel__titles">
            {title ? <h2 className="sds-panel__title">{title}</h2> : null}
            {note ? <span className="sds-panel__note">{note}</span> : null}
          </div>
          {aside ? <div className="sds-panel__aside">{aside}</div> : null}
        </div>
      ) : null}
      <div className={`sds-panel__body ${flush ? 'sds-panel__body--flush' : ''}`}>{children}</div>
    </section>
  );
}
