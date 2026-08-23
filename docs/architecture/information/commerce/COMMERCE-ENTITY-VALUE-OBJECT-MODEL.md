# Commerce Entity & Value Object Model

**Status:** Draft
**Phase:** 2 — Information Architecture
**Scope:** Commerce domain
**Date:** 2026-08-23

## 1. Purpose

This document defines the logical entity and value-object model inside the Commerce aggregate boundaries established during Phase 2.1.

It is intentionally storage-agnostic. It does not prescribe database tables, ORM models, API DTOs or physical storage technology.

## 2. Aggregate boundaries

Commerce contains five independent aggregate roots:

1. Cart
2. Checkout Session
3. Order
4. Payment Transaction
5. Refund

No aggregate directly mutates another aggregate. Cross-aggregate interaction uses commands, events and references by identifier.

## 3. Modelling principles

- Aggregate roots own their internal entities and invariants.
- Product is referenced by `ProductId`; Commerce does not own Product state.
- Inventory is referenced through an `InventoryReservationId`; Commerce does not own Inventory state.
- Order commercial contents are historical snapshots and do not change when Product changes.
- Order lifecycle state may change without changing its historical commercial snapshot.
- Payment and Refund have independent financial lifecycles.
- Value objects are immutable by definition.
- External identifiers are references, not ownership transfers.
- DTOs, projections, search records, analytics views and workflow messages are not domain entities merely because they exist operationally.

## 4. Cart aggregate

### Aggregate root

**Cart**

### Owned entities

**CartItem**

A CartItem has no independent lifecycle outside its Cart.

### Value objects

- `CartId`
- `CustomerId`
- `ProductId`
- `Quantity`
- `Money`

### Logical fields

**Cart**

- `CartId`
- `CustomerId`
- `status`
- `items`
- `createdAt`
- `updatedAt`

**CartItem**

- `ProductId`
- `Quantity`
- `UnitPrice`

### Invariants

- A CartItem belongs to exactly one Cart.
- Quantity is a positive integer.
- A Cart cannot contain an invalid item quantity.
- Cart operations must preserve ownership of the Cart by its customer/household context.
- Product identity is referenced, not owned.

Cart pricing is mutable commercial intent and must not be treated as the historical price of an eventual Order.

## 5. Checkout Session aggregate

### Aggregate root

**CheckoutSession**

Checkout Session is an independent short-lived stateful process boundary. It is created from a Cart but does not own the Cart.

### Owned entities

**CheckoutItemSnapshot**

Represents the commercial item snapshot used by this checkout attempt.

### Value objects

- `CheckoutSessionId`
- `CartId`
- `CustomerId`
- `ProductId`
- `Money`
- `Quantity`
- `InventoryReservationId`
- `PaymentReference`
- `PricingSnapshot`

### Logical fields

**CheckoutSession**

- `CheckoutSessionId`
- `CartId`
- `CustomerId`
- `status`
- `items`
- `pricingSnapshot`
- `inventoryReservationId`
- `paymentReference`
- `createdAt`
- `expiresAt`
- `completedAt`

**CheckoutItemSnapshot**

- `ProductId`
- `Quantity`
- `ProductNameSnapshot`
- `UnitPriceSnapshot`
- `TaxSnapshot`

### Invariants

- Checkout is associated with one source Cart.
- Checkout does not mutate or delete the Cart merely because checkout fails or expires.
- Commercial values used by the checkout attempt are frozen within the checkout boundary once the relevant pricing stage is committed.
- Inventory reservation state is referenced by ID; Inventory remains authoritative for reservation state.
- Payment state is referenced; Payment remains authoritative for financial settlement.
- An expired or completed Checkout Session cannot continue normal progression.

### Lifecycle

```text
Initiated → Pricing → InventoryPending → PaymentPending → Completed
                         │                  │
                         └──────→ Failed ←──┘

Any eligible active state → Expired
```

The exact state machine will be resolved in Phase 2.6.

## 6. Order aggregate

### Aggregate root

**Order**

### Owned entities

**OrderItem**

OrderItem is subordinate to Order and has no independent aggregate lifecycle.

### Value objects

- `OrderId`
- `CustomerId`
- `ProductId`
- `Money`
- `Quantity`
- `AddressSnapshot`
- `TaxSnapshot`

### Logical fields

**Order**

- `OrderId`
- `CustomerId`
- `status`
- `items`
- `subtotal`
- `tax`
- `total`
- `currency`
- `createdAt`
- `updatedAt`

**OrderItem**

- `ProductId`
- `ProductNameSnapshot`
- `Quantity`
- `UnitPriceSnapshot`
- `TaxSnapshot`
- `LineTotal`

### Invariants

- OrderItems cannot exist outside an Order.
- Every OrderItem has a historical ProductId and commercial snapshot.
- Historical price, product name and applied tax are not recalculated from the current Product catalogue.
- Order total must equal the authoritative sum of its commercial lines and applicable charges.
- Order lifecycle transitions must follow the defined state machine.
- Payment state is not embedded as authoritative financial state inside Order.
- Fulfilment state is referenced through the Fulfilment domain rather than owned by Commerce.

### Important distinction

The **commercial snapshot** of an Order is immutable after order creation. The Order aggregate itself remains mutable for lifecycle transitions such as payment, fulfilment and cancellation where permitted by the lifecycle rules.

## 7. Payment Transaction aggregate

### Aggregate root

**PaymentTransaction**

There are no Order-owned Payment entities. Payment has its own lifecycle because gateway interactions, retries and settlement may be asynchronous and externally controlled.

### Value objects

- `PaymentTransactionId`
- `OrderId`
- `CustomerId`
- `Money`
- `PaymentMethodReference`
- `PaymentProviderReference`
- `ProviderTransactionId`

### Logical fields

- `PaymentTransactionId`
- `OrderId`
- `CustomerId`
- `amount`
- `currency`
- `paymentMethodReference`
- `provider`
- `providerTransactionId`
- `status`
- `failureReason`
- `createdAt`
- `updatedAt`

### Invariants

- A PaymentTransaction belongs to one financial attempt.
- Payment provider state is never assumed to be synchronous.
- Provider callbacks/webhooks must be correlated to the correct transaction.
- Payment state transitions must be idempotent.
- PaymentTransaction does not directly mutate Order; it emits a result that Order processing consumes.

## 8. Refund aggregate

### Aggregate root

**Refund**

Refund is independent because approval, partial refunds, retries and settlement may have a lifecycle that outlives the initiating payment event.

### Value objects

- `RefundId`
- `OrderId`
- `PaymentTransactionId`
- `CustomerId`
- `Money`
- `RefundReason`
- `ProviderRefundReference`

### Logical fields

- `RefundId`
- `OrderId`
- `PaymentTransactionId`
- `CustomerId`
- `amount`
- `reason`
- `status`
- `providerRefundReference`
- `createdAt`
- `updatedAt`

### Invariants

- A Refund references an existing Order and PaymentTransaction.
- Refund amount cannot exceed the refundable amount permitted by the financial policy.
- Multiple partial refunds must remain independently traceable.
- Refund settlement may be asynchronous.
- Refund state changes are idempotent.
- Refund does not mutate the historical Order commercial snapshot.

## 9. Cross-aggregate reference rules

| Reference | Rule |
|---|---|
| Cart → Product | Reference by `ProductId` |
| Checkout → Cart | Reference by `CartId` |
| Checkout → Product | Reference by `ProductId` plus snapshot |
| Checkout → Inventory | Reference by `InventoryReservationId` |
| Checkout → Payment | Reference by payment transaction/reference |
| Order → Product | Historical `ProductId` plus immutable snapshot |
| Payment → Order | Reference by `OrderId` |
| Refund → Order | Reference by `OrderId` |
| Refund → Payment | Reference by `PaymentTransactionId` |

These references do not confer ownership.

## 10. Value object catalogue

| Value object | Purpose | Mutability |
|---|---|---|
| `CartId` | Cart identity | Immutable |
| `CheckoutSessionId` | Checkout identity | Immutable |
| `OrderId` | Order identity | Immutable |
| `PaymentTransactionId` | Payment identity | Immutable |
| `RefundId` | Refund identity | Immutable |
| `CustomerId` | Customer identity reference | Immutable |
| `ProductId` | Product identity reference | Immutable |
| `Quantity` | Valid positive quantity | Immutable |
| `Money` | Amount + currency | Immutable |
| `PricingSnapshot` | Frozen checkout pricing context | Immutable |
| `AddressSnapshot` | Historical address used by an order | Immutable |
| `TaxSnapshot` | Historical tax context | Immutable |
| `PaymentMethodReference` | Token/reference to payment method | Immutable |
| `PaymentProviderReference` | External PSP reference | Immutable |
| `ProviderTransactionId` | External transaction identity | Immutable |
| `RefundReason` | Controlled refund reason | Immutable |
| `ProviderRefundReference` | External refund identity | Immutable |
| `InventoryReservationId` | Reference to Inventory reservation | Immutable |

## 11. Deliberate non-ownership

Commerce does not own:

- Product catalogue state;
- Inventory quantity or reservation state;
- Fulfilment task state;
- Delivery state;
- customer identity;
- household membership;
- payment-provider accounts;
- analytics projections;
- AI recommendations;
- notification delivery state.

Commerce may consume authoritative capabilities, events and read models from those domains without acquiring ownership.

## 12. Phase 2 dependencies

This model feeds directly into:

- Phase 2.3 — Ownership & Data Boundaries
- Phase 2.4 — Identifier Strategy
- Phase 2.5 — Entity Relationships
- Phase 2.6 — Lifecycle & State Machines
- Phase 2.7 — Command Model
- Phase 2.8 — Event Model
- Phase 2.9 — Database Blueprint

The database blueprint must not be frozen until these dependent information-architecture decisions are resolved.

## 13. Status

**Commerce entity/value-object model: Draft — ready for cross-domain ownership review.**
