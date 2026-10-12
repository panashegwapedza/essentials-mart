# AISLE-WALK-001 — Photographic aisle walk-through

**Status:** Default Walk Mode (prototype, visual layer only). The Babylon 3D scene (`WalkMode.tsx`) is kept and reachable with `?walk=3d`; it is the only version with tap-to-open product selection. Consistent with ADR-014: the client is untrusted for price, stock and basket truth; product anchors will come from `walk_product_positions`.

## What it is
`apps/customer_web/src/AisleWalk.tsx` walks down one aisle from still photos ("stops"). Neighbouring photos are **registered to each other** with a thin-plate-spline warp built from shared landmarks (green "Fresh Produce" panel corners, fridge-bank top, the green number tiles of signs 5 and 6). While walking, the viewer warps both photos onto the same in-between geometry and dissolves them, so the far wall, fridges, signs and aisle floor coincide instead of ghosting. Each frame is a fixed, slightly zoomed 3:2 cut-out of the photo (look-around is limited to the margin), so the view stays stable. Past the last stop the last photo slowly zooms (~1.2 m).

An earlier version projected each photo onto a box-shaped aisle. That cannot align these images, because the AI-generated stops are not geometrically consistent with each other (different horizons, aisle widths, sign sizes), so it was replaced.

## Wire-in (default Walk Mode; legacy Babylon scene via `?walk=3d`)
In `App.tsx`:
```tsx
import AisleWalk from './AisleWalk';
{walkModeOpen&&(new URLSearchParams(window.location.search).get('walk')==='3d'
  ?<WalkMode products={products} onClose={()=>setWalkModeOpen(false)} onProductSelect={(product)=>{setWalkModeOpen(false);void openProduct(product);}}/>
  :<AisleWalk onClose={()=>setWalkModeOpen(false)}/>)}
```

## Stops and alignment data
Stops are listed in `scripts/aisle-walk/stops.json` (landmarks in 1536×1024 pixels). `python3 scripts/aisle-walk/build_morph.py build` regenerates `apps/customer_web/src/aisleWalkMorph.ts` (warps + stop distances). Do not edit that file by hand.

| File | z (m) | Notes |
|---|---|---|
| `stop-0.jpg` | 0 | original entrance view (signs 3/4 near, 5/6 far) |
| `stop-8.jpg` | 6.05 | approach to fridges |
| `stop-9.jpg` | 6.59 | approach to fridges (sign 6 text repainted) |
| `stop-10.jpg` | 7.22 | closest view; open produce side with plants |

z is derived from the landmark zoom between consecutive stops (depth reference 13 m; override with an explicit `z`). `stop-7.jpg` (enhanced far view) is kept but not in the sequence: it is the same distance as `stop-10` and a different aspect ratio.

### Adding a stop
1. Generate the image to the spec below and save it as 1536×1024 in `apps/customer_web/public/walk/aisle/`.
2. `python3 scripts/aisle-walk/build_morph.py detect <image>` proposes the green panel and sign-tile positions; measure `fridge_top_y` by eye.
3. Add the stop to `stops.json` **in walking order** and run `build`.
4. Check the transition by walking it; if a landmark is off, fix the number in `stops.json` and rebuild.

Every stop must show the landmarks: the green panel, the fridge bank top and both sign-5/6 tiles. Beyond ~10 m the signs leave the frame; use other shared features and extend `landmarks()` in the script.

### Camera spec for new stops
1536×1024 (3:2), rectilinear, no tilt/roll; on the aisle centre line, eye height 1.6 m, horizon near mid-frame; aisle ~2.3 m wide, shelving both sides ~2.1 m; same floor, ceiling, lighting and sign style; no people or carts; generic fictional brands only.

### Style lock (prefix every prompt)
> Photorealistic supermarket interior, same store as the reference image: dark steel gondola shelving, polished concrete floor with soft reflections, exposed black ceiling with track spotlights, green-and-white hanging signs. Eye-level 1.6 m, camera centred in a 2.3 m wide aisle, level, 70° rectilinear lens, 3:2. Generic fictional brands only. No people, no carts.

Chain shots: pass the previous stop as reference: *"Same aisle, camera moved forward exactly N m along the centre line; keep lens, height, lighting, floor, ceiling and sign style identical."*

| z (m) | Left | Right | Ahead / overhead |
|---|---|---|---|
| 0 | Cereal | Soft drinks | Signs 3 & 4; far signs 5 & 6 |
| 2.5–3.5 | Porridge/oats, granola bars | Bottled water | Signs 5 & 6 ahead, fridges visible |
| ~4.5 | Jam, honey, peanut butter | Juices, cordials | Panel and fridges clearly visible |
| 10+ | Fruit racks | Vegetable racks | "Fresh Produce" wall, chiller doors |

## Known limits
- **Coverage gaps:** one long morph from z 0 to 6 m (the biggest stretch; shelf contents change in one dissolve) and nothing past ~7.2 m (the last ~1.2 m is a zoom). Next stops needed: z ≈ 2.5–3.5 and ≈ 4.5, then 10+.
- Signs 5/6 are the same apparent size in stops 8–10 although the fridges get closer, so they are registered by position, not size.
- Product shelves are not registered (their contents differ between photos); they dissolve while the shelf rails and structure stay aligned.
- Stops show real brand packaging (Kellogg's, Coca-Cola, etc.). Replace with generic packaging before wider public use; the repo is public.
- The viewer is not covered by automated tests; the shader was validated with glslangValidator (GLSL ES 1.00) and the warp with an offline renderer.
