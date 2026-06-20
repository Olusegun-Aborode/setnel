import type { Severity } from './db';

const SEVERITY_PREFIX: Record<Severity, string> = {
  info: 'ℹ️ Info',
  warning: '⚠️ Warning',
  critical: '🚨 CRITICAL',
  emergency: '🚨🚨🚨 EMERGENCY',
};

/**
 * Send a data alert to Telegram. Plain text (no parse_mode) so message bodies
 * with stray <, >, & can't break the API call. Mirrors datum-monitor routing:
 * data-insight categories go to TG; `technical` does not.
 */
export async function notifyTelegram(args: {
  dashboardName: string;
  severity: Severity;
  category: string;
  message: string;
  deepLink: string;
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('[notify] telegram not configured — skipping');
    return;
  }

  const text = [
    `${SEVERITY_PREFIX[args.severity]} • ${args.dashboardName}`,
    args.message,
    '',
    `Open: ${args.deepLink}`,
  ].join('\n');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4000),
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('[notify] telegram failed', res.status, detail.slice(0, 200));
  }
}

// Whether a category is an internal/technical issue (TG-suppressed).
export function isTechnical(category: string): boolean {
  return category === 'technical';
}
