# EIP-025 Amendment 001 — Walk Mode Discovery and 3D/AR Product Representation

**Status:** Proposed  
**Date:** 2026-08-27  
**Parent EIP:** EIP-025 — Flutter Client Implementation Architecture  
**Related EIP:** EIP-034 — Walk Mode Spatial Discovery and Product Asset Implementation Architecture  
**Related ADR:** ADR-014 Amendment 002 — Walk Mode Discovery and Product Asset Fidelity  
**Parent Architecture:** EDA-001

## 1. Purpose

This amendment refines the Flutter implementation requirements for Walk Mode so that the client implementation reflects the agreed product thesis rather than treating Walk Mode as a primarily visual supermarket recreation.

## 2. Discovery-First Client Behaviour

The Walk Mode client must support product visibility and incidental discovery as first-class behaviours.

The client should allow users to encounter products through:

- spatial shelf presentation;
- department and aisle context;
- product adjacency;
- route traversal;
- and relevant nearby inventory.

The client must not reduce Walk Mode to a sequence of search results or direct product-to-product jumps.

## 3. Familiarity

The client should represent store structure consistently enough to create cognitive familiarity.

Relevant presentation includes:

- recognisable departments;
- aisle structure;
- shelf relationships;
- landmarks;
- product groupings;
- and stable spatial conventions.

Visual complexity is subordinate to useful familiarity.

## 4. 3D and AR Product Assets

Walk Mode product presentation must be designed for high-fidelity 3D and AR representation.

The intended product asset should closely resemble the real-world product, including where applicable:

- shape;
- proportions;
- packaging;
- branding;
- major label characteristics;
- colour/material characteristics;
- and recognisable visual identity.

The Flutter client must treat accurate 3D/AR representation as a product requirement, not an optional decorative enhancement.

## 5. Asset and Commerce Separation

The client must keep product asset identity separate from authoritative commerce state.

```text
Product Identity
      ↓
Digital Asset Identity
      ↓
Spatial Placement
      ↓
3D / AR Presentation

Product Identity
      ↓
Inventory / Pricing / Basket
      ↓
Authoritative Commerce Services
```

A rendered asset must never be treated as evidence of stock, price or purchase state.

## 6. AI Behaviour

The Walk Mode client must preserve the AI operating principles established by the AI architecture.

AI is permitted to:

- assist;
- explain;
- answer questions;
- recommend where authorised;
- help with navigation;
- and request or execute governed actions within delegated authority.

AI must not be implemented as a continuous sales prompt engine.

The client must allow AI to remain silent when no useful intervention is required.

## 7. Basket Integration

Product discovery may lead to basket mutation only through the shared basket capability and governed commerce boundary.

The client must distinguish:

- product visibility;
- product encounter;
- customer selection;
- basket addition;
- and purchase.

## 8. Performance and Fidelity

Progressive loading, level-of-detail and fallback representations may be used to preserve responsiveness.

However, performance fallbacks must not redefine the intended product experience.

Where a lower-fidelity representation is displayed, it should remain associated with the correct product identity and be capable of later replacement by the intended high-fidelity asset.

## 9. Verification

Walk Mode client verification must include the requirements established by EIP-034 and EIP-030, including:

- discovery opportunity preservation;
- accurate product-to-asset mapping;
- 3D/AR fidelity requirements;
- progressive asset loading;
- distinction between spatial exposure and AI recommendation;
- shared basket integration;
- mode-specific authority;
- and privacy-conscious discovery telemetry.

**EIP-025 remains authoritative together with this amendment unless superseded by a later architecture decision.**
