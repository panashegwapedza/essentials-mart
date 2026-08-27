# EIP-034 — Walk Mode Spatial Discovery and Product Asset Implementation Architecture

**Document ID:** EIP-034  
**Title:** Walk Mode Spatial Discovery and Product Asset Implementation Architecture  
**Project:** Essentials Mart  
**Status:** Proposed / Implementation Baseline  
**Date:** 2026-08-27  
**Parent Architecture:** EDA-001  
**Depends On:** EIP-019, EIP-020, EIP-021, EIP-022, EIP-025, EIP-028, EIP-030  
**Related ADRs:** ADR-007, ADR-009, ADR-010, ADR-013, ADR-014, ADR-015, ADR-016, ADR-017

## 1. Purpose

EIP-034 defines the implementation pattern for Walk Mode as a product-discovery and spatial-shopping capability.

Walk Mode is not implemented primarily as a visual supermarket simulation. Its implementation must preserve three outcomes:

1. product visibility;
2. incidental product discovery;
3. familiarity with the physical supermarket environment.

The implementation must also support progressively richer 3D and AR product representations whose appearance closely matches the real-world product.

## 2. Constitutional Principle

> **Walk Mode optimises for what the customer can discover, not only for what the customer already knows to search for.**

Search and direct shopping optimise for explicit intent.

Walk Mode adds a spatial browsing layer that allows products to become visible through natural movement through departments, aisles, shelves and product groupings.

The system must not confuse discovery with recommendation or purchase.

## 3. Experience Model

```text
Customer Intent
      |
      +--------------------+
      |                    |
      v                    v
Search / List         Walk Mode
Known Intent          Discovery Opportunity
      |                    |
      +---------+----------+
                |
                v
          Product Decision
                |
                v
        Shared Basket Capability
                |
                v
             Commerce
```

Walk Mode therefore complements search rather than replacing it.

## 4. Spatial Experience

The spatial model should represent enough of the physical store to create cognitive familiarity.

It should support:

- departments;
- aisles;
- shelf groupings;
- product positions;
- landmarks;
- navigation paths;
- store services;
- and store-specific relationships.

Visual detail should be introduced where it improves comprehension, familiarity or discovery rather than merely increasing rendering complexity.

## 5. Product Visibility

Products should be visible as part of the spatial environment even when they are not present on the user's original shopping list.

Examples include products such as:

- cotton wool;
- methylated spirit;
- crackers;
- and other ordinary household or discretionary products.

The implementation must allow a customer to encounter such products naturally.

The customer may then:

- ignore the product;
- inspect it;
- ask about it;
- compare it;
- add it to the basket;
- or continue walking.

No AI intervention is required for discovery itself.

## 6. Product Asset Identity

Every immersive product representation must resolve to an authoritative Product identity.

```text
Product ID
   |
   +---- Product Knowledge
   +---- Product Media
   +---- Digital Asset(s)
   |
   v
Walk Mode Placement
   |
   v
3D / AR Presentation
```

A spatial product instance must never become an independent product record.

## 7. 3D and AR Fidelity

3D/AR product assets are a core requirement of the intended Walk Mode experience.

The target representation should:

- be recognisably the same product;
- closely resemble the real product photography;
- preserve package proportions;
- preserve major branding and label characteristics;
- preserve important visual packaging features;
- maintain consistent orientation and scale rules;
- and support AR presentation where the device and experience permit it.

Generic shapes or unrelated placeholder products may be used only as temporary development fallbacks and must never be treated as the finished product experience.

## 8. Progressive Fidelity

The implementation should support multiple asset fidelity levels without changing product identity.

```text
Authoritative Product
        |
        +--> Reference Image
        |
        +--> Standard 3D Asset
        |
        +--> High-Fidelity 3D Asset
        |
        +--> AR-Ready Asset
```

A lower-fidelity asset may be selected because of device capability, bandwidth, latency or temporary asset availability.

The system should preserve the relationship between all fidelity levels and the same authoritative product.

## 9. Asset Availability

Asset metadata should make it possible to distinguish:

- available asset;
- unavailable asset;
- loading asset;
- fallback asset;
- stale asset;
- and unsupported device representation.

The client must not silently present a generic asset as though it were an accurate real-product representation.

## 10. Discovery and AI Separation

AI recommendations and spatial discovery are separate mechanisms.

```text
Spatial Visibility
       ↓
Customer Notices Product
       ↓
Customer Decision
```

versus:

```text
Authorised AI Reasoning
       ↓
Recommendation
       ↓
Customer Decision
```

Both may occur in the same session, but telemetry and auditability must distinguish them.

## 11. AI Authority

AI operates according to ADR-007, ADR-009 and ADR-010.

AI may assist with:

- navigation;
- product questions;
- comparisons;
- alternatives;
- authorised contextual assistance;
- and explicitly permitted actions.

AI must not treat the existence of a visible product as permission to purchase it.

AI may remain silent when no assistance is needed.

## 12. Walk Mode Modes

### Manual

The customer controls movement, browsing and discovery.

### AI Assisted

The customer controls movement and decisions while governed AI assistance is available.

### Autopilot

The customer delegates navigation and movement authority within defined limits.

Autopilot should still preserve meaningful opportunities for product visibility and discovery along an efficient route where practical.

## 13. Basket Integration

Walk Mode must use the shared basket capability rather than creating an independent basket state model.

Discovery becomes a Commerce action only when the customer or an explicitly authorised capability adds the product to the basket through the governed commerce boundary.

The client must not infer purchase completion from local presentation state.

## 14. Spatial Placement and Inventory

Product presentation and inventory are separate concerns.

A product may have a spatial location even when inventory is:

- available;
- low;
- unavailable;
- uncertain;
- or stale.

The UI must communicate inventory certainty separately from product visibility.

## 15. Performance Strategy

The implementation should use:

- asset streaming;
- level-of-detail selection;
- bounded spatial loading;
- progressive rendering;
- local caching where authorised;
- device capability detection;
- and network-aware asset selection.

Performance optimisation must not break product identity or produce misleading product representations.

## 16. Offline and Limited Connectivity

Where offline operation is supported, the client may cache:

- spatial layout;
- product placement;
- reference product media;
- and approved 3D assets.

Highly volatile inventory and operational state must remain clearly distinguished from cached information.

## 17. Observability

Walk Mode telemetry should distinguish at minimum:

- product visible;
- product encountered;
- product inspected;
- product recommended by AI;
- product selected by customer;
- product added to basket;
- and product purchased.

This enables the platform to determine whether Walk Mode is actually increasing discovery and visibility without incorrectly attributing customer behaviour to AI.

## 18. Verification

EIP-030 verification for Walk Mode should additionally verify:

- fidelity metadata is respected;
- the correct product asset resolves from the correct Product ID;
- fallback assets are clearly classified;
- spatial discovery does not mutate the basket;
- AI recommendations remain distinguishable from organic discovery;
- Manual, AI Assisted and Autopilot authority boundaries remain distinct;
- 3D/AR assets do not contain unintended privileged data or secrets;
- and product presentation remains stable across supported devices and fidelity levels.

## 19. Security and Anti-Replication

The client is untrusted.

Proprietary asset-generation pipelines, ranking logic, discovery optimisation logic, protected product intelligence and privileged AI decision logic should remain server-side or behind controlled delivery boundaries where appropriate.

The client may receive assets necessary to render the experience, but should not receive unnecessary proprietary generation logic or secrets.

## 20. Architectural Boundaries

EIP-034 does not create ownership of:

- products;
- inventory;
- pricing;
- orders;
- AI authority;
- store operations;
- or delivery.

It defines how the Flutter Walk Mode experience composes those existing capabilities.

## 21. Definition of Done

The Walk Mode implementation is not considered faithful to this EIP until:

- discovery is possible without explicit search;
- the environment provides meaningful store familiarity;
- the three Walk Mode modes remain distinct;
- basket state remains shared and server-authoritative;
- AI assistance remains governed and non-intrusive;
- real products resolve to recognisable digital representations;
- the target 3D/AR representation closely resembles the real product;
- fallback assets are explicitly classified;
- and discovery, recommendation, selection and purchase remain separately observable.
