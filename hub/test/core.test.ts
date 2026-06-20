import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sign, verifySignature, dashboardSecret } from '../src/lib/auth-hmac.ts';
import { buildDeepLink } from '../src/lib/ingest.ts';

test('verifySignature accepts a correct signature', () => {
  const body = JSON.stringify({ dashboardId: 'aave', events: [] });
  const sig = sign(body, 'secret123');
  assert.equal(verifySignature(body, sig, 'secret123'), true);
});

test('verifySignature rejects a wrong signature', () => {
  const body = JSON.stringify({ dashboardId: 'aave', events: [] });
  assert.equal(verifySignature(body, sign(body, 'secret123'), 'WRONG'), false);
  assert.equal(verifySignature(body, 'deadbeef', 'secret123'), false);
  assert.equal(verifySignature(body, '', 'secret123'), false);
});

test('verifySignature rejects a tampered body', () => {
  const sig = sign(JSON.stringify({ a: 1 }), 's');
  assert.equal(verifySignature(JSON.stringify({ a: 2 }), sig, 's'), false);
});

test('dashboardSecret maps id to env var name', () => {
  process.env.SETNEL_DASHBOARD_SECRET_AAVE = 'x';
  process.env['SETNEL_DASHBOARD_SECRET_STATE_OF_SUI'] = 'y';
  assert.equal(dashboardSecret('aave'), 'x');
  assert.equal(dashboardSecret('state-of-sui'), 'y'); // non-alnum → underscore
  assert.equal(dashboardSecret('unknown'), null);
});

test('buildDeepLink appends the incident id, handling existing query strings', () => {
  assert.equal(
    buildDeepLink('https://x.vercel.app', '/markets/USDT', '42'),
    'https://x.vercel.app/markets/USDT?setnel=42',
  );
  // trailing slash on base + null path
  assert.equal(buildDeepLink('https://x.vercel.app/', null, '7'), 'https://x.vercel.app/?setnel=7');
  // path already has a query → use &
  assert.equal(
    buildDeepLink('https://x.vercel.app', '/m?tab=risk', '9'),
    'https://x.vercel.app/m?tab=risk&setnel=9',
  );
});
