'use client';

import { useOptimistic, useTransition } from 'react';
import { setDetectorEnabled } from '../config-actions';

// Optimistic enable/disable: the button flips instantly, the server action runs
// in the background, and revalidation reconciles. No full-page stall per toggle.
export function DetectorToggle({ dashboardId, detectorId, enabled }: { dashboardId: string; detectorId: string; enabled: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(enabled);
  const [pending, start] = useTransition();

  return (
    <button
      className={`act ${optimistic ? '' : 'act-primary'}`}
      disabled={pending}
      onClick={() =>
        start(async () => {
          setOptimistic(!optimistic);
          const fd = new FormData();
          fd.set('dashboardId', dashboardId);
          fd.set('detectorId', detectorId);
          fd.set('enabled', String(!optimistic));
          await setDetectorEnabled(fd);
        })
      }
    >
      {optimistic ? 'Disable' : 'Enable'}
    </button>
  );
}
