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
        error: `HTTP ${res.status} ${humanStatus(res.status)} — ${summarizeBody(text)}`,
        latencyMs,
      };
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      // Don't dump raw HTML into Telegram. Just describe what came back.
      return {
        ok: false,
        status: res.status,
        error: `Got HTTP ${res.status} but body was ${summarizeBody(text)} (expected JSON)`,
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

/**
 * Reduce an arbitrary response body to a short, readable description
 * instead of dumping raw HTML/text into a Telegram alert.
 */
function summarizeBody(text: string): string {
  const trimmed = text.trim();
  if (trimmed === '') return 'an empty body';
  const lower = trimmed.slice(0, 200).toLowerCase();
  if (lower.startsWith('<!doctype') || lower.startsWith('<html')) return 'an HTML page';
  if (lower.startsWith('<?xml')) return 'an XML document';
  if (lower.startsWith('<')) return 'an HTML/XML fragment';
  // Plain-text errors — show a clipped version.
  const oneLine = trimmed.replace(/\s+/g, ' ').slice(0, 120);
  return `"${oneLine}${trimmed.length > 120 ? '…' : ''}"`;
}

function humanStatus(code: number): string {
  switch (code) {
    case 401: return '(Unauthorized — check auth/secrets)';
    case 402: return '(Payment Required — Vercel deployment-protection?)';
    case 403: return '(Forbidden)';
    case 404: return '(Not Found — route may not be deployed)';
    case 500: return '(Server Error)';
    case 502: return '(Bad Gateway — upstream down?)';
    case 503: return '(Service Unavailable)';
    case 504: return '(Gateway Timeout — upstream slow)';
    default: return '';
  }
}
