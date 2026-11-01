# WALK-MODE-UNREAL-001 — Empty master aisle

**Status:** Initial Unreal Engine scene-builder scaffold. Not yet executed in Unreal Editor and not yet integrated into the customer web application.

## Objective

Create one persistent, product-free master aisle as the spatial source of truth for Essentials Mart Walk Mode. This replaces the idea of generating unrelated aisle images and attempting to align them after the fact.

## Fixed scene specification

| Property | Initial value |
|---|---:|
| Aisle length | 26 m |
| Overall environment width | 11 m |
| Ceiling height | 5 m |
| Shelf bay width | 3.8 m |
| Dry shelf bays | 6 |
| Refrigerated cabinets | 4 |
| Additional open shelf bays | 2 |
| Camera eye height | 1.7 m |
| Coordinate unit | Unreal centimetres |

The initial layout uses empty metal shelving on the right and empty glass-fronted refrigerator cabinets on the left, followed by two open shelf bays. It includes a polished floor, neutral walls/ceiling, repeated LED lighting, and restrained Essentials Mart green/wood branding. The builder also creates fixed camera rail nodes every 1.5 m and named TargetPoint anchors at each empty shelf level for later catalogue placement.

## Explicit exclusions

No products, packaging, product labels, price strips, promotional signs, people, carts, baskets or merchandising props. Product placement will be a separate data-driven layer introduced after the environment is approved.

## Deliverables in this milestone

- Unreal project descriptor with editor Python enabled.
- Deterministic Python scene builder.
- Named actors with the `EM_AISLE_` prefix.
- A first-person camera start and PlayerStart.
- Reusable materials stored under `/Game/Materials/WalkMode`.
- A stable map path: `/Game/Maps/EM_EmptyAisle`.

## Rendering and integration boundary

Unreal Engine is the offline source environment and rendering studio. Babylon.js/WebGL remains the first browser runtime. The future export pipeline will deliver optimized geometry/materials plus camera, depth and optional object-ID passes. Product hotspots and shelf positions will be attached to stable scene coordinates, not baked into environment images.

## Acceptance checks

1. The project opens in the selected Unreal Engine 5 version.
2. The Python builder executes without errors and saves `EM_EmptyAisle`.
3. Both aisle sides have continuous, consistently spaced empty shelving.
4. Refrigerator doors, interiors and shelves are empty.
5. No SKU/product or pricing content is present.
6. A camera at eye height looks down the aisle without shelf geometry shifting between views.
7. Camera rail nodes exist at 1.5 m intervals along the centreline and remain at 1.7 m eye height.\n8. Named product anchors exist at each intended shelf level but contain no product meshes.\n9. A second builder run recreates the same level without duplicating actors.
8. Geometry dimensions and actor names remain stable for future product-slot metadata.

## Known implementation boundary

The repository toolchain can add the Unreal project and builder source, but cannot launch Unreal Editor or validate rendered output. The first execution and visual QA must happen in Unreal Editor before the scene is called complete or exported to the web application.
