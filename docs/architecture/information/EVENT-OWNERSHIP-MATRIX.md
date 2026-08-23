# Event Ownership Matrix

## Status

Defined — Phase 2.7

## Purpose

This document establishes authoritative ownership of enterprise events. It prevents multiple domains from publishing competing meanings for the same business fact and provides the bridge between the enterprise information model and the Event-Driven Architecture (EDA) and Enterprise Integration Patterns (EIP).

## Core Rule

The domain that owns the state transition owns and publishes the authoritative event describing that transition.

Consumers may react to an event, but they do not redefine its meaning or publish a duplicate event on behalf of another domain.

Events describe facts that have already occurred. Commands request state changes and are not substitutes for events.

## Ownership Matrix

| Domain | Authoritative State | Event Examples | Primary Consumers |
|---|---|---|---|
| Identity | Identity and access lifecycle | `CustomerRegistered`, `IdentityVerified`, `AccessRevoked` | Customer, Household, Security, AI Society |
| Household | Household membership and configuration | `HouseholdCreated`, `MemberAdded`, `MemberRemoved` | Personalisation, Shopping, AI Society |
| Catalog | Product master lifecycle | `ProductCreated`, `ProductUpdated`, `ProductDiscontinued` | Commerce, Search, Recommendations, Inventory |
| Inventory | Stock and reservation state | `InventoryReserved`, `InventoryReleased`, `InventoryAdjusted` | Commerce, Fulfilment, Forecasting |
| Commerce / Cart | Cart state | `CartCreated`, `CartItemAdded`, `CartItemRemoved` | Checkout, Recommendations, AI Society |
| Commerce / Checkout | Checkout process state | `CheckoutInitiated`, `CheckoutExpired`, `CheckoutCompleted` | Inventory, Payment, Order |
| Commerce / Order | Order lifecycle | `OrderPlaced`, `OrderCancelled`, `OrderFulfilled` | Payment, Fulfilment, Notifications, AI Society |
| Payments | Financial transaction state | `PaymentInitiated`, `PaymentAuthorized`, `PaymentFailed`, `PaymentSettled` | Order, Refund, Risk, Notifications |
| Refunds | Refund lifecycle | `RefundRequested`, `RefundApproved`, `RefundRejected`, `RefundSettled` | Payments, Order, Notifications, Finance |
| Fulfilment | Picking/packing/dispatch state | `FulfilmentStarted`, `OrderPacked`, `OrderDispatched` | Delivery, Notifications, Store Operations |
| Delivery | Delivery lifecycle | `DeliveryAssigned`, `DeliveryStarted`, `DeliveryCompleted`, `DeliveryFailed` | Customer, Notifications, AI Society |
| Store Operations | Store operational state | `StoreOpened`, `StoreClosed`, `ShelfUpdated` | Inventory, Walk Mode, Enterprise Intelligence |
| Notifications | Delivery of communications | `NotificationQueued`, `NotificationDelivered`, `NotificationFailed` | Customer, Audit, AI Society |
| AI Society | Agent orchestration and AI decisions | `AgentInvoked`, `AgentDecisionRecorded`, `HumanApprovalRequested` | Audit, Governance, Observability |

Event names above are illustrative vocabulary anchors. Before implementation, the authoritative event catalogue must define the final event contract, version, payload, ownership, and publication rules.

## Aggregate-to-Event Ownership

| Aggregate / Process | Owns | Does Not Own |
|---|---|---|
| Cart | Cart state events | Product, inventory, payment or order state |
| Checkout Session | Checkout process events | Final payment settlement or inventory truth |
| Order | Order lifecycle events | Payment gateway state or inventory truth |
| Payment Transaction | Payment lifecycle events | Order lifecycle state |
| Refund | Refund lifecycle events | Original payment lifecycle |
| Product | Product master events | Stock quantity |
| Inventory Reservation | Reservation events | Product master data |
| Delivery | Delivery state events | Order financial state |

## Cross-Domain Event Rules

1. **Single authoritative publisher:** only the owning domain publishes the canonical business event.
2. **Consumers react:** consumers may create local projections, trigger workflows, or publish their own resulting events when they own a resulting state transition.
3. **No event laundering:** a consumer must not republish an upstream event under a new name merely to make it appear locally owned.
4. **State before event:** the authoritative state transition must succeed before its corresponding event is considered published.
5. **At-least-once tolerance:** consumers must be idempotent because delivery may be duplicated.
6. **Ordering is scoped:** ordering guarantees apply only where explicitly defined by the event contract and partitioning strategy.
7. **No distributed transaction by default:** cross-domain workflows use events, commands, retries, compensation, and reconciliation rather than a shared transaction boundary.
8. **Schema ownership:** the publisher owns the event schema and compatibility policy.
9. **Auditability:** material business events must carry sufficient metadata for correlation, causation, actor/authority and traceability.
10. **Sensitive data minimisation:** events must not contain data that consumers do not need.

## Commerce Flow

A representative checkout flow is:

```text
Cart
  │
  └── CheckoutInitiated ──► Checkout
                              │
                              ├── Inventory reservation request
                              │
                              └── Payment initiation request

Inventory
  └── InventoryReserved ──► Checkout / Order workflow

Payments
  └── PaymentAuthorized / PaymentFailed ──► Order / Checkout

Order
  └── OrderPlaced ──► Fulfilment / Notifications / Analytics

Payments
  └── PaymentSettled ──► Order / Finance

Refunds
  └── RefundSettled ──► Payments / Order / Notifications
```

The diagram expresses ownership, not necessarily a final transport topology. Commands, events, retries, orchestration and compensation will be defined in the backend architecture.

## Event Metadata Requirements

Canonical enterprise events should support, as applicable:

- `eventId` — globally unique event identity;
- `eventType` — canonical event name;
- `eventVersion` — schema version;
- `occurredAt` — event occurrence timestamp;
- `producer` — owning service/domain;
- `aggregateType` — aggregate category;
- `aggregateId` — authoritative aggregate identity;
- `correlationId` — workflow correlation;
- `causationId` — immediate causal event/command identity;
- `actorId` / actor context where appropriate;
- authority or execution context where an AI or human acted;
- payload containing only required business data.

## AI Society Boundary

AI agents are consumers and decision-makers, not alternate owners of enterprise state.

An AI agent may recommend, request, orchestrate or execute an authorised command. The underlying domain remains responsible for validating the command, enforcing invariants, changing state and publishing the authoritative event.

AI decisions must therefore remain traceable to the domain event or command that caused the relevant state transition.

## Relationship to EDA and EIP

This matrix is an information-architecture artefact. It does not replace the EDA architecture or EIP catalogue.

- EDA defines the enterprise event-driven architectural model.
- EIP defines integration patterns used to transport and coordinate messages.
- This document defines **who owns the business facts represented by those events**.
- Backend architecture will define concrete services, brokers, topics/streams, consumers and persistence mechanisms.

## Constraints for Phase 3

Backend implementation must preserve this ownership model when defining:

- service boundaries;
- event publishers;
- commands and handlers;
- message topics/streams;
- outbox/inbox processing;
- retry and dead-letter behaviour;
- idempotency;
- projections and read models;
- audit records.

Any implementation that requires two domains to jointly own one authoritative business event must be treated as an architectural exception and reviewed against the aggregate and domain boundaries before implementation.
