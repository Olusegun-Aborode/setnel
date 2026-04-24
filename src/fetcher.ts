import { optionalEnv } from './config.js';
import type { FetchResult } from './types.js';

const UA = 'datum-monitor/0.1 (+https://datumlabs.xyz)';

export async function fetchJson(url: string): Promise<FetchResult> {
  const timeoutMs = Number(optionalEnv('REQUEST_TIMEOUT_MS', '15000'));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': UA, accept: 'application/json' },
    });
    const latencyMs = Date.now() - started;
    const text = await res.text();

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: `HTTP ${res.status}: ${truncate(text, 200)}`,
        latencyMs,
      };
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        ok: false,
        status: res.status,
        error: `Non-JSON response: ${truncate(text, 200)}`,
        latencyMs,
      };
    }
    return { ok: true, status: res.status, data, latencyMs };
  } catch (err) {
    const latencyMs = Date.now() - started;
    const msg =
      err instanceof Error
        ? err.name === 'AbortError'
          ? `Timeout after ${timeoutMs}ms`
          : err.message
        : String(err);
    return { ok: false, status: null, error: msg, latencyMs };
  } finally {
    clearTimeout(timer);
  }
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '…' : s;
}
