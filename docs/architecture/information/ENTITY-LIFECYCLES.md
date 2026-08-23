# Essentials Mart — Entity Lifecycles

**Status:** Proposed
**Phase:** 2 — Information Architecture
**Phase Step:** 2.6 — Entity Lifecycles
**Date:** 2026-08-23

## 1. Purpose

This document defines the logical lifecycle model for enterprise entities before physical database schema design.

A lifecycle describes the valid states an entity may occupy, the transitions between those states, the authority allowed to perform each transition, and the events that record meaningful state changes.

The database must implement these lifecycle rules; it must not invent them.

## 2. Governing principles

- Every stateful entity has an explicit lifecycle.
- Only the authoritative owning domain may perform authoritative state transitions.
- Invalid state transitions must be rejected.
- Terminal states are immutable except where a separately defined compensating workflow exists.
- State changes must be auditable.
- Events describe facts that have occurred; they do not replace the authoritative state.
- Cross-domain workflows use commands, events, and eventual consistency rather than shared mutable state.
- AI agents may recommend or initiate permitted actions but cannot bypass domain authority or lifecycle invariants.

## 3. Lifecycle vocabulary

| Term | Meaning |
|---|---|
| State | A valid condition in an entity's lifecycle. |
| Transition | A permitted movement from one state to another. |
| Command | An instruction requesting a transition. |
| Event | An immutable fact stating that a transition or business fact occurred. |
| Terminal state | A state from which normal forward transitions are no longer permitted. |
| Compensating action | A new business action that corrects or reverses a previous fact without rewriting history. |

## 4. Commerce lifecycle models

### 4.1 Cart

```text
ACTIVE ───────────────► CHECKOUT_IN_PROGRESS
  │                         │
  │                         ├──► ACTIVE
  │                         └──► CONVERTED
  │
  └──────────────────────► ABANDONED
```

Rules:

- `ACTIVE` is the normal mutable state.
- `CHECKOUT_IN_PROGRESS` does not transfer ownership of the cart to Checkout.
- A failed or expired checkout returns the cart to a usable state unless business policy explicitly marks it otherwise.
- `CONVERTED` means the cart produced an order; the historical cart record must not be rewritten to represent the order.
- `ABANDONED` is a business lifecycle state and may be recoverable according to retention policy.

### 4.2 Checkout Session

```text
INITIATED
    │
    ▼
IN_PROGRESS
    ├──► FAILED
    ├──► EXPIRED
    ├──► CANCELLED
    └──► COMPLETED
```

Rules:

- Checkout Session is independent of Cart.
- It contains the frozen inputs required to execute the checkout process, including applicable product/price snapshots.
- It may request inventory reservation and payment processing but does not own those domains' state.
- `COMPLETED`, `FAILED`, `EXPIRED`, and `CANCELLED` are terminal for that session.

### 4.3 Order

```text
PENDING
   │
   ├──► CONFIRMED
   │       │
   │       ├──► FULFILLING
   │       │       └──► FULFILLED
   │       │
   │       └──► CANCELLED
   │
   └──► CANCELLED
```

Additional post-fulfilment business outcomes such as returns or refunds are represented by their own workflows and records rather than rewriting the historical Order into an unrelated state.

Rules:

- Order is the authoritative commercial transaction record.
- Order Items are subordinate and preserve historical snapshots.
- Order history is append-oriented; completed historical facts are not rewritten to reflect current Product data.
- Payment state is not embedded into the Order lifecycle merely because payment affects whether fulfilment may proceed.

### 4.4 Payment Transaction

```text
CREATED
   │
   ├──► REQUIRES_ACTION
   │       └──► PROCESSING
   │               ├──► SUCCEEDED
   │               ├──► FAILED
   │               └──► EXPIRED
   │
   └──► CANCELLED
```

Rules:

- Payment Transaction is independently authoritative for payment state.
- PSP webhooks and asynchronous settlement notifications may drive transitions.
- A payment transaction must be idempotently correlated with its intended business operation.
- A failed payment does not rewrite the historical attempt; a retry creates or advances a separately defined payment attempt according to the payment model.

### 4.5 Refund

```text
REQUESTED
   │
   ├──► APPROVED
   │       └──► PROCESSING
   │               ├──► COMPLETED
   │               └──► FAILED
   │
   └──► REJECTED
```

Rules:

- Refund is independently auditable.
- Multiple refunds may reference one Order or Payment Transaction subject to business constraints.
- Partial refunds are represented explicitly by amount/line allocation rather than by mutating the original payment record.
- A completed refund is not deleted or rewritten to hide the financial fact.

## 5. Product and inventory lifecycle boundaries

### Product

The Product lifecycle is owned by the Product/Catalog domain and is not controlled by Commerce.

A baseline logical lifecycle is:

```text
DRAFT ──► ACTIVE ──► DISCONTINUED
             │
             └──► SUSPENDED ──► ACTIVE
```

Commerce may observe Product availability and snapshot required product information, but it must not transition Product state.

### Inventory Item / Stock Position

Inventory owns stock lifecycle and reservation semantics. Commerce may request a hold but does not directly mutate inventory quantities.

The logical reservation flow is:

```text
REQUESTED ──► HELD ──► COMMITTED
                │
                ├──► RELEASED
                └──► EXPIRED
```

A hold has a bounded lifetime and must be safely releasable when checkout expires or payment fails.

## 6. Identity and household lifecycles

Identity and household records have separate ownership and lifecycle policies from Commerce.

Examples:

```text
User:      INVITED ─► ACTIVE ─► SUSPENDED ─► DEACTIVATED
Household: CREATED ─► ACTIVE ─► ARCHIVED
Membership: INVITED ─► ACTIVE ─► SUSPENDED ─► REMOVED
```

These are logical baseline states. The authoritative Identity/Household architecture may refine them without transferring ownership to another domain.

## 7. Delivery lifecycle

Delivery is independently owned by the Delivery/Fulfilment domain.

```text
CREATED
   │
   ▼
ASSIGNED
   │
   ▼
PICKED_UP
   │
   ▼
IN_TRANSIT
   ├──► DELIVERED
   ├──► FAILED
   └──► CANCELLED
```

Delivery may consume Order and fulfilment events but must not mutate the Order's authoritative history directly.

## 8. AI agent lifecycle authority

AI agents do not receive unrestricted ownership of operational entity lifecycles.

An AI agent may:

- observe authorised read models;
- recommend an action;
- request a permitted command;
- receive the resulting event;
- explain the resulting decision.

An AI agent may not:

- directly mutate another domain's aggregate;
- bypass authorisation;
- invent lifecycle states;
- suppress an audit event;
- rewrite historical records;
- treat a recommendation as an authoritative transition.

Human approval requirements defined by the AI governance and Human-in-the-Loop architecture remain binding.

## 9. Transition rules

Every authoritative transition must define:

1. current state;
2. requested command/action;
3. actor or authorised system principal;
4. validation/invariants;
5. resulting state;
6. event emitted, where applicable;
7. correlation and causation identifiers;
8. audit requirements;
9. idempotency behaviour;
10. failure/compensation behaviour.

## 10. Terminal-state discipline

Terminal states must not be used as a shortcut for deleting history.

Where a later business action is required, the system creates a new record or compensating workflow. For example:

- a completed payment is not edited into a failed payment;
- a completed order is not rewritten to erase fulfilment history;
- a completed refund is not deleted;
- an expired checkout remains auditable as an expired session.

## 11. Cross-domain lifecycle rule

A domain transition may trigger cross-domain work, but no domain may directly modify another domain's aggregate.

The preferred pattern is:

```text
Command
   ↓
Owning Aggregate
   ↓
State Transition
   ↓
Domain Event
   ↓
Interested Domain / Process Manager
   ↓
Own Local Transition
```

This preserves ownership while allowing Essentials Mart to operate as an event-driven enterprise platform.

## 12. Database implications

The eventual database design must support:

- explicit state fields or equivalent state representation;
- transition validation;
- optimistic concurrency/versioning where required;
- immutable event/audit records;
- timestamps for lifecycle transitions;
- idempotency for retried commands and external callbacks;
- ownership-scoped access;
- retention policies appropriate to the entity;
- historical snapshots where required by the domain.

Physical tables, indexes, partitioning, and storage technology remain Phase 3/database-design concerns and must not be prematurely fixed here.

## 13. Architectural invariants

The following are mandatory:

- One authoritative owner per entity lifecycle.
- No direct cross-domain aggregate mutation.
- No silent state transitions.
- No deletion as a substitute for lifecycle management of financially or operationally significant records.
- No AI bypass of lifecycle authority.
- No dependence on current Product data to reconstruct historical Order state.
- No assumption that asynchronous external systems respond synchronously.
- All externally retried operations must be designed for idempotency.

## 14. Dependencies

This document depends on and must remain consistent with:

- Enterprise Domain Architecture;
- ADR-003 — Event-Driven Architecture;
- ADR-005 — Data Ownership & Database Boundaries;
- ADR-007 — AI Society Architecture;
- ADR-009 — AI Agent Governance & Permissions;
- ADR-010 — Human-in-the-Loop Architecture;
- ADR-016 — Observability, Auditability & Trust Architecture;
- Phase 2 aggregate and relationship documents;
- Phase 2 identifier strategy.

## 15. Next Phase 2 deliverable

The next logical deliverable is the **Event Ownership Matrix**, which will map each authoritative lifecycle transition to its owning domain, event, producer, consumers, and consistency expectations.
