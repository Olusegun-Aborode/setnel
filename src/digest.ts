import type { Config } from './types.js';
import { runCheck } from './check.js';
import { renderDigestHtml, renderDigestText } from './render.js';
import { sendTelegram } from './notifiers/telegram.js';
import { sendEmail } from './notifiers/email.js';

/**
 * Build the 12-hour report. We piggyback on the same runCheck pass so the
 * digest shows the *current* values alongside their last snapshots. The
 * alert cooldown means repeated breaches won't double-fire into the digest.
 *
 * Routing rules:
 *  - Email: full digest including BOTH data alerts and technical issues.
 *  - Telegram: a summary-only post with the metric table, but technical
 *    alerts are STRIPPED out so the channel stays high-signal. The TG
 *    summary is optional context — the live data alerts already arrived
 *    in the channel from the every-15-min check workflow.
 */
export async function runDigest(config: Config): Promise<void> {
  const { alerts, samples } = await runCheck(config);
  const dataOnly = alerts.filter((a) => a.kind === 'metric');

  const html = renderDigestHtml(samples, alerts);              // email gets all
  const tgText = renderDigestText(samples, dataOnly);          // TG gets data-only
  const fullText = renderDigestText(samples, alerts);          // email plain-text fallback

  if (config.notifications.telegram.enabled) {
    try {
      await sendTelegram(tgText);
    } catch (err) {
      console.error('[digest] telegram failed:', err);
    }
  }
  if (config.notifications.email.enabled) {
    try {
      const techCount = alerts.length - dataOnly.length;
      const subject =
        `Datum 12h digest — ${new Date().toISOString().slice(0, 10)} ` +
        `(${dataOnly.length} data, ${techCount} technical)`;
      await sendEmail({ subject, html, text: fullText });
    } catch (err) {
      console.error('[digest] email failed:', err);
    }
  }
}
