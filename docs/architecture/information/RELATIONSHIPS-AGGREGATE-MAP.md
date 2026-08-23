# Phase 2.4 — Relationships & Aggregate Map

**Status:** Proposed
**Phase:** Information Architecture
**Scope:** Enterprise aggregate relationships, cardinality, reference direction, and cross-domain interaction boundaries

## 1. Purpose

This document defines how authoritative enterprise entities relate to one another without collapsing independent aggregate boundaries.

The map is intentionally storage-agnostic. It describes ownership and consistency boundaries, not SQL tables or foreign-key implementation.

## 2. Aggregate Map

```text
                           ┌─────────────────────┐
                           │   CUSTOMER / HOUSEHOLD│
                           └──────────┬──────────┘
                                      │ identity/reference
                                      ▼
┌──────────────┐       initiates      ┌────────────────────┐
│    PRODUCT   │◄───── references ────│        CART        │
│   CATALOG    │                      │      Aggregate     │
└──────┬───────┘                      └─────────┬──────────┘
       │                                        │ creates
       │ snapshot/reference                     ▼
       │                              ┌────────────────────┐
       └─────────────────────────────►│  CHECKOUT SESSION  │
                                      │      Aggregate     │
                                      └──────┬─────┬───────┘
                                             │     │
                                  hold/query  │     │ payment request
                                             ▼     ▼
                                      ┌─────────┐ ┌──────────────┐
                                      │INVENTORY│ │   PAYMENT    │
                                      │Aggregate│ │   Aggregate  │
                                      └────┬────┘ └──────┬───────┘
                                           │             │
                                           │ outcomes    │ outcomes
                                           └──────┬──────┘
                                                  ▼
                                      ┌────────────────────┐
                                      │       ORDER        │
                                      │      Aggregate     │
                                      └─────────┬──────────┘
                                                │ reference
                                                ▼
                                      ┌────────────────────┐
                                      │       REFUND       │
                                      │      Aggregate     │
                                      └────────────────────┘
```

The diagram represents logical interaction and reference direction. It does not imply that all relationships are synchronous or transactional.

## 3. Commerce Aggregate Relationships

### Cart

**Root:** Cart

**Owns:** CartItem

Relationships:

- Cart belongs to a customer/household context by owner ID.
- CartItem references Product by ProductId.
- Cart does not own Product.
- Cart may initiate creation of a Checkout Session.

Cardinality:

- One Cart → many CartItems.
- One CartItem → one ProductId reference.
- One active shopping context → one applicable Cart, subject to future household/multi-cart rules.

### Checkout Session

**Root:** CheckoutSession

**Owns:** CheckoutItemSnapshot and checkout-specific state.

Relationships:

- CheckoutSession originates from a Cart but is independently identified.
- CheckoutSession references the Cart by CartId for provenance.
- CheckoutSession references Product by ProductId.
- CheckoutSession contains frozen commercial/product snapshots required for deterministic checkout.
- CheckoutSession requests Inventory holds and Payment operations but does not own either state.

A failed or abandoned Checkout Session must not destroy the source Cart.

### Order

**Root:** Order

**Owns:** OrderItem

Relationships:

- Order may record the CheckoutSessionId that produced it.
- OrderItem references ProductId and stores immutable historical snapshots.
- Order may reference PaymentTransactionId(s) without owning Payment state.
- Order may reference Inventory reservation identifiers without owning Inventory state.
- Order does not mutate Product, Inventory, Payment, or Refund aggregates directly.

Cardinality:

- One Order → one or more OrderItems.
- One OrderItem → one ProductId reference.
- One Order → potentially multiple PaymentTransaction references.
- One Order → potentially multiple Refund references.

### Payment Transaction

**Root:** PaymentTransaction

Relationships:

- PaymentTransaction references OrderId.
- PaymentTransaction interacts with an external payment provider through the Payments boundary.
- Multiple payment attempts/transactions may relate to one Order where the payment model permits retries, split payments, or deferred settlement.
- Payment does not own Order state.

### Refund

**Root:** Refund

Relationships:

- Refund references OrderId.
- Refund references PaymentTransactionId.
- Multiple Refunds may reference one Order or PaymentTransaction where partial refunds are supported.
- Refund state is independent because approval, processing, settlement, and failure have their own lifecycle.

## 4. Inventory Relationships

Inventory is authoritative for stock state.

Commerce may request:

```text
CheckoutSession
      │
      └──► Inventory Hold Request
                    │
                    ▼
             Inventory Hold
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      committed             released
```

The Inventory Hold is not embedded inside the Checkout aggregate as authoritative inventory state.

Commerce stores only the identifiers/status information required to coordinate checkout.

## 5. Product Relationships

Product is referenced by ID across operational aggregates.

```text
Product
  │
  ├── ProductId ─────────► CartItem
  │
  ├── ProductId ─────────► CheckoutItemSnapshot
  │
  └── ProductId ─────────► OrderItem
                              │
                              └── historical snapshot
```

The reference does not permit the consuming aggregate to mutate Product.

OrderItem's snapshot preserves historical commercial meaning even when Product later changes.

## 6. Relationship Types

### Strong ownership

Used when a child has no independent lifecycle outside its aggregate.

Examples:

- Cart → CartItem
- Order → OrderItem
- CheckoutSession → CheckoutItemSnapshot

### Reference by identity

Used when two aggregates need to relate without sharing a consistency boundary.

Examples:

- Order → PaymentTransactionId
- Refund → OrderId
- CartItem → ProductId
- OrderItem → ProductId

### Snapshot relationship

Used when historical state must remain stable despite future changes to the referenced entity.

Example:

- OrderItem → Product snapshot

### Process relationship

Used when one aggregate/process coordinates another without owning its state.

Examples:

- CheckoutSession → Inventory Hold
- CheckoutSession → Payment Transaction

## 7. Aggregate Boundary Rules

1. No aggregate may directly modify another aggregate's internal entities.
2. A reference between aggregates is not an ownership relationship.
3. Aggregate boundaries must not be inferred from database foreign keys.
4. Cross-aggregate consistency is normally achieved through explicit commands and events rather than distributed transactions.
5. A historical snapshot is deliberately independent of the current state of its source entity.
6. A process manager may coordinate multiple aggregates but does not absorb their ownership.

## 8. Consistency Map

| Relationship | Consistency expectation |
|---|---|
| Cart → CartItem | Strong / same aggregate |
| Order → OrderItem | Strong / same aggregate |
| CheckoutSession → Checkout snapshot | Strong / same aggregate |
| Cart → CheckoutSession | Eventual/process boundary |
| Checkout → Inventory | Eventual / command + outcome |
| Checkout → Payment | Eventual / command + provider outcome |
| Payment → Order | Eventual / payment event or authorised command |
| Order → Refund | Eventual / independent refund lifecycle |
| Commerce → Product | Query/read + immutable snapshot |
| Commerce → Inventory | Command/event boundary |

## 9. Relationship Anti-Patterns

The following are prohibited architectural shortcuts:

- Embedding PaymentTransaction inside Order merely because payment relates to an order.
- Embedding Refund inside PaymentTransaction when refunds have an independent lifecycle.
- Treating Product as a child of Cart or Order.
- Allowing Checkout to mutate Cart internals after checkout creation.
- Using shared mutable domain objects across aggregate boundaries.
- Making AI read models authoritative operational stores.
- Creating bidirectional write dependencies between domains.

## 10. Enterprise Extension Rule

This aggregate map establishes the pattern for other enterprise domains.

Future domains must identify:

- root aggregates;
- owned subordinate entities;
- identity references;
- snapshots;
- process relationships;
- consistency expectations;
- event/command boundaries.

They must not introduce cross-domain ownership that contradicts Phase 2.3.

## 11. Relationship to Remaining Phase 2 Work

This map constrains:

- **2.5 IDs & Identity Strategy** — each identity reference must be explicit.
- **2.6 Events & Domain Lifecycles** — process relationships must map to commands/events and state transitions.
- **2.7 Information Architecture Freeze** — all relationships must preserve single ownership and aggregate boundaries.

## 12. Status

This is the authoritative working relationship map for Phase 2. It remains subject to the final Phase 2 consistency review before the information architecture is frozen.
