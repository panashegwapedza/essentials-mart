import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateBasketReadiness } from '../src/basket-readiness.ts';

const item = (status: string, issue: string | null = null) => ({
  productId: 'p1',
  status,
  issue,
});

test('healthy basket is allowed', () => {
  assert.equal(evaluateBasketReadiness({ items: [item('healthy')], summary: { itemCount: 1 } }).ready, true);
});

test('low-stock basket is blocked', () => {
  assert.equal(evaluateBasketReadiness({ items: [item('low-stock', 'Low stock')] }).ready, false);
});

test('out-of-stock basket is blocked', () => {
  assert.equal(evaluateBasketReadiness({ items: [item('out-of-stock', 'Unavailable')] }).ready, false);
});

test('over-requested basket is blocked', () => {
  assert.equal(evaluateBasketReadiness({ items: [item('over-stocked', 'Insufficient stock')] }).ready, false);
});

test('invalid basket is blocked', () => {
  assert.equal(evaluateBasketReadiness({ items: [item('invalid', 'Invalid quantity')] }).ready, false);
});

test('mixed basket is blocked when one item fails', () => {
  assert.equal(
    evaluateBasketReadiness({ items: [item('healthy'), item('out-of-stock', 'Unavailable')] }).ready,
    false,
  );
});

test('empty or malformed intelligence is blocked', () => {
  assert.equal(evaluateBasketReadiness(undefined).ready, false);
  assert.equal(evaluateBasketReadiness({ items: [] }).ready, false);
  assert.equal(evaluateBasketReadiness({ items: {} }).ready, false);
});

test('healthy item with a non-null issue is blocked', () => {
  const result = evaluateBasketReadiness({ items: [item('healthy', 'Unexpected issue')] });
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'Unexpected issue');
});

test('inconsistent item count is blocked', () => {
  assert.equal(
    evaluateBasketReadiness({ items: [item('healthy')], summary: { itemCount: 2 } }).ready,
    false,
  );
});
