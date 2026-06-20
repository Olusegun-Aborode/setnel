import { sql, type Severity } from './db';

const SEVERITY_PREFIX: Record<Severity, string> = {
  info: 'ℹ️ Info',
  warning: '⚠️ Warning',
  critical: '🚨 CRITICAL',
  emergency: '🚨🚨🚨 EMERGENCY',
};

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** One raw Telegram send attempt. Returns ok + error detail. */
async function sendTelegramOnce(text: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, error: 'telegram not configured' };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 4000), disable_web_page_preview: true }),
    });
    if (res.ok) return { ok: true };
    const detail = await res.text().catch(() => '');
    return { ok: false, error: `HTTP ${res.status}: ${detail.slice(0, 200)}` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Send a data alert to Telegram with retry. On final failure, write to the
 * dead-letter table so a delivery failure is never silently lost.
 * Plain text (no parse_mode) so stray <, >, & can't break the API call.
 */
export async function notifyTelegram(args: {
  dashboardName: string;
  severity: Severity;
  category: string;
  message: string;
  deepLink: string;
  incidentId?: string | number;
}): Promise<boolean> {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.warn('[notify] telegram not configured — skipping');
    return false;
  }

  const text = [
    `${SEVERITY_PREFIX[args.severity]} • ${args.dashboardName}`,
    args.message,
    '',
    `Open: ${args.deepLink}`,
  ].join('\n');

  let lastError = 'unknown';
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const r = await sendTelegramOnce(text);
    if (r.ok) return true;
    lastError = r.error ?? 'unknown';
    if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS * attempt);
  }

  // All attempts failed — dead-letter it.
  console.error('[notify] telegram failed after retries:', lastError);
  try {
    await sql`
      INSERT INTO failed_notifications (channel, incident_id, message, error, attempts)
      VALUES ('telegram', ${args.incidentId ?? null}, ${text}, ${lastError}, ${MAX_ATTEMPTS})
    `;
  } catch (e) {
    console.error('[notify] dead-letter write failed', e);
  }
  return false;
}

// Whether a category is an internal/technical issue (TG-suppressed).
export function isTechnical(category: string): boolean {
  return category === 'technical';
}
