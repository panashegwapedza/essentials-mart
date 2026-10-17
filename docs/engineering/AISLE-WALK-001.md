# AISLE-WALK-001 — Photographic aisle walk-through

**Status:** Default Walk Mode (prototype, visual layer only). The Babylon 3D scene (`WalkMode.tsx`) is kept and reachable with `?walk=3d`; it is the only version with tap-to-open product selection. Consistent with ADR-014: the client is untrusted for price, stock and basket truth; product anchors will come from `walk_product_positions`.

## What it is
`apps/customer_web/src/AisleWalk.tsx` walks down one aisle from still photos ("stops") of an **empty-shelf** aisle. Because the shelves hold no products, neighbouring photos cannot disagree about what is on them, and real catalog products can be placed on the shelves later without contradicting the photo.

Neighbouring photos are registered to each other with a thin-plate-spline warp built from shared landmarks (the green "Fresh Produce" panel outline and the left edge of the wooden counter). While walking, the viewer warps both photos onto the same in-between geometry and dissolves them, so the panel, fridges, counter and floor coincide and grow smoothly. The photos are also registered to one fixed vanishing point and shown as a fixed, slightly zoomed 3:2 cut-out, so the view does not wander. Past the last stop the final photo slowly zooms (~1.2 m).

History: a box-projection renderer (cannot align inconsistent AI images) and a stocked-shelf image set (products differed between photos, so transitions looked distorted) were both replaced by this.

## Wire-in (default Walk Mode; legacy Babylon scene via `?walk=3d`)
In `App.tsx`:
```tsx
import AisleWalk from './AisleWalk';
{walkModeOpen&&(new URLSearchParams(window.location.search).get('walk')==='3d'
  ?<WalkMode products={products} onClose={()=>setWalkModeOpen(false)} onProductSelect={(product)=>{setWalkModeOpen(false);void openProduct(product);}}/>
  :<AisleWalk onClose={()=>setWalkModeOpen(false)}/>)}
```

## Stops and alignment data
Stops are listed in `scripts/aisle-walk/stops.json` (landmarks in 1536×1024 pixels). `python3 scripts/aisle-walk/build_morph.py build` regenerates `apps/customer_web/src/aisleWalkMorph.ts` (warps + stop distances). Do not edit that file by hand. `build_morph.py detect <image>` proposes the panel and counter boxes for a new image.

| File | z (m) | Source upload | Notes |
|---|---|---|---|
| `stop-0.jpg` | 0 | 1 | entrance view, signs 5 & 6 overhead |
| `stop-1.jpg` | 2.77 | 3 | |
| `stop-2.jpg` | 4.70 | 4 | |
| `stop-3.jpg` | 8.03 | 7 | |
| `stop-4.jpg` | 9.60 | 6 | |
| `stop-5.jpg` | 10.50 | 8 | closest view; counter fills the right |

- Uploads 2 and 5 were near-duplicates of 1 and 4 and are not used.
- Uploads 6 and 7 are swapped relative to the walking order: by measured size of the panel and counter, 7 is farther than 6.
- z is derived from the measured growth of the panel and counter (geometric mean) with the last stop pinned at 10.5 m. The photos are *not* evenly 1.5 m apart.
- Source frames were cropped to 3:2 (the 16:9 ones from the centre), translated so their vanishing points coincide, and resized to 1536×1024.

### Adding a stop
1. Generate the image to the spec below and save it as 1536×1024 in `apps/customer_web/public/walk/aisle/`.
2. `python3 scripts/aisle-walk/build_morph.py detect <image>`; add the stop to `stops.json` **in walking order** (by how large the panel and counter appear), then run `build`.
3. Walk the transition and fix a landmark in `stops.json` if something is off.

### Camera spec for new stops
3:2, rectilinear, no tilt/roll; on the aisle centre line at eye height; vanishing point near the frame centre; same empty gondola shelving, floor, ceiling and sign style; the green "Fresh Produce" panel and the wooden counter visible; no people or carts.

## Known limits
- **Shelf geometry differs between some photos** (the generator changed the number and placement of bays, notably around stops 2→3 and 4→5). The panel, fridges, counter and floor stay aligned, but the shelf posts cannot be made to coincide with any smooth warp, so shelves dissolve quickly rather than morph. Regenerating those photos from the previous one with the shelves held fixed would fix it.
- The 0–2.8 m and 4.7–8 m stretches are the longest single dissolves; extra photos there help most.
- The shader was validated with glslangValidator (GLSL ES 1.00) and the warp with an offline renderer, not in a browser; no automated tests.
