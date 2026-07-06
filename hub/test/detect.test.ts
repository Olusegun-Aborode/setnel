import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mean, stddev, evaluateLatest, backtestFires, type BaselineParams } from '../src/lib/detect.ts';

const P: BaselineParams = { z: 3, minPct: 8, window: 400, minSamples: 20 };

test('mean and stddev', () => {
  assert.equal(mean([2, 4, 6]), 4);
  assert.equal(stddev([4, 4, 4]), 0);
  assert.ok(Math.abs(stddev([2, 4, 6]) - Math.sqrt(8 / 3)) < 1e-9);
});

test('evaluateLatest returns null below minSamples', () => {
  assert.equal(evaluateLatest([1, 2, 3], P), null);
});

test('evaluateLatest does not fire on a flat series', () => {
  const flat = Array(30).fill(100);
  const r = evaluateLatest(flat, P);
  assert.equal(r?.fired, false); // stddev 0 → never fires
});

test('evaluateLatest fires on a large spike past both thresholds', () => {
  // baseline ~100 with real variance (std ≈ 1), then a +60% spike
  const vals = Array.from({ length: 40 }, (_, i) => (i % 2 ? 101 : 99)).concat([160]);
  const r = evaluateLatest(vals, P);
  assert.equal(r?.fired, true);
  assert.ok(r!.z > 3 && Math.abs(r!.pct) > 8);
});

test('evaluateLatest cannot fire on a zero-variance baseline (undefined z)', () => {
  const vals = Array(30).fill(100).concat([160]); // flat history → stddev 0
  assert.equal(evaluateLatest(vals, P)?.fired, false);
});

test('evaluateLatest respects the percent floor (big z, tiny move does not fire)', () => {
  // tight baseline: 100 ± ~0.1, latest 100.5 → huge z but only 0.5% move
  const base = Array.from({ length: 40 }, (_, i) => 100 + (i % 2 === 0 ? 0.1 : -0.1));
  const r = evaluateLatest(base.concat([100.5]), { ...P, minPct: 8 });
  assert.ok(r!.z > 3);
  assert.equal(r?.fired, false); // move under 8%
});

test('backtestFires: sensitivity rises as z falls', () => {
  const vals = Array.from({ length: 200 }, (_, i) => 100 + Math.sin(i / 3) * 15 + (i % 37 === 0 ? 40 : 0));
  const loose = backtestFires(vals, { ...P, z: 4, minPct: 8 }).length;
  const tight = backtestFires(vals, { ...P, z: 2, minPct: 8 }).length;
  assert.ok(tight >= loose, `z=2 (${tight}) should fire at least as often as z=4 (${loose})`);
});

test('backtestFires: window respects minSamples floor', () => {
  const vals = Array(10).fill(100).concat([500]);
  assert.deepEqual(backtestFires(vals, P), []); // only 11 points, below minSamples 20
});
