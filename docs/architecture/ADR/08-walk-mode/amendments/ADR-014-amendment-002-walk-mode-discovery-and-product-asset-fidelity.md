# ADR-014 Amendment 002 — Walk Mode Discovery and Product Asset Fidelity

**Status:** Proposed  
**Date:** 2026-08-27  
**Parent ADR:** ADR-014 — Walk Mode / Living Digital Supermarket Architecture  
**Related ADRs:** ADR-007, ADR-009, ADR-010, ADR-013, ADR-015, ADR-016, ADR-017  
**Related EIPs:** EIP-025, EIP-030, EIP-034  
**Parent Architecture:** EDA-001

## 1. Purpose

This amendment refines the product thesis and visual fidelity requirements of Walk Mode without changing its enterprise ownership boundaries.

Walk Mode is not primarily a visual novelty, game, or aesthetic recreation of a supermarket. Its primary purpose is to restore the product visibility, incidental discovery and familiarity that physical supermarket browsing provides but conventional online shopping often removes.

## 2. Product Thesis

Online shopping is naturally intent-driven:

> Search for what is already known → select → purchase.

Physical supermarket shopping also creates value through incidental discovery:

> Walk through familiar spaces → encounter products → remember a need or want → decide whether to purchase.

Walk Mode therefore exists to expose products that may otherwise remain invisible to a customer who shops exclusively through search, lists or direct recommendations.

This includes ordinary non-essential household products whose absence may matter even when they were not part of the original shopping intent, such as cotton wool, methylated spirit, crackers and similar products.

Walk Mode shall therefore optimise for **discovery opportunity and product visibility**, not merely route efficiency.

## 3. Familiarity Principle

Walk Mode should create cognitive familiarity with the supermarket rather than pursuing visual complexity for its own sake.

The experience should use recognisable:

- departments;
- aisle structures;
- shelf relationships;
- product groupings;
- landmarks;
- routes;
- and store-specific spatial patterns.

The objective is for the customer to feel that they understand where they are and what they are looking at.

The experience should feel familiar and comfortable rather than game-like.

## 4. Product Visibility Is a First-Class Requirement

A Walk Mode implementation must not optimise only for finding requested products.

It must preserve opportunities for a customer to notice relevant products while moving through the digital supermarket.

This means the spatial experience may surface products through natural visual presence, shelf relationships, departments and proximity rather than requiring an explicit search query for every product.

The system must not equate product discovery with an AI recommendation.

A customer discovering a product visually and deciding independently whether it is useful is a valid and important Walk Mode outcome.

## 5. Product Representation Fidelity

Products represented inside Walk Mode must ultimately be available as high-fidelity digital assets suitable for 3D and AR experiences.

A product representation must:

- correspond to the authoritative product identity;
- be recognisable as the real-world product;
- closely resemble the real product image and physical packaging;
- preserve important visual characteristics such as shape, proportions, branding, packaging and major label elements;
- support consistent representation across Walk Mode contexts;
- and be suitable for progressive enhancement into richer 3D/AR experiences.

Generic placeholder geometry must not become the permanent representation of a real retail product.

Where a lower-fidelity fallback is temporarily required for performance or asset availability, the system must treat that representation as a known limitation rather than as the target product experience.

## 6. Product Asset Authority

Product digital assets remain part of the Product Intelligence boundary and must not become an independent Walk Mode product catalogue.

Conceptually:

```text
Authoritative Product
        ↓
Product Digital Asset
        ↓
Walk Mode Spatial Placement
        ↓
3D / AR Presentation
```

Product identity, product knowledge, product media and digital asset identity must remain distinguishable from store location, inventory and pricing.

## 7. AI Participation

The Walk Mode product thesis does not authorise AI to manufacture or aggressively push impulse purchases.

The AI Society remains governed by the authority principles established by ADR-007, ADR-009 and ADR-010.

AI may:

- assist when useful;
- answer questions about encountered products;
- explain alternatives;
- provide authorised contextual assistance;
- help with navigation;
- and execute actions only within explicitly delegated authority.

AI may remain silent when no intervention is useful.

The customer retains decision authority over consequential purchases unless the applicable authority model explicitly delegates otherwise.

## 8. Walk Mode Modes

The three Walk Mode modes remain:

### Manual

The customer controls movement and discovery directly.

### AI Assisted

The customer controls the journey while governed AI assistance is available when relevant or requested.

### Autopilot

The customer delegates greater navigation and movement authority to the system while retaining the authority boundaries defined by the Walk Mode and AI governance architecture.

Autopilot must not collapse the discovery experience into a sequence of direct product jumps. Where practical, efficient routing should coexist with relevant product visibility.

## 9. Basket Relationship

Walk Mode discovery may result in a customer deciding to add a product to the shared, server-authoritative basket capability.

Discovery itself does not constitute a purchase decision.

A product becomes part of commerce only through the governed basket and commerce boundaries.

## 10. Observability and Auditability

Walk Mode should distinguish between:

- product encountered;
- product surfaced through spatial presentation;
- product recommended by AI;
- product selected by the customer;
- product added to basket;
- and product purchased.

These are different events and must not be conflated in analytics, telemetry or audit records.

This distinction is necessary to measure whether Walk Mode is genuinely creating discovery without incorrectly attributing customer decisions to AI.

## 11. Consequences

### Positive

- Establishes a clear commercial reason for Walk Mode.
- Protects incidental product discovery as a core product behaviour.
- Makes familiarity a deliberate experience principle.
- Prevents Walk Mode from becoming a purely aesthetic virtual supermarket.
- Makes high-fidelity 3D/AR product representation an architectural requirement rather than a later cosmetic enhancement.
- Preserves customer autonomy and the governed AI operating model.

### Negative

- Requires significantly better product asset coverage.
- Requires product-to-asset identity management.
- Increases rendering, storage, bandwidth and device-performance requirements.
- Requires explicit distinction between discovery, recommendation and purchase behaviour.

## 12. Forward-Consistency Check

Direct impacts:

- ADR-014 Walk Mode architecture.
- Product digital asset requirements.
- Flutter Walk Mode implementation.
- Walk Mode verification.

Related impacts:

- AI Society authority and human-control boundaries.
- Product Intelligence digital product representation.
- Shared basket capability.
- Observability and auditability.
- Anti-replication and client security boundaries.

Affected EDA:

- No enterprise domain ownership or event boundary changes are introduced by this amendment. Existing EDA-001 already recognises Product Digital Assets and Walk Mode within the established domain model.

Affected EIPs:

- EIP-025 — Flutter Client Implementation Architecture.
- EIP-030 — Testing & Verification Architecture.
- EIP-034 — Walk Mode Spatial Discovery and Product Asset Implementation Architecture.

No secondary domain ownership change is required.

**ADR-014 remains authoritative together with this amendment unless superseded by a later ADR.**
