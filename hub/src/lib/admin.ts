import { sql } from './db';

// Central audit — every human action records here (shown on the Inbox page).
export async function audit(actor: string, action: string, target?: string, detail?: string): Promise<void> {
  try {
    await sql`INSERT INTO audit_log (actor, action, target, detail) VALUES (${actor}, ${action}, ${target ?? null}, ${detail ?? null})`;
  } catch (e) {
    console.error('[audit] failed', e);
  }
}

// ── Detector config (enable/disable + severity override), read by ingest ──
export type DetectorConfig = { enabled: boolean; severityOverride: string | null };
export async function getDetectorConfigMap(): Promise<Map<string, DetectorConfig>> {
  const rows = (await sql`SELECT dashboard_id, detector_id, enabled, severity_override FROM detector_config`) as
    { dashboard_id: string; detector_id: string; enabled: boolean; severity_override: string | null }[];
  return new Map(rows.map((r) => [`${r.dashboard_id}:${r.detector_id}`, { enabled: r.enabled, severityOverride: r.severity_override }]));
}

// ── Baseline overrides, read by the anomaly runner ──
export type BaselineOverride = { z: number | null; minPct: number | null; enabled: boolean };
export async function getBaselineConfigMap(): Promise<Map<string, BaselineOverride>> {
  const rows = (await sql`SELECT metric_key, z, min_pct, enabled FROM baseline_config`) as
    { metric_key: string; z: number | null; min_pct: number | null; enabled: boolean }[];
  return new Map(rows.map((r) => [r.metric_key, { z: r.z, minPct: r.min_pct, enabled: r.enabled }]));
}

// ── Detector registry for the Detectors page (fired ∪ configured) ──
export type DetectorRow = {
  dashboardId: string;
  detectorId: string;
  enabled: boolean;
  severityOverride: string | null;
  total: number;
  falsePositives: number;
  lastSeen: string | null;
};
export async function getDetectorRegistry(days = 90): Promise<DetectorRow[]> {
  const rows = (await sql`
    WITH fired AS (
      SELECT dashboard_id, detector_id,
             count(*)::int AS total,
             count(*) FILTER (WHERE false_positive)::int AS fp,
             max(last_event_at) AS last_seen
      FROM incidents WHERE opened_at > now() - (${days} || ' days')::interval
      GROUP BY dashboard_id, detector_id
    ),
    keys AS (
      SELECT dashboard_id, detector_id FROM fired
      UNION SELECT dashboard_id, detector_id FROM detector_config
    )
    SELECT k.dashboard_id, k.detector_id,
           COALESCE(c.enabled, true) AS enabled,
           c.severity_override,
           COALESCE(f.total, 0) AS total,
           COALESCE(f.fp, 0) AS fp,
           f.last_seen
    FROM keys k
    LEFT JOIN fired f ON f.dashboard_id = k.dashboard_id AND f.detector_id = k.detector_id
    LEFT JOIN detector_config c ON c.dashboard_id = k.dashboard_id AND c.detector_id = k.detector_id
    ORDER BY k.dashboard_id, total DESC, k.detector_id
  `) as { dashboard_id: string; detector_id: string; enabled: boolean; severity_override: string | null; total: number; fp: number; last_seen: string | null }[];
  return rows.map((r) => ({
    dashboardId: r.dashboard_id, detectorId: r.detector_id, enabled: r.enabled,
    severityOverride: r.severity_override, total: r.total, falsePositives: r.fp, lastSeen: r.last_seen,
  }));
}

// ── Baseline metrics for the Detectors page (distinct sampled metrics ∪ overrides) ──
export type BaselineMetric = { metricKey: string; samples: number; z: number | null; minPct: number | null; enabled: boolean };
export async function getBaselineMetrics(): Promise<BaselineMetric[]> {
  const rows = (await sql`
    WITH m AS (
      SELECT metric_key, count(*)::int AS samples
      FROM metric_samples WHERE source = 'dashboard'
      GROUP BY metric_key
    )
    SELECT COALESCE(m.metric_key, c.metric_key) AS metric_key,
           COALESCE(m.samples, 0) AS samples, c.z, c.min_pct, c.enabled
    FROM m FULL OUTER JOIN baseline_config c ON c.metric_key = m.metric_key
    ORDER BY samples DESC, metric_key
  `) as { metric_key: string; samples: number; z: number | null; min_pct: number | null; enabled: boolean | null }[];
  return rows.map((r) => ({ metricKey: r.metric_key, samples: r.samples, z: r.z, minPct: r.min_pct, enabled: r.enabled ?? true }));
}

// ── Recently escalated incidents, for the Escalation page ──
export type EscalatedIncident = { id: string; severity: string; message: string; escalated_at: string; dashboard_name: string };
export async function getRecentEscalations(limit = 20): Promise<EscalatedIncident[]> {
  return (await sql`
    SELECT i.id, i.severity, i.message, i.escalated_at, d.name AS dashboard_name
    FROM incidents i JOIN dashboards d ON d.id = i.dashboard_id
    WHERE i.escalated_at IS NOT NULL
    ORDER BY i.escalated_at DESC LIMIT ${limit}
  `) as EscalatedIncident[];
}

// ── Escalation / on-call ──
export type Escalation = { escalateAfterMin: number; oncallName: string | null; oncallContact: string | null; enabled: boolean; emailRecipients: string | null };
export async function getEscalation(): Promise<Escalation> {
  const r = (await sql`SELECT escalate_after_min, oncall_name, oncall_contact, enabled, email_recipients FROM escalation_config WHERE id = 1`) as
    { escalate_after_min: number; oncall_name: string | null; oncall_contact: string | null; enabled: boolean; email_recipients: string | null }[];
  const x = r[0];
  return {
    escalateAfterMin: x?.escalate_after_min ?? 15, oncallName: x?.oncall_name ?? null,
    oncallContact: x?.oncall_contact ?? null, enabled: x?.enabled ?? true, emailRecipients: x?.email_recipients ?? null,
  };
}

// Parse the free-text recipients field into a clean address list.
export function parseRecipients(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(/[\s,;]+/).map((s) => s.trim()).filter((s) => s.includes('@'));
}

// ── Notification channel routing (per severity) ──
export type ChannelConfig = { telegram: boolean; email: boolean };
const DEFAULT_CHANNELS: ChannelConfig = { telegram: true, email: false };
export async function getChannelConfigMap(): Promise<Map<string, ChannelConfig>> {
  const rows = (await sql`SELECT severity, telegram, email FROM channel_config`) as
    { severity: string; telegram: boolean; email: boolean }[];
  return new Map(rows.map((r) => [r.severity, { telegram: r.telegram, email: r.email }]));
}
export function channelsFor(map: Map<string, ChannelConfig>, severity: string): ChannelConfig {
  return map.get(severity) ?? DEFAULT_CHANNELS;
}
export type ChannelRow = { severity: string; telegram: boolean; email: boolean };
export async function getChannels(): Promise<ChannelRow[]> {
  const order = ['warning', 'critical', 'emergency'];
  const map = await getChannelConfigMap();
  return order.map((s) => ({ severity: s, ...channelsFor(map, s) }));
}

// ── Member role labels (attribution only — see schema note) ──
export const MEMBER_ROLES = ['Owner', 'Responder', 'System', 'Viewer'] as const;
export async function getMemberRoleMap(): Promise<Map<string, string>> {
  const rows = (await sql`SELECT actor, role FROM member_roles`) as { actor: string; role: string }[];
  return new Map(rows.map((r) => [r.actor, r.role]));
}

// ── Detector proposals (from the Coverage map) ──
export type Proposal = { id: string; dashboardId: string | null; riskType: string; note: string | null; proposedBy: string | null; status: string; created_at: string };
export async function getProposals(limit = 100): Promise<Proposal[]> {
  const rows = (await sql`
    SELECT id, dashboard_id, risk_type, note, proposed_by, status, created_at
    FROM detector_proposals ORDER BY created_at DESC LIMIT ${limit}
  `) as { id: string; dashboard_id: string | null; risk_type: string; note: string | null; proposed_by: string | null; status: string; created_at: string }[];
  return rows.map((r) => ({ id: r.id, dashboardId: r.dashboard_id, riskType: r.risk_type, note: r.note, proposedBy: r.proposed_by, status: r.status, created_at: r.created_at }));
}

// ── Active-incident counts per dashboard (Dashboards tab) ──
export async function getActiveCountsByDashboard(): Promise<Map<string, number>> {
  const rows = (await sql`
    SELECT dashboard_id, count(*)::int AS n FROM incidents WHERE status = 'active' GROUP BY dashboard_id
  `) as { dashboard_id: string; n: number }[];
  return new Map(rows.map((r) => [r.dashboard_id, r.n]));
}

// ── Weekly report series (Reports tab trends + CSV export) ──
export type WeekRow = { week: string; incidents: number; falsePositives: number; ackedPct: number; mttaMin: number | null; mttrMin: number | null };
export async function getWeeklyReport(weeks = 12): Promise<WeekRow[]> {
  const rows = (await sql`
    SELECT to_char(date_trunc('week', opened_at), 'YYYY-MM-DD') AS week,
           count(*)::int AS incidents,
           count(*) FILTER (WHERE false_positive)::int AS fp,
           count(*) FILTER (WHERE acknowledged_at IS NOT NULL)::int AS acked,
           avg(EXTRACT(EPOCH FROM (acknowledged_at - opened_at)) / 60) FILTER (WHERE acknowledged_at IS NOT NULL) AS mtta,
           avg(EXTRACT(EPOCH FROM (resolved_at - opened_at)) / 60) FILTER (WHERE resolved_at IS NOT NULL) AS mttr
    FROM incidents
    WHERE opened_at > now() - (${weeks} || ' weeks')::interval
    GROUP BY 1 ORDER BY 1
  `) as { week: string; incidents: number; fp: number; acked: number; mtta: number | null; mttr: number | null }[];
  return rows.map((r) => ({
    week: r.week, incidents: r.incidents, falsePositives: r.fp,
    ackedPct: r.incidents ? Math.round((r.acked / r.incidents) * 100) : 0,
    mttaMin: r.mtta == null ? null : Math.round(r.mtta), mttrMin: r.mttr == null ? null : Math.round(r.mttr),
  }));
}

// ── Settings: dashboards admin + members ──
export type DashboardAdmin = { id: string; name: string; protocolSlug: string; baseUrl: string; enabled: boolean };
export async function getDashboardsAdmin(): Promise<DashboardAdmin[]> {
  const rows = (await sql`SELECT id, name, protocol_slug, base_url, enabled FROM dashboards ORDER BY enabled DESC, name`) as
    { id: string; name: string; protocol_slug: string; base_url: string; enabled: boolean }[];
  return rows.map((r) => ({ id: r.id, name: r.name, protocolSlug: r.protocol_slug, baseUrl: r.base_url, enabled: r.enabled }));
}
export type Member = { actor: string; actions: number; lastSeen: string | null; role: string };
export async function getMembers(): Promise<Member[]> {
  const roles = await getMemberRoleMap();
  const rows = (await sql`
    SELECT actor, count(*)::int AS actions, max(created_at) AS last_seen
    FROM audit_log GROUP BY actor ORDER BY actions DESC LIMIT 50
  `) as { actor: string; actions: number; last_seen: string | null }[];
  return rows.map((r) => ({ actor: r.actor, actions: r.actions, lastSeen: r.last_seen, role: roles.get(r.actor) ?? 'Responder' }));
}

// ── Inbox / audit feed ──
export type AuditRow = { id: string; actor: string; action: string; target: string | null; detail: string | null; created_at: string };
export async function getAuditLog(limit = 200): Promise<AuditRow[]> {
  return (await sql`SELECT id, actor, action, target, detail, created_at FROM audit_log ORDER BY created_at DESC LIMIT ${limit}`) as AuditRow[];
}
