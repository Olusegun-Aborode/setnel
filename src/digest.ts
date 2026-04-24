import type { Config } from './types.js';
import { runCheck } from './check.js';
import { renderDigestHtml, renderDigestText } from './render.js';
import { sendTelegram } from './notifiers/telegram.js';
import { sendEmail } from './notifiers/email.js';

/**
 * Build the 6-hour report. We piggyback on the same runCheck pass so the
 * digest shows the *current* values alongside their last snapshots. The
 * alert cooldown means repeated breaches won't double-fire into the digest.
 */
export async function runDigest(config: Config): Promise<void> {
  const { alerts, samples } = await runCheck(config);
  const text = renderDigestText(samples, alerts);
  const html = renderDigestHtml(samples, alerts);

  if (config.notifications.telegram.enabled) {
    try {
      await sendTelegram(text);
    } catch (err) {
      console.error('[digest] telegram failed:', err);
    }
  }
  if (config.notifications.email.enabled) {
    try {
      const subject = `Datum digest — ${new Date().toISOString().slice(0, 10)} (${alerts.length} alerts)`;
      await sendEmail({ subject, html, text });
    } catch (err) {
      console.error('[digest] email failed:', err);
    }
  }
}
