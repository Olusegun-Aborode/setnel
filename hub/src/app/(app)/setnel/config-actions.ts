'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { isAuthed } from '@/lib/session';
import { audit } from '@/lib/admin';

async function actor(): Promise<string> {
  const n = (await cookies()).get('setnel_actor')?.value?.trim();
  return n && n.length ? n.slice(0, 40) : 'team';
}
async function guard() {
  if (!(await isAuthed())) throw new Error('unauthorized');
}

export async function setDetectorEnabled(formData: FormData) {
  await guard();
  const dashboardId = String(formData.get('dashboardId'));
  const detectorId = String(formData.get('detectorId'));
  const enabled = String(formData.get('enabled')) === 'true';
  const who = await actor();
  await sql`
    INSERT INTO detector_config (dashboard_id, detector_id, enabled, updated_by)
    VALUES (${dashboardId}, ${detectorId}, ${enabled}, ${who})
    ON CONFLICT (dashboard_id, detector_id)
    DO UPDATE SET enabled = ${enabled}, updated_by = ${who}, updated_at = now()
  `;
  await audit(who, enabled ? 'detector.enable' : 'detector.disable', `${dashboardId}:${detectorId}`);
  revalidatePath('/setnel/detectors');
}

export async function setDetectorSeverity(formData: FormData) {
  await guard();
  const dashboardId = String(formData.get('dashboardId'));
  const detectorId = String(formData.get('detectorId'));
  const sev = String(formData.get('severity'));
  const value = ['info', 'warning', 'critical', 'emergency'].includes(sev) ? sev : null;
  const who = await actor();
  await sql`
    INSERT INTO detector_config (dashboard_id, detector_id, severity_override, updated_by)
    VALUES (${dashboardId}, ${detectorId}, ${value}, ${who})
    ON CONFLICT (dashboard_id, detector_id)
    DO UPDATE SET severity_override = ${value}, updated_by = ${who}, updated_at = now()
  `;
  await audit(who, 'detector.severity', `${dashboardId}:${detectorId}`, value ?? 'default');
  revalidatePath('/setnel/detectors');
}

export async function setBaselineThreshold(formData: FormData) {
  await guard();
  const metricKey = String(formData.get('metricKey'));
  const z = formData.get('z') ? Number(formData.get('z')) : null;
  const minPct = formData.get('minPct') ? Number(formData.get('minPct')) : null;
  const enabled = String(formData.get('enabled') ?? 'true') === 'true';
  const who = await actor();
  await sql`
    INSERT INTO baseline_config (metric_key, z, min_pct, enabled, updated_by)
    VALUES (${metricKey}, ${z}, ${minPct}, ${enabled}, ${who})
    ON CONFLICT (metric_key)
    DO UPDATE SET z = ${z}, min_pct = ${minPct}, enabled = ${enabled}, updated_by = ${who}, updated_at = now()
  `;
  await audit(who, 'baseline.tune', metricKey, `z=${z ?? 'default'} minPct=${minPct ?? 'default'} enabled=${enabled}`);
  revalidatePath('/setnel/detectors');
}

export async function saveEscalation(formData: FormData) {
  await guard();
  const minutes = Math.max(1, Math.min(1440, Number(formData.get('minutes') ?? 15)));
  const name = String(formData.get('oncallName') ?? '').slice(0, 80) || null;
  const contact = String(formData.get('oncallContact') ?? '').slice(0, 120) || null;
  const emails = String(formData.get('emailRecipients') ?? '').slice(0, 500) || null;
  const enabled = String(formData.get('enabled') ?? 'true') === 'true';
  const who = await actor();
  await sql`
    UPDATE escalation_config SET escalate_after_min = ${minutes}, oncall_name = ${name},
      oncall_contact = ${contact}, email_recipients = ${emails}, enabled = ${enabled},
      updated_by = ${who}, updated_at = now()
    WHERE id = 1
  `;
  await audit(who, 'escalation.save', undefined, `after=${minutes}m oncall=${name ?? '—'} enabled=${enabled}`);
  revalidatePath('/setnel/escalation');
}

export async function saveChannel(formData: FormData) {
  await guard();
  const severity = String(formData.get('severity'));
  if (!['warning', 'critical', 'emergency'].includes(severity)) return;
  const telegram = formData.get('telegram') != null;
  const email = formData.get('email') != null;
  const who = await actor();
  await sql`
    INSERT INTO channel_config (severity, telegram, email, updated_by)
    VALUES (${severity}, ${telegram}, ${email}, ${who})
    ON CONFLICT (severity) DO UPDATE SET telegram = ${telegram}, email = ${email}, updated_by = ${who}, updated_at = now()
  `;
  await audit(who, 'channels.save', severity, `telegram=${telegram} email=${email}`);
  revalidatePath('/setnel/escalation');
}

export async function setMemberRole(formData: FormData) {
  await guard();
  const target = String(formData.get('actor') ?? '').slice(0, 40);
  const role = String(formData.get('role') ?? '');
  if (!target || !['Owner', 'Responder', 'System', 'Viewer'].includes(role)) return;
  const who = await actor();
  await sql`
    INSERT INTO member_roles (actor, role, updated_by)
    VALUES (${target}, ${role}, ${who})
    ON CONFLICT (actor) DO UPDATE SET role = ${role}, updated_by = ${who}, updated_at = now()
  `;
  await audit(who, 'member.role', target, role);
  revalidatePath('/setnel/settings');
}

export async function proposeDetector(formData: FormData) {
  await guard();
  const dashboardId = String(formData.get('dashboardId') ?? '').slice(0, 80) || null;
  const riskType = String(formData.get('riskType') ?? '').slice(0, 120);
  const note = String(formData.get('note') ?? '').slice(0, 500) || null;
  if (!riskType) return;
  const who = await actor();
  await sql`
    INSERT INTO detector_proposals (dashboard_id, risk_type, note, proposed_by)
    VALUES (${dashboardId}, ${riskType}, ${note}, ${who})
  `;
  await audit(who, 'detector.propose', `${dashboardId ?? '—'}:${riskType}`, note ?? undefined);
  revalidatePath('/setnel/coverage');
}

export async function resolveProposal(formData: FormData) {
  await guard();
  const id = String(formData.get('id'));
  const who = await actor();
  await sql`UPDATE detector_proposals SET status = 'closed' WHERE id = ${id}`;
  await audit(who, 'detector.propose.close', id);
  revalidatePath('/setnel/coverage');
}

// Display preferences (density, default time range, colorblind-safe status).
// Stored in a cookie so the shell can read them at SSR time — no DB, no identity.
export async function savePreferences(formData: FormData) {
  await guard();
  const density = String(formData.get('density')) === 'compact' ? 'compact' : 'comfortable';
  const timeRange = ['7', '14', '30', '90'].includes(String(formData.get('timeRange'))) ? String(formData.get('timeRange')) : '30';
  const colorblind = formData.get('colorblind') != null;
  const jar = await cookies();
  jar.set('setnel_prefs', JSON.stringify({ density, timeRange, colorblind }), {
    httpOnly: false, sameSite: 'lax', path: '/', maxAge: 31536000,
  });
  revalidatePath('/setnel', 'layout');
}

export async function addDashboard(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const name = String(formData.get('name') ?? '').trim().slice(0, 80);
  const baseUrl = String(formData.get('baseUrl') ?? '').trim();
  const protocolSlug = String(formData.get('protocolSlug') ?? id).trim().slice(0, 80);
  if (!id || !name || !baseUrl) return;
  const who = await actor();
  await sql`
    INSERT INTO dashboards (id, name, protocol_slug, base_url, enabled)
    VALUES (${id}, ${name}, ${protocolSlug}, ${baseUrl}, true)
    ON CONFLICT (id) DO UPDATE SET name = ${name}, base_url = ${baseUrl}, protocol_slug = ${protocolSlug}
  `;
  await audit(who, 'dashboard.add', id, name);
  revalidatePath('/setnel/settings');
}

export async function setDashboardEnabled(formData: FormData) {
  await guard();
  const id = String(formData.get('id'));
  const enabled = String(formData.get('enabled')) === 'true';
  const who = await actor();
  await sql`UPDATE dashboards SET enabled = ${enabled} WHERE id = ${id}`;
  await audit(who, enabled ? 'dashboard.enable' : 'dashboard.disable', id);
  revalidatePath('/setnel/settings');
}
