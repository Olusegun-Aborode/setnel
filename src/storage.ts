import { Redis } from '@upstash/redis';
import { requireEnv, optionalEnv } from './config.js';

type StoredSnapshot = { value: number; timestamp: number };
type HistoryEntry = { value: number; timestamp: number };

const NAMESPACE = 'datum-monitor';
// Retain 7 days of 15-minute history = 672 entries. Keep a round 800.
const HISTORY_CAP = 800;

let _redis: Redis | null = null;
function redis(): Redis {
  if (_redis) return _redis;
  _redis = new Redis({
    url: requireEnv('UPSTASH_REDIS_REST_URL'),
    token: requireEnv('UPSTASH_REDIS_REST_TOKEN'),
  });
  return _redis;
}

export function snapshotKey(dashboardId: string, metricId: string): string {
  return `${NAMESPACE}:snapshot:${dashboardId}:${metricId}`;
}
export function historyKey(dashboardId: string, metricId: string): string {
  return `${NAMESPACE}:history:${dashboardId}:${metricId}`;
}
export function alertStateKey(
  dashboardId: string,
  metricId: string,
  ruleName: string,
): string {
  return `${NAMESPACE}:alert:${dashboardId}:${metricId}:${ruleName}`;
}

export async function getSnapshot(
  dashboardId: string,
  metricId: string,
): Promise<StoredSnapshot | null> {
  const raw = await redis().get<StoredSnapshot>(snapshotKey(dashboardId, metricId));
  return raw ?? null;
}

export async function setSnapshot(
  dashboardId: string,
  metricId: string,
  value: number,
  timestamp: number,
): Promise<void> {
  await redis().set(snapshotKey(dashboardId, metricId), { value, timestamp });
}

/**
 * Get the snapshot closest to `cutoffMs` looking back in the history series.
 * Used for rules like "compare vs 24h ago".
 */
export async function getSnapshotAtAge(
  dashboardId: string,
  metricId: string,
  ageMs: number,
): Promise<HistoryEntry | null> {
  const now = Date.now();
  const entries = await getHistory(dashboardId, metricId);
  const target = now - ageMs;
  // History is newest-first. Find the first entry at or before target.
  for (const e of entries) {
    if (e.timestamp <= target) return e;
  }
  return entries.at(-1) ?? null;
}

export async function getHistory(
  dashboardId: string,
  metricId: string,
): Promise<HistoryEntry[]> {
  // List stored newest-first via LPUSH.
  const raw = await redis().lrange<HistoryEntry>(
    historyKey(dashboardId, metricId),
    0,
    HISTORY_CAP - 1,
  );
  return raw ?? [];
}

export async function appendHistory(
  dashboardId: string,
  metricId: string,
  value: number,
  timestamp: number,
): Promise<void> {
  const intervalMin = Number(optionalEnv('HISTORY_INTERVAL_MINUTES', '15'));
  const intervalMs = intervalMin * 60_000;
  const [latest] = await redis().lrange<HistoryEntry>(
    historyKey(dashboardId, metricId),
    0,
    0,
  );
  // Skip if we already wrote an entry within this interval — keeps Redis small.
  if (latest && timestamp - latest.timestamp < intervalMs) return;

  const key = historyKey(dashboardId, metricId);
  await redis().lpush(key, { value, timestamp });
  await redis().ltrim(key, 0, HISTORY_CAP - 1);
}

/**
 * Returns true if we should fire this alert (cooldown expired), and records
 * the fire time. False means we're within the cooldown window.
 */
export async function claimAlertSlot(
  dashboardId: string,
  metricId: string,
  ruleName: string,
): Promise<boolean> {
  const cooldownMin = Number(optionalEnv('ALERT_COOLDOWN_MINUTES', '60'));
  const key = alertStateKey(dashboardId, metricId, ruleName);
  const existing = await redis().get<number>(key);
  const now = Date.now();
  if (existing && now - existing < cooldownMin * 60_000) return false;
  await redis().set(key, now, { ex: cooldownMin * 60 * 2 });
  return true;
}
