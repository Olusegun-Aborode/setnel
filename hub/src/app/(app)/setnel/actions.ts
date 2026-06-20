'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { isAuthed } from '@/lib/session';

const ACTOR_COOKIE = 'setnel_actor';

async function actor(): Promise<string> {
  const jar = await cookies();
  const name = jar.get(ACTOR_COOKIE)?.value?.trim();
  return name && name.length ? name.slice(0, 40) : 'team';
}

async function guard() {
  if (!(await isAuthed())) throw new Error('unauthorized');
}

export async function setActor(formData: FormData) {
  await guard();
  const name = String(formData.get('name') ?? '').trim().slice(0, 40);
  const jar = await cookies();
  if (name) jar.set(ACTOR_COOKIE, name, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 31536000 });
  revalidatePath('/setnel');
}

export async function acknowledgeIncident(formData: FormData) {
  await guard();
  const id = String(formData.get('id'));
  const who = await actor();
  await sql`UPDATE incidents SET acknowledged_at = now(), acknowledged_by = ${who} WHERE id = ${id} AND acknowledged_at IS NULL`;
  await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, 'Acknowledged')`;
  revalidatePath('/setnel');
  revalidatePath(`/setnel/incident/${id}`);
}

export async function muteIncident(formData: FormData) {
  await guard();
  const id = String(formData.get('id'));
  const minutes = Math.max(5, Math.min(10080, Number(formData.get('minutes') ?? 60)));
  const who = await actor();
  await sql`UPDATE incidents SET muted_until = now() + (${minutes} || ' minutes')::interval WHERE id = ${id}`;
  await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, ${'Muted for ' + minutes + ' min'})`;
  revalidatePath('/setnel');
  revalidatePath(`/setnel/incident/${id}`);
}

export async function markFalsePositive(formData: FormData) {
  await guard();
  const id = String(formData.get('id'));
  const who = await actor();
  await sql`UPDATE incidents SET false_positive = true, status = 'resolved', resolved_at = now(), resolved_by = ${who} WHERE id = ${id}`;
  await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, 'Marked false positive')`;
  revalidatePath('/setnel');
  revalidatePath(`/setnel/incident/${id}`);
}

export async function resolveIncident(formData: FormData) {
  await guard();
  const id = String(formData.get('id'));
  const who = await actor();
  await sql`UPDATE incidents SET status = 'resolved', resolved_at = now(), resolved_by = ${who} WHERE id = ${id}`;
  await sql`INSERT INTO incident_notes (incident_id, author, body) VALUES (${id}, ${who}, 'Resolved manually')`;
  revalidatePath('/setnel');
  revalidatePath(`/setnel/incident/${id}`);
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
