export type HouseholdMembership = {
  household_id: string;
  role: string;
  status: string;
  households?: { status: string; name: string | null } | null;
};

export type HouseholdResolution =
  | { ok: true; household: { id: string; name: string | null; status: string; role: string } | null }
  | { ok: false; status: 400 | 403 | 409; code: string; message: string; households?: Array<{ id: string; name: string | null; role: string }> };

export function resolveHouseholdSelection(
  memberships: HouseholdMembership[],
  requestedHouseholdId?: string | null,
): HouseholdResolution {
  const active = memberships.filter(row =>
    row.status === 'active' && (!row.households || row.households.status === 'active'),
  );
  const unique = [...new Map(active.map(row => [row.household_id, row])).values()];

  if (requestedHouseholdId) {
    const selected = unique.find(row => row.household_id === requestedHouseholdId);
    if (!selected) return { ok: false, status: 403, code: 'HOUSEHOLD_ACCESS_DENIED', message: 'You are not an active member of the selected household.' };
    return { ok: true, household: { id: selected.household_id, name: selected.households?.name ?? null, status: selected.households?.status ?? 'active', role: selected.role } };
  }

  if (unique.length > 1) {
    return {
      ok: false,
      status: 409,
      code: 'HOUSEHOLD_SELECTION_REQUIRED',
      message: 'Select a household to continue.',
      households: unique.map(row => ({ id: row.household_id, name: row.households?.name ?? null, role: row.role })),
    };
  }

  const selected = unique[0];
  return {
    ok: true,
    household: selected
      ? { id: selected.household_id, name: selected.households?.name ?? null, status: selected.households?.status ?? 'active', role: selected.role }
      : null,
  };
}
