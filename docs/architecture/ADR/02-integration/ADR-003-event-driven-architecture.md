# ADR-003 — Event-Driven Architecture

**Status:** Proposed
**Date:** 2026-08-11
**Decision Type:** Integration

---

## 1. Context

ADR-001 established event-driven communication as a foundational architectural principle.

ADR-002 established that Essentials Mart will be organised around clearly defined enterprise domains with explicit responsibilities and ownership.

As these domains operate independently, they will still need to react to changes occurring elsewhere in the enterprise.

For example, when an order is created:

* Fulfilment may need to begin preparation.
* Inventory may need to reserve or adjust stock.
* Notifications may need to inform the customer.
* Delivery may eventually require fulfilment information.
* Intelligence Engines may analyse the transaction.
* AI agents may need to respond to relevant events.

If these domains communicate through direct, tightly coupled calls for every interaction, changes to one domain could require changes across many other domains.

Essentials Mart therefore requires a communication model that allows domains to react to enterprise events while preserving their independence.

---

## 2. Problem

The platform needs to support communication between domains without creating excessive synchronous dependencies.

Without an event-driven architecture, the system risks:

* tightly coupled services;
* cascading failures;
* duplicated integration logic;
* difficult-to-change workflows;
* direct dependencies between unrelated domains;
* inconsistent state propagation;
* limited scalability;
* and difficulty introducing new consumers of existing business events.

The architecture must therefore establish how meaningful changes in enterprise state are represented, published, consumed, and governed.

---

## 3. Decision

Essentials Mart will adopt an **event-driven architecture** for appropriate cross-domain and asynchronous communication.

Domains will publish meaningful events when significant changes occur within their area of responsibility.

Other authorised domains and services may subscribe to those events and react independently.

The architecture will distinguish between:

* **Domain Events** — events representing meaningful changes within a domain.
* **Integration Events** — events intentionally exposed for consumption outside the originating domain.
* **Commands** — explicit requests for a domain or service to perform an action.
* **Queries** — requests for information without requesting a state change.

Events will represent facts that have occurred rather than instructions for another system to perform an action.

For example:

```text id="4t4m7p"
OrderCreated
```

means:

> An order has been created.

It should not mean:

> Fulfilment, reserve inventory, send a notification, and dispatch delivery.

Those consuming domains independently determine whether and how they respond.

---

## 4. Rationale

An event-driven architecture supports the domain boundaries established by ADR-002.

It allows a domain to announce important changes without needing to know every consumer of those changes.

For example:

```text id="s8u4ec"
                    Commerce Domain
                          │
                          │ OrderCreated
                          ▼
                    Event Backbone
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
     Fulfilment       Notification     Intelligence
       Domain            Domain          Engines
```

The Commerce domain does not need direct knowledge of every future consumer.

A new capability could subscribe to `OrderCreated` later without requiring the Commerce domain to be redesigned.

This makes the platform more extensible and supports future AI capabilities, additional stores, new communication channels, and additional enterprise applications.

---

## 5. Architectural Principles Affected

This decision establishes or reinforces:

* Domain independence
* Event-driven communication
* Loose coupling
* Asynchronous processing
* Authoritative domain ownership
* API and contract-based integration
* Fault isolation
* Scalability
* Auditability
* Extensibility
* Channel independence

---

## 6. Alternatives Considered

### Alternative A — Fully Synchronous Service-to-Service Communication

**Description:**
Every domain directly calls the domain responsible for the next operation.

**Why not selected:**
This creates strong runtime coupling and can produce cascading failures and complex dependency chains.

---

### Alternative B — Shared Database Integration

**Description:**
Domains communicate by directly reading and modifying shared database tables.

**Why not selected:**
This violates domain ownership, creates hidden dependencies, and makes schema changes dangerous.

---

### Alternative C — Point-to-Point Messaging

**Description:**
Each domain establishes direct messaging relationships with every consumer.

**Why not selected:**
As the number of domains grows, integration relationships become difficult to manage and evolve.

---

### Alternative D — Event-Driven Architecture

**Description:**
Domains publish meaningful events through an event backbone, allowing authorised consumers to subscribe independently.

**Why selected:**
This provides loose coupling, extensibility, asynchronous processing, and a natural integration model for the domain-driven architecture.

---

## 7. Consequences

### Positive

* Reduced cross-domain coupling.
* Independent event consumers.
* Easier introduction of new consumers.
* Better scalability.
* Improved fault isolation.
* Support for asynchronous processing.
* Natural integration point for Intelligence Engines.
* Natural integration point for AI Society workflows.
* Improved auditability.
* Better support for future multi-store operations.

### Negative

* Event infrastructure introduces operational complexity.
* Eventual consistency becomes necessary for some workflows.
* Debugging distributed workflows is more difficult.
* Events require versioning and governance.
* Duplicate event delivery must be handled safely.
* Event ordering may require explicit design.
* Event-driven systems require stronger observability.

### Neutral / Trade-offs

* Not every interaction should become an event.
* Synchronous APIs remain appropriate when an immediate response is required.
* Some workflows will intentionally combine synchronous calls and asynchronous events.

---

## 8. Domain Impact

| Domain           | Impact | Responsibility                                               |
| ---------------- | ------ | ------------------------------------------------------------ |
| Commerce         | High   | Publishes commercial state changes                           |
| Inventory        | High   | Consumes and publishes inventory events                      |
| Fulfilment       | High   | Reacts to order and fulfilment events                        |
| Delivery         | High   | Reacts to fulfilment and delivery events                     |
| Customer         | Medium | Receives state changes through appropriate channels          |
| Notification     | High   | Consumes events requiring customer/staff communication       |
| Customer Support | Medium | Consumes relevant service events                             |
| Intelligence     | High   | Consumes authorised enterprise events for analysis           |
| AI Society       | High   | Reacts to authorised events and initiates governed workflows |
| Store Operations | High   | Consumes operational events                                  |
| Identity         | Medium | Publishes relevant identity/security events                  |

The final event ownership and domain relationships will be defined in `EVENT-ARCHITECTURE.md`.

---

## 9. Data Impact

Events will communicate facts about state changes without transferring ownership of the underlying data.

For example:

```text id="iwp4zk"
Commerce Domain
      │
      └── OrderCreated
              │
              ▼
        Other Consumers
```

Consumers may receive the information necessary to react to the event, but the Commerce domain remains the authoritative owner of order state.

Event payloads should therefore avoid becoming accidental alternative databases.

Where consumers require additional authoritative information, they should use appropriate APIs or domain capabilities.

**Data impact:** High.

---

## 10. Event Impact

The event architecture will distinguish between event categories.

### Domain Events

Internal events representing significant domain state changes.

Examples:

* `OrderCreated`
* `OrderConfirmed`
* `OrderCancelled`
* `InventoryAdjusted`
* `OrderPacked`
* `DeliveryAssigned`
* `DeliveryCompleted`

### Integration Events

Events intentionally exposed for consumption by other domains or enterprise systems.

Examples may include:

* `OrderCreated`
* `OrderReadyForFulfilment`
* `InventoryAvailabilityChanged`
* `OrderReadyForDelivery`
* `OrderDelivered`

The final distinction between domain and integration events will be established in `EVENT-ARCHITECTURE.md`.

### Event Requirements

Events should have:

* Unique event identifiers
* Event type
* Event version
* Timestamp
* Source
* Correlation identifier
* Causation identifier where applicable
* Relevant entity/aggregate identifier
* Payload appropriate to the event
* Schema/version information

Events should be designed for safe evolution.

---

## 11. API / Integration Impact

Events will complement rather than replace APIs.

The platform will use:

**Commands / APIs** when a system needs to request an action.

**Queries / APIs** when a system needs immediate information.

**Events** when a system needs to communicate that something has happened.

For example:

```text id="y3h8jp"
Customer
   │
   │ Create Order
   ▼
Commerce API
   │
   ▼
Order Created
   │
   ▼
Event Backbone
   │
   ├── Fulfilment
   ├── Inventory
   └── Notification
```

This distinction prevents the event system from becoming an uncontrolled substitute for APIs.

**Integration impact:** High.

---

## 12. Security Impact

Event infrastructure will be treated as a controlled enterprise boundary.

Security requirements will include:

* Authenticated producers and consumers.
* Authorised event subscriptions.
* Domain-level access controls.
* Protection against unauthorised event publication.
* Sensitive-data minimisation in event payloads.
* Encryption where appropriate.
* Event integrity.
* Audit logging.
* Monitoring for abnormal event activity.

Not every domain or AI agent should automatically have access to every event.

Event access will follow the principle of least privilege.

**Security impact:** High.

---

## 13. AI / Intelligence Impact

The event architecture becomes a major communication mechanism for the AI Society and Intelligence Engines.

For example:

```text id="v8r1ab"
OrderCreated
     │
     ▼
Event Backbone
     │
     ├── Demand Intelligence
     ├── Customer Intelligence
     ├── Inventory Intelligence
     └── AI Society
```

However, receiving an event does not automatically grant an AI agent authority to act.

AI agents must still operate within the permissions and governance established by subsequent ADRs.

Events provide **awareness**.

They do not automatically provide **authority**.

This distinction is fundamental to the AI architecture.

**AI impact:** High.

---

## 14. Implementation Implications

The platform will require an event infrastructure capable of supporting:

* Event publication
* Event subscription
* Event routing
* Event persistence where required
* Event retry
* Dead-letter handling
* Idempotent processing
* Event versioning
* Schema management
* Correlation and tracing
* Monitoring
* Auditability

The exact technology will be determined during backend architecture and implementation.

The event model must be documented in:

`docs/architecture/EVENT-ARCHITECTURE.md`

---

## 15. Dependencies

This ADR depends upon:

* ADR-001 — Enterprise Architecture Principles
* ADR-002 — Domain-Driven Enterprise Architecture

It establishes the foundation for:

* ADR-004 — API & Service Architecture
* ADR-005 — Data Ownership & Database Boundaries
* ADR-007 — AI Society Architecture
* ADR-008 — Intelligence Engine Architecture
* ADR-009 — AI Agent Governance & Permissions
* ADR-011 — Notification & Communication Architecture
* ADR-016 — Observability, Auditability & Trust
* ADR-017 — Scalability & Multi-Store Architecture

---

## 16. Related Architecture Documents

* `EDA-001-enterprise-data-architecture.md`
* `DOMAINS.md`
* `EVENT-ARCHITECTURE.md`
* `SECURITY-ARCHITECTURE.md`
* `AI-001-ai-society.md`

---

## 17. Related ADRs

* ADR-001 — Enterprise Architecture Principles
* ADR-002 — Domain-Driven Enterprise Architecture
* ADR-004 — API & Service Architecture
* ADR-005 — Data Ownership & Database Boundaries
* ADR-007 — AI Society Architecture
* ADR-008 — Intelligence Engine Architecture
* ADR-016 — Observability, Auditability & Trust

---

## 18. Decision Lifecycle

**Current Status:** Proposed

### Review Conditions

This ADR should be reviewed if:

* Event-driven communication proves unsuitable for a major class of enterprise workflow.
* Event volume or latency requirements require a fundamentally different architecture.
* Regulatory requirements impose new event retention or data-handling constraints.
* The domain model changes substantially.
* The AI Society requires fundamentally different event interaction mechanisms.
* A new communication pattern is required that cannot be reconciled with the current event model.

### Supersession

If this decision is replaced, the replacement ADR must reference ADR-003 and explain why the event-driven architecture has changed.

---

## 19. Final Decision

> **Essentials Mart will use event-driven architecture as the primary mechanism for appropriate asynchronous cross-domain communication. Domains will publish meaningful facts about state changes, while authorised consumers independently react to those events. APIs and synchronous communication will remain available where immediate request-response behaviour is required.**

**ADR-003 remains authoritative unless superseded by a subsequent ADR.**
