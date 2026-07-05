import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/session';
import { allRunbooks } from '@/lib/runbooks';

export const dynamic = 'force-dynamic';

export default async function RunbooksPage() {
  if (!(await isAuthed())) redirect('/login');
  const books = allRunbooks();
  return (
    <>
      <section className="panel">
        <div className="panel-head"><h2>Runbooks</h2><span className="panel-note">what to do when each kind of alert fires</span></div>
        {books.map((b) => (
          <div key={b.title} className="runbook">
            <h3>{b.title}</h3>
            <div className="runbook-when">{b.when}</div>
            <ol className="runbook-steps">
              {b.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        ))}
      </section>
    </>
  );
}
