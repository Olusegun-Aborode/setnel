import 'dotenv/config';
import { loadConfig } from './config.js';
import { runCheck } from './check.js';
import { runDigest } from './digest.js';
import { renderAlertText } from './render.js';
import { sendTelegram } from './notifiers/telegram.js';

async function main() {
  const [, , cmd, ...rest] = process.argv;
  const configPathFlag = rest.indexOf('--config');
  const configPath = configPathFlag >= 0 ? rest[configPathFlag + 1] : undefined;

  const config = loadConfig(configPath);

  switch (cmd) {
    case 'validate-config': {
      console.log(
        `Config OK — ${config.dashboards.length} dashboards, ` +
          `${config.dashboards.reduce((n, d) => n + d.metrics.length, 0)} metrics total.`,
      );
      for (const d of config.dashboards) {
        console.log(`  • ${d.name} (${d.enabled ? 'enabled' : 'disabled'}): ${d.metrics.length} metrics`);
      }
      return;
    }

    case 'check': {
      const { alerts, samples } = await runCheck(config);
      const dataAlerts = alerts.filter((a) => a.kind === 'metric');
      const techAlerts = alerts.filter((a) => a.kind === 'technical');
      console.log(
        `check: ${samples.length} samples, ${alerts.length} alerts ` +
          `(${dataAlerts.length} data, ${techAlerts.length} technical, ` +
          `${alerts.filter((a) => a.critical).length} critical)`,
      );
      // Telegram = data alerts only. Technical alerts get batched into the
      // 12-hour email digest so the channel stays high-signal.
      if (config.notifications.telegram.enabled && dataAlerts.length > 0) {
        for (const alert of dataAlerts) {
          try {
            await sendTelegram(renderAlertText(alert));
          } catch (err) {
            console.error('[check] telegram failed:', err);
          }
        }
      }
      // Exit non-zero on any critical alert (data or technical) so the GH
      // Actions run is flagged for inspection in the Actions tab.
      if (alerts.some((a) => a.critical)) process.exitCode = 1;
      return;
    }

    case 'digest': {
      await runDigest(config);
      console.log('digest: sent.');
      return;
    }

    default: {
      console.error(
        `Usage: datum-monitor <check|digest|validate-config> [--config path/to/dashboards.yaml]`,
      );
      process.exit(2);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
