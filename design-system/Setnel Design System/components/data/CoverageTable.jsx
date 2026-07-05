import React from 'react';

const STYLE_ID = 'sds-coverage';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .sds-cov-wrap { overflow-x: auto; }
  .sds-cov { border-collapse: collapse; width: 100%; font-size: var(--text-13); }
  .sds-cov th, .sds-cov td { padding: 7px 10px; border-bottom: 1px solid var(--border); text-align: center; }
  .sds-cov thead th { color: var(--muted); font-weight: var(--weight-semibold); font-size: var(--text-xs); position: sticky; top: 0; background: var(--panel); }
  .sds-cov__risk { text-align: left; font-weight: 550; white-space: nowrap; color: var(--ink); }
  .sds-cov__key { display: inline-block; width: 16px; text-align: center; font-weight: var(--weight-bold); font-family: var(--font-mono); }
  .sds-cov__yes     { color: var(--cov-yes); }
  .sds-cov__blocked { color: var(--cov-blocked); }
  .sds-cov__planned { color: var(--cov-planned); }
  .sds-cov__na      { color: var(--cov-na); }
  .sds-cov__legend { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 12px; font-size: var(--text-xs); color: var(--muted); }
  .sds-cov__legend span { display: inline-flex; align-items: center; gap: 6px; }
  `;
  document.head.appendChild(el);
}

const GLYPH = { yes: '\u25CF', blocked: '\u2715', planned: '\u25CB', na: '\u00B7' };
const LEGEND = [['yes', 'covered'], ['blocked', 'blind spot'], ['planned', 'planned'], ['na', 'n/a']];

/**
 * CoverageTable — the risk-type × protocol coverage map. Each cell is a state:
 * `yes` (covered), `blocked` (blind spot), `planned`, or `na`.
 */
export function CoverageTable({ protocols, rows, legend = true, className = '', ...rest }) {
  return (
    <div className={`sds-cov-wrap ${className}`.trim()} {...rest}>
      <table className="sds-cov">
        <thead>
          <tr>
            <th className="sds-cov__risk">Risk type</th>
            {protocols.map((p) => <th key={p}>{p}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.risk}>
              <td className="sds-cov__risk">{r.risk}</td>
              {r.cells.map((c, i) => (
                <td key={i}><span className={`sds-cov__key sds-cov__${c}`} title={c}>{GLYPH[c] || GLYPH.na}</span></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {legend ? (
        <div className="sds-cov__legend">
          {LEGEND.map(([k, l]) => (
            <span key={k}><span className={`sds-cov__key sds-cov__${k}`}>{GLYPH[k]}</span>{l}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
