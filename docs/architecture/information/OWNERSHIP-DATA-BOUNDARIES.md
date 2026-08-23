# Phase 2.3 — Ownership & Data Boundaries

**Status:** Proposed
**Phase:** Information Architecture
**Scope:** Enterprise-wide authoritative data ownership and cross-domain write boundaries

## 1. Purpose

This document defines which domain owns each authoritative piece of enterprise data and establishes the write boundary between domains.

The objective is to prevent duplicated sources of truth, uncontrolled cross-domain writes, and aggregate boundaries being bypassed by application services, AI agents, APIs, or database access.

## 2. Core Principles

1. Every authoritative entity has exactly one owning domain.
2. Ownership means authority to create, mutate, validate, and retire the authoritative state.
3. Other domains may reference an entity by ID, consume an approved read model, or react to domain events; they do not mutate the owner's authoritative state.
4. Cross-domain commands are explicit and cross the boundary through an API/command contract or an approved domain-event workflow.
5. Database-level foreign keys do not constitute permission to write another domain's data.
6. AI agents do not receive implicit ownership merely because they can reason over a domain's data.
7. Historical snapshots are owned by the aggregate that captured them; they do not become a second source of truth for the original entity.
8. Derived/read-model data may be duplicated for performance, but its derivation and refresh mechanism must remain explicit.

## 3. Commerce Ownership Baseline

| Authoritative concept | Owner | Non-owner domains may |
|---|---|---|
| Cart | Commerce | Read through approved interfaces; request cart operations |
| Cart Item | Commerce / Cart | Never mutate directly |
| Checkout Session | Commerce | Initiate/query through checkout contract |
| Checkout Item Snapshot | Commerce / Checkout | Never mutate as Product data |
| Order | Commerce | Query, subscribe to events, request permitted order operations |
| Order Item | Commerce / Order | Never mutate directly |
| Payment Transaction | Payments | Commerce may request payment actions and consume payment outcomes |
| Refund | Payments / Refunds capability | Commerce may request refund workflows and consume outcomes |
| Product identity/catalog state | Catalog/Product domain | Commerce references by ProductId and captures approved snapshots |
| Inventory state | Inventory | Commerce requests holds/releases and consumes inventory outcomes |

## 4. Domain Ownership Rules

### Commerce

Commerce owns customer shopping and commercial transaction state: Cart, Checkout Session, Order, and their subordinate records.

Commerce does not own Product catalog state, inventory quantities, payment settlement state, or refund settlement state.

### Catalog / Product

Catalog owns authoritative product identity and catalog metadata. Commerce may read product information and capture historical snapshots when required for an order or checkout process.

Commerce must never update a Product merely because a cart or order changes.

### Inventory

Inventory owns authoritative stock availability, reservations/holds, and stock movements. Commerce may request an inventory hold and react to its result, but must not directly decrement or restore inventory quantities.

### Payments

Payments owns payment transaction state and interaction with external payment service providers. Commerce owns the commercial order, not the financial settlement ledger.

### Refunds

Refund state is independently owned within the payment/refund capability. A Refund references the relevant PaymentTransactionId and OrderId rather than becoming an uncontrolled child mutation of either aggregate.

## 5. Cross-Domain Interaction

Cross-domain interaction follows this hierarchy:

1. **Command/API** when one domain explicitly requests an operation owned by another domain.
2. **Domain event** when a completed state transition must be observed by other domains.
3. **Read model/query** when another domain needs information without assuming ownership.
4. **ID reference** when only identity is required.

Direct writes into another domain's tables are prohibited as an architectural pattern.

## 6. Commerce Example

A checkout may involve:

```text
Commerce
  │
  ├── requests ──► Inventory: create/renew hold
  │
  ├── requests ──► Payments: authorize/capture payment
  │
  └── creates ───► Order when its defined creation conditions are satisfied

Inventory
  └── publishes ─► reservation outcome

Payments
  └── publishes ─► payment outcome

Commerce
  └── reacts ────► update permitted Order / Checkout state
```

No participant directly edits another participant's authoritative records.

## 7. Historical Snapshots

When Commerce creates an Order, it captures the product and commercial values required to preserve the historical transaction, such as:

- ProductId
- Product name/title at purchase
- Unit price
- Currency
- Tax information where applicable
- Quantity

These values are part of the Order's historical record. Later Product changes must not rewrite the Order.

The snapshot therefore has **historical ownership**, not Product-domain ownership.

## 8. Derived Data and Read Models

Read-optimized projections are permitted where required for scale, AI reasoning, search, analytics, or operational dashboards.

A projection is not authoritative merely because it contains copied data.

Every projection must have:

- a declared source of truth;
- an owning projection/read-model boundary;
- a defined update mechanism;
- an understood consistency model;
- a recovery/rebuild strategy.

## 9. AI and Intelligence Engine Boundary

AI agents and Intelligence Engines are consumers and decision participants, not automatic owners of operational entities.

An AI component may:

- query approved information;
- produce recommendations;
- request an operation through an authorised command;
- react to events;
- create an explicitly owned AI artifact where the architecture defines one.

An AI component may not bypass domain ownership by writing directly to another domain's authoritative storage.

## 10. Database Implication

The eventual database architecture must reflect these boundaries.

Separate ownership does not necessarily require a separate physical database for every domain, but it does require logical ownership that can be enforced in the application and persistence architecture.

Physical storage may be consolidated where justified, provided domain boundaries, write permissions, migrations, and access paths preserve authoritative ownership.

## 11. Boundary Invariants

The following invariants apply across the enterprise:

- One authoritative owner per entity.
- No direct cross-domain mutation.
- No aggregate may mutate another aggregate's internal state.
- Events communicate completed state transitions; they do not become a hidden write channel.
- Read models never become accidental sources of truth.
- Historical snapshots remain immutable within their owning aggregate.
- AI permissions follow the same ownership boundaries as human/application actors.

## 12. Relationship to Phase 2

This document constrains the remaining Information Architecture work:

- **2.4 Relationships & Aggregate Map** must preserve these ownership boundaries.
- **2.5 IDs & Identity Strategy** must distinguish references from ownership.
- **2.6 Events & Domain Lifecycles** must define the cross-domain events and commands implied by these boundaries.
- **2.7 Information Architecture Freeze** must verify that no entity has multiple authoritative owners.

## 13. Status

This document establishes the ownership baseline for Phase 2. It is subject to the Phase 2 forward-consistency review before the Information Architecture is frozen.
