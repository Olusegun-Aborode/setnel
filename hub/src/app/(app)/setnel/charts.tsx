// Server-rendered SVG charts — no client JS, no dependencies. Institutional,
// monochrome, restrained. Designed for the light theme.

import type { DayCell } from '@/lib/queries';

const AXIS = '#9aa3af';
const GRID = '#ececf0';
const INK = '#0a0a0a';

/**
 * Daily collection-volume line chart. Shows total successful check-ins per day
 * across all dashboards — a clean way to see if the whole fleet keeps collecting.
 */
export function CollectionLineChart({
  data,
  height = 200,
}: {
  data: DayCell[];
  height?: number;
}) {
  const W = 900;
  const H = height;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const max = Math.max(10, ...data.map((d) => d.checks));
  // Round the axis max up to a clean number.
  const niceMax = niceCeil(max);
  const n = data.length;
  const x = (i: number) => padL + (n <= 1 ? 0 : (i / (n - 1)) * innerW);
  const y = (v: number) => padT + innerH - (v / niceMax) * innerH;

  const linePts = data.map((d, i) => `${x(i)},${y(d.checks)}`).join(' ');
  const areaPts = `${padL},${padT + innerH} ${linePts} ${padL + innerW},${padT + innerH}`;

  // 4 horizontal gridlines.
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(niceMax * f));
  const last = data[data.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Daily collection volume">
      {/* gridlines + y labels */}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={padL + innerW} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} />
          <text x={padL - 8} y={y(t) + 3} textAnchor="end" fontSize={11} fill={AXIS}>
            {abbrev(t)}
          </text>
        </g>
      ))}
      {/* x labels: first, middle, last */}
      {[0, Math.floor((n - 1) / 2), n - 1].map((i) => (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize={11} fill={AXIS}>
          {fmtDay(data[i]?.day)}
        </text>
      ))}
      {/* area + line */}
      <polygon points={areaPts} fill={INK} fillOpacity={0.05} />
      <polyline points={linePts} fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {/* last-point marker + value */}
      {last ? (
        <>
          <circle cx={x(n - 1)} cy={y(last.checks)} r={3.5} fill={INK} />
          <text x={x(n - 1) - 6} y={y(last.checks) - 8} textAnchor="end" fontSize={12} fontWeight={600} fill={INK}>
            {abbrev(last.checks)}
          </text>
        </>
      ) : null}
    </svg>
  );
}

function niceCeil(v: number): number {
  if (v <= 10) return 10;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / mag;
  const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nf * mag;
}

function abbrev(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

function fmtDay(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
