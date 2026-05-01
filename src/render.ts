import type { Alert, MetricSample, MetricSpec } from './types.js';

export function formatValue(value: number | null, unit: MetricSpec['unit']): string {
  if (value == null || !Number.isFinite(value)) return 'n/a';
  switch (unit) {
    case 'usd':
      return formatUsd(value);
    case 'percent':
      return `${value.toFixed(2)}%`;
    case 'count':
      return new Intl.NumberFormat('en-US').format(Math.round(value));
    default:
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(value);
  }
}

function formatUsd(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

export function signedPct(pct: number): string {
  const s = pct > 0 ? '+' : '';
  return `${s}${pct.toFixed(2)}%`;
}

// ─── Telegram (plain text) ─────────────────────────────────────────────
// Sender uses no parse_mode, so the format is whatever shows up in TG raw.
// Two clearly-distinct categories so a glance tells you which kind of alert
// is firing:
//   🔧 Technical Issue  — a failure in the dashboard / monitor itself
//                          (dashboard down, route 404, response unparseable)
//   📊 Data Insight     — a metric value crossed a configured threshold
//                          (TVL drop, utilization spike, liquidation cascade)

export function renderAlertText(alert: Alert): string {
  const severity = alert.critical ? '🚨 CRITICAL' : '⚠️ WARNING';

  if (alert.kind === 'technical') {
    const subject = alert.label
      ? `${alert.dashboardName} — ${alert.label}`
      : alert.dashboardName;
    return [
      `${severity}  •  🔧 Technical Issue`,
      `Where: ${subject}`,
      `What:  ${alert.message}`,
      `Why:   The monitor couldn't read this dashboard's data.`,
      `       This is a code/infra issue, not a market signal.`,
    ].join('\n');
  }

  // Data insight — metric value breached a rule.
  const change =
    Number.isFinite(alert.deltaPct) && alert.previous !== 0
      ? `${formatValue(alert.previous, alert.unit)}  →  ${formatValue(alert.current, alert.unit)}  (${signedPct(alert.deltaPct)})`
      : `${formatValue(alert.current, alert.unit)} (no prior reading)`;

  return [
    `${severity}  •  📊 Data Insight`,
    `Where: ${alert.dashboardName} — ${alert.label}`,
    `Value: ${change}`,
    `Why:   ${alert.rule}`,
  ].join('\n');
}

export function renderAlertHtml(alert: Alert): string {
  const color = alert.critical ? '#d32f2f' : '#ed6c02';
  const tag = alert.critical
    ? '<span style="background:#d32f2f;color:#fff;font-size:11px;padding:2px 6px;border-radius:3px;font-weight:600;">CRITICAL</span>'
    : '<span style="background:#ed6c02;color:#fff;font-size:11px;padding:2px 6px;border-radius:3px;font-weight:600;">WARNING</span>';

  if (alert.kind === 'technical') {
    const where = alert.label
      ? `${escapeHtml(alert.dashboardName)} — ${escapeHtml(alert.label)}`
      : escapeHtml(alert.dashboardName);
    return `
      <div style="border-left:4px solid ${color};padding:10px 14px;margin:10px 0;background:#fafafa;border-radius:0 4px 4px 0;">
        <div style="margin-bottom:6px;">${tag} <strong>🔧 Technical Issue</strong></div>
        <div style="margin-bottom:4px;"><b>${where}</b></div>
        <div style="color:#444;">${escapeHtml(alert.message)}</div>
        <div style="color:#888;font-size:12px;margin-top:6px;">Code/infra issue, not a market signal.</div>
      </div>`;
  }

  const change =
    Number.isFinite(alert.deltaPct) && alert.previous !== 0
      ? `${formatValue(alert.previous, alert.unit)} → <b>${formatValue(alert.current, alert.unit)}</b> (${signedPct(alert.deltaPct)})`
      : `<b>${formatValue(alert.current, alert.unit)}</b> <small style="color:#888;">(no prior reading)</small>`;

  return `
    <div style="border-left:4px solid ${color};padding:10px 14px;margin:10px 0;background:#fafafa;border-radius:0 4px 4px 0;">
      <div style="margin-bottom:6px;">${tag} <strong>📊 Data Insight</strong></div>
      <div style="margin-bottom:4px;"><b>${escapeHtml(alert.dashboardName)}</b> — ${escapeHtml(alert.label)}</div>
      <div style="color:#444;">${change}</div>
      <div style="color:#888;font-size:12px;margin-top:6px;">${escapeHtml(alert.rule)}</div>
    </div>`;
}

// ─── 6-hour digest ─────────────────────────────────────────────────────

export function renderDigestText(samples: MetricSample[], alerts: Alert[]): string {
  const byDashboard = groupBy(samples, (s) => s.dashboardName);
  const parts: string[] = [];
  parts.push(`📊 Datum 6-hour digest — ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`);
  parts.push('');
  for (const [name, rows] of byDashboard) {
    parts.push(`• ${name}`);
    for (const s of rows) {
      const delta =
        s.previousValue != null && s.value != null && s.previousValue !== 0
          ? ` (${signedPct(((s.value - s.previousValue) / s.previousValue) * 100)})`
          : '';
      parts.push(`   ${s.label}: ${formatValue(s.value, s.unit)}${delta}`);
    }
    parts.push('');
  }
  if (alerts.length > 0) {
    parts.push(`Alerts in last window: ${alerts.length}`);
  } else {
    parts.push('No alerts in the last 6 hours.');
  }
  return parts.join('\n');
}

export function renderDigestHtml(samples: MetricSample[], alerts: Alert[]): string {
  const byDashboard = groupBy(samples, (s) => s.dashboardName);
  const rows: string[] = [];
  for (const [name, metrics] of byDashboard) {
    rows.push(`<h3 style="margin:16px 0 4px 0;">${escapeHtml(name)}</h3>`);
    rows.push('<table style="border-collapse:collapse;width:100%;font-size:14px;">');
    rows.push(
      '<tr><th align="left" style="padding:4px 8px;border-bottom:1px solid #ddd;">Metric</th>' +
        '<th align="right" style="padding:4px 8px;border-bottom:1px solid #ddd;">Current</th>' +
        '<th align="right" style="padding:4px 8px;border-bottom:1px solid #ddd;">Previous</th>' +
        '<th align="right" style="padding:4px 8px;border-bottom:1px solid #ddd;">Δ</th></tr>',
    );
    for (const s of metrics) {
      const deltaPct =
        s.previousValue != null && s.value != null && s.previousValue !== 0
          ? ((s.value - s.previousValue) / s.previousValue) * 100
          : null;
      const deltaColor =
        deltaPct == null ? '#888' : deltaPct > 0 ? '#2e7d32' : deltaPct < 0 ? '#c62828' : '#555';
      rows.push(
        `<tr>
          <td style="padding:4px 8px;border-bottom:1px solid #eee;">${escapeHtml(s.label)}</td>
          <td align="right" style="padding:4px 8px;border-bottom:1px solid #eee;">${formatValue(s.value, s.unit)}</td>
          <td align="right" style="padding:4px 8px;border-bottom:1px solid #eee;color:#888;">${formatValue(s.previousValue, s.unit)}</td>
          <td align="right" style="padding:4px 8px;border-bottom:1px solid #eee;color:${deltaColor};">${deltaPct == null ? '—' : signedPct(deltaPct)}</td>
        </tr>`,
      );
    }
    rows.push('</table>');
  }

  const alertsBlock =
    alerts.length > 0
      ? `<h3>Alerts fired</h3>${alerts.map(renderAlertHtml).join('')}`
      : '<p style="color:#2e7d32;">No alerts fired in this window. 🟢</p>';

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:720px;margin:0 auto;padding:16px;">
      <h2 style="margin:0 0 8px 0;">Datum Labs — 6-hour digest</h2>
      <p style="color:#666;margin:0 0 16px 0;">${new Date().toUTCString()}</p>
      ${rows.join('\n')}
      ${alertsBlock}
      <p style="color:#888;font-size:12px;margin-top:24px;">
        Generated by datum-monitor. Thresholds live in <code>config/dashboards.yaml</code>.
      </p>
    </div>`;
}

function groupBy<T, K>(arr: T[], keyFn: (t: T) => K): Map<K, T[]> {
  const m = new Map<K, T[]>();
  for (const item of arr) {
    const k = keyFn(item);
    const list = m.get(k);
    if (list) list.push(item);
    else m.set(k, [item]);
  }
  return m;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
