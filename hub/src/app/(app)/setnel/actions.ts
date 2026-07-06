'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { isAuthed } from '@/lib/session';
import { audit } from '@/lib/admin';
import { currentActor } from '@/lib/users';

// Attribution comes from the verified user session (HMAC-signed), not a
// forgeable free-text name. Unverified sessions attribute to 'team'.
const actor = currentActor;

async function guard() {
  if (!(await isAuthed())) throw new Error('unauthorized');
}

export async function acknowledgeIncident(formData: FormData) {
  await guard();
  const id = String(formData.get('id'));
  const who = await actor();
  await sql`UPDATE incidents SET acknowledged_at = now(), acknowledged_by = ${who} WHERE id = ${id} AND acknowledged_at IS NULL`;
  await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, 'Acknowledged')`;
  await audit(who, 'incident.ack', id);
  revalidatePath('/setnel');
  revalidatePath(`/setnel/incident/${id}`);
}

export async function muteIncident(formData: FormData) {
  await guard();
  const id = String(formData.get('id'));
  const minutes = Math.max(5, Math.min(10080, Number(formData.get('minutes') ?? 60)));
  const reason = String(formData.get('reason') ?? '').trim().slice(0, 200);
  const who = await actor();
  await sql`UPDATE incidents SET muted_until = now() + (${minutes} || ' minutes')::interval WHERE id = ${id}`;
  const note = `Muted ${minutes}m${reason ? `: ${reason}` : ''}`;
  await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, ${note})`;
  await audit(who, 'incident.mute', id, `${minutes}m${reason ? ` · ${reason}` : ''}`);
  revalidatePath('/setnel');
  revalidatePath(`/setnel/incident/${id}`);
}

// ── Bulk triage (from the Incidents keyboard/selection UI) ──
function idsFrom(formData: FormData): string[] {
  return String(formData.get('ids') ?? '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 200);
}

export async function bulkAck(formData: FormData) {
  await guard();
  const who = await actor();
  const ids = idsFrom(formData);
  for (const id of ids) {
    await sql`UPDATE incidents SET acknowledged_at = now(), acknowledged_by = ${who} WHERE id = ${id} AND acknowledged_at IS NULL`;
    await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, 'Acknowledged (bulk)')`;
  }
  await audit(who, 'incident.bulk_ack', ids.join(','), `${ids.length} incidents`);
  revalidatePath('/setnel/incidents');
  revalidatePath('/setnel');
}

export async function bulkMute(formData: FormData) {
  await guard();
  const who = await actor();
  const ids = idsFrom(formData);
  const minutes = Math.max(5, Math.min(10080, Number(formData.get('minutes') ?? 60)));
  const reason = String(formData.get('reason') ?? '').trim().slice(0, 200);
  const note = `Muted ${minutes}m (bulk)${reason ? `: ${reason}` : ''}`;
  for (const id of ids) {
    await sql`UPDATE incidents SET muted_until = now() + (${minutes} || ' minutes')::interval WHERE id = ${id}`;
    await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, ${note})`;
  }
  await audit(who, 'incident.bulk_mute', ids.join(','), `${ids.length} · ${minutes}m${reason ? ` · ${reason}` : ''}`);
  revalidatePath('/setnel/incidents');
  revalidatePath('/setnel');
}

export async function bulkResolve(formData: FormData) {
  await guard();
  const who = await actor();
  const ids = idsFrom(formData);
  for (const id of ids) {
    await sql`UPDATE incidents SET status = 'resolved', resolved_at = now(), resolved_by = ${who} WHERE id = ${id}`;
    await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, 'Resolved (bulk)')`;
  }
  await audit(who, 'incident.bulk_resolve', ids.join(','), `${ids.length} incidents`);
  revalidatePath('/setnel/incidents');
  revalidatePath('/setnel');
}

export async function markFalsePositive(formData: FormData) {
  await guard();
  const id = String(formData.get('id'));
  const who = await actor();
  await sql`UPDATE incidents SET false_positive = true, status = 'resolved', resolved_at = now(), resolved_by = ${who} WHERE id = ${id}`;
  await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, 'Marked false positive')`;
  await audit(who, 'incident.false_positive', id);
  revalidatePath('/setnel');
  revalidatePath(`/setnel/incident/${id}`);
}

export async function resolveIncident(formData: FormData) {
  await guard();
  const id = String(formData.get('id'));
  const who = await actor();
  await sql`UPDATE incidents SET status = 'resolved', resolved_at = now(), resolved_by = ${who} WHERE id = ${id}`;
  await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, 'Resolved manually')`;
  await audit(who, 'incident.resolve', id);
  revalidatePath('/setnel');
  revalidatePath(`/setnel/incident/${id}`);
}

export async function muteDetector(formData: FormData) {
  await guard();
  const dashboardId = String(formData.get('dashboardId'));
  const detectorId = String(formData.get('detectorId'));
  const minutes = Math.max(60, Math.min(43200, Number(formData.get('minutes') ?? 1440)));
  const who = await actor();
  await sql`
    INSERT INTO detector_mutes (dashboard_id, detector_id, muted_until, muted_by)
    VALUES (${dashboardId}, ${detectorId}, now() + (${minutes} || ' minutes')::interval, ${who})
    ON CONFLICT (dashboard_id, detector_id)
    DO UPDATE SET muted_until = EXCLUDED.muted_until, muted_by = EXCLUDED.muted_by
  `;
  await audit(who, 'detector.mute', `${dashboardId}:${detectorId}`, minutes + 'm');
  revalidatePath('/setnel');
  revalidatePath(`/setnel/incident/${formData.get('id')}`);
}

export async function addNote(formData: FormData) {
  await guard();
  const id = String(formData.get('id'));
  const body = String(formData.get('body') ?? '').trim().slice(0, 1000);
  if (!body) return;
  const who = await actor();
  await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, ${body})`;
  revalidatePath(`/setnel/incident/${id}`);
}
