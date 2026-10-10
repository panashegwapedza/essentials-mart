# AISLE-WALK-001 — Photographic aisle walk-through

**Status:** Prototype, visual layer only. Consistent with ADR-014 (Walk Mode): the client is untrusted for price, stock and basket truth; product anchors will come from `walk_product_positions`.

## What it is
`apps/customer_web/src/AisleWalk.tsx` renders a walk down one aisle from still photos ("stops"). The aisle is a box (floor, ceiling, two shelf walls, end wall); each stop photo is projected onto it from the stop's own camera position, and neighbouring stops are cross-faded as you walk. Surfaces a photo shows too coarsely fall back to a repeated near-field slice of the same photo, so detail only comes from real stops: **more stops = less repetition**.

## Wire-in (non-invasive, opt-in via `?walk=aisle`)
In `App.tsx`:
```tsx
import AisleWalk from './AisleWalk';
// replace the WalkMode render with:
{walkModeOpen&&(new URLSearchParams(window.location.search).get('walk')==='aisle'
  ?<AisleWalk onClose={()=>setWalkModeOpen(false)}/>
  :<WalkMode products={products} onClose={()=>setWalkModeOpen(false)} onProductSelect={(product)=>{setWalkModeOpen(false);void openProduct(product);}}/>)}
```

## Stops
Configured in `STOP_SOURCES` (`AisleWalk.tsx`); images in `public/walk/aisle/`. Stops are sorted by `z`, so file names can be in any order. Currently: `stop-0.jpg` (z 0) and `stop-7.jpg` (z 6.5, enhanced 2×, own vanishing point). The walk spans 0 → last stop + 2 m; once a stop at z ≥ 15 exists it spans 0 → 17 m.

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
- Camera constants are global except per-stop `vp` and `f`; a stop that drifts from the spec should be regenerated.
- Stops generated independently will differ in shelf contents when cross-fading.
- Not yet tested in CI; no `walk_product_positions` anchors or overlays yet.
