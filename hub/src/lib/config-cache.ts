// Tiny in-process TTL cache for rarely-changing config that sits on hot paths
// (ingest/escalate read detector + channel + escalation config on every run).
// Serverless keeps warm instances alive, so this collapses repeated round-trips
// within an instance. Cost: a config change can take up to TTL to take effect,
// which matches the "applies on the next run" contract already documented.
const TTL_MS = 30_000;
type Entry = { value: unknown; at: number };
const store = new Map<string, Entry>();

export async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const e = store.get(key);
  const now = Date.now();
  if (e && now - e.at < TTL_MS) return e.value as T;
  const value = await fn();
  store.set(key, { value, at: now });
  return value;
}

export function invalidate(key?: string): void {
  if (key) store.delete(key);
  else store.clear();
}
