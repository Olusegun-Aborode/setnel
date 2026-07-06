import { SEVERITY_RANK, type Severity } from './db';

// Pure incident state-machine helpers, extracted so they can be unit-tested
// (the DB-bound code in ingest.ts / escalate.ts calls these).

export const RENOTIFY_ACKED_MS = Infinity; // acked → silent until escalation
export const RENOTIFY_URGENT_MS = 60 * 60 * 1000; // 1h for critical/emergency
export const RENOTIFY_NORMAL_MS = 6 * 60 * 60 * 1000; // 6h otherwise

/** How long to stay quiet before re-paging an unresolved, still-firing incident. */
export function renotifyWindowMs(acked: boolean, severity: Severity): number {
  if (acked) return RENOTIFY_ACKED_MS;
  return SEVERITY_RANK[severity] >= SEVERITY_RANK.critical ? RENOTIFY_URGENT_MS : RENOTIFY_NORMAL_MS;
}

/** Did the severity climb versus the open incident's current severity? */
export function isSeverityEscalation(next: Severity, current: Severity): boolean {
  return SEVERITY_RANK[next] > SEVERITY_RANK[current];
}

/** Should an already-open incident re-page right now? */
export function shouldRenotify(args: {
  muted: boolean;
  escalated: boolean;
  notifiedAt: string | null;
  nowMs: number;
  windowMs: number;
}): boolean {
  if (args.muted) return false;
  const stale = !args.notifiedAt || args.nowMs - new Date(args.notifiedAt).getTime() > args.windowMs;
  return args.escalated || stale;
}

/**
 * Should an active incident be (re-)escalated now? Mirrors the escalate.ts SQL as
 * a testable guard: critical+ , unacked, not muted, old enough, and not escalated
 * within the last window.
 */
export function shouldEscalate(
  row: { severity: Severity; acknowledgedAt: string | null; mutedUntil: string | null; openedAt: string; escalatedAt: string | null },
  nowMs: number,
  afterMin: number,
): boolean {
  if (SEVERITY_RANK[row.severity] < SEVERITY_RANK.critical) return false;
  if (row.acknowledgedAt) return false;
  if (row.mutedUntil && new Date(row.mutedUntil).getTime() > nowMs) return false;
  const windowMs = afterMin * 60 * 1000;
  if (nowMs - new Date(row.openedAt).getTime() < windowMs) return false;
  if (row.escalatedAt && nowMs - new Date(row.escalatedAt).getTime() < windowMs) return false;
  return true;
}
