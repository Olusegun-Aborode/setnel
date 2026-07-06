import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  renotifyWindowMs, isSeverityEscalation, shouldRenotify, shouldEscalate,
  RENOTIFY_ACKED_MS, RENOTIFY_URGENT_MS, RENOTIFY_NORMAL_MS,
} from '../src/lib/incident-logic.ts';

test('renotifyWindowMs: acked is silent, urgent nags hourly, normal 6h', () => {
  assert.equal(renotifyWindowMs(true, 'critical'), RENOTIFY_ACKED_MS);
  assert.equal(renotifyWindowMs(false, 'critical'), RENOTIFY_URGENT_MS);
  assert.equal(renotifyWindowMs(false, 'emergency'), RENOTIFY_URGENT_MS);
  assert.equal(renotifyWindowMs(false, 'warning'), RENOTIFY_NORMAL_MS);
  assert.equal(renotifyWindowMs(false, 'info'), RENOTIFY_NORMAL_MS);
});

test('isSeverityEscalation only when climbing', () => {
  assert.equal(isSeverityEscalation('critical', 'warning'), true);
  assert.equal(isSeverityEscalation('warning', 'critical'), false);
  assert.equal(isSeverityEscalation('critical', 'critical'), false);
});

test('shouldRenotify: muted never, escalation always, else staleness', () => {
  const now = 1_000_000_000_000;
  assert.equal(shouldRenotify({ muted: true, escalated: true, notifiedAt: null, nowMs: now, windowMs: 1000 }), false);
  assert.equal(shouldRenotify({ muted: false, escalated: true, notifiedAt: new Date(now).toISOString(), nowMs: now, windowMs: 9e9 }), true);
  const old = new Date(now - 2000).toISOString();
  assert.equal(shouldRenotify({ muted: false, escalated: false, notifiedAt: old, nowMs: now, windowMs: 1000 }), true);
  const fresh = new Date(now - 500).toISOString();
  assert.equal(shouldRenotify({ muted: false, escalated: false, notifiedAt: fresh, nowMs: now, windowMs: 1000 }), false);
});

test('shouldEscalate: gating on severity, ack, mute, age, and prior escalation', () => {
  const now = 1_000_000_000_000;
  const base = {
    severity: 'critical' as const,
    acknowledgedAt: null,
    mutedUntil: null,
    openedAt: new Date(now - 20 * 60 * 1000).toISOString(), // 20m old
    escalatedAt: null,
  };
  assert.equal(shouldEscalate(base, now, 15), true); // 20m old, 15m window

  assert.equal(shouldEscalate({ ...base, severity: 'warning' }, now, 15), false); // too low
  assert.equal(shouldEscalate({ ...base, acknowledgedAt: new Date(now).toISOString() }, now, 15), false); // acked
  assert.equal(shouldEscalate({ ...base, mutedUntil: new Date(now + 60000).toISOString() }, now, 15), false); // muted
  assert.equal(shouldEscalate({ ...base, openedAt: new Date(now - 5 * 60 * 1000).toISOString() }, now, 15), false); // too fresh
  assert.equal(shouldEscalate({ ...base, escalatedAt: new Date(now - 60 * 1000).toISOString() }, now, 15), false); // escalated 1m ago
  assert.equal(shouldEscalate({ ...base, escalatedAt: new Date(now - 20 * 60 * 1000).toISOString() }, now, 15), true); // escalated 20m ago → due again
});
