# EIP-034 — Walk Mode Spatial Discovery and Product Asset Implementation Architecture

**Document ID:** EIP-034  
**Title:** Walk Mode Spatial Discovery and Product Asset Implementation Architecture  
**Project:** Essentials Mart  
**Version:** 0.1.0  
**Status:** Proposed  
**Parent Architecture:** EDA-001  
**Depends On:** EIP-019, EIP-020, EIP-021, EIP-022, EIP-023, EIP-025, EIP-028, EIP-029, EIP-030  
**Related ADRs:** ADR-007, ADR-009, ADR-010, ADR-013, ADR-014, ADR-015, ADR-016, ADR-017  

---

## 1. Purpose

EIP-034 translates ADR-014 Amendment 002 into implementation guidance for Walk Mode's spatial discovery experience and high-fidelity product representation.

Walk Mode is implemented as a digital browsing and discovery experience. Its primary product value is restoring product visibility, incidental discovery and familiarity that physical supermarket browsing provides but conventional online shopping can remove.

This EIP defines the implementation boundary for:

- spatial browsing;
- product visibility;
- incidental discovery;
- store familiarity;
- product-to-asset identity;
- high-fidelity 3D and AR representation;
- progressive rendering;
- discovery measurement;
- and integration with the shared basket capability.

---

## 2. Governing Principles

1. Walk Mode is a discovery experience, not a game.
2. Product visibility is a first-class requirement, not an incidental rendering effect.
3. Search optimises for known intent; Walk Mode must preserve opportunities to discover unknown or forgotten intent.
4. Familiarity should come from recognisable spatial structure, product grouping and store relationships.
5. Product assets must correspond to authoritative product identity.
6. 3D/AR representations must ultimately resemble the real product closely enough to be recognisable and trustworthy.
7. Placeholder geometry may be a temporary fallback but is not the target product experience.
8. Discovery must not be conflated with AI recommendation.
9. AI assistance remains governed by ADR-007, ADR-009 and ADR-010.
10. Basket mutation remains governed by the shared server-authoritative commerce capability.
11. Client rendering must never become authoritative for product, inventory, pricing or purchase state.
12. Discovery telemetry must distinguish exposure, recommendation, selection, basket mutation and purchase.

---

## 3. Spatial Experience Model

The implementation should represent the store as a navigable spatial model rather than a sequence of product screens.

```text
Store
  ↓
Departments
  ↓
Aisles / Sections
  ↓
Shelves / Product Zones
  ↓
Products
  ↓
Product Assets
  ↓
3D / AR Presentation
```

The spatial model must remain linked to authoritative store and product information while allowing the client to optimise rendering for the device.

---

## 4. Discovery-First Navigation

Route planning must not optimise solely for the shortest path between requested products.

Where practical, route presentation should preserve relevant product visibility along the journey.

The implementation may therefore consider:

- nearby products;
- adjacent shelf groups;
- department relationships;
- known household-relevant categories where authorised;
- product availability;
- and store familiarity.

Discovery opportunities must remain subordinate to explicit user goals and must not create unsafe or confusing navigation.

---

## 5. Product Visibility

The spatial experience should allow products to be encountered naturally.

A product may become visible because it is:

- physically adjacent in the digital shelf model;
- part of the current aisle;
- within the current department;
- on the route to another requested product;
- or otherwise present in the user's current spatial context.

The system must not require an AI recommendation for every discovered product.

The customer may inspect, ignore, save or add an encountered product according to the normal commerce flow.

---

## 6. Product Asset Identity

Every rendered product must maintain an explicit relationship between:

```text
Authoritative Product ID
        ↓
Digital Asset ID
        ↓
Asset Version
        ↓
Rendering Representation
        ↓
Spatial Placement
```

The asset identity must not replace the authoritative product identity.

Product location, availability, price and asset representation must remain independently updateable.

---

## 7. 3D Product Representation

Walk Mode product assets shall support a progressively richer representation strategy.

The target representation is a product model that:

- matches the authoritative product;
- preserves recognisable proportions;
- resembles real packaging;
- preserves major branding and label characteristics;
- supports appropriate textures/materials;
- maintains consistent orientation and scale;
- and remains recognisable when viewed in the Walk Mode environment.

A generic cube, abstract icon or unrelated stock object must not be treated as the finished representation of a real retail product.

---

## 8. AR Representation

Where device capabilities permit, product assets should be reusable in AR presentation.

AR representation must preserve:

- product identity;
- scale semantics;
- recognisable appearance;
- orientation;
- and safe user interaction.

The implementation should avoid coupling the product model permanently to one AR framework so that future client platforms remain possible.

---

## 9. Asset Fidelity and Fallbacks

Asset fidelity shall be classified rather than hidden.

Example:

```text
High Fidelity 3D / AR
        ↓
Reduced Fidelity 3D
        ↓
Image / Billboard Fallback
        ↓
Unavailable Asset State
```

Fallbacks may be used because of:

- device capability;
- bandwidth;
- asset availability;
- loading time;
- or rendering constraints.

The system must not silently represent a low-fidelity fallback as equivalent to the intended product representation where that distinction materially affects the experience.

---

## 10. Progressive Rendering

Walk Mode should use progressive loading and level-of-detail strategies.

The implementation should avoid loading the complete store and every high-resolution product asset simultaneously.

Potential strategy:

```text
Current View
    ↓
Nearby Spatial Data
    ↓
Visible Product Assets
    ↓
Higher Fidelity on Demand
    ↓
AR Asset When Requested / Supported
```

Performance optimisation must preserve product recognisability and must not alter authoritative commerce state.

---

## 11. Familiarity Model

The implementation should prioritise consistent spatial relationships.

Relevant structures include:

- departments;
- aisle naming;
- shelf grouping;
- product adjacency;
- store landmarks;
- familiar routes;
- and stable spatial conventions.

The objective is cognitive familiarity: the customer should understand the digital environment as a supermarket they know rather than as a game world.

---

## 12. Walk Mode Modes

The implementation preserves the three established modes.

### Manual

The user controls movement and discovery directly.

### AI Assisted

The user controls the journey while governed AI can provide relevant assistance.

### Autopilot

The user delegates navigation and movement within defined authority boundaries.

Autopilot must preserve discovery opportunities where practical rather than reducing the journey to direct product teleportation.

---

## 13. AI Boundary

AI participation must remain a governed capability.

```text
Walk Mode Context
       ↓
Authorised AI Capability
       ↓
AI Society
       ↓
Recommendation / Explanation / Action Request
       ↓
Authority Check
       ↓
Governed Capability
```

AI should not continuously interrupt the user to manufacture purchases.

Silence is an acceptable AI outcome when no useful intervention is required.

An AI recommendation must remain distinguishable from a product merely being visible in the spatial environment.

---

## 14. Basket Integration

A discovered product may be added through the shared basket capability.

The implementation flow is:

```text
Product Encountered
        ↓
User Inspects / Decides
        ↓
Basket Capability
        ↓
Server-Authoritative Basket
```

Walk Mode must not maintain a second authoritative basket.

Discovery does not equal selection, and selection does not equal purchase.

---

## 15. Event and State Integration

Walk Mode may consume relevant events and state updates including:

- ProductLocationChanged;
- InventoryUpdated;
- StoreLayoutPublished;
- StoreAreaClosed;
- ProductRemovedFromStore;
- ProductAddedToStore;
- and ProductAssetUpdated.

Events communicate facts. Queries retrieve current state. Commands request actions.

Walk Mode must not infer authoritative state from stale client events when a current server query is required.

---

## 16. Discovery and Audit Events

The implementation should distinguish the following states:

```text
Product Exposed
      ↓
Product Encountered
      ↓
Product Recommended (optional)
      ↓
Product Selected
      ↓
Product Added to Basket
      ↓
Product Purchased
```

These states must not be collapsed into a single "AI recommendation" metric.

Where telemetry is implemented, identifiers should support correlation without unnecessarily capturing sensitive movement history.

---

## 17. Privacy

Spatial discovery does not create unrestricted movement tracking authority.

The implementation must follow ADR-014 privacy requirements and use the minimum location context necessary for the requested experience.

Anonymous or aggregated spatial information may be used where appropriate, but identifiable movement data must not be exposed merely to improve discovery analytics.

---

## 18. Security and Anti-Replication

The client is an untrusted environment.

High-value product intelligence, ranking logic, proprietary discovery algorithms and authoritative commerce decisions should remain server-side where feasible.

The client should receive only the information necessary to render the current experience and execute authorised capabilities.

3D/AR assets are presentation resources and should not expose protected business logic or privileged authority.

---

## 19. Offline and Limited Connectivity

Where appropriate, the client may cache:

- store spatial structure;
- product locations;
- product metadata;
- and previously retrieved product assets.

Volatile inventory and operational state must remain clearly distinguished from cached state.

A cached product asset may remain usable offline, but its presence must not imply current stock or price.

---

## 20. Verification Requirements

EIP-030 verification for Walk Mode must include, where applicable:

- discovery opportunities are preserved during navigation;
- product exposure is distinguishable from AI recommendation;
- product assets map to the correct product identity;
- high-fidelity representations resemble the intended real-world product;
- 3D assets load and degrade progressively;
- AR assets preserve identity and scale semantics where supported;
- Manual, AI Assisted and Autopilot behaviours remain distinct;
- Autopilot retains defined authority boundaries;
- discovered products use the shared basket capability;
- stale inventory is not presented as authoritative;
- privacy controls remain enforced;
- and discovery, selection, basket and purchase events remain distinguishable.

---

## 21. Architectural Outcome

EIP-034 establishes Walk Mode's implementation layer beneath ADR-014 and alongside EIP-025.

The resulting chain is:

```text
ADR-014
Walk Mode Architecture
        ↓
ADR-014 Amendment 002
Discovery + Product Asset Fidelity
        ↓
EIP-034
Spatial Discovery + Product Asset Implementation
        ↓
Flutter Walk Mode
        ↓
Verification through EIP-030
        ↓
Runtime Evidence through EIP-028
```

This implementation preserves the core thesis: **Walk Mode exists to make more products visible, restore incidental discovery and create a familiar digital shopping environment, while accurate 3D/AR product representation makes those products recognisable rather than abstract placeholders.**
