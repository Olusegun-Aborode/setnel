import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { getHealthMatrix } from '@/lib/queries';

export const dynamic = 'force-dynamic';

function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

export default async function DashboardsPage() {
  if (!(await isAuthed())) redirect('/login');
  const health = await getHealthMatrix();
  return (
    <section className="panel">
      <div className="panel-head"><h2>Monitored dashboards</h2><span className="panel-note">{health.length} surfaces · collection status</span></div>
      <div className="matrix">
        <div className="matrix-row matrix-head">
          <div className="m-name">Dashboard</div>
          <div className="m-cells m-cells-head">14-day collection</div>
          <div className="m-last">Last check</div>
          <div className="m-today">Today</div>
        </div>
        {health.map((h) => (
          <a key={h.id} className="matrix-row dash-row" href={`/setnel?dashboard=${h.id}`}>
            <div className="m-name"><span className={`status-dot status-${h.status}`} />{h.name}</div>
            <div className="m-cells">
              {h.cells.map((c) => <span key={c.day} className={`cell lvl-${c.checks <= 0 ? 0 : c.checks < 60 ? 1 : c.checks < 200 ? 2 : 3}`} title={`${c.day}: ${c.checks}`} />)}
            </div>
            <div className="m-last">{timeAgo(h.lastCheckAt)}</div>
            <div className="m-today">{h.checksToday}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
