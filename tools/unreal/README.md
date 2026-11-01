# Essentials Mart — Unreal Engine empty master aisle

This is the first Unreal Engine production environment for Walk Mode. It creates one **empty**, consistently measured supermarket aisle as a reusable 3D source scene. It is not wired into the live customer application yet.

## Visual direction

Use the approved photorealistic reference generated for this milestone as the visual target:

- Premium but welcoming Essentials Mart store
- Warm green and natural wood branding, restrained leafy accents
- Polished stone-look floor, neutral ceiling and realistic linear LED lighting
- Empty metal gondola shelving on the right
- Empty glass-fronted refrigerated cabinets on the left, with two empty shelf bays toward the far end
- No products, packaging, price strips, shelf labels, promotional displays, people or shopping carts

## Project contents

- `EssentialsMartAisle.uproject` — Unreal Engine project descriptor, with editor Python enabled
- `Content/Python/build_empty_aisle.py` — deterministic scene builder; all dimensions are centimetres
- `docs/engineering/WALK-MODE-UNREAL-001.md` — scene specification and integration boundary

## Build the scene

1. Install Unreal Engine 5.6 (or update the project descriptor to the installed UE5 minor version).
2. Open `EssentialsMartAisle.uproject` in Unreal Editor.
3. Allow the Python Editor Script Plugin to load.
4. Open **Window → Developer Tools → Output Log**.
5. Run:

   ```python
   py "Content/Python/build_empty_aisle.py"
   ```

6. Open `/Game/Maps/EM_EmptyAisle` and inspect the scene from `EM_AISLE_Walk_Camera_Start`.

The script uses Unreal's built-in cube mesh as a modular construction primitive and creates reusable PBR materials in `/Game/Materials/WalkMode`. It rebuilds a fresh level each time, so it is deterministic rather than accumulating duplicate actors.

## Important boundary

Unreal Engine is the **offline environment-authoring and rendering studio**. The browser runtime remains Babylon.js/WebGL for the first integration. We will export optimized static meshes/materials and camera/depth renders from the approved scene; we are not putting a live Unreal pixel stream in the shopping application.

This milestone is geometry-first. Final photorealism requires a lighting/material review in Unreal Editor and may require replacing the primitive cabinet/shelf construction with properly authored modular meshes. Keep the aisle dimensions and actor naming stable so later product slots can be attached to shelf coordinates without changing the environment.
