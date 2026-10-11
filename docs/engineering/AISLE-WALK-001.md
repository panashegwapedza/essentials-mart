# AISLE-WALK-001 — Photographic aisle walk-through

**Status:** Default Walk Mode (prototype, visual layer only). The Babylon 3D scene (`WalkMode.tsx`) is kept and reachable with `?walk=3d`; it is the only version with tap-to-open product selection. Consistent with ADR-014 (Walk Mode): the client is untrusted for price, stock and basket truth; product anchors will come from `walk_product_positions`.

## What it is
`apps/customer_web/src/AisleWalk.tsx` renders a walk down one aisle from still photos ("stops"). The aisle is a box (floor, ceiling, two shelf walls, end wall); each stop photo is projected onto it from the stop's own camera position, and neighbouring stops are cross-faded as you walk. Surfaces a photo shows too coarsely fall back to a repeated near-field slice of the same photo, so detail only comes from real stops: **more stops = less repetition**.

## Wire-in (default Walk Mode; legacy Babylon scene via `?walk=3d`)
In `App.tsx`:
```tsx
import AisleWalk from './AisleWalk';
// the WalkMode render is replaced with:
{walkModeOpen&&(new URLSearchParams(window.location.search).get('walk')==='3d'
  ?<WalkMode products={products} onClose={()=>setWalkModeOpen(false)} onProductSelect={(product)=>{setWalkModeOpen(false);void openProduct(product);}}/>
  :<AisleWalk onClose={()=>setWalkModeOpen(false)}/>)}
```

## Stops
Configured in `STOP_SOURCES` (`AisleWalk.tsx`); images in `public/walk/aisle/`. Stops are sorted by `z`, so file names can be in any order. Currently (z = estimated camera distance from the entrance):

| File | z (m) | Vanishing point | Notes |
|---|---|---|---|
| `stop-0.jpg` | 0 | default | original entrance view |
| `stop-7.jpg` | 5.0 | .445 / .42 | far-aisle view, enhanced 2× |
| `stop-8.jpg` | 6.5 | .44 / .52 | approach to fridges |
| `stop-9.jpg` | 7.4 | .52 / .556 | approach to fridges (sign 6 text repainted) |
| `stop-10.jpg` | 8.0 | .48 / .54 | closest view; open produce side with plants |

z values for stops 7–10 were estimated from fridge height relative to stop 0 (±1.5 m); tune them in `STOP_SOURCES`. The walk spans 0 → last stop + 2 m (10 m now); once a stop at z ≥ 15 exists it spans 0 → 17 m. Images are ~2.2 MB in total and all load up front.

### Camera spec for new stops (identical for every shot)
1536×1024 (3:2), rectilinear ~70° HFOV, no tilt/roll; on the aisle centre line, eye height 1.6 m; aisle floor vanishing point ≈ 52% across, 39% down; aisle 2.3 m wide, shelving both sides ~2.1 m; same floor, ceiling, lighting and sign style; no people or carts; generic fictional brands only.

### Style lock (prefix every prompt)
> Photorealistic supermarket interior, same store as the reference image: dark steel gondola shelving, polished concrete floor with soft reflections, exposed black ceiling with track spotlights, green-and-white hanging signs. Eye-level 1.6 m, camera centred in a 2.3 m wide aisle, level, 70° rectilinear lens, 3:2. Generic fictional brands only. No people, no carts.

Chain shots: pass the previous stop as reference — *"Same aisle, camera moved forward exactly N m along the centre line; keep lens, height, lighting, floor, ceiling and sign style identical."*

| z (m) | Left | Right | Ahead / overhead |
|---|---|---|---|
| 0 | Cereal | Soft drinks | Signs 3 & 4; far signs 5 & 6 |
| 3 | Porridge/oats, granola bars | Bottled water | — |
| 6 | Jam, honey, peanut butter | Juices, cordials | Far end brighter |
| 9 | Tea, coffee, long-life milk | Energy & sports drinks, mixers | Signs 5 & 6 ahead |
| 12 | Shelving ends; fruit racks begin | Shelving ends; vegetable racks begin | Cross-aisle; signs 5 (left-centre) & 6 (right-centre) |
| 15 | Tiered wooden fruit racks | Tiered vegetable racks | "Fresh Produce" wall sign |
| 18 | Fruit rack, close | Vegetable rack, close | Chiller doors ~3 m ahead |

Keep z ≥ 12 a corridor (full-height produce displays both sides, same 2.3 m width).

## Known limits
- **Coverage gaps:** nothing between z 0 and 5 m except one long cross-fade (shelf textures repeat here), and nothing past ~8 m (last 2 m of the walk are extrapolated). Next stops needed: z ≈ 2.5–3.5 and z ≈ 10+.
- Signs 5/6 are the same apparent size in stops 8–10 although the fridges get closer, so they won't grow as you approach.
- Stops show real brand packaging (Kellogg's, Coca-Cola, etc.). Replace with generic packaging before wider public use; the repo is public.
- Camera constants are global except per-stop `vp` and `f`; a stop that drifts from the spec should be regenerated.
- Stops generated independently will differ in shelf contents when cross-fading.
- Not yet tested in CI; no `walk_product_positions` anchors or overlays yet.
