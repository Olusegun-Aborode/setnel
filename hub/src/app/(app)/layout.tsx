import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isAuthed } from '@/lib/session';
import { getSummary } from '@/lib/queries';
import { Sidebar } from './shell/Sidebar';
import { Topbar } from './shell/Topbar';
import { CommandPalette } from './shell/CommandPalette';

export const dynamic = 'force-dynamic';

export default async function AppShell({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) redirect('/login');
  const [summary, jar] = await Promise.all([getSummary(), cookies()]);
  const actorName = jar.get('setnel_actor')?.value ?? '';

  let prefs = { density: 'comfortable', colorblind: false };
  try { prefs = { ...prefs, ...JSON.parse(jar.get('setnel_prefs')?.value ?? '{}') }; } catch { /* default */ }
  const shellClass = `shell-root${prefs.density === 'compact' ? ' density-compact' : ''}${prefs.colorblind ? ' cb-safe' : ''}`;

  return (
    <div className={shellClass}>
      <Sidebar activeCount={summary.activeCount} />
      <div className="shell-main">
        <Topbar criticalActive={summary.criticalActive} activeCount={summary.activeCount} actorName={actorName} />
        <main className="shell-content">
          <div className="content-rail">{children}</div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
