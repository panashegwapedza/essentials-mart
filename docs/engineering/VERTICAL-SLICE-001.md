# VERTICAL-SLICE-001 — Commerce Foundation

**Status:** In Progress
**Scope:** Identity → Customer → Product → Basket → Checkout → Order
**Primary implementation:** `services/commerce-api`

## Objective

Establish the first executable Essentials Mart vertical slice without creating duplicate sources of truth or bypassing the domain, service, data and event boundaries established by the EDA, ADR and EIP baseline.

## Current implementation

The first increment provides:

- an authenticated-principal boundary represented by `AuthenticatedPrincipal`;
- customer ownership of baskets;
- product availability validation;
- authoritative product-price validation at checkout;
- basket total calculation using minor currency units;
- order creation from a validated basket;
- immutable order input through cloned basket lines;
- domain-level failure handling;
- automated tests for the core commerce invariants.

## Deliberate non-goals

This increment does not yet implement:

- a production identity provider;
- persistent customer, product, basket or order storage;
- payment processing;
- event publication;
- external APIs;
- inventory reservation;
- fulfilment;
- notifications;
- Flutter UI.

Those capabilities will be integrated at their governed boundaries rather than embedded prematurely in the first domain increment.

## Invariants

1. A customer may only place an order from their own basket.
2. An empty basket cannot be checked out.
3. Quantities must be positive integers.
4. Unavailable products cannot be ordered.
5. Basket prices must match the current product price at checkout.
6. A basket cannot contain mixed currencies.
7. The resulting order records the validated total and line snapshot.

## Traceability

- EIP-019 — Architecture-to-Implementation Traceability
- EIP-020 — Enterprise Domain & Bounded Context Implementation Map
- EIP-021 — Backend Service & API Implementation Architecture
- EIP-022 — Enterprise Data Implementation Architecture
- EIP-027 — Engineering Repository & Workspace Architecture
- PLATFORM-FOUNDATION-001 — Platform Foundation

## Exit criteria for this increment

- core commerce invariants are represented in executable code;
- tests cover the invariants;
- CI builds and runs the commerce test suite;
- no secrets or production credentials are required;
- persistence and integration boundaries remain explicit;
- the next increment can add persistence without rewriting the domain rules.
