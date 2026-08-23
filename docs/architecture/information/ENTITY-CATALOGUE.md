# Enterprise Entity Catalogue

## Status

Defined — Phase 2.8

## Purpose

This catalogue establishes the authoritative enterprise entities for Essentials Mart. It provides the common vocabulary used by the domain model, aggregate boundaries, database design, APIs, events, AI Society and future read models.

The catalogue defines ownership and identity at the enterprise level. It does not prescribe physical database tables; persistence design follows from the aggregate and domain boundaries already established.

## Catalogue Rules

1. Every authoritative entity has one owning domain.
2. Every entity has one authoritative identity.
3. An entity must not be duplicated as an independent source of truth in another domain.
4. Cross-domain relationships use stable IDs rather than shared mutable objects.
5. Entities inside an aggregate are owned by the aggregate root unless explicitly identified as independent roots.
6. Historical and transactional snapshots are immutable representations of state at a point in time, not alternate Product or Customer records.
7. Read models may denormalise entities for query performance but never become competing sources of truth.
8. AI agents may derive profiles, recommendations and intelligence views, but derived intelligence does not silently become authoritative enterprise state.

## Enterprise Entity Catalogue

| Domain | Entity | Boundary | Ownership | Identity | Notes |
|---|---|---|---|---|---|
| Identity | Customer | Root | Identity | `CustomerId` | Human/customer identity used across enterprise domains. |
| Identity | Identity Credential | Child | Customer/Identity | `CredentialId` | Authentication material; never exposed as ordinary domain data. |
| Identity | Session | Root | Identity | `SessionId` | Authentication/session lifecycle. |
| Household | Household | Root | Household | `HouseholdId` | Shared household context for people, preferences and plans. |
| Household | Household Membership | Child | Household | `MembershipId` | Links a customer to a household with role/authority. |
| Catalog | Product | Root | Catalog | `ProductId` | Canonical product identity and catalogue metadata. |
| Catalog | Product Variant | Root/child by modelling decision | Catalog | `ProductVariantId` | Distinct sellable variant where SKU-level differentiation requires it. |
| Catalog | Category | Root | Catalog | `CategoryId` | Product classification hierarchy. |
| Catalog | Brand | Root | Catalog | `BrandId` | Product brand identity. |
| Store | Store | Root | Store Operations | `StoreId` | Physical/virtual store identity. |
| Store | Aisle | Child | Store | `AisleId` | Physical store navigation structure. |
| Store | Shelf | Child | Store | `ShelfId` | Physical shelf/location structure. |
| Inventory | Inventory Item | Root | Inventory | `InventoryItemId` | Stock state for a product/variant at a location. |
| Inventory | Inventory Reservation | Root/process entity | Inventory | `ReservationId` | Temporary stock hold with expiry and lifecycle. |
| Commerce | Cart | Root | Commerce | `CartId` | Mutable shopping state owned by a customer/household. |
| Commerce | Cart Item | Child | Cart | `CartItemId` or deterministic line identity | Exists only within Cart. |
| Commerce | Checkout Session | Root/process entity | Commerce | `CheckoutSessionId` | Short-lived process state derived from a cart. |
| Commerce | Checkout Line Snapshot | Child | Checkout Session | `CheckoutLineId` | Frozen checkout representation of the selected item/price context. |
| Commerce | Order | Root | Commerce | `OrderId` | Authoritative transactional purchase record. |
| Commerce | Order Item | Child | Order | `OrderItemId` | Immutable historical product/price/tax snapshot. |
| Payments | Payment Transaction | Root | Payments | `PaymentTransactionId` | Financial transaction state and PSP interaction. |
| Payments | Payment Attempt | Child/root by PSP model | Payments | `PaymentAttemptId` | Individual authorisation/processing attempt. |
| Refunds | Refund | Root | Refunds | `RefundId` | Independent refund lifecycle supporting partial/multiple refunds. |
| Fulfilment | Fulfilment | Root | Fulfilment | `FulfilmentId` | Operational fulfilment of an order or order portion. |
| Fulfilment | Fulfilment Item | Child | Fulfilment | `FulfilmentItemId` | Fulfilment-specific representation of order items. |
| Delivery | Delivery | Root | Delivery | `DeliveryId` | Delivery lifecycle and coordination state. |
| Delivery | Delivery Stop | Child | Delivery | `DeliveryStopId` | Stop within a delivery route where required. |
| Notifications | Notification | Root | Notifications | `NotificationId` | Communication intent and delivery lifecycle. |
| Notifications | Notification Delivery | Child | Notification | `NotificationDeliveryId` | Channel-specific delivery attempt/status. |
| AI Society | AI Agent | Root | AI Society | `AgentId` | Registered autonomous capability with defined authority. |
| AI Society | Agent Capability | Child | AI Society/Governance | `CapabilityId` | Explicit capability/permission boundary. |
| AI Society | AI Decision Record | Root/audit record | AI Society | `DecisionId` | Traceable record of an AI decision/recommendation/action. |
| Risk | Risk Assessment | Root | Risk | `RiskAssessmentId` | Risk evaluation associated with a relevant business subject. |
| Store Operations | Store Operation | Root/process entity | Store Operations | `StoreOperationId` | Operational activity or workflow in a store. |
| Analytics | Metric Definition | Root | Enterprise Intelligence | `MetricDefinitionId` | Defines enterprise measurement semantics; derived metrics are not transactional truth. |

## Entity Ownership Clarifications

### Product vs Inventory

`Product` owns what a product is. `Inventory Item` owns how much stock exists at a specific inventory location/context.

Inventory may reference `ProductId` or `ProductVariantId`, but it must not become the owner of catalogue metadata.

### Cart vs Checkout vs Order

`Cart` owns mutable shopping intent.

`Checkout Session` owns the temporary process of validating and preparing that intent for purchase.

`Order` owns the durable commercial transaction created from a successful checkout flow.

A failed or abandoned checkout must not destroy the customer's cart unless an explicit product decision later establishes that behaviour.

### Order vs Payment vs Refund

`Order` owns the commercial purchase lifecycle.

`Payment Transaction` owns financial processing and settlement state.

`Refund` owns the lifecycle of returning value and may reference both `OrderId` and `PaymentTransactionId`.

No domain may infer that payment state is equivalent to order state; the relationship is established through explicit events and workflow rules.

### Customer vs Household

A `Customer` is an individual identity. A `Household` is a shared context containing one or more memberships.

Household membership does not replace customer identity and must carry its own authority/role semantics.

### AI Agent vs AI Decision Record

An `AI Agent` represents an authorised capability. An `AI Decision Record` records a particular decision or recommendation and its traceability context.

The existence of an AI Decision Record does not itself grant authority to modify enterprise state.

## Reference Rules

Cross-domain references should use IDs such as:

```text
Order.customerId -> CustomerId
OrderItem.productId -> ProductId
InventoryItem.productId -> ProductId
InventoryItem.storeId -> StoreId
PaymentTransaction.orderId -> OrderId
Refund.paymentTransactionId -> PaymentTransactionId
Refund.orderId -> OrderId
Delivery.orderId -> OrderId
Fulfilment.orderId -> OrderId
Notification.customerId -> CustomerId
AI Decision Record.actorAgentId -> AgentId
```

These are logical references. They do not imply foreign-key coupling across independent service databases in the final backend architecture.

## Historical Snapshots

Transactional records must preserve the information required to explain what happened at the time of the transaction.

For example, an `OrderItem` may contain:

- Product ID;
- product name snapshot;
- selected variant/SKU;
- unit price snapshot;
- currency;
- tax information;
- quantity;
- applicable discount information.

Changing the current Product record must not rewrite historical order meaning.

## Entity Identity Requirements

The ID strategy defined in `IDS-001-ids-and-identity-strategy.md` applies to this catalogue.

In particular:

- IDs are immutable;
- IDs are opaque and stable;
- IDs are not derived from mutable business names;
- external PSP, store, supplier and marketplace identifiers remain separate from internal IDs;
- correlation, causation and idempotency identifiers are not substitutes for entity IDs.

## Lifecycle Relationship

Entity lifecycle rules are defined separately in `ENTITY-LIFECYCLES.md`.

An entity's existence in this catalogue does not imply that every state transition is implemented synchronously. Lifecycle transitions may cross aggregate and domain boundaries through commands, events and compensating workflows.

## Database Design Constraint

The Phase 3 database model must not simply turn this catalogue into one giant relational schema.

The implementation must preserve:

- aggregate ownership;
- write ownership;
- transactional boundaries;
- independent service/domain persistence where required;
- event-driven integration;
- immutable historical snapshots;
- read-model denormalisation where justified.

## AI and Derived Data

AI Society may maintain derived representations such as:

- household preference profiles;
- recommendation context;
- demand predictions;
- product embeddings;
- shopping intent;
- behavioural signals;
- agent working memory.

These are derived intelligence artefacts. They must have explicit provenance and lifecycle rules and must not silently overwrite authoritative enterprise entities.

## Phase 3 Requirements

Backend architecture must use this catalogue to define:

1. service ownership;
2. database ownership;
3. aggregate persistence;
4. API resource boundaries;
5. event payload references;
6. read models;
7. audit records;
8. AI data access boundaries.

Any new authoritative entity introduced during implementation must identify its owning domain, aggregate boundary, identity, lifecycle and integration consequences before becoming part of production architecture.

## Relationship to Other Information Architecture Documents

- `RELATIONSHIPS-AGGREGATE-MAP.md` defines aggregate relationships and boundaries.
- `IDS-001-ids-and-identity-strategy.md` defines identity rules.
- `ENTITY-LIFECYCLES.md` defines lifecycle states and transitions.
- `EVENT-OWNERSHIP-MATRIX.md` defines authoritative event ownership.

Together these documents form the enterprise information model foundation for Phase 3 database and backend architecture.
