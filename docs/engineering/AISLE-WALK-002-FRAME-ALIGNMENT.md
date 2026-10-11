# AISLE-WALK-002 — Camera calibration and frame stability

**Status:** Initial calibration fix committed to a working branch; browser/build verification pending. Not deployed to production.

## Change

The photographic renderer previously used a single hard-coded screen-ray calibration (vanishing point and focal length) for every stop, even though each stop carries its own camera calibration. That mismatch can contribute to apparent drift during stop transitions.

The renderer now derives the screen ray from the active stop pair's camera calibration and interpolates those calibration values over the same transition interval used for the image pair.

## Important limitation

This is a first correction, not proof of seamless registration. Different generated photographs can still contain different physical shelf positions, aisle widths, signs, fridge geometry, and floor markings. Interpolating camera intrinsics cannot make those independent scenes geometrically identical.

For strict stability, each stop must be registered to the reference image using measured corresponding landmarks (shelf corners, floor boundaries, refrigerator edges and signs), with a common crop and an acceptance threshold. Images that fail registration should not be blended. This registration stage is not implemented by this change.

## Verification required

- Run `npm run build` from `apps/customer_web`.
- Open the aisle prototype in a browser and test every stop transition in both directions.
- Record screen positions of fixed landmarks before and after transitions.
- Confirm shelves, fridge edges and floor boundaries do not jump; reject any stop that cannot be aligned.
- Do not deploy to production until these checks pass.

## Commit

`fix(walk): use stop-specific camera calibration`
