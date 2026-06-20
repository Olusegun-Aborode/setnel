'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Auto-refreshes the server-rendered console on an interval via router.refresh()
// (re-runs the server components, no full page reload). Toggleable.
export function LiveRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [on, setOn] = useState(true);
  const [ago, setAgo] = useState(0);

  useEffect(() => {
    if (!on) return;
    const tick = setInterval(() => setAgo((a) => a + 1), 1000);
    const refresh = setInterval(() => {
      router.refresh();
      setAgo(0);
    }, intervalMs);
    return () => {
      clearInterval(tick);
      clearInterval(refresh);
    };
  }, [on, intervalMs, router]);

  return (
    <button
      className={`live-btn ${on ? 'live-on' : ''}`}
      onClick={() => { setOn((v) => !v); setAgo(0); }}
      title={on ? 'Auto-refresh on — click to pause' : 'Paused — click to resume'}
    >
      <span className="live-dot" />
      {on ? `live · ${ago}s` : 'paused'}
    </button>
  );
}
