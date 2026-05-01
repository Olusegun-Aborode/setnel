import { requireEnv } from '../config.js';

/**
 * Send a plain-text message to the configured Telegram chat.
 *
 * No parse_mode — we send raw text so error bodies containing HTML/Markdown
 * (e.g. a 404 page snippet) can't break the API call. Neither the alert
 * formatter nor the digest formatter relies on rich formatting in TG.
 *
 * Falls back silently if credentials aren't configured so locally-run checks
 * don't die before reaching the check logic.
 */
export async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('[telegram] skipping send — TELEGRAM_BOT_TOKEN/CHAT_ID not set');
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: text.slice(0, 4000), // Telegram hard limit is 4096
    disable_web_page_preview: true,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Telegram sendMessage failed: ${res.status} ${detail.slice(0, 200)}`);
  }
}

// Lazy assertion so scripts that don't need TG don't fail at import time.
export function requireTelegramEnv() {
  requireEnv('TELEGRAM_BOT_TOKEN');
  requireEnv('TELEGRAM_CHAT_ID');
}
