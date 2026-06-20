// Setnel dead-man's-switch watchdog.
//
// Runs from GitHub Actions on its own schedule, independent of the Hub and the
// per-dashboard crons. It answers "is Setnel itself still alive?" — the failure
// mode nothing else can catch (if the Hub is down or the heartbeat stops, no
// alert would ever fire). On a problem it pings Telegram DIRECTLY (not via the
// Hub), so it works even when the Hub is down.
//
// Plain Node (global fetch), no dependencies — so it can't fail for the same
// reason the thing it watches might.

const STATUS_URL = process.env.SETNEL_STATUS_URL || 'https://setnel.datumlab.xyz/api/v1/status';
const STALE_MIN = Number(process.env.SETNEL_STALE_MIN || '20'); // dashboards ping every 5m
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT = process.env.TELEGRAM_CHAT_ID;

async function tg(text) {
  if (!TOKEN || !CHAT) {
    console.error('telegram not configured; would have sent:\n' + text);
    return;
  }
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT, text: text.slice(0, 4000), disable_web_page_preview: true }),
  });
  if (!r.ok) console.error('watchdog TG send failed', r.status, await r.text().catch(() => ''));
}

async function main() {
  let json;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(STATUS_URL, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) {
      await tg(`🚨 Setnel watchdog: Hub status endpoint returned HTTP ${res.status}. The Hub may be down — alerts could be silently failing.`);
      process.exitCode = 1;
      return;
    }
    json = await res.json();
  } catch (err) {
    await tg(`🚨 Setnel watchdog: cannot reach the Hub (${err?.message || err}). The Hub may be down — alerts could be silently failing.`);
    process.exitCode = 1;
    return;
  }

  if (json.ok === false) {
    await tg(`🚨 Setnel watchdog: Hub reported an error (${json.error || 'unknown'}).`);
    process.exitCode = 1;
    return;
  }

  const problems = [];

  // Whole-fleet silence: no check-ins from ANY dashboard recently.
  if (json.lastCheckAgeMin == null || json.lastCheckAgeMin > STALE_MIN) {
    problems.push(
      `No dashboard check-ins in ${json.lastCheckAgeMin == null ? 'a long time' : json.lastCheckAgeMin + ' min'} — collection may be down (heartbeat stopped?).`,
    );
  }

  // Individual dashboards gone quiet (but fleet otherwise alive).
  const quiet = (json.dashboards || []).filter((d) => d.ageMin == null || d.ageMin > STALE_MIN);
  if (quiet.length && json.lastCheckAgeMin != null && json.lastCheckAgeMin <= STALE_MIN) {
    problems.push(
      'Dashboard(s) quiet: ' + quiet.map((d) => `${d.name} (${d.ageMin == null ? 'never' : d.ageMin + 'm'})`).join(', '),
    );
  }

  // Undelivered alerts sitting in the dead-letter.
  if (json.failedNotifications > 0) {
    problems.push(`${json.failedNotifications} undelivered alert(s) in the dead-letter — check delivery.`);
  }

  if (problems.length) {
    await tg('⚠️ Setnel watchdog:\n• ' + problems.join('\n• '));
    process.exitCode = 1;
  } else {
    console.log(`watchdog ok — last check ${json.lastCheckAgeMin}m ago, ${json.dashboards?.length || 0} dashboards healthy`);
  }
}

main();
