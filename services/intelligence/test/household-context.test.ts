import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveHouseholdSelection } from '../../../api/_household-context.ts';

const memberships = [
  { household_id: 'h1', role: 'owner', status: 'active', households: { status: 'active', name: 'Home' } },
  { household_id: 'h2', role: 'member', status: 'active', households: { status: 'active', name: 'Shared home' } },
];

test('zero active memberships resolves to no household', () => {
  assert.deepEqual(resolveHouseholdSelection([]), { ok: true, household: null });
});

test('one active membership is selected without requiring a household id', () => {
  const result = resolveHouseholdSelection([memberships[0]]);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.household?.id, 'h1');
});

test('multiple active memberships require an explicit selection', () => {
  const result = resolveHouseholdSelection(memberships);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.status, 409);
    assert.equal(result.code, 'HOUSEHOLD_SELECTION_REQUIRED');
    assert.equal(result.households?.length, 2);
  }
});

test('an explicitly selected active membership resolves successfully', () => {
  const result = resolveHouseholdSelection(memberships, 'h2');
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.household?.id, 'h2');
});

test('a household not in the customer active memberships is denied', () => {
  const result = resolveHouseholdSelection(memberships, 'h3');
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.status, 403);
    assert.equal(result.code, 'HOUSEHOLD_ACCESS_DENIED');
  }
});

test('inactive household records are not selectable', () => {
  const result = resolveHouseholdSelection([
    { household_id: 'h1', role: 'owner', status: 'active', households: { status: 'archived', name: 'Old home' } },
  ]);
  assert.deepEqual(result, { ok: true, household: null });
});
